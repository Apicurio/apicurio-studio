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
import io.apicurio.hub.api.beans.NewApiDesign;
import io.apicurio.hub.api.exceptions.AlreadyExistsException;
import io.apicurio.hub.api.exceptions.ServerError;
import io.apicurio.hub.api.rest.IDesignsResource;
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

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#listDesigns()
     */
    @Override
    public Collection<ApiDesign> listDesigns() throws ServerError {
        try {
            logger.debug("Listing API Designs");
            return this.storage.listApiDesigns();
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IDesignsResource#addDesign(io.apicurio.hub.api.beans.AddApiDesign)
     */
    @Override
    public ApiDesign addDesign(AddApiDesign info) throws ServerError, AlreadyExistsException {
        logger.debug("Adding an API Design: {}", info.getRepositoryUrl());
        
        Date now = new Date();
        
        ApiDesign design = new ApiDesign();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setModifiedBy("user");
        design.setModifiedOn(now);
        design.setName("API Name");
        design.setRepositoryUrl(info.getRepositoryUrl());
        
        try {
            String id = this.storage.createApiDesign(design);
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

}
