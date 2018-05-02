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

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.api.metrics.IApiMetrics;
import io.apicurio.hub.api.rest.ICurrentUserResource;
import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.ApiDesignChange;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;
import io.apicurio.studio.shared.beans.User;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class CurrentUserResource implements ICurrentUserResource {
    
    private static Logger logger = LoggerFactory.getLogger(CurrentUserResource.class);

    @Inject
    private ISecurityContext security;
    @Inject
    private IStorage storage;
    @Inject
    private IApiMetrics metrics;

    /**
     * @see io.apicurio.hub.api.rest.ICurrentUserResource#getCurrentUser()
     */
    @Override
    public User getCurrentUser() {
        return security.getCurrentUser();
    }
    
    /**
     * @see io.apicurio.hub.api.rest.ICurrentUserResource#getActivity(java.lang.Integer, java.lang.Integer)
     */
    @Override
    public Collection<ApiDesignChange> getActivity(Integer start, Integer end) throws ServerError, NotFoundException {
        metrics.apiCall("/currentuser", "GET");
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
            return this.storage.listUserActivity(user, from, to);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    @Override
    public Collection<ApiDesign> getRecentDesigns() throws ServerError {
        metrics.apiCall("/currentuser/recent/designs", "GET");
        
        try {
            logger.debug("Listing API Designs");
            String user = this.security.getCurrentUser().getLogin();
            Collection<ApiDesign> designs = this.storage.getRecentApiDesigns(user);
            return designs;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
}
