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

package io.apicurio.hub.api.security;

import javax.enterprise.context.RequestScoped;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;

import io.apicurio.studio.shared.beans.User;

/**
 * A security context that uses github access tokens to authenticate the user.
 * @author eric.wittmann@gmail.com
 */
@RequestScoped
public class GitHubSecurityContext implements ISecurityContext {
    
    @Context
    private HttpServletRequest httpRequest;
    
    private User user;
    
    /**
     * Constructor.
     */
    public GitHubSecurityContext() {
    }
    
    /**
     * @param user
     */
    protected void setUser(User user) {
        this.user = user;
    }
    
    /**
     * @see io.apicurio.hub.api.security.ISecurityContext#getCurrentUser()
     */
    @Override
    public User getCurrentUser() {
        return user;
    }

}
