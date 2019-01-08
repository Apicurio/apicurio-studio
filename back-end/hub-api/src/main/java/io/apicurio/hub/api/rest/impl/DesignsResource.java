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

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.zip.ZipInputStream;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.StreamingOutput;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import io.apicurio.hub.api.beans.CodegenLocation;
import io.apicurio.hub.api.beans.ImportApiDesign;
import io.apicurio.hub.api.beans.NewApiDesign;
import io.apicurio.hub.api.beans.NewApiPublication;
import io.apicurio.hub.api.beans.NewCodegenProject;
import io.apicurio.hub.api.beans.ResourceContent;
import io.apicurio.hub.api.beans.UpdateCodgenProject;
import io.apicurio.hub.api.beans.UpdateCollaborator;
import io.apicurio.hub.api.bitbucket.BitbucketResourceResolver;
import io.apicurio.hub.api.codegen.OpenApi2Thorntail;
import io.apicurio.hub.api.codegen.OpenApi2Thorntail.ThorntailProjectSettings;
import io.apicurio.hub.api.connectors.ISourceConnector;
import io.apicurio.hub.api.connectors.SourceConnectorException;
import io.apicurio.hub.api.connectors.SourceConnectorFactory;
import io.apicurio.hub.api.github.GitHubResourceResolver;
import io.apicurio.hub.api.gitlab.GitLabResourceResolver;
import io.apicurio.hub.api.metrics.IApiMetrics;
import io.apicurio.hub.api.microcks.IMicrocksConnector;
import io.apicurio.hub.api.microcks.MicrocksConnectorException;
import io.apicurio.hub.api.rest.IDesignsResource;
import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.core.beans.ApiContentType;
import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.ApiDesignChange;
import io.apicurio.hub.core.beans.ApiDesignCollaborator;
import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.beans.ApiDesignContent;
import io.apicurio.hub.core.beans.ApiDesignResourceInfo;
import io.apicurio.hub.core.beans.ApiMock;
import io.apicurio.hub.core.beans.ApiPublication;
import io.apicurio.hub.core.beans.CodegenProject;
import io.apicurio.hub.core.beans.CodegenProjectType;
import io.apicurio.hub.core.beans.Contributor;
import io.apicurio.hub.core.beans.FormatType;
import io.apicurio.hub.core.beans.Invitation;
import io.apicurio.hub.core.beans.LinkedAccountType;
import io.apicurio.hub.core.beans.OpenApi2Document;
import io.apicurio.hub.core.beans.OpenApi3Document;
import io.apicurio.hub.core.beans.OpenApiDocument;
import io.apicurio.hub.core.beans.OpenApiInfo;
import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.editing.IEditingSessionManager;
import io.apicurio.hub.core.exceptions.AccessDeniedException;
import io.apicurio.hub.core.exceptions.ApiValidationException;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.hub.core.js.OaiCommandException;
import io.apicurio.hub.core.js.OaiCommandExecutor;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;
import io.apicurio.hub.core.util.FormatUtils;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class DesignsResource implements IDesignsResource {

    private static Logger logger = LoggerFactory.getLogger(DesignsResource.class);
    private static ObjectMapper mapper = new ObjectMapper();
    static {
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.setSerializationInclusion(Include.NON_NULL);
    }
    
    @Inject
    private HubConfiguration config;
    @Inject
    private IStorage storage;
    @Inject
    private SourceConnectorFactory sourceConnectorFactory;
    @Inject
    private ISecurityContext security;
    @Inject
    private IApiMetrics metrics;
    @Inject
    private OaiCommandExecutor oaiCommandExecutor;
    @Inject
    private IEditingSessionManager editingSessionManager;
    @Inject
    private IMicrocksConnector microcks;

    @Context
    private HttpServletRequest request;
    @Context
    private HttpServletResponse response;

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#listDesigns()
     */
    @Override
    public Collection<ApiDesign> listDesigns() throws ServerError {
        metrics.apiCall("/designs", "GET");
        
        try {
            logger.debug("Listing API Designs");
            String user = this.security.getCurrentUser().getLogin();
            Collection<ApiDesign> designs = this.storage.listApiDesigns(user);
            return designs;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#importDesign(io.apicurio.hub.api.beans.ImportApiDesign)
     */
    @Override
    public ApiDesign importDesign(ImportApiDesign info) throws ServerError, NotFoundException, ApiValidationException {
        metrics.apiCall("/designs", "PUT");
        
        if (info.getData() != null && !info.getData().trim().isEmpty()) {
            logger.debug("Importing an API Design (from data).");
            return importDesignFromData(info);
        } else {
            logger.debug("Importing an API Design: {}", info.getUrl());
            if (info.getUrl() == null) {
                throw new ApiValidationException("No data provided to import.");
            }
            ISourceConnector connector = null;
            
            try {
                connector = this.sourceConnectorFactory.createConnector(info.getUrl());
            } catch (NotFoundException nfe) {
                // This means it's not a source control URL.  So we'll treat it as a raw content URL.
                connector = null;
            }
            
            if (connector != null) {
                return importDesignFromSource(info, connector);
            } else {
                return importDesignFromUrl(info);
            }
        }
    }

    /**
     * Imports an API Design from one of the source control systems using its API.
     * @param info
     * @param connector
     * @throws NotFoundException
     * @throws ServerError 
     * @throws ApiValidationException
     */
    private ApiDesign importDesignFromSource(ImportApiDesign info, ISourceConnector connector) throws NotFoundException, ServerError, ApiValidationException {
        try {
            ApiDesignResourceInfo resourceInfo = connector.validateResourceExists(info.getUrl());
            ResourceContent initialApiContent = connector.getResourceContent(info.getUrl());
            
            Date now = new Date();
            String user = this.security.getCurrentUser().getLogin();
            String description = resourceInfo.getDescription();
            if (description == null) {
                description = "";
            }

            ApiDesign design = new ApiDesign();
            design.setName(resourceInfo.getName());
            design.setDescription(description);
            design.setCreatedBy(user);
            design.setCreatedOn(now);
            design.setTags(resourceInfo.getTags());
            
            try {
                String content = initialApiContent.getContent();
                if (resourceInfo.getFormat() == FormatType.YAML) {
                    content = FormatUtils.yamlToJson(content);
                }
                String id = this.storage.createApiDesign(user, design, content);
                design.setId(id);
            } catch (StorageException e) {
                throw new ServerError(e);
            }
            
            metrics.apiImport(connector.getType());
            
            return design;
        } catch (SourceConnectorException | IOException e) {
            throw new ServerError(e);
        }
    }

    /**
     * Imports an API Design from base64 encoded content included in the request.  This supports
     * the use-case where the UI allows the user to simply copy/paste the full API content.
     * @param info
     * @throws ServerError
     */
    private ApiDesign importDesignFromData(ImportApiDesign info) throws ServerError, ApiValidationException {
        try {
            String data = info.getData();
            byte[] decodedData = Base64.decodeBase64(data);
            
            try (InputStream is = new ByteArrayInputStream(decodedData)) {
                String content = IOUtils.toString(is, "UTF-8");
                ApiDesignResourceInfo resourceInfo = ApiDesignResourceInfo.fromContent(content);
                
                String name = resourceInfo.getName();
                if (name == null) {
                    name = "Imported API Design";
                }

                Date now = new Date();
                String user = this.security.getCurrentUser().getLogin();
    
                ApiDesign design = new ApiDesign();
                design.setName(name);
                design.setDescription(resourceInfo.getDescription());
                design.setCreatedBy(user);
                design.setCreatedOn(now);
                design.setTags(resourceInfo.getTags());
    
                try {
                    if (resourceInfo.getFormat() == FormatType.YAML) {
                        content = FormatUtils.yamlToJson(content);
                    }
                    String id = this.storage.createApiDesign(user, design, content);
                    design.setId(id);
                } catch (StorageException e) {
                    throw new ServerError(e);
                }
                
                metrics.apiImport(null);
                
                return design;
            }
        } catch (IOException e) {
            throw new ServerError(e);
        } catch (ApiValidationException ave) {
            throw ave;
        } catch (Exception e) {
            throw new ServerError(e);
        }
    }

    /**
     * Imports an API design from an arbitrary URL.  This simply opens a connection to that 
     * URL and tries to consume its content as an OpenAPI document.
     * @param info
     * @throws NotFoundException
     * @throws ServerError
     * @throws ApiValidationException
     */
    private ApiDesign importDesignFromUrl(ImportApiDesign info) throws NotFoundException, ServerError, ApiValidationException {
        try {
            URL url = new URL(info.getUrl());
            
            try (InputStream is = url.openStream()) {
                String content = IOUtils.toString(is, "UTF-8");
                ApiDesignResourceInfo resourceInfo = ApiDesignResourceInfo.fromContent(content);
                
                String name = resourceInfo.getName();
                if (name == null) {
                    name = url.getPath();
                    if (name != null && name.indexOf("/") >= 0) {
                        name = name.substring(name.indexOf("/") + 1);
                    }
                }
                if (name == null) {
                    name = "Imported API Design";
                }
    
                Date now = new Date();
                String user = this.security.getCurrentUser().getLogin();
    
                ApiDesign design = new ApiDesign();
                design.setName(name);
                design.setDescription(resourceInfo.getDescription());
                design.setCreatedBy(user);
                design.setCreatedOn(now);
                design.setTags(resourceInfo.getTags());
    
                try {
                    if (resourceInfo.getFormat() == FormatType.YAML) {
                        content = FormatUtils.yamlToJson(content);
                    }
                    String id = this.storage.createApiDesign(user, design, content);
                    design.setId(id);
                } catch (StorageException e) {
                    throw new ServerError(e);
                }
                
                metrics.apiImport(null);
                
                return design;
            }
        } catch (ApiValidationException ave) {
            throw ave;
        } catch (IOException e) {
            throw new ServerError(e);
        } catch (Exception e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#createDesign(io.apicurio.hub.api.beans.NewApiDesign)
     */
    @Override
    public ApiDesign createDesign(NewApiDesign info) throws ServerError {
        logger.debug("Creating an API Design: {}", info.getName());
        metrics.apiCall("/designs", "POST");

        try {
            Date now = new Date();
            String user = this.security.getCurrentUser().getLogin();
            
            // The API Design meta-data
            ApiDesign design = new ApiDesign();
            design.setName(info.getName());
            design.setDescription(info.getDescription());
            design.setCreatedBy(user);
            design.setCreatedOn(now);

            // The API Design content (OAI document)
            OpenApiDocument doc;
            if (info.getSpecVersion() == null || info.getSpecVersion().equals("2.0")) {
                doc = new OpenApi2Document();
            } else {
                doc = new OpenApi3Document();
            }
            doc.setInfo(new OpenApiInfo());
            doc.getInfo().setTitle(info.getName());
            doc.getInfo().setDescription(info.getDescription());
            doc.getInfo().setVersion("1.0.0");
            String oaiContent = mapper.writeValueAsString(doc);

            // Create the API Design in the database
            String designId = storage.createApiDesign(user, design, oaiContent);
            design.setId(designId);
            
            metrics.apiCreate(info.getSpecVersion());
            
            return design;
        } catch (JsonProcessingException | StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getDesign(java.lang.String)
     */
    @Override
    public ApiDesign getDesign(String designId) throws ServerError, NotFoundException {
        logger.debug("Getting an API design with ID {}", designId);
        metrics.apiCall("/designs/{designId}", "GET");

        try {
            String user = this.security.getCurrentUser().getLogin();
            ApiDesign design = this.storage.getApiDesign(user, designId);
            return design;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#editDesign(java.lang.String)
     */
    @Override
    public Response editDesign(String designId) throws ServerError, NotFoundException {
        logger.debug("Editing an API Design with ID {}", designId);
        metrics.apiCall("/designs/{designId}/session", "GET");
        
        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("\tUSER: {}", user);

            ApiDesignContent designContent = this.storage.getLatestContentDocument(user, designId);
            String content = designContent.getOaiDocument();
            long contentVersion = designContent.getContentVersion();
            String secret = this.security.getToken().substring(0, Math.min(64, this.security.getToken().length() - 1));
            String sessionId = this.editingSessionManager.createSessionUuid(designId, user, secret, contentVersion);

            logger.debug("\tCreated Session ID: {}", sessionId);
            logger.debug("\t            Secret: {}", secret);

            byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
            String ct = "application/json; charset=" + StandardCharsets.UTF_8;
            String cl = String.valueOf(bytes.length);

            ResponseBuilder builder = Response.ok().entity(content)
                    .header("X-Apicurio-EditingSessionUuid", sessionId)
                    .header("X-Apicurio-ContentVersion", contentVersion)
                    .header("Content-Type", ct)
                    .header("Content-Length", cl);

            return builder.build();
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
        metrics.apiCall("/designs/{designId}", "DELETE");
        
        try {
            String user = this.security.getCurrentUser().getLogin();
            this.storage.deleteApiDesign(user, designId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getContributors(java.lang.String)
     */
    @Override
    public Collection<Contributor> getContributors(String designId) throws ServerError, NotFoundException {
        logger.debug("Retrieving contributors list for design with ID: {}", designId);
        metrics.apiCall("/designs/{designId}/contributors", "GET");

        try {
            String user = this.security.getCurrentUser().getLogin();
            return this.storage.listContributors(user, designId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getContent(java.lang.String, java.lang.String)
     */
    @Override
    public Response getContent(String designId, String format) throws ServerError, NotFoundException {
        logger.debug("Getting content for API design with ID: {}", designId);
        metrics.apiCall("/designs/{designId}/content", "GET");

        try {
            String user = this.security.getCurrentUser().getLogin();
            ApiDesignContent designContent = this.storage.getLatestContentDocument(user, designId);
            List<ApiDesignCommand> apiCommands = this.storage.listContentCommands(user, designId, designContent.getContentVersion());
            List<String> commands = new ArrayList<>(apiCommands.size());
            for (ApiDesignCommand apiCommand : apiCommands) {
                commands.add(apiCommand.getCommand());
            }
            String content = this.oaiCommandExecutor.executeCommands(designContent.getOaiDocument(), commands);
            String ct = "application/json; charset=" + StandardCharsets.UTF_8;
            String cl = null;
            
            // Convert to yaml if necessary
            if ("yaml".equals(format)) {
                content = FormatUtils.jsonToYaml(content);
                ct = "application/x-yaml; charset=" + StandardCharsets.UTF_8;
            }
            
            byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
            cl = String.valueOf(bytes.length);
            
            ResponseBuilder builder = Response.ok().entity(content)
                    .header("Content-Type", ct)
                    .header("Content-Length", cl);
            return builder.build();
        } catch (StorageException | OaiCommandException | IOException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#createInvitation(java.lang.String)
     */
    @Override
    public Invitation createInvitation(String designId) throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Creating a collaboration invitation for API: {} ", designId);
        metrics.apiCall("/designs/{designId}/invitations", "POST");

        try {
            String user = this.security.getCurrentUser().getLogin();
            String username = this.security.getCurrentUser().getName();
            String inviteId = UUID.randomUUID().toString();
            
            ApiDesign design = this.storage.getApiDesign(user, designId);
            if (!this.storage.hasOwnerPermission(user, designId)) {
                throw new AccessDeniedException();
            }
            
            this.storage.createCollaborationInvite(inviteId, designId, user, username, "collaborator", design.getName());
            Invitation invite = new Invitation();
            invite.setCreatedBy(user);
            invite.setCreatedOn(new Date());
            invite.setDesignId(designId);
            invite.setInviteId(inviteId);
            invite.setStatus("pending");
            return invite;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getInvitation(java.lang.String, java.lang.String)
     */
    @Override
    public Invitation getInvitation(String designId, String inviteId) throws ServerError, NotFoundException {
        logger.debug("Retrieving a collaboration invitation for API: {}  and inviteID: {}", designId, inviteId);
        metrics.apiCall("/designs/{designId}/invitations/{inviteId}", "GET");

        try {
            return this.storage.getCollaborationInvite(designId, inviteId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getInvitations(java.lang.String)
     */
    @Override
    public Collection<Invitation> getInvitations(String designId) throws ServerError, NotFoundException {
        logger.debug("Retrieving all collaboration invitations for API: {}", designId);
        metrics.apiCall("/designs/{designId}/invitations", "GET");

        try {
            String user = this.security.getCurrentUser().getLogin();
            return this.storage.listCollaborationInvites(designId, user);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#acceptInvitation(java.lang.String, java.lang.String)
     */
    @Override
    public void acceptInvitation(String designId, String inviteId) throws ServerError, NotFoundException {
        logger.debug("Accepting an invitation to collaborate on an API: {}", designId);
        metrics.apiCall("/designs/{designId}/invitations", "PUT");

        try {
            String user = this.security.getCurrentUser().getLogin();
            Invitation invite = this.storage.getCollaborationInvite(designId, inviteId);
            if (this.storage.hasWritePermission(user, designId)) {
                throw new NotFoundException();
            }
            boolean accepted = this.storage.updateCollaborationInviteStatus(inviteId, "pending", "accepted", user);
            if (!accepted) {
                throw new NotFoundException();
            }
            this.storage.createPermission(designId, user, invite.getRole());
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#rejectInvitation(java.lang.String, java.lang.String)
     */
    @Override
    public void rejectInvitation(String designId, String inviteId) throws ServerError, NotFoundException {
        logger.debug("Rejecting an invitation to collaborate on an API: {}", designId);
        metrics.apiCall("/designs/{designId}/invitations", "DELETE");

        try {
            String user = this.security.getCurrentUser().getLogin();
            // This will ensure that the invitation exists for this designId.
            this.storage.getCollaborationInvite(designId, inviteId);
            boolean accepted = this.storage.updateCollaborationInviteStatus(inviteId, "pending", "rejected", user);
            if (!accepted) {
                throw new NotFoundException();
            }
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getCollaborators(java.lang.String)
     */
    @Override
    public Collection<ApiDesignCollaborator> getCollaborators(String designId) throws ServerError, NotFoundException {
        logger.debug("Retrieving all collaborators for API: {}", designId);
        metrics.apiCall("/designs/{designId}/collaborators", "GET");

        try {
            String user = this.security.getCurrentUser().getLogin();
            if (!this.storage.hasWritePermission(user, designId)) {
                throw new NotFoundException();
            }
            return this.storage.listPermissions(designId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#updateCollaborator(java.lang.String, java.lang.String, io.apicurio.hub.api.beans.UpdateCollaborator)
     */
    @Override
    public void updateCollaborator(String designId, String userId,
            UpdateCollaborator update) throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Updating collaborator for API: {}", designId);
        metrics.apiCall("/designs/{designId}/collaborators/{userId}", "PUT");

        try {
            String user = this.security.getCurrentUser().getLogin();
            if (!this.storage.hasOwnerPermission(user, designId)) {
                throw new AccessDeniedException();
            }
            this.storage.updatePermission(designId, userId, update.getNewRole());
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#deleteCollaborator(java.lang.String, java.lang.String)
     */
    @Override
    public void deleteCollaborator(String designId, String userId)
            throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Deleting/revoking collaborator for API: {}", designId);
        metrics.apiCall("/designs/{designId}/collaborators/{userId}", "DELETE");

        try {
            String user = this.security.getCurrentUser().getLogin();
            if (!this.storage.hasOwnerPermission(user, designId)) {
                throw new AccessDeniedException();
            }
            this.storage.deletePermission(designId, userId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getActivity(java.lang.String, java.lang.Integer, java.lang.Integer)
     */
    @Override
    public Collection<ApiDesignChange> getActivity(String designId, Integer start, Integer end)
            throws ServerError, NotFoundException {
        int from = 0;
        int to = 20;
        if (start != null) {
            from = start.intValue();
        }
        if (end != null) {
            to = end.intValue();
        }
        
        try {
        	if (!config.isShareForEveryone()) {
	            String user = this.security.getCurrentUser().getLogin();
	            if (!this.storage.hasWritePermission(user, designId)) {
	                throw new NotFoundException();
	            }
        	}
            return this.storage.listApiDesignActivity(designId, from, to);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getPublications(java.lang.String, java.lang.Integer, java.lang.Integer)
     */
    @Override
    public Collection<ApiPublication> getPublications(String designId, Integer start, Integer end)
            throws ServerError, NotFoundException {
        int from = 0;
        int to = 20;
        if (start != null) {
            from = start.intValue();
        }
        if (end != null) {
            to = end.intValue();
        }
        
        try {
            String user = this.security.getCurrentUser().getLogin();
            if (!this.storage.hasWritePermission(user, designId)) {
                throw new NotFoundException();
            }
            return this.storage.listApiDesignPublications(designId, from, to);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#publishApi(java.lang.String, io.apicurio.hub.api.beans.NewApiPublication)
     */
    @Override
    public void publishApi(String designId, NewApiPublication info) throws ServerError, NotFoundException {
        LinkedAccountType type = info.getType();
        
        try {
            // First step - publish the content to the soruce control system
            ISourceConnector connector = this.sourceConnectorFactory.createConnector(type);
            String resourceUrl = info.toResourceUrl();
            String formattedContent = getApiContent(designId, info.getFormat());
            try {
                ResourceContent content = connector.getResourceContent(resourceUrl);
                content.setContent(formattedContent);
                connector.updateResourceContent(resourceUrl, info.getCommitMessage(), null, content);
            } catch (NotFoundException nfe) {
                connector.createResourceContent(resourceUrl, info.getCommitMessage(), formattedContent);
            }
            
            // Followup step - store a row in the api_content table
            try {
                String user = this.security.getCurrentUser().getLogin();
                String publicationData = createPublicationData(info);
                storage.addContent(user, designId, ApiContentType.Publish, publicationData);
            } catch (Exception e) {
                logger.error("Failed to record API publication in database.", e);
            }
        } catch (SourceConnectorException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#mockApi(java.lang.String)
     */
    @Override
    public Response mockApi(String designId) throws ServerError, NotFoundException {
        try {
            // First step - publish the content to the Microcks server API
            String content = getApiContent(designId, FormatType.YAML);
            String serviceRef = this.microcks.uploadResourceContent(content);

            // Build mockURL from microcksURL.
            String mockURL = null;
            String microcksURL = config.getMicrocksApiUrl();
            try {
                mockURL = microcksURL.substring(0, microcksURL.indexOf("/api")) + "/#/services/"
                      + URLEncoder.encode(serviceRef, "UTF-8");
            } catch (Exception e) {
                logger.error("Failed to produce a valid mockURL", e);
            }


            // Followup step - store a row in the api_content table
            try {
                String user = this.security.getCurrentUser().getLogin();
                String mockData = createMockData(serviceRef, mockURL);
                storage.addContent(user, designId, ApiContentType.Mock, mockData);
            } catch (Exception e) {
                logger.error("Failed to record API mock publication in database.", e);
            }

            // Finally return response.
            StringBuilder json = new StringBuilder("{");
            json.append("\"serviceRef\": ").append("\"" + serviceRef + "\", ");
            json.append("\"mockURL\": ").append("\"" + mockURL + "\"}");
            ResponseBuilder builder = Response.ok().entity(json.toString())
                  .header("Content-Type", "application/json")
                  .header("Content-Length", json.toString().length());

            return builder.build();
        } catch (MicrocksConnectorException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getMocks(java.lang.String, java.lang.Integer, java.lang.Integer)
     */
    @Override
    public Collection<ApiMock> getMocks(String designId, Integer start, Integer end)
            throws ServerError, NotFoundException {
        int from = 0;
        int to = 20;
        if (start != null) {
            from = start.intValue();
        }
        if (end != null) {
            to = end.intValue();
        }
        
        try {
            String user = this.security.getCurrentUser().getLogin();
            if (!this.storage.hasWritePermission(user, designId)) {
                throw new NotFoundException();
            }
            return this.storage.listApiDesignMocks(designId, from, to);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * Creates the JSON data to be stored in the data row representing a "publish API" event
     * (also known as an API publication).
     * @param info
     */
    private String createPublicationData(NewApiPublication info) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode data = JsonNodeFactory.instance.objectNode();
            data.set("type", JsonNodeFactory.instance.textNode(info.getType().name()));
            data.set("org", JsonNodeFactory.instance.textNode(info.getOrg()));
            data.set("repo", JsonNodeFactory.instance.textNode(info.getRepo()));
            data.set("team", JsonNodeFactory.instance.textNode(info.getTeam()));
            data.set("group", JsonNodeFactory.instance.textNode(info.getGroup()));
            data.set("project", JsonNodeFactory.instance.textNode(info.getProject()));
            data.set("branch", JsonNodeFactory.instance.textNode(info.getBranch()));
            data.set("resource", JsonNodeFactory.instance.textNode(info.getResource()));
            data.set("format", JsonNodeFactory.instance.textNode(info.getFormat().name()));
            data.set("commitMessage", JsonNodeFactory.instance.textNode(info.getCommitMessage()));
            return mapper.writeValueAsString(data);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Create the JSON data to be stored in the data row representing a "mock API" event
     * (also know as an API mock publication).
     * @param serviceRef The service reference as returned by Microcks
     * @param mockURL The URL for accessing description page on Microcks server
     */
    private String createMockData(String serviceRef, String mockURL) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode data = JsonNodeFactory.instance.objectNode();
            data.set("mockType", JsonNodeFactory.instance.textNode("microcks"));
            data.set("serviceRef", JsonNodeFactory.instance.textNode(serviceRef));
            data.set("mockURL", JsonNodeFactory.instance.textNode(mockURL));
            return mapper.writeValueAsString(data);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Gets the current content of an API.
     * @param designId
     * @param format
     * @throws ServerError
     * @throws NotFoundException
     */
    private String getApiContent(String designId, FormatType format) throws ServerError, NotFoundException {
        try {
            String user = this.security.getCurrentUser().getLogin();
            ApiDesignContent designContent = this.storage.getLatestContentDocument(user, designId);
            
            String content = designContent.getOaiDocument();
            
            List<ApiDesignCommand> apiCommands = this.storage.listContentCommands(user, designId, designContent.getContentVersion());
            if (!apiCommands.isEmpty()) {
                List<String> commands = new ArrayList<>(apiCommands.size());
                for (ApiDesignCommand apiCommand : apiCommands) {
                    commands.add(apiCommand.getCommand());
                }
                content = this.oaiCommandExecutor.executeCommands(designContent.getOaiDocument(), commands);
            }

            // Convert to yaml if necessary
            if (format == FormatType.YAML) {
                content = FormatUtils.jsonToYaml(content);
            } else {
                content = FormatUtils.formatJson(content);
            }
            
            return content;
        } catch (StorageException | OaiCommandException | IOException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getCodegenProjects(java.lang.String)
     */
    @Override
    public Collection<CodegenProject> getCodegenProjects(String designId)
            throws ServerError, NotFoundException {
        logger.debug("Retrieving codegen project list for design with ID: {}", designId);
        metrics.apiCall("/designs/{designId}/codegen/projects", "GET");

        try {
            String user = this.security.getCurrentUser().getLogin();
            ApiDesign design = this.storage.getApiDesign(user, designId);
            return this.storage.listCodegenProjects(user, design.getId());
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#createCodegenProject(java.lang.String, io.apicurio.hub.api.beans.NewCodegenProject)
     */
    @Override
    public CodegenProject createCodegenProject(String designId, NewCodegenProject body)
            throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Creating a codegen project for API: {} ", designId);
        metrics.apiCall("/designs/{designId}/codegen/projects", "POST");

        try {
            String user = this.security.getCurrentUser().getLogin();
            
            ApiDesign design = this.storage.getApiDesign(user, designId);
            if (!this.storage.hasWritePermission(user, designId)) {
                throw new AccessDeniedException();
            }
            
            CodegenProject project = new CodegenProject();
            Date now = new Date();
            project.setCreatedBy(user);
            project.setCreatedOn(now);
            project.setModifiedBy(user);
            project.setModifiedOn(now);
            project.setDesignId(design.getId());
            project.setType(body.getProjectType());
            
            project.setAttributes(new HashMap<String, String>());
            if (body.getProjectConfig() != null) {
                project.getAttributes().putAll(body.getProjectConfig());
            }
            project.getAttributes().put("location", body.getLocation().toString());
            project.getAttributes().put("update-only", Boolean.FALSE.toString());
            if (body.getPublishInfo() != null) {
                if (body.getPublishInfo().getType() != null) {
                    project.getAttributes().put("publish-type", body.getPublishInfo().getType().toString());
                }
                project.getAttributes().put("publish-branch", body.getPublishInfo().getBranch());
                project.getAttributes().put("publish-commitMessage", body.getPublishInfo().getCommitMessage());
                project.getAttributes().put("publish-group", body.getPublishInfo().getGroup());
                project.getAttributes().put("publish-location", body.getPublishInfo().getLocation());
                project.getAttributes().put("publish-org", body.getPublishInfo().getOrg());
                project.getAttributes().put("publish-project", body.getPublishInfo().getProject());
                project.getAttributes().put("publish-repo", body.getPublishInfo().getRepo());
                project.getAttributes().put("publish-team", body.getPublishInfo().getTeam());
            }

            if (body.getLocation() == CodegenLocation.download) {
                // Nothing extra to do when downloading - that will be handled by a separate call
            }

            if (body.getLocation() == CodegenLocation.sourceControl) {
                String prUrl = generateAndPublishProject(project, false);
                project.getAttributes().put("pullRequest-url", prUrl);
            }

            String projectId = this.storage.createCodegenProject(user, project);
            project.setId(projectId);

            return project;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#getCodegenProjectAsZip(java.lang.String, java.lang.String)
     */
    @Override
    public Response getCodegenProjectAsZip(String designId, String projectId)
            throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Downloading a codegen project for API Design with ID {}", designId);
        metrics.apiCall("/designs/{designId}/codegen/projects/{projectId}/zip", "GET");

        String user = this.security.getCurrentUser().getLogin();

        try {
            if (!this.storage.hasWritePermission(user, designId)) {
                throw new AccessDeniedException();
            }
            CodegenProject project = this.storage.getCodegenProject(user, designId, projectId);
            String oaiContent = this.getApiContent(designId, FormatType.JSON);
            
            // TODO support other types besides Thorntail
            if (project.getType() == CodegenProjectType.thorntail) {
                String groupId = project.getAttributes().get("groupId");
                String artifactId = project.getAttributes().get("artifactId");
                String javaPackage = project.getAttributes().get("javaPackage");
            
                ThorntailProjectSettings settings = new ThorntailProjectSettings();
                settings.groupId = groupId != null ? groupId : "org.example.api";
                settings.artifactId = artifactId != null ? artifactId : "generated-api";
                settings.javaPackage = javaPackage != null ? javaPackage : "org.example.api";
                
                boolean updateOnly = "true".equals(project.getAttributes().get("update-only"));

                final OpenApi2Thorntail generator = new OpenApi2Thorntail();
                generator.setSettings(settings);
                generator.setOpenApiDocument(oaiContent);
                generator.setUpdateOnly(updateOnly);
                
                StreamingOutput stream = new StreamingOutput() {
                    @Override
                    public void write(OutputStream output) throws IOException, WebApplicationException {
                        generator.generate(output);
                    }
                };
                
                String fname = settings.artifactId + ".zip";
                ResponseBuilder builder = Response.ok().entity(stream)
                        .header("Content-Disposition", "attachment; filename=\"" + fname + "\"")
                        .header("Content-Type", "application/zip");

                return builder.build();
            } else {
                throw new ServerError("Unsupported project type: " + project.getType());
            }
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#updateCodegenProject(java.lang.String, java.lang.String, io.apicurio.hub.api.beans.UpdateCodgenProject)
     */
    @Override
    public CodegenProject updateCodegenProject(String designId, String projectId, UpdateCodgenProject body)
            throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Updating codegen project for API: {}", designId);
        metrics.apiCall("/designs/{designId}/codegen/projects/{projectId}", "PUT");

        try {
            String user = this.security.getCurrentUser().getLogin();
            if (!this.storage.hasWritePermission(user, designId)) {
                throw new AccessDeniedException();
            }

            CodegenProject project = this.storage.getCodegenProject(user, designId, projectId);
            project.setType(body.getProjectType());
            
            project.setAttributes(new HashMap<String, String>());
            if (body.getProjectConfig() != null) {
                project.getAttributes().putAll(body.getProjectConfig());
            }
            project.getAttributes().put("location", body.getLocation().toString());
            project.getAttributes().put("update-only", Boolean.TRUE.toString());
            if (body.getPublishInfo() != null) {
                if (body.getPublishInfo().getType() != null) {
                    project.getAttributes().put("publish-type", body.getPublishInfo().getType().toString());
                }
                project.getAttributes().put("publish-branch", body.getPublishInfo().getBranch());
                project.getAttributes().put("publish-commitMessage", body.getPublishInfo().getCommitMessage());
                project.getAttributes().put("publish-group", body.getPublishInfo().getGroup());
                project.getAttributes().put("publish-location", body.getPublishInfo().getLocation());
                project.getAttributes().put("publish-org", body.getPublishInfo().getOrg());
                project.getAttributes().put("publish-project", body.getPublishInfo().getProject());
                project.getAttributes().put("publish-repo", body.getPublishInfo().getRepo());
                project.getAttributes().put("publish-team", body.getPublishInfo().getTeam());
            }
            
            if (body.getLocation() == CodegenLocation.download) {
                // Nothing extra to do when downloading - that will be handled by a separate call
            }
            
            if (body.getLocation() == CodegenLocation.sourceControl) {
                String prUrl = generateAndPublishProject(project, true);
                project.getAttributes().put("pullRequest-url", prUrl);
            }

            this.storage.updateCodegenProject(user, project);
            
            return project;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#deleteCodegenProject(java.lang.String, java.lang.String)
     */
    @Override
    public void deleteCodegenProject(String designId, String projectId)
            throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Deleting codegen project for API: {}", designId);
        metrics.apiCall("/designs/{designId}/codegen/projects/{projectId}", "DELETE");

        try {
            String user = this.security.getCurrentUser().getLogin();
            if (!this.storage.hasWritePermission(user, designId)) {
                throw new AccessDeniedException();
            }
            this.storage.deleteCodegenProject(user, designId, projectId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#deleteCodegenProjects(java.lang.String)
     */
    @Override
    public void deleteCodegenProjects(String designId) throws ServerError, NotFoundException, AccessDeniedException {
        logger.debug("Deleting ALL codegen projects for API: {}", designId);
        metrics.apiCall("/designs/{designId}/codegen/projects", "DELETE");

        try {
            String user = this.security.getCurrentUser().getLogin();
            if (!this.storage.hasWritePermission(user, designId)) {
                throw new AccessDeniedException();
            }
            this.storage.deleteCodegenProjects(user, designId);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * Generate and publish (to a git/source control system) a project.  This will 
     * generate a project from the OpenAPI document and then publish the result to
     * a soruce control platform.
     * @param project
     * @param updateOnly
     * @return the URL of the published pull request
     */
    private String generateAndPublishProject(CodegenProject project, boolean updateOnly)
            throws ServerError, NotFoundException {
        try {
            String oaiContent = this.getApiContent(project.getDesignId(), FormatType.JSON);
            
            // TODO support other types besides Thorntail
            if (project.getType() == CodegenProjectType.thorntail) {
                String groupId = project.getAttributes().get("groupId");
                String artifactId = project.getAttributes().get("artifactId");
                String javaPackage = project.getAttributes().get("javaPackage");
            
                ThorntailProjectSettings settings = new ThorntailProjectSettings();
                settings.groupId = groupId != null ? groupId : "org.example.api";
                settings.artifactId = artifactId != null ? artifactId : "generated-api";
                settings.javaPackage = javaPackage != null ? javaPackage : "org.example.api";

                OpenApi2Thorntail generator = new OpenApi2Thorntail();
                generator.setSettings(settings);
                generator.setOpenApiDocument(oaiContent);
                generator.setUpdateOnly(updateOnly);
                
                ByteArrayOutputStream generatedContent = generator.generate();
                LinkedAccountType scsType = LinkedAccountType.valueOf(project.getAttributes().get("publish-type"));
                
                ISourceConnector connector = this.sourceConnectorFactory.createConnector(scsType);
                String url = toSourceResourceUrl(project);
                String commitMessage = project.getAttributes().get("publish-commitMessage");
                String pullRequestUrl = connector.createPullRequestFromZipContent(url, commitMessage,
                        new ZipInputStream(new ByteArrayInputStream(generatedContent.toByteArray())));
                return pullRequestUrl;
            } else {
                throw new ServerError("Unsupported project type: " + project.getType());
            }
        } catch (IOException | SourceConnectorException e) {
            throw new ServerError(e);
        }
    }

    /**
     * Creates a source control resource URL from the information found in the codegen project.
     * @param project
     */
    private String toSourceResourceUrl(CodegenProject project) {
        LinkedAccountType scsType = LinkedAccountType.valueOf(project.getAttributes().get("publish-type"));
        String url;
        switch (scsType) {
            case Bitbucket: {
                String team = project.getAttributes().get("publish-team");
                String repo = project.getAttributes().get("publish-repo");
                String branch = project.getAttributes().get("publish-branch");
                String path = project.getAttributes().get("publish-location");
                url = BitbucketResourceResolver.create(team, repo, branch, path);
            }
            break; 
            case GitHub: {
                String org = project.getAttributes().get("publish-org");
                String repo = project.getAttributes().get("publish-repo");
                String branch = project.getAttributes().get("publish-branch");
                String path = project.getAttributes().get("publish-location");
                url = GitHubResourceResolver.create(org, repo, branch, path);
            }
            break;
            case GitLab: {
                String group = project.getAttributes().get("publish-group");
                String proj = project.getAttributes().get("publish-project");
                String branch = project.getAttributes().get("publish-branch");
                String path = project.getAttributes().get("publish-location");
                url = GitLabResourceResolver.create(group, proj, branch, path);
            }
            break;
            default:
                throw new RuntimeException("Unsupported type: " + scsType);
        }
        return url;
    }
    
}
