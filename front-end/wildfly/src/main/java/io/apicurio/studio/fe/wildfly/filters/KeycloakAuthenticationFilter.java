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

package io.apicurio.studio.fe.wildfly.filters;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.keycloak.KeycloakSecurityContext;
import org.keycloak.representations.AccessToken;

import io.apicurio.studio.fe.wildfly.config.RequestAttributeKeys;
import io.apicurio.studio.shared.beans.User;

/**
 * This is a simple filter that extracts authentication information from the 
 * Keycloak 
 * @author eric.wittmann@gmail.com
 */
public class KeycloakAuthenticationFilter implements Filter {

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
        KeycloakSecurityContext session = getSession(httpReq);
        if (session != null) {
            HttpSession httpSession = httpReq.getSession();
            
            // Set the token as a string in the request (as an attribute) for later use.
            String tokenStr = session.getTokenString();
            httpSession.setAttribute(RequestAttributeKeys.TOKEN_KEY, tokenStr);

            // Fabricate a User object from information in the access token and store it in the request.
            AccessToken token = session.getToken();
            if (token != null) {
                User user = new User();
                user.setEmail(token.getEmail());
                user.setLogin(token.getPreferredUsername());
                user.setName(token.getName());
                httpSession.setAttribute(RequestAttributeKeys.USER_KEY, user);
            }
        }
        chain.doFilter(request, response);
    }

    /**
     * @see javax.servlet.Filter#destroy()
     */
    @Override
    public void destroy() {
    }
    
    private KeycloakSecurityContext getSession(HttpServletRequest req) {
        return (KeycloakSecurityContext) req.getAttribute(KeycloakSecurityContext.class.getName());
    }
}
