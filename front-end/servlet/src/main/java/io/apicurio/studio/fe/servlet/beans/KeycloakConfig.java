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

package io.apicurio.studio.fe.servlet.beans;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author eric.wittmann@gmail.com
 */
public class KeycloakConfig {
    
    private String realm;
    @JsonProperty("auth-server-url")
    private String authServerUrl;
    @JsonProperty("ssl-required")
    private String sslRequired;
    private String resource;
    @JsonProperty("public-client")
    private boolean publicClient;
    
    /**
     * Constructor.
     */
    public KeycloakConfig() {
    }

    /**
     * @return the realm
     */
    public String getRealm() {
        return realm;
    }

    /**
     * @param realm the realm to set
     */
    public void setRealm(String realm) {
        this.realm = realm;
    }

    /**
     * @return the authServerUrl
     */
    public String getAuthServerUrl() {
        return authServerUrl;
    }

    /**
     * @param authServerUrl the authServerUrl to set
     */
    public void setAuthServerUrl(String authServerUrl) {
        this.authServerUrl = authServerUrl;
    }

    /**
     * @return the sslRequired
     */
    public String getSslRequired() {
        return sslRequired;
    }

    /**
     * @param sslRequired the sslRequired to set
     */
    public void setSslRequired(String sslRequired) {
        this.sslRequired = sslRequired;
    }

    /**
     * @return the resource
     */
    public String getResource() {
        return resource;
    }

    /**
     * @param resource the resource to set
     */
    public void setResource(String resource) {
        this.resource = resource;
    }

    /**
     * @return the publicClient
     */
    public boolean isPublicClient() {
        return publicClient;
    }

    /**
     * @param publicClient the publicClient to set
     */
    public void setPublicClient(boolean publicClient) {
        this.publicClient = publicClient;
    }
}
