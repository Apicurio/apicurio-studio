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

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.apicurio.studio.shared.beans.User;

/**
 * An authentication filter that requires every request to present a valid GitHub access token.
 * @author eric.wittmann@gmail.com
 */
public class GitHubAuthenticationFilter implements Filter {
    
    private static Logger logger = LoggerFactory.getLogger(GitHubAuthenticationFilter.class);
    private static final Map<String, User> authCache = new HashMap<>();
    private static ObjectMapper mapper = new ObjectMapper();
    static {
        mapper.setSerializationInclusion(Include.NON_NULL);
    }
    
    @Inject
    private ISecurityContext security;

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
        
        String token = getAuthenticationToken(httpReq);
        if (token == null || token.trim().isEmpty()) {
            httpResp.setHeader("WWW-Authenticate", "Bearer realm=\"apicurio-studio\"");
            httpResp.sendError(401);
        } else {
            User user = getCachedUser(token);
            if (user == null) {
                user = authenticateUser(token);
                if (user != null) {
                    cacheAuthenticatedUser(token, user);
                }
            }
            if (user == null) {
                httpResp.setHeader("WWW-Authenticate", "Bearer realm=\"apicurio-studio\"");
                httpResp.sendError(401);
            } else {
                ((SecurityContext) security).setUser(user);
                chain.doFilter(request, response);
            }
        }
    }

    /**
     * Extracts the access token from the "Authorization" HTTP header.  Returns null if no
     * Authorization header is found.
     * @param request
     */
    private String getAuthenticationToken(HttpServletRequest request) {
        String tokenHeader = request.getHeader("Authorization");
        if (tokenHeader == null || !(tokenHeader.toLowerCase().startsWith("bearer ") || tokenHeader.toLowerCase().startsWith("token "))) {
            return null;
        }
        String token = tokenHeader.substring(tokenHeader.indexOf(' ') + 1);
        return token;
    }

    /**
     * Gets the cached authenticated user object for the given token.  Returns null
     * if no authenticated user is found in the cache.
     * @param token
     */
    private User getCachedUser(String token) {
        return authCache.get(token);
    }

    /**
     * Fetches information about the authenticated user.  Uses the github access token
     * to make an authenticated call to the GitHub API to fetch the user info.
     * @param token
     */
    private User authenticateUser(String token) {
        try {
            HttpResponse<String> userResp = Unirest.get("https://api.github.com/user")
                    .header("Accept", "application/json")
                    .header("Authorization", "Bearer " + token)
                    .asString();
            if (userResp.getStatus() != 200) {
                return null;
            } else {
                String json = userResp.getBody();
                User user = mapper.readerFor(User.class).readValue(json);
                return user;
            }
        } catch (Exception e) {
            logger.error("Failed to authenticate with the GitHub API", e);
            return null;
        }
    }

    /**
     * Caches the given authenticated user, mapping it to the given token.  Future requests will
     * be able to look up the authenticated user from the token without accessing GitHub again.
     * @param token
     * @param user
     */
    private void cacheAuthenticatedUser(String token, User user) {
        authCache.put(token, user);
    }

    /**
     * @see javax.servlet.Filter#destroy()
     */
    @Override
    public void destroy() {
    }

}
