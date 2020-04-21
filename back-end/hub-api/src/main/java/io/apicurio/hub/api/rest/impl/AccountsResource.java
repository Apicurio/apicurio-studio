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

import java.io.IOException;
import java.util.Collection;
import java.util.Date;
import java.util.UUID;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.api.beans.BitbucketRepository;
import io.apicurio.hub.api.beans.BitbucketTeam;
import io.apicurio.hub.api.beans.CompleteLinkedAccount;
import io.apicurio.hub.api.beans.CreateLinkedAccount;
import io.apicurio.hub.api.beans.GitHubOrganization;
import io.apicurio.hub.api.beans.GitHubRepository;
import io.apicurio.hub.api.beans.GitLabGroup;
import io.apicurio.hub.api.beans.GitLabProject;
import io.apicurio.hub.api.beans.InitiatedLinkedAccount;
import io.apicurio.hub.api.beans.SourceCodeBranch;
import io.apicurio.hub.api.bitbucket.BitbucketException;
import io.apicurio.hub.api.bitbucket.IBitbucketSourceConnector;
import io.apicurio.hub.api.connectors.SourceConnectorException;
import io.apicurio.hub.api.github.GitHubException;
import io.apicurio.hub.api.github.IGitHubSourceConnector;
import io.apicurio.hub.api.gitlab.GitLabException;
import io.apicurio.hub.api.gitlab.IGitLabSourceConnector;
import io.apicurio.hub.api.metrics.IApiMetrics;
import io.apicurio.hub.api.rest.IAccountsResource;
import io.apicurio.hub.api.security.ILinkedAccountsProvider;
import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.core.beans.LinkedAccount;
import io.apicurio.hub.core.beans.LinkedAccountType;
import io.apicurio.hub.core.exceptions.AlreadyExistsException;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class AccountsResource implements IAccountsResource {

    private static Logger logger = LoggerFactory.getLogger(AccountsResource.class);

    @Inject
    private IStorage storage;
    @Inject
    private ISecurityContext security;
    @Inject
    private ILinkedAccountsProvider linkedAccountsProvider;
    @Inject
    private IApiMetrics metrics;

    @Inject
    private IGitHubSourceConnector github;
    @Inject
    private IGitLabSourceConnector gitLab;
    @Inject
    private IBitbucketSourceConnector bitbucket;

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
        metrics.apiCall("/accounts", "GET");

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
    public InitiatedLinkedAccount createLinkedAccount(CreateLinkedAccount info) throws ServerError, AlreadyExistsException {
        metrics.apiCall("/accounts", "POST");

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

            // Step #2 - initiate account linking with e.g. Keycloak
            InitiatedLinkedAccount rval = linkedAccountsProvider.initiateLinkedAccount(info.getType(), info.getRedirectUrl(), nonce);
            logger.debug("Sending browser redirect URL: {}", rval.getAuthUrl());
            
            metrics.accountLinkInitiated(info.getType());
            
            return rval;
        } catch (StorageException | IOException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#getLinkedAccount(java.lang.String)
     */
    @Override
    public LinkedAccount getLinkedAccount(String accountType) throws ServerError, NotFoundException {
        logger.debug("Getting a Linked Account of type {}", accountType);
        metrics.apiCall("/accounts/{accountType}", "GET");

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
    public void completeLinkedAccount(String accountType, CompleteLinkedAccount update) throws ServerError, NotFoundException {
        logger.debug("Completing account lingage for: {}", accountType);
        metrics.apiCall("/accounts/{accountType}", "PUT");

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
            
            metrics.accountLinkCompleted(account.getType());
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
        metrics.apiCall("/accounts/{accountType}", "DELETE");

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
     * Removes the linked account from the provider.
     * @param type
     */
    private void deleteIdentityProvider(LinkedAccountType type) {
        logger.debug("Deleting identity provider from Keycloak: {}", type);

        try {
            this.linkedAccountsProvider.deleteLinkedAccount(type);
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#getOrganizations(java.lang.String)
     */
    @Override
    public Collection<GitHubOrganization> getOrganizations(String accountType) throws ServerError {
        metrics.apiCall("/accounts/{accountType}/organizations", "GET");

        LinkedAccountType at = LinkedAccountType.valueOf(accountType);
        if (at != LinkedAccountType.GitHub) {
            throw new ServerError("Invalid account type.  Expected 'GitHub' but got: " + accountType);
        }
        try {
            return this.github.getOrganizations();
        } catch (GitHubException | SourceConnectorException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#getRepositories(java.lang.String, java.lang.String)
     */
    @Override
    public Collection<GitHubRepository> getRepositories(String accountType, String org) throws ServerError {
        metrics.apiCall("/accounts/{accountType}/organizations/{org}/repositories", "GET");

        LinkedAccountType at = LinkedAccountType.valueOf(accountType);
        if (at != LinkedAccountType.GitHub) {
            throw new ServerError("Invalid account type.  Expected 'GitHub' but got: " + accountType);
        }
        try {
            return this.github.getRepositories(org);
        } catch (GitHubException | SourceConnectorException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#getGroups(java.lang.String)
     */
    @Override
    public Collection<GitLabGroup> getGroups(String accountType) throws ServerError {
        metrics.apiCall("/accounts/{accountType}/groups", "GET");

        LinkedAccountType at = LinkedAccountType.valueOf(accountType);
        if (at != LinkedAccountType.GitLab) {
            throw new ServerError("Invalid account type.  Expected 'GitLab' but got: " + accountType);
        }

        try {
            return gitLab.getGroups();
        } catch (GitLabException | SourceConnectorException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#getProjects(java.lang.String, java.lang.String)
     */
    @Override
    public Collection<GitLabProject> getProjects(String accountType, String group) throws ServerError {
        metrics.apiCall("/accounts/{accountType}/groups/{group}/projects", "GET");

        LinkedAccountType at = LinkedAccountType.valueOf(accountType);
        if (at != LinkedAccountType.GitLab) {
            throw new ServerError("Invalid account type.  Expected 'GitLab' but got: " + accountType);
        }
        try {
            return gitLab.getProjects(group);
        } catch (GitLabException | SourceConnectorException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#getTeams(java.lang.String)
     */
    @Override
    public Collection<BitbucketTeam> getTeams(String accountType) throws ServerError {
        metrics.apiCall("/accounts/{accountType}/teams", "GET");

        LinkedAccountType at = LinkedAccountType.valueOf(accountType);
        if (at != LinkedAccountType.Bitbucket) {
            throw new ServerError("Invalid account type.  Expected 'Bitbucket' but got: " + accountType);
        }
        try {
            return this.bitbucket.getTeams();
        } catch (BitbucketException | SourceConnectorException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#getBitbucketRepositories(java.lang.String, java.lang.String)
     */
    @Override
    public Collection<BitbucketRepository> getBitbucketRepositories(String accountType, String group)
            throws ServerError {
        metrics.apiCall("/accounts/{accountType}/teams/{team}/repositories", "GET");

        LinkedAccountType at = LinkedAccountType.valueOf(accountType);
        if (at != LinkedAccountType.Bitbucket) {
            throw new ServerError("Invalid account type.  Expected 'Bitbucket' but got: " + accountType);
        }
        try {
            return this.bitbucket.getRepositories(group);
        } catch (SourceConnectorException | BitbucketException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#getRepositoryBranches(java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public Collection<SourceCodeBranch> getRepositoryBranches(String accountType, String org, String repo)
            throws ServerError {
        metrics.apiCall("/accounts/{accountType}/organizations/{org}/repositories/{repo}/branches", "GET");

        LinkedAccountType at = LinkedAccountType.valueOf(accountType);
        if (at != LinkedAccountType.GitHub) {
            throw new ServerError("Invalid account type.  Expected 'GitHub' but got: " + accountType);
        }
        try {
            return this.github.getBranches(org, repo);
        } catch (GitHubException | SourceConnectorException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#getProjectBranches(java.lang.String, java.lang.String)
     */
    @Override
    public Collection<SourceCodeBranch> getProjectBranches(String accountType, String projectId)
            throws ServerError {
        metrics.apiCall("/accounts/{accountType}/projects/{projectId}/repository/branches", "GET");

        LinkedAccountType at = LinkedAccountType.valueOf(accountType);
        if (at != LinkedAccountType.GitLab) {
            throw new ServerError("Invalid account type.  Expected 'GitLab' but got: " + accountType);
        }
        try {
            return gitLab.getBranches(projectId);
        } catch (GitLabException | SourceConnectorException e) {
            throw new ServerError(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.rest.IAccountsResource#getBitbucketBranches(java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public Collection<SourceCodeBranch> getBitbucketBranches(String accountType, String group, String repo)
            throws ServerError {
        metrics.apiCall("/accounts/{accountType}/teams/{team}/repositories/{repo}/branches", "GET");

        LinkedAccountType at = LinkedAccountType.valueOf(accountType);
        if (at != LinkedAccountType.Bitbucket) {
            throw new ServerError("Invalid account type.  Expected 'Bitbucket' but got: " + accountType);
        }
        try {
            return this.bitbucket.getBranches(group, repo);
        } catch (SourceConnectorException | BitbucketException e) {
            throw new ServerError(e);
        }
    }
}
