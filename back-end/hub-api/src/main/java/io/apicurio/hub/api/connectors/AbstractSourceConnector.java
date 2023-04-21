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

package io.apicurio.hub.api.connectors;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;

import javax.inject.Inject;

import kong.unirest.HttpRequest;
import kong.unirest.Unirest;
import org.apache.http.impl.client.HttpClients;
import org.keycloak.common.util.Encode;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.apicurio.hub.api.security.ILinkedAccountsProvider;
import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.core.config.HubConfiguration;

/**
 * Base class for all source connectors.
 * @author eric.wittmann@gmail.com
 */
public abstract class AbstractSourceConnector implements ISourceConnector {

    protected static final ObjectMapper mapper = new ObjectMapper();
    static {
        mapper.setSerializationInclusion(Include.NON_NULL);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        Unirest.config().setObjectMapper(new kong.unirest.ObjectMapper() {
            public <T> T readValue(String value, Class<T> valueType) {
                try {
                    return mapper.readValue(value, valueType);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
            public String writeValue(Object value) {
                try {
                    return mapper.writeValueAsString(value);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            }
        });
        // To allow Unirest to use system proxy
        Unirest.config().httpClient(HttpClients.createSystem());
    }

    @Inject
    protected HubConfiguration config;
    @Inject
    protected ISecurityContext security;
    @Inject
    protected ILinkedAccountsProvider linkedAccountsProvider;

    /**
     * Returns the base URL for the source connector's API.
     */
    protected abstract String getBaseApiEndpointUrl();
    
    /**
     * Adds the appropriate security credentials into the request.
     * @param request
     */
    protected abstract void addSecurityTo(HttpRequest request) throws SourceConnectorException;

    /**
     * Fetches the external IDP token from Keycloak.  For this to work, the user must
     * have established a linked account with the provider in question (e.g. GitHub).
     */
    protected String getExternalToken() throws SourceConnectorException {
        try {
            String externalAccessToken = linkedAccountsProvider.getLinkedAccountToken(getType());
            if (externalAccessToken == null) {
                return null;
            }
            
            Map<String, String> data = parseExternalTokenResponse(externalAccessToken);
            return data.get("access_token");
        } catch (IOException e) {
            throw new SourceConnectorException(e);
        }
    }

    /**
     * Parses the response from the Keycloak "get external IDP token" endpoint into a simple 
     * map of values.  A typical response body might be:
     * 
     * <pre>
     * access_token=298cc1f917075a955a7bbbff23f67a72e5d6cba7&scope=repo%2Cuser%3Aemail&token_type=bearer
     * </pre>
     * 
     * @param body
     */
    protected abstract Map<String, String> parseExternalTokenResponse(String body);

    /**
     * Creates a github API endpoint from the api path.
     * @param path
     */
    protected Endpoint endpoint(String path) {
        return new Endpoint(getBaseApiEndpointUrl() + path);
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
        private Map<String, String> queryParams = new LinkedHashMap<>();
        
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
         */
        public Endpoint bind(String paramName, Object value) {
            this.url = this.url.replace(":" + paramName, String.valueOf(value));
            return this;
        }
        
        /**
         * Sets a query param.
         * @param name
         * @param value
         */
        public Endpoint queryParam(String name, String value) {
            this.queryParams.put(name, value);
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
            if (this.queryParams.isEmpty()) {
                return this.url;
            }
            final StringBuilder url = new StringBuilder(this.url);
            boolean first = true;
            for (Entry<String, String> entry : this.queryParams.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();
                String sep = "&";
                if (first) {
                    sep = "?";
                    first = false;
                }
                url.append(sep);
                url.append(Encode.encodeQueryParamAsIs(key));
                url.append("=");
                url.append(Encode.encodeQueryParamAsIs(value));
            }
            
            return url.toString();
        }
        
    }

}
