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

import java.util.Collection;
import java.util.Date;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.api.beans.AddApiDesign;
import io.apicurio.hub.api.beans.ApiDesign;
import io.apicurio.hub.api.beans.ApiDesignResourceInfo;
import io.apicurio.hub.api.beans.Collaborator;
import io.apicurio.hub.api.beans.NewApiDesign;
import io.apicurio.hub.api.beans.UpdateApiDesign;
import io.apicurio.hub.api.exceptions.AlreadyExistsException;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.exceptions.ServerError;
import io.apicurio.hub.api.github.IGitHubService;
import io.apicurio.hub.api.rest.IDesignsResource;
import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.api.storage.IStorage;
import io.apicurio.hub.api.storage.StorageException;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class DesignsResource implements IDesignsResource {

    private static Logger logger = LoggerFactory.getLogger(DesignsResource.class);

    @Inject
    private IStorage storage;
    @Inject
    private IGitHubService github;
    @Inject
    private ISecurityContext security;

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
        
        ApiDesignResourceInfo resourceInfo = this.github.validateResourceExists(info.getRepositoryUrl());
        
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
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#createDesign(io.apicurio.hub.api.beans.NewApiDesign)
     */
    @Override
    public ApiDesign createDesign(NewApiDesign info) throws ServerError, AlreadyExistsException {
        logger.debug("Creating an API Design: {} :: {}", info.getName(), info.getRepositoryUrl());
        // TODO Auto-generated method stub
        return null;
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
        try {
            String user = this.security.getCurrentUser().getLogin();
            ApiDesign design = this.storage.getApiDesign(user, designId);
            String repoUrl = design.getRepositoryUrl();
            return this.github.getCollaborators(repoUrl);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

}
