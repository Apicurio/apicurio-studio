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

package io.apicurio.hub.api.microcks;

import java.io.ByteArrayInputStream;
import java.nio.charset.Charset;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Default;
import javax.inject.Inject;

import kong.unirest.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import io.apicurio.hub.core.config.HubConfiguration;

/**
 * Default implementation of a Microcks connector.
 *
 * @author laurent.broudoux@gmail.com
 */
@ApplicationScoped
@Default
public class MicrocksConnector implements IMicrocksConnector {

    private static Logger logger = LoggerFactory.getLogger(MicrocksConnector.class);

    @Inject
    private HubConfiguration config;

    /** Microcks API URL (should ends with /api). */
    private String apiURL;
    private String _keycloakURL;

    /**
     * Create a new connector for interacting with Microcks.
     */
    public MicrocksConnector() {
    }

    @PostConstruct
    public void postConstruct() {
        String microcksURL = config.getMicrocksApiUrl();
        // Store and sanitize microcks API URL.
        this.apiURL = microcksURL;
        if (!this.apiURL.endsWith("/api")) {
            this.apiURL += "/api";
        }
    }

    /**
     * Returns the OAuth token to use when accessing Microcks.
     *
     * @throws MicrocksConnectorException
     */
    private String getKeycloakOAuthToken() throws MicrocksConnectorException {
        String keycloakURL = getKeycloakURL();
        String keycloakClientId = config.getMicrocksClientId();
        String keycloakClientSecret = config.getMicrocksClientSecret();

        // Retrieve a token using client_credentials flow.
        HttpRequestWithBody tokenRequest = Unirest.post(keycloakURL + "/protocol/openid-connect/token")
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header("Accept", "application/json").basicAuth(keycloakClientId, keycloakClientSecret);

        HttpResponse<JsonNode> tokenResponse = null;
        try {
            tokenResponse = tokenRequest.body("grant_type=client_credentials").asJson();
        } catch (UnirestException e) {
            logger.error("Exception while connecting to Keycloak backend", e);
            throw new MicrocksConnectorException(
                    "Exception while connecting Microcks Keycloak backend. Check Keycloak configuration.");
        }

        if (tokenResponse.getStatus() != 200) {
            logger.error(
                    "OAuth token cannot be retrieved for Microcks server, check keycloakClient configuration");
            throw new MicrocksConnectorException(
                    "OAuth token cannot be retrieved for Microcks. Check keycloakClient.");
        }
        return tokenResponse.getBody().getObject().getString("access_token");
    }

    /**
     * Figures out the URL of the Keycloak server that is protecting Microcks.
     */
    private String getKeycloakURL() throws MicrocksConnectorException {
        if (this._keycloakURL == null) {
            // Retrieve the Keycloak configuration to build keycloakURL.
            HttpResponse<JsonNode> keycloakConfig = null;
            try {
                keycloakConfig = Unirest.get(this.apiURL + "/keycloak/config")
                        .header("Accept", "application/json").asJson();
            } catch (UnirestException e) {
                logger.error("Exception while connecting to Microcks backend", e);
                throw new MicrocksConnectorException(
                        "Exception while connecting Microcks backend. Check URL.");
            }

            if (keycloakConfig.getStatus() != 200) {
                logger.error("Keycloak config cannot be fetched from Microcks server, check configuration");
                throw new MicrocksConnectorException(
                        "Keycloak configuration cannot be fetched from Microcks. Check URL.");
            }
            String authServer = keycloakConfig.getBody().getObject().getString("auth-server-url");
            String realmName = keycloakConfig.getBody().getObject().getString("realm");
            this._keycloakURL = authServer + "/realms/" + realmName;
        }
        return this._keycloakURL;
    }

    /**
     * Upload an OAS v3 specification content to Microcks. This will trigger service discovery and mock
     * endpoint publication on the Microcks side.
     *
     * @param content OAS v3 specification content
     * @throws MicrocksConnectorException if upload fails for many reasons
     */
    @Override
    public String uploadResourceContent(String content) throws MicrocksConnectorException {
        String oauthToken = this.getKeycloakOAuthToken();
        MultipartBody uploadRequest = Unirest.post(this.apiURL + "/artifact/upload")
                .header("Authorization", "Bearer " + oauthToken)
                .field("file", new ByteArrayInputStream(content.getBytes(Charset.forName("UTF-8"))), "open-api-contract.yml");

        HttpResponse<String> response = null;
        try {
            response = uploadRequest.asString();
        } catch (UnirestException e) {
            logger.error("Exception while connecting to Microcks backend", e);
            throw new MicrocksConnectorException("Exception while connecting Microcks backend. Check URL.");
        }

        switch (response.getStatus()) {
            case 201:
                String serviceRef = response.getBody();
                logger.info("Microcks mocks have been created/updated for " + serviceRef);
                return serviceRef;
            case 204:
                logger.warn("NoContent returned by Microcks server");
                throw new MicrocksConnectorException(
                        "NoContent returned by Microcks server is unexpected return");
            case 400:
                logger.error(
                        "ClientRequestMalformed returned by Microcks server: " + response.getStatusText());
                throw new MicrocksConnectorException("ClientRequestMalformed returned by Microcks server");
            case 500:
                logger.error("InternalServerError returned by Microcks server");
                throw new MicrocksConnectorException("InternalServerError returned by Microcks server");
            default:
                logger.error("Unexpected response from Microcks server: " + response.getStatusText());
                throw new MicrocksConnectorException(
                        "Unexpected response by Microcks server: " + response.getStatusText());
        }
    }

    /**
     * Reserved for future usage.
     *
     * @return List of repository secrets managed by Microcks server
     * @throws MicrocksConnectorException if connection fails for any reasons
     */
    @Override
    public Collection<MicrocksSecret> getSecrets() throws MicrocksConnectorException {
        return null;
    }

    /**
     * Reserved for future usage.
     *
     * @return List of import jobs managed by Microcks server
     * @throws MicrocksConnectorException if connection fails for any reasons
     */
    @Override
    public Collection<MicrocksImporter> getImportJobs() throws MicrocksConnectorException {
        return null;
    }

    /**
     * Reserved for future usage.
     *
     * @param job Import job to create in Microcks server.
     * @throws MicrocksConnectorException if connection fails for any reasons
     */
    @Override
    public void createImportJob(MicrocksImporter job) throws MicrocksConnectorException {
        throw new MicrocksConnectorException("Not implemented");
    }

    /**
     * Reserved for future usage.
     *
     * @param job Import job to force import in Microcks server.
     * @throws MicrocksConnectorException if connection fails for any reasons
     */
    @Override
    public void forceResourceImport(MicrocksImporter job) throws MicrocksConnectorException {
        throw new MicrocksConnectorException("Not implemented");
    }
}
