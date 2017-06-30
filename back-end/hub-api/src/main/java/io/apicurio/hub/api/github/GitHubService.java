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

package io.apicurio.hub.api.github;

import java.io.IOException;
import java.util.Map;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.codec.binary.Base64;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mashape.unirest.request.GetRequest;

import io.apicurio.hub.api.beans.ApiDesignResourceInfo;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.security.ISecurityContext;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class GitHubService implements IGitHubService {

    private static final String GITHUB_API_ENDPOINT = "https://api.github.com";
    private static final ObjectMapper mapper = new ObjectMapper();

    @Inject
    private ISecurityContext security;

    /**
     * @see io.apicurio.hub.api.github.IGitHubService#validateResourceExists(java.lang.String)
     * 
     * TODO need more granular error conditions besides just {@link NotFoundException}
     */
    @Override
    public ApiDesignResourceInfo validateResourceExists(String repositoryUrl) throws NotFoundException {
        try {
            GitHubResource resource = ResourceResolver.resolve(repositoryUrl);
            if (resource == null) {
                throw new NotFoundException();
            }
            String content = getResourceContent(resource);
            Map<String, Object> jsonContent = mapper.reader(Map.class).readValue(content);
            String b64Content = (String) jsonContent.get("content");
            
            content = new String(Base64.decodeBase64(b64Content), "UTF-8");
            jsonContent = mapper.reader(Map.class).readValue(content);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> infoContent = (Map<String, Object>) jsonContent.get("info");
            String name = (String) infoContent.get("title");
            String description = (String) infoContent.get("description");
            
            ApiDesignResourceInfo info = new ApiDesignResourceInfo();
            info.setName(name);
            info.setDescription(description);
            return info;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Gets the content of the given GitHub resource.  This is done by querying for the
     * content using the GH API.
     * @param resource
     * 
     * TODO need more granular error conditions besides just {@link NotFoundException}
     */
    private String getResourceContent(GitHubResource resource) throws NotFoundException {
        try {
            String githubApiUrl = this.endpoint("/repos/:owner/:repo/contents/:path")
                    .bind("owner", resource.getOrganization())
                    .bind("repo", resource.getRepository())
                    .bind("path", resource.getResourcePath())
                    .url();
            GetRequest request = Unirest.get(githubApiUrl).header("Accept", "application/json");
            security.addSecurity(request);
            HttpResponse<String> userResp = request.asString();
            if (userResp.getStatus() != 200) {
                throw new NotFoundException();
            } else {
                String json = userResp.getBody();
                return json;
            }
        } catch (UnirestException e) {
            throw new NotFoundException();
        }
    }

    /**
     * Creates a github API endpoint from the api path.
     * @param path
     */
    protected Endpoint endpoint(String path) {
        return new Endpoint(GITHUB_API_ENDPOINT + path);
    }
    
    /**
     * An endpoint that will be used to make a call to the GitHub API.  The form of an endpoint path
     * should be (for example):
     * 
     * https://api.github.com/repos/:owner/:repo/contents/:path
     * 
     * The path parameters can then be set by calling bind() on the {@link Endpoint} object.
     * 
     * @author eric.wittmann@gmail.com
     */
    public static class Endpoint {
        
        private String url;
        
        /**
         * Constructor.
         */
        public Endpoint(String url) {
            this.url = url;
        }
        
        /**
         * Binds a parameter to the endpoint.  
         * @param paramName
         * @param value
         * @return
         */
        public Endpoint bind(String paramName, Object value) {
            this.url = this.url.replace(":" + paramName, String.valueOf(value));
            return this;
        }
        
        /**
         * Returns the url.
         */
        public String url() {
            return this.url;
        }
        
        /**
         * @see java.lang.Object#toString()
         */
        @Override
        public String toString() {
            return this.url;
        }
        
    }

}
