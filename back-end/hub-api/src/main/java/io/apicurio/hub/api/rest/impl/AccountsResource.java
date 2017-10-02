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

package io.apicurio.hub.api.rest.impl;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;

import org.keycloak.KeycloakSecurityContext;
import org.keycloak.common.util.Base64Url;
import org.keycloak.common.util.KeycloakUriBuilder;
import org.keycloak.representations.AccessToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.request.HttpRequest;

import io.apicurio.hub.api.beans.CompleteLinkedAccount;
import io.apicurio.hub.api.beans.CreateLinkedAccount;
import io.apicurio.hub.api.beans.GitHubOrganization;
import io.apicurio.hub.api.beans.GitHubRepository;
import io.apicurio.hub.api.beans.InitiatedLinkedAccount;
import io.apicurio.hub.api.beans.LinkedAccount;
import io.apicurio.hub.api.beans.LinkedAccountType;
import io.apicurio.hub.api.config.HubApiConfiguration;
import io.apicurio.hub.api.connectors.SourceConnectorException;
import io.apicurio.hub.api.exceptions.AlreadyExistsException;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.exceptions.ServerError;
import io.apicurio.hub.api.github.GitHubException;
import io.apicurio.hub.api.github.IGitHubSourceConnector;
import io.apicurio.hub.api.gitlab.IGitLabSourceConnector;
import io.apicurio.hub.api.rest.IAccountsResource;
import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.api.storage.IStorage;
import io.apicurio.hub.api.storage.StorageException;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class AccountsResource implements IAccountsResource {

    private static Logger logger = LoggerFactory.getLogger(AccountsResource.class);

    private static final List<LinkedAccountType> SUPPORTED_LINKED_ACCOUNT_TYPES =
        Arrays.asList(LinkedAccountType.GitHub, LinkedAccountType.GitLab);

    @Inject
    private IStorage storage;
    @Inject
    private ISecurityContext security;
    @Inject
    private HubApiConfiguration config;

    @Inject
    private IGitHubSourceConnector github;

    @Inject
    private IGitLabSourceConnector gitLab;

    @Context
    private HttpServletRequest request;
    @Context
    private HttpServletResponse response;

    /**
     * Constructor.
     */
    public AccountsResource() {
    }

    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#listLinkedAccounts()
     */
    @Override
    public Collection<LinkedAccount> listLinkedAccounts() throws ServerError {
        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("Listing Linked Accounts for {}", user);
            return this.storage.listLinkedAccounts(user);
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#createLinkedAccount(io.apicurio.hub.api.beans.CreateLinkedAccount)
     */
    @Override
    public InitiatedLinkedAccount createLinkedAccount(CreateLinkedAccount info)
        throws ServerError, AlreadyExistsException {
        try {
            String user = this.security.getCurrentUser().getLogin();
            logger.debug("Creating a linked {} account for user {}", info.getType().name(), user);

            String nonce = UUID.randomUUID().toString();

            // Step #1 - create an entry in the storage (with a null "linkedOn" field)
            LinkedAccount account = new LinkedAccount();
            account.setType(info.getType());
            account.setNonce(nonce);
            this.storage.createLinkedAccount(user, account);

            logger.debug("Linked Account created in DB.");

            // Step #2 - initiate account linking with Keycloak
            String redirectUri = info.getRedirectUrl();
            String authServerRootUrl = config.getKeycloakAuthUrl();
            String realm = config.getKeycloakRealm();
            String provider = info.getType().alias();

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

                .path("/auth/realms/{realm}/broker/{provider}/link").queryParam("nonce", nonce)
                .queryParam("hash", hash).queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri).build(realm, provider).toString();

            logger.debug("Account Link URL: {}", accountLinkUrl);

            // Return the URL that the browser should use to initiate the account linking
            InitiatedLinkedAccount rval = new InitiatedLinkedAccount();
            rval.setAuthUrl(accountLinkUrl);
            rval.setNonce(nonce);
            return rval;
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#getLinkedAccount(java.lang.String)
     */
    @Override
    public LinkedAccount getLinkedAccount(String accountType) throws ServerError, NotFoundException {
        logger.debug("Getting a Linked Account of type {}", accountType);
        try {
            String user = this.security.getCurrentUser().getLogin();
            return this.storage.getLinkedAccount(user, LinkedAccountType.valueOf(accountType));
        } catch (StorageException | IllegalArgumentException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#completeLinkedAccount(java.lang.String, io.apicurio.hub.api.beans.CompleteLinkedAccount)
     */
    @Override
    public void completeLinkedAccount(String accountType, CompleteLinkedAccount update)
        throws ServerError, NotFoundException {
        logger.debug("Completing account lingage for: {}", accountType);
        try {
            String user = this.security.getCurrentUser().getLogin();
            String nonce = update.getNonce();
            if (nonce == null) {
                throw new ServerError("Invalid request: nonce not provided");
            }

            LinkedAccount account = this.getLinkedAccount(accountType);
            if (!nonce.equals(account.getNonce())) {
                throw new ServerError("Invalid request: nonce mismatch");
            }

            account.setLinkedOn(new Date());
            account.setNonce(null);

            this.storage.updateLinkedAccount(user, account);
        } catch (StorageException | IllegalArgumentException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#deleteLinkedAccount(java.lang.String)
     */
    @Override
    public void deleteLinkedAccount(String accountType) throws ServerError, NotFoundException {
        logger.debug("Deleting a Linked Account of type {}", accountType);
        try {
            LinkedAccountType type = LinkedAccountType.valueOf(accountType);
            String user = this.security.getCurrentUser().getLogin();

            this.storage.deleteLinkedAccount(user, type);

            this.deleteIdentityProvider(type);
        } catch (StorageException | IllegalArgumentException e) {
            throw new ServerError(e);
        }
    }

    /**
     * Removes the identity provider from Keycloak.
     *
     * @param type
     */
    private void deleteIdentityProvider(LinkedAccountType type) {
        logger.debug("Deleting identity provider from Keycloak: {}", type);
        try {
            KeycloakSecurityContext session = (KeycloakSecurityContext) request.getAttribute(KeycloakSecurityContext.class.getName());

            String authServerRootUrl = config.getKeycloakAuthUrl();
            String realm = config.getKeycloakRealm();
            String provider = type.alias();

            session.getToken().getSessionState();

            String url = KeycloakUriBuilder.fromUri(authServerRootUrl)
                .path("/auth/realms/{realm}/account/federated-identity-update")
                .queryParam("action", "REMOVE").queryParam("provider_id", provider).build(realm)
                .toString();
            logger.debug("Deleting identity provider using URL: {}", url);

            HttpRequest request = Unirest.get(url).header("Accept", "application/json")
                .header("Authorization", "Bearer " + session.getTokenString());
            HttpResponse<String> response = request.asString();
            if (response.getStatus() != 200) {
                logger.debug("HTTP Response Status Code when deleting identity provider: {}",
                    response.getStatus());
                logger.debug("HTTP Response Body when deleting identity provider: {}", response.getBody());
            }
        } catch (Exception e) {
            logger.error("Error deleting identity provider from Keycloak.", e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#getOrganizations()
     */
    @Override
    public Collection<GitHubOrganization> getOrganizations(String accountType) throws ServerError {

        List<LinkedAccountType> supportedLinkedAccountTypes =
            Arrays.asList(LinkedAccountType.GitHub, LinkedAccountType.GitLab);

        if (!supportedLinkedAccountTypes.contains(LinkedAccountType.valueOf(accountType))) {
            throw new ServerError("Invalid account type.  Expected 'GitHub' but got: " + accountType);
        }

        switch (LinkedAccountType.valueOf(accountType)) {
            case GitHub:
                try {
                    return this.github.getOrganizations();
                } catch (GitHubException | SourceConnectorException e) {
                    throw new ServerError(e);
                }
            case GitLab:
                try {
                    return gitLab.getGroups();
                } catch (GitHubException | SourceConnectorException e) {
                    throw new ServerError(e);
                }
        }

        return new ArrayList<>();
    }

    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#getRepositories(java.lang.String)
     */
    @Override
    public Collection<GitHubRepository> getRepositories(String accountType, String org)
        throws ServerError {
        if (!SUPPORTED_LINKED_ACCOUNT_TYPES.contains(LinkedAccountType.valueOf(accountType))) {
            throw new ServerError("Invalid account type.  Expected 'GitHub' but got: " + accountType);
        }

        switch (LinkedAccountType.valueOf(accountType)) {
            case GitHub:
                try {
                    return this.github.getRepositories(org);
                } catch (GitHubException | SourceConnectorException e) {
                    throw new ServerError(e);
                }
            case GitLab:
                try {
                    return gitLab.getRepositories(org);
                } catch (GitHubException | SourceConnectorException e) {
                    throw new ServerError(e);
                }
        }

        return new ArrayList<>();
    }
}
