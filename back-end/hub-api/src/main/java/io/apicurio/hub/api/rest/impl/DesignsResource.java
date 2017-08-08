/*
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.apicurio.hub.api.rest.impl;

import java.io.IOException;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Date;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.apicurio.hub.api.beans.AddApiDesign;
import io.apicurio.hub.api.beans.ApiDesign;
import io.apicurio.hub.api.beans.ApiDesignResourceInfo;
import io.apicurio.hub.api.beans.Collaborator;
import io.apicurio.hub.api.beans.NewApiDesign;
import io.apicurio.hub.api.beans.OpenApiDocument;
import io.apicurio.hub.api.beans.OpenApiInfo;
import io.apicurio.hub.api.beans.ResourceContent;
import io.apicurio.hub.api.beans.UpdateApiDesign;
import io.apicurio.hub.api.connectors.ISourceConnector;
import io.apicurio.hub.api.connectors.SourceConnectorFactory;
import io.apicurio.hub.api.connectors.SourceConnectorException;
import io.apicurio.hub.api.exceptions.AlreadyExistsException;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.exceptions.ServerError;
import io.apicurio.hub.api.rest.IDesignsResource;
import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.api.storage.IStorage;
import io.apicurio.hub.api.storage.StorageException;
import io.apicurio.hub.api.util.OpenApiTools;
import io.apicurio.hub.api.util.OpenApiTools.NameAndDescription;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class DesignsResource implements IDesignsResource {

    private static Logger logger = LoggerFactory.getLogger(DesignsResource.class);
    private static ObjectMapper mapper = new ObjectMapper();

    @Inject
    private IStorage storage;
    @Inject
    private SourceConnectorFactory sourceConnectorFactory;
    @Inject
    private ISecurityContext security;

    @Context
    private HttpServletRequest request;
    @Context
    private HttpServletResponse response;

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#listDesigns()
     */
    @Override
    public Collection<ApiDesign> listDesigns() throws ServerError {
        try {
            logger.debug("Listing API Designs");
            String user = this.security.getCurrentUser().getLogin();
            return this.storage.listApiDesigns(user);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#addDesign(io.apicurio.hub.api.beans.AddApiDesign)
     */
    @Override
    public ApiDesign addDesign(AddApiDesign info) throws ServerError, AlreadyExistsException, NotFoundException {
        logger.debug("Adding an API Design: {}", info.getRepositoryUrl());
        
        try {
            ISourceConnector connector = this.sourceConnectorFactory.createConnector(info.getRepositoryUrl());
			ApiDesignResourceInfo resourceInfo = connector.validateResourceExists(info.getRepositoryUrl());
			
			Date now = new Date();
			String user = this.security.getCurrentUser().getLogin();

			ApiDesign design = new ApiDesign();
			design.setName(resourceInfo.getName());
			design.setDescription(resourceInfo.getDescription());
			design.setRepositoryUrl(resourceInfo.getUrl());
			design.setCreatedBy(user);
			design.setCreatedOn(now);
			design.setModifiedBy(user);
			design.setModifiedOn(now);
			
			try {
			    String id = this.storage.createApiDesign(user, design);
			    design.setId(id);
			} catch (StorageException e) {
			    throw new ServerError(e);
			}
			
			return design;
		} catch (SourceConnectorException e) {
			throw new ServerError(e);
		}
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#createDesign(io.apicurio.hub.api.beans.NewApiDesign)
     */
    @Override
    public ApiDesign createDesign(NewApiDesign info) throws ServerError, AlreadyExistsException {
        logger.debug("Creating an API Design: {} :: {}", info.getName(), info.getRepositoryUrl());

        try {
            Date now = new Date();
            String user = this.security.getCurrentUser().getLogin();

            ISourceConnector connector = this.sourceConnectorFactory.createConnector(info.getRepositoryUrl());

            try {
                connector.validateResourceExists(info.getRepositoryUrl());
                throw new StorageException("GitHub resource already exists: " + info.getRepositoryUrl());
            } catch (NotFoundException e) {
                // This is what we want!
            }

            ApiDesign design = new ApiDesign();
            design.setName(info.getName());
            design.setDescription(info.getDescription());
            design.setRepositoryUrl(info.getRepositoryUrl());
            design.setCreatedBy(user);
            design.setCreatedOn(now);
            design.setModifiedBy(user);
            design.setModifiedOn(now);
            
            storage.createApiDesign(user, design);
            
            OpenApiDocument doc = new OpenApiDocument();
            doc.setSwagger("2.0");
            doc.setInfo(new OpenApiInfo());
            doc.getInfo().setTitle(info.getName());
            doc.getInfo().setDescription(info.getDescription());
            doc.getInfo().setVersion("1.0.0");
            String oaiContent = mapper.writeValueAsString(doc);
            
            connector.createResourceContent(info.getRepositoryUrl(), "Initial creation of API: " + info.getName(), oaiContent);
            
            return design;
        } catch (JsonProcessingException | StorageException | SourceConnectorException | NotFoundException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getDesign(java.lang.String)
     */
    @Override
    public ApiDesign getDesign(String designId) throws ServerError, NotFoundException {
        logger.debug("Getting an API design with ID {}", designId);
        try {
            String user = this.security.getCurrentUser().getLogin();
            return this.storage.getApiDesign(user, designId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#updateDesign(java.lang.String, io.apicurio.hub.api.beans.UpdateApiDesign)
     */
    @Override
    public ApiDesign updateDesign(String designId, UpdateApiDesign update) throws ServerError, NotFoundException {
        try {
            logger.debug("Updating an API Design with ID {}", designId);
            String user = this.security.getCurrentUser().getLogin();
            ApiDesign design = this.storage.getApiDesign(user, designId);
            if (update.getDescription() != null) {
                design.setDescription(update.getDescription());
            }
            if (update.getName() != null) {
                design.setName(update.getName());
            }
            design.setModifiedBy(this.security.getCurrentUser().getLogin());
            design.setModifiedOn(new Date());
            this.storage.updateApiDesign(user, design);
            return design;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#deleteDesign(java.lang.String)
     */
    @Override
    public void deleteDesign(String designId) throws ServerError, NotFoundException {
        logger.debug("Deleting an API Design with ID {}", designId);
        try {
            String user = this.security.getCurrentUser().getLogin();
            this.storage.deleteApiDesign(user, designId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getCollaborators(java.lang.String)
     */
    @Override
    public Collection<Collaborator> getCollaborators(String designId) throws ServerError, NotFoundException {
        logger.debug("Retrieving collaborators list for design with ID: {}", designId);
        try {
            String user = this.security.getCurrentUser().getLogin();
            ApiDesign design = this.storage.getApiDesign(user, designId);
            String repoUrl = design.getRepositoryUrl();
            
            ISourceConnector connector = this.sourceConnectorFactory.createConnector(repoUrl);
            return connector.getCollaborators(repoUrl);
        } catch (StorageException | SourceConnectorException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getContent(java.lang.String)
     */
    @Override
    public Response getContent(String designId) throws ServerError, NotFoundException {
        logger.debug("Getting content for API design with ID: {}", designId);
        try {
            ApiDesign design = this.getDesign(designId);
            ISourceConnector connector = this.sourceConnectorFactory.createConnector(design.getRepositoryUrl());
            ResourceContent content = connector.getResourceContent(design.getRepositoryUrl());
            
            byte[] bytes = content.getContent().getBytes("UTF-8");
            String ct = "application/json; charset=utf-8";
            String cl = String.valueOf(bytes.length);
            
            ResponseBuilder builder = Response.ok().entity(content.getContent())
                    .header("X-Content-SHA", content.getSha())
                    .header("Content-Type", ct)
                    .header("Content-Length", cl);
            return builder.build();
        } catch (UnsupportedEncodingException | SourceConnectorException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#updateContent(java.lang.String)
     */
    @Override
    public void updateContent(String designId) throws ServerError, NotFoundException {
        logger.debug("Updating content for API design with ID: {}", designId);
        ApiDesign design = this.getDesign(designId);

        ISourceConnector connector = this.sourceConnectorFactory.createConnector(design.getRepositoryUrl());

        String contentType = request.getContentType();
        if (!contentType.equals("application/json")) {
            throw new ServerError("Unexpected content-type: " + contentType);
        }
        
        String sha = request.getHeader("X-Content-SHA");
        if (sha == null) {
            throw new ServerError("Missing request Header: 'X-Content-SHA'");
        }
        
        String commitMessage = request.getHeader("X-Apicurio-CommitMessage");
        String commitComment = request.getHeader("X-Apicurio-CommitComment");
        try {
            if (commitMessage == null) {
                commitMessage = "Updating API design: " + new URI(design.getRepositoryUrl()).getPath();
            }
        } catch (URISyntaxException e1) {
            commitMessage = "Updating API design";
        }
        
        String content = null;
        try (Reader data = request.getReader()) {
            content = IOUtils.toString(data);

            ResourceContent rc = new ResourceContent();
            rc.setContent(content);
            rc.setSha(sha);
            
            String newSha = connector.updateResourceContent(design.getRepositoryUrl(), commitMessage, commitComment, rc);
            this.response.setHeader("X-Content-SHA", newSha);
            
            this.updateNameAndDescription(design, content);
            design.setModifiedBy(this.security.getCurrentUser().getLogin());
            design.setModifiedOn(new Date());

        	this.storage.updateApiDesign(this.security.getCurrentUser().getLogin(), design);
        } catch (StorageException | SourceConnectorException | IOException e) {
            throw new ServerError(e);
        }
    }

    /**
     * Parses the content and extracts the name and description.  Sets them on the
     * given API Design object.
     * @param design
     * @param content
     */
    private void updateNameAndDescription(ApiDesign design, String content) throws ServerError {
        try {
            NameAndDescription nad = OpenApiTools.getNameAndDescriptionFromSpec(content);
            design.setName(nad.name);
            design.setDescription(nad.description);
        } catch (IOException e) {
            throw new ServerError(e);
        }
    }

}
