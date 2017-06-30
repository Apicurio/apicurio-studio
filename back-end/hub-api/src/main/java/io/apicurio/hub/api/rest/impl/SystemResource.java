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

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.api.Version;
import io.apicurio.hub.api.beans.SystemStatus;
import io.apicurio.hub.api.rest.ISystemResource;
import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.api.storage.IStorage;
import io.apicurio.hub.api.storage.StorageException;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class SystemResource implements ISystemResource {

    private static Logger logger = LoggerFactory.getLogger(SystemResource.class);
    
    @Inject
    private IStorage storage;
    @Inject
    private Version version;
    @Inject
    private ISecurityContext securityContext;

    /**
     * @see io.apicurio.hub.api.rest.ISystemResource#getStatus()
     */
    @Override
    public SystemStatus getStatus() {
        logger.debug("Getting system status.");
        
        SystemStatus status = new SystemStatus();
        try {
            status.setBuiltOn(version.getVersionDate());
            status.setDescription("The API to the Apicurio Studio Hub.");
            status.setMoreInfo("http://www.apicur.io/");
            status.setName("Apicurio Studio Hub API");
            status.setUp(storage != null && storage.listApiDesigns().size() >= 0);
            status.setVersion(version.getVersionString());
            status.setUser(securityContext.getCurrentUser());
        } catch (StorageException e) {
            logger.error("Error getting System Status.", e);
            status.setUp(false);
        }

        return status;
    }

}
