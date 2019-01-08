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

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mashape.unirest.request.HttpRequestWithBody;
import com.mashape.unirest.request.body.MultipartBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.util.Collection;

/**
 * Default implementation of a Microcks specific connector.
 * @author laurent.broudoux@gmail.com
 */
public class MicrocksConnector implements IMicrocksConnector {

   private static Logger logger = LoggerFactory.getLogger(MicrocksConnector.class);

   /** Microcks API URL (should ends with /api). */
   private String apiURL;
   /** Keycloak URL including realm name (deduced from Microcks configuration). */
   private String keycloakURL;
   /** OAuth token associated to this connection. */
   private String oauthToken;

   /**
    * Create a new connector for interacting with Microcks.
    * @param microcksURL Microcks API URL (should ends with /api)
    * @param keycloakClientId ClientId known from keycloak Microcks realm
    * @param keycloakClientSecret ClientSecret known from keycloak Microcks realm
    * @throws MicrocksConnectorException if connection fails for many reasons
    */
   public MicrocksConnector(String microcksURL, String keycloakClientId, String keycloakClientSecret) throws MicrocksConnectorException {

      // Store and sanitize microcks API URL.
      this.apiURL = microcksURL;
      if (!this.apiURL.endsWith("/api")) {
         this.apiURL += "/api";
      }

      // Retrieve the Keycloak configuration to build keycloakURL.
      HttpResponse<JsonNode> keycloakConfig = null;
      try {
         keycloakConfig = Unirest.get(this.apiURL + "/keycloak/config")
               .header("Accept", "application/json").asJson();
      } catch (UnirestException e) {
         logger.error("Exception while connecting to Microcks backend", e);
         throw new MicrocksConnectorException("Exception while connecting Microcks backend. Check URL.");
      }

      if (keycloakConfig.getStatus() != 200) {
         logger.error("Keycloak config cannot be fetched from Microcks server, check configuration");
         throw new MicrocksConnectorException("Keycloak configuration cannot be fetched from Microcks. Check URL.");
      }
      String authServer = keycloakConfig.getBody().getObject().getString("auth-server-url");
      String realmName = keycloakConfig.getBody().getObject().getString("realm");
      this.keycloakURL = authServer + "/realms/" + realmName;

      // Retrieve a token using client_credentials flow.
      HttpRequestWithBody tokenRequest = Unirest.post(this.keycloakURL + "/protocol/openid-connect/token")
            .header("Content-Type", "application/x-www-form-urlencoded")
            .header("Accept", "application/json")
            .basicAuth(keycloakClientId, keycloakClientSecret);

      HttpResponse<JsonNode> tokenResponse = null;
      try {
         tokenResponse = tokenRequest.body("grant_type=client_credentials").asJson();
      } catch (UnirestException e) {
         logger.error("Exception while connecting to Keycloak backend", e);
         throw new MicrocksConnectorException("Exception while connecting Microcks Keycloak backend. Check Keycloak configuration.");
      }

      if (tokenResponse.getStatus() != 200) {
         logger.error("OAuth token cannot be retrieved for Microcks server, check keycloakClient configuration");
         throw new MicrocksConnectorException("OAuth token cannot be retrieved for Microcks. Check keycloakClient.");
      }
      this.oauthToken = tokenResponse.getBody().getObject().getString("access_token");
   }

   /**
    * Upload an OAS v3 specification content to Microcks. This will trigger service discovery and mock
    * endpoint publication on the Microcks side.
    * @param content OAS v3 specification content
    * @throws MicrocksConnectorException if upload fails for many reasons
    */
   public String uploadResourceContent(String content) throws MicrocksConnectorException {

      MultipartBody uploadRequest = Unirest.post(this.apiURL + "/artifact/upload")
            .header("Authorization", "Bearer " + oauthToken)
            .field("file", new ByteArrayInputStream(content.getBytes()), "open-api-contract.yml");

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
            throw new MicrocksConnectorException("NoContent returned by Microcks server is unexpected return");
         case 400:
            logger.error("ClientRequestMalformed returned by Microcks server: " + response.getStatusText());
            throw new MicrocksConnectorException("ClientRequestMalformed returned by Microcks server");
         case 500:
            logger.error("InternalServerError returned by Microcks server");
            throw new MicrocksConnectorException("InternalServerError returned by Microcks server");
         default:
            logger.error("Unexpected response from Microcks server: " + response.getStatusText());
            throw new MicrocksConnectorException("Unexpected response by Microcks server: " + response.getStatusText());
      }
   }

   /**
    * Reserved for future usage.
    * @return List of repository secrets managed by Microcks server
    * @throws MicrocksConnectorException if connection fails for any reasons
    */
   public Collection<MicrocksSecret> getSecrets() throws MicrocksConnectorException {
      return null;
   }

   /**
    * Reserved for future usage.
    * @return List of import jobs managed by Microcks server
    * @throws MicrocksConnectorException if connection fails for any reasons
    */
   public Collection<MicrocksImporter> getImportJobs() throws MicrocksConnectorException {
      return null;
   }

   /**
    * Reserved for future usage.
    * @param job Import job to create in Microcks server.
    * @throws MicrocksConnectorException if connection fails for any reasons
    */
   public void createImportJob(MicrocksImporter job) throws MicrocksConnectorException {
      throw new MicrocksConnectorException("Not implemented");
   }

   /**
    * Reserved for future usage.
    * @param job Import job to force import in Microcks server.
    * @throws MicrocksConnectorException if connection fails for any reasons
    */
   public void forceResourceImport(MicrocksImporter job) throws MicrocksConnectorException {
      throw new MicrocksConnectorException("Not implemented");
   }
}
