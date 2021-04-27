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
import java.io.InputStream;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.net.ssl.SSLContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.IOUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;
import org.keycloak.KeycloakSecurityContext;
import org.keycloak.common.util.Base64Url;
import org.keycloak.common.util.KeycloakUriBuilder;
import org.keycloak.representations.AccessToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.api.beans.InitiatedLinkedAccount;
import io.apicurio.hub.core.beans.LinkedAccountType;
import io.apicurio.hub.core.config.HubConfiguration;

/**
 * An implementation of {@link ILinkedAccountsProvider} that used Keycloak to manage
 * the account links.  This uses the Identity Provider support built into Keycloak to
 * create and manage the account links.  Keycloak also stores the external token needed
 * to access the external services.
 * 
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class KeycloakLinkedAccountsProvider implements ILinkedAccountsProvider {

    private static Logger logger = LoggerFactory.getLogger(KeycloakLinkedAccountsProvider.class);

    @Inject
    private ISecurityContext security;
    @Inject
    private HubConfiguration config;

    @Inject
    private HttpServletRequest request;

    private CloseableHttpClient httpClient;

    @PostConstruct
    protected void postConstruct() {
        try {
            if (config.isDisableKeycloakTrustManager()) {
                SSLContext sslContext = SSLContexts.custom().loadTrustMaterial(null, new TrustSelfSignedStrategy()).build();
                SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext, NoopHostnameVerifier.INSTANCE);
                httpClient = HttpClients.custom().setSSLSocketFactory(sslsf).build();
            } else {
                httpClient = HttpClients.createSystem();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.security.ILinkedAccountsProvider#initiateLinkedAccount(io.apicurio.hub.core.beans.LinkedAccountType, java.lang.String, java.lang.String)
     */
    @Override
    public InitiatedLinkedAccount initiateLinkedAccount(LinkedAccountType accountType, String redirectUri,
            String nonce) {
        String authServerRootUrl = config.getKeycloakAuthUrl();
        String realm = config.getKeycloakRealm();
        String provider = accountType.alias();

        KeycloakSecurityContext session = (KeycloakSecurityContext) request.getAttribute(KeycloakSecurityContext.class.getName());

        AccessToken token = session.getToken();

        String clientId = token.getIssuedFor();
        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        String input = nonce + token.getSessionState() + clientId + provider;
        byte[] check = md.digest(input.getBytes(StandardCharsets.UTF_8));
        String hash = Base64Url.encode(check);
        String accountLinkUrl = KeycloakUriBuilder.fromUri(authServerRootUrl)
            .path("/realms/{realm}/broker/{provider}/link").queryParam("nonce", nonce)
            .queryParam("hash", hash).queryParam("client_id", clientId)
            .queryParam("redirect_uri", redirectUri).build(realm, provider).toString();

        logger.debug("Account Link URL: {}", accountLinkUrl);

        // Return the URL that the browser should use to initiate the account linking
        InitiatedLinkedAccount rval = new InitiatedLinkedAccount();
        rval.setAuthUrl(accountLinkUrl);
        rval.setNonce(nonce);
        return rval;
    }
    
    /**
     * @see io.apicurio.hub.api.security.ILinkedAccountsProvider#deleteLinkedAccount(io.apicurio.hub.core.beans.LinkedAccountType)
     */
    @Override
    public void deleteLinkedAccount(LinkedAccountType type) throws IOException {
        try {
            KeycloakSecurityContext session = (KeycloakSecurityContext) request.getAttribute(KeycloakSecurityContext.class.getName());

            String authServerRootUrl = config.getKeycloakAuthUrl();
            String realm = config.getKeycloakRealm();
            String provider = type.alias();

            session.getToken().getSessionState();

            String url = KeycloakUriBuilder.fromUri(authServerRootUrl)
                .path("/realms/{realm}/account/federated-identity-update")
                .queryParam("action", "REMOVE").queryParam("provider_id", provider).build(realm)
                .toString();
            logger.debug("Deleting identity provider using URL: {}", url);

            HttpGet get = new HttpGet(url);
            get.addHeader("Accept", "application/json");
            get.addHeader("Authorization", "Bearer " + session.getTokenString());
            
            try (CloseableHttpResponse response = httpClient.execute(get)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    logger.debug("HTTP Response Status Code when deleting identity provider: {}",
                        response.getStatusLine().getStatusCode());
                }
            }            
        } catch (Exception e) {
            throw new IOException("Error deleting linked account.", e);
        }
    }

    /**
     * @see io.apicurio.hub.api.security.ILinkedAccountsProvider#getLinkedAccountToken(io.apicurio.hub.core.beans.LinkedAccountType)
     */
    @Override
    public String getLinkedAccountToken(LinkedAccountType type) throws IOException {
        String authServerRootUrl = config.getKeycloakAuthUrl();
        String realm = config.getKeycloakRealm();
        String provider = type.alias();

        try {
            String externalTokenUrl = KeycloakUriBuilder.fromUri(authServerRootUrl)
                    .path("/realms/{realm}/broker/{provider}/token")
                    .build(realm, provider).toString();
            String token = this.security.getToken();

            HttpGet get = new HttpGet(externalTokenUrl);
            get.addHeader("Accept", "application/json");
            get.addHeader("Authorization", "Bearer " + token);

            try (CloseableHttpResponse response = httpClient.execute(get)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    logger.error("Failed to access External IDP Access Token from Keycloak: {} - {}", 
                            response.getStatusLine().getStatusCode(), response.getStatusLine().getReasonPhrase());
                    throw new IOException(
                            "Unexpected response from Keycloak: " + response.getStatusLine().getStatusCode() + "::"
                                    + response.getStatusLine().getReasonPhrase());
                }
                
                try (InputStream contentStream = response.getEntity().getContent()) {
                    String content = IOUtils.toString(contentStream, Charset.forName("UTF-8"));
                    return content;
                }
            }            
        } catch (IllegalArgumentException e) {
            throw new IOException("Error getting linked account token.", e);
        }
    }

}
