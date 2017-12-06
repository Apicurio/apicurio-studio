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

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.api.beans.SystemReady;
import io.apicurio.hub.api.beans.SystemStatus;
import io.apicurio.hub.api.metrics.IApiMetrics;
import io.apicurio.hub.api.rest.ISystemResource;
import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.core.Version;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;
import io.prometheus.client.exporter.common.TextFormat;

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
    private ISecurityContext security;
    @Inject
    private IApiMetrics metrics;

    /**
     * @see io.apicurio.hub.api.rest.ISystemResource#getStatus()
     */
    @Override
    public SystemStatus getStatus() {
        logger.debug("Getting system status.");
        
        metrics.apiCall("/system/status", "GET");
        
        SystemStatus status = new SystemStatus();
        String user = null;
        if (this.security.getCurrentUser() != null) {
            user = this.security.getCurrentUser().getLogin();
        }
        try {
            status.setBuiltOn(version.getVersionDate());
            status.setDescription("The API to the Apicurio Studio Hub.");
            status.setMoreInfo("http://www.apicur.io/");
            status.setName("Apicurio Studio Hub API");
            status.setUp(storage != null && storage.listApiDesigns(user).size() >= 0);
            status.setVersion(version.getVersionString());
            status.setUser(security.getCurrentUser());
        } catch (StorageException e) {
            logger.error("Error getting System Status.", e);
            status.setUp(false);
        }

        return status;
    }
    
    /**
     * @see io.apicurio.hub.api.rest.ISystemResource#getReady()
     */
    @Override
    public SystemReady getReady() {
        SystemReady ready = new SystemReady();
        ready.setUp(true);
        return ready;
    }
    
    /**
     * @see io.apicurio.hub.api.rest.ISystemResource#getMetrics()
     */
    @Override
    public Response getMetrics() throws ServerError {
        try {
            String metricsInfo = metrics.getCurrentMetricsInfo();
            ResponseBuilder builder = Response.ok().entity(metricsInfo)
                    .header("Content-Type", TextFormat.CONTENT_TYPE_004)
                    .header("Content-Length", metricsInfo.length());
            return builder.build();
        } catch (IOException e) {
            throw new ServerError(e);
        }
    }

}
