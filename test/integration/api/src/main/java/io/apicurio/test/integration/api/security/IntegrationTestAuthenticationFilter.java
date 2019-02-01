/*
 * Copyright 2019 JBoss Inc
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

package io.apicurio.test.integration.api.security;

import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.api.security.SecurityContext;
import io.apicurio.studio.shared.beans.User;
import io.apicurio.test.integration.common.IAuthOverride;

import javax.inject.Inject;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Base64;

/**
 * This is a simple filter that extracts authentication information from the 
 * Keycloak 
 * @author eric.wittmann@gmail.com
 */
public class IntegrationTestAuthenticationFilter implements Filter {

    @Inject
    private ISecurityContext security;

    @Inject
    private IAuthOverride override;

    /**
     * @see javax.servlet.Filter#init(javax.servlet.FilterConfig)
     */
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    /**
     * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest, javax.servlet.ServletResponse, javax.servlet.FilterChain)
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpReq = (HttpServletRequest) request;
        HttpServletResponse httpResp = (HttpServletResponse) response;

        if (override.isManualOverride()) {
            override.applyUser();
            chain.doFilter(request, response);
            return;
        }

        // Authorization header is required
        String authHeader = httpReq.getHeader("Authorization");
        if (authHeader == null) {
            httpResp.sendError(403);
            return;
        }

        // Must be Basic auth
        if (!authHeader.toLowerCase().startsWith("basic ")) {
            httpResp.sendError(403);
            return;
        }
        
        // Parse the basic auth header
        String username = null;
        String password = null;
        try {
            String authToken = authHeader.substring(6);
            String decoded = new String(Base64.getDecoder().decode(authToken));
            String [] split = decoded.split(":");
            username = split[0];
            password = split[1];
        } catch (Throwable e) {
            e.printStackTrace();
            httpResp.sendError(403);
            return;
        }
        
        // Username and password should be the same
        if (!username.equals(password)) {
            httpResp.sendError(403);
            return;
        }

        // Authentication successful, configure the security context for the request.
        User user = new User();
        user.setEmail(username + "@example.org");
        user.setLogin(username);
        user.setName(username);
        ((SecurityContext) security).setUser(user);
        ((SecurityContext) security).setToken(authHeader);
        
        chain.doFilter(request, response);
    }

    /**
     * @see javax.servlet.Filter#destroy()
     */
    @Override
    public void destroy() {
    }
}
