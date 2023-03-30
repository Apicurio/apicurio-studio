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

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipInputStream;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import kong.unirest.*;
import org.apache.commons.codec.binary.Base64;
import org.eclipse.egit.github.core.Repository;
import org.eclipse.egit.github.core.RepositoryBranch;
import org.eclipse.egit.github.core.User;
import org.eclipse.egit.github.core.client.GitHubClient;
import org.eclipse.egit.github.core.service.OrganizationService;
import org.eclipse.egit.github.core.service.RepositoryService;
import org.eclipse.egit.github.core.service.UserService;
import org.keycloak.common.util.Encode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import io.apicurio.hub.api.beans.GitHubCreateCommitCommentRequest;
import io.apicurio.hub.api.beans.GitHubCreateFileRequest;
import io.apicurio.hub.api.beans.GitHubGetContentsResponse;
import io.apicurio.hub.api.beans.GitHubOrganization;
import io.apicurio.hub.api.beans.GitHubRepository;
import io.apicurio.hub.api.beans.GitHubUpdateFileRequest;
import io.apicurio.hub.api.beans.ResourceContent;
import io.apicurio.hub.api.beans.SourceCodeBranch;
import io.apicurio.hub.api.connectors.AbstractSourceConnector;
import io.apicurio.hub.api.connectors.SourceConnectorException;
import io.apicurio.hub.core.beans.ApiDesignResourceInfo;
import io.apicurio.hub.core.beans.LinkedAccountType;
import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.exceptions.ApiValidationException;
import io.apicurio.hub.core.exceptions.NotFoundException;

/**
 * Implementation of the GitHub source connector.
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class GitHubSourceConnector extends AbstractSourceConnector implements IGitHubSourceConnector {

    private static Logger logger = LoggerFactory.getLogger(GitHubSourceConnector.class);

    @Inject
    private HubConfiguration config;
    @Inject
    private GitHubResourceResolver resolver;

    private String apiUrl;

    /**
     * @throws SourceConnectorException
     */
    private GitHubClient githubClient() throws SourceConnectorException {
        try {
            String ghUrl = config.getGitHubApiUrl();

            URI url = new URI(ghUrl);
            String host = url.getHost();
            int port = url.getPort();
            String scheme = url.getScheme();
            
            GitHubClient client = new GitHubClient(host, port, scheme);
            String idpToken = getExternalToken();
            client.setOAuth2Token(idpToken);
            return client;
        } catch (URISyntaxException e) {
            throw new SourceConnectorException("Error creating the GitHub client.", e);
        }
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#getType()
     */
    @Override
    public LinkedAccountType getType() {
        return LinkedAccountType.GitHub;
    }

    /**
     * @see AbstractSourceConnector#getBaseApiEndpointUrl()
     */
    @Override
    protected String getBaseApiEndpointUrl() {
        if (apiUrl == null) {
            apiUrl = this.config.getGitHubApiUrl();
        }
        return apiUrl;
    }

    /**
     * @see io.apicurio.hub.api.connectors.AbstractSourceConnector#parseExternalTokenResponse(java.lang.String)
     */
    protected Map<String, String> parseExternalTokenResponse(String body) {
        Map<String, String> rval = new HashMap<>();
        String[] split1 = body.split("&");
        for (String item : split1) {
            String[] split2 = item.split("=");
            String encodedKey = split2[0];
            String encodedVal = split2[1];
            String key = Encode.decode(encodedKey);
            String val = Encode.decode(encodedVal);
            rval.put(key, val);
        }
        
        return rval;
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#validateResourceExists(java.lang.String)
     */
    @Override
    public ApiDesignResourceInfo validateResourceExists(String repositoryUrl) throws NotFoundException, SourceConnectorException, ApiValidationException {
        logger.debug("Validating the existence of resource {}", repositoryUrl);
        try {
            GitHubResource resource = resolver.resolve(repositoryUrl);
            if (resource == null) {
                throw new NotFoundException();
            }
            ResourceContent ctobj = getResourceContent(repositoryUrl);
            String content = ctobj.getContent();
            ApiDesignResourceInfo info = ApiDesignResourceInfo.fromContent(content);
            if (info.getName() == null) {
                info.setName(resource.getResourcePath());
            }
            return info;
        } catch (NotFoundException nfe) {
            throw nfe;
        } catch (ApiValidationException ave) {
            throw ave;
        } catch (Exception e) {
            logger.error("Error checking that a GitHub resource exists.", e);
            throw new SourceConnectorException("Error checking that a GitHub resource exists.", e);
        }
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#getResourceContent(java.lang.String)
     */
    @Override
    public ResourceContent getResourceContent(String repositoryUrl) throws NotFoundException, SourceConnectorException {
        try {
            GitHubResource resource = resolver.resolve(repositoryUrl);
            String getContentUrl = this.endpoint("/repos/:org/:repo/contents/:path")
                    .bind("org", resource.getOrganization())
                    .bind("repo", resource.getRepository())
                    .bind("path", resource.getResourcePath())
                    .queryParam("ref", resource.getBranch())
                    .toString();
            HttpRequest request = Unirest.get(getContentUrl).header("Accept", "application/json");
            try {
                addSecurityTo(request);
            } catch (Exception e) {
                // If adding security fails, just go ahead and try without security.  If it's a public
                // repository then this will work.  If not, then it will fail with a 404.
            }
            HttpResponse<GitHubGetContentsResponse> response = request.asObject(GitHubGetContentsResponse.class);
            if (response.getStatus() == 404) {
                throw new NotFoundException();
            }
            if (response.getStatus() != 200) {
                throw new UnirestException("Unexpected response from GitHub: " + response.getStatus() + "::" + response.getStatusText());
            }
            
            GitHubGetContentsResponse body = response.getBody();
            String b64Content = body.getContent();
            String content = new String(Base64.decodeBase64(b64Content), StandardCharsets.UTF_8);
            ResourceContent rval = new ResourceContent();
            rval.setContent(content);
            rval.setSha(body.getSha());
            return rval;
        } catch (UnirestException e) {
            logger.error("Error getting Github resource content.", e);
            throw new SourceConnectorException("Error getting Github resource content.", e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#updateResourceContent(java.lang.String, java.lang.String, java.lang.String, io.apicurio.hub.api.beans.ResourceContent)
     */
    @Override
    public String updateResourceContent(String repositoryUrl, String commitMessage, String commitComment,
            ResourceContent content) throws SourceConnectorException {
        try {
            String b64Content = Base64.encodeBase64String(content.getContent().getBytes(StandardCharsets.UTF_8));

            GitHubResource resource = resolver.resolve(repositoryUrl);

            GitHubUpdateFileRequest requestBody = new GitHubUpdateFileRequest();
            requestBody.setMessage(commitMessage);
            requestBody.setContent(b64Content);
            requestBody.setSha(content.getSha());
            requestBody.setBranch(resource.getBranch());

            String createContentUrl = this.endpoint("/repos/:org/:repo/contents/:path")
                .bind("org", resource.getOrganization())
                .bind("repo", resource.getRepository())
                .bind("path", resource.getResourcePath())
                .toString();

            HttpRequestWithBody request = Unirest.put(createContentUrl).header("Content-Type", "application/json; charset=utf-8");
            addSecurityTo(request);
            HttpResponse<JsonNode> response = request.body(requestBody).asJson();
            if (response.getStatus() != 200) {
                throw new UnirestException("Unexpected response from GitHub: " + response.getStatus() + "::" + response.getStatusText());
            }
            JsonNode node = response.getBody();
            String newSha = node.getObject().getJSONObject("content").getString("sha");
            
            if (commitComment != null && !commitComment.trim().isEmpty()) {
                String commitSha = node.getObject().getJSONObject("commit").getString("sha");
                this.addCommitComment(repositoryUrl, commitSha, commitComment);
            }
            
            return newSha;
        } catch (UnirestException e) {
            logger.error("Error updating Github resource content.", e);
            throw new SourceConnectorException("Error updating Github resource content.", e);
        }
    }
    
    /**
     * Uses the GH API to add a commit comment.
     * @param repositoryUrl
     * @param commitSha
     * @param commitComment
     * @throws UnirestException
     * @throws SourceConnectorException
     */
    private void addCommitComment(String repositoryUrl, String commitSha, String commitComment)
            throws UnirestException, SourceConnectorException {
        GitHubCreateCommitCommentRequest body = new GitHubCreateCommitCommentRequest();
        body.setBody(commitComment);

        GitHubResource resource = resolver.resolve(repositoryUrl);
        String addCommentUrl = this.endpoint("/repos/:org/:repo/commits/:sha/comments")
            .bind("org", resource.getOrganization())
            .bind("repo", resource.getRepository())
            .bind("path", resource.getResourcePath())
            .bind("sha", commitSha)
            .toString();

        HttpRequestWithBody request = Unirest.post(addCommentUrl).header("Content-Type", "application/json; charset=utf-8");
        addSecurityTo(request);
        HttpResponse<JsonNode> response = request.body(body).asJson();
        if (response.getStatus() != 201) {
            throw new UnirestException("Unexpected response from GitHub: " + response.getStatus() + "::" + response.getStatusText());
        }
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#createResourceContent(java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public void createResourceContent(String repositoryUrl, String commitMessage, String content) throws SourceConnectorException {
        try {
            String b64Content = Base64.encodeBase64String(content.getBytes(StandardCharsets.UTF_8));

            GitHubResource resource = resolver.resolve(repositoryUrl);

            GitHubCreateFileRequest requestBody = new GitHubCreateFileRequest();
            requestBody.setMessage(commitMessage);
            requestBody.setContent(b64Content);
            requestBody.setBranch(resource.getBranch());

            String createContentUrl = this.endpoint("/repos/:org/:repo/contents/:path")
                .bind("org", resource.getOrganization())
                .bind("repo", resource.getRepository())
                .bind("path", resource.getResourcePath())
                .toString();

            HttpRequestWithBody request = Unirest.put(createContentUrl).header("Content-Type", "application/json; charset=utf-8");
            addSecurityTo(request);
            HttpResponse<InputStream> response = request.body(requestBody).asBytes().map(ByteArrayInputStream::new);
            if (response.getStatus() != 201) {
                throw new UnirestException("Unexpected response from GitHub: " + response.getStatus() + "::" + response.getStatusText());
            }
        } catch (UnirestException e) {
            logger.error("Error creating Github resource content.", e);
            throw new SourceConnectorException("Error creating Github resource content.", e);
        }
    }

    /**
     * @see io.apicurio.hub.api.github.IGitHubSourceConnector#getOrganizations()
     */
    @Override
    public Collection<GitHubOrganization> getOrganizations() throws GitHubException, SourceConnectorException {
        logger.debug("Getting organizations for current user.");
        Collection<GitHubOrganization> rval = new HashSet<>();
        try {
            GitHubClient client = githubClient();
            
            // Add the user's personal org
            UserService userService = new UserService(client);
            User user = userService.getUser();
            GitHubOrganization gho = new GitHubOrganization();
            gho.setUserOrg(true);
            gho.setId(user.getLogin());
            rval.add(gho);
            
            // Now all the user's orgs
            OrganizationService orgService = new OrganizationService(client);
            List<User> organizations = orgService.getOrganizations();
            for (User org : organizations) {
                gho = new GitHubOrganization();
                gho.setUserOrg(false);
                gho.setId(org.getLogin());
                rval.add(gho);
            }
        } catch (IOException e) {
            logger.error("Error getting GitHub organizations.", e);
            throw new GitHubException("Error getting GitHub organizations.", e);
        }
        return rval;
    }
    
    /**
     * @see io.apicurio.hub.api.github.IGitHubSourceConnector#getRepositories(java.lang.String)
     */
    @Override
    public Collection<GitHubRepository> getRepositories(String org) throws GitHubException, SourceConnectorException {
        logger.debug("Getting the repositories from organization {}", org);
        Collection<GitHubRepository> rval = new HashSet<>();
        try {
            GitHubClient client = githubClient();

            // First get the user's login id
            UserService userService = new UserService(client);
            User user = userService.getUser();
            String userLogin = user.getLogin();

            // Get the Org/User repositories
            RepositoryService repoService = new RepositoryService(client);
            List<Repository> repositories = null;
            if (org.equals(userLogin)) {
                Map<String, String> filters = new HashMap<String, String>();
                filters.put("affiliation", "owner");
                filters.put("visibility", "all");
                repositories = repoService.getRepositories(filters);
            } else {
                repositories = repoService.getOrgRepositories(org);
            }
            
            for (Repository repository : repositories) {
                GitHubRepository ghrepo = new GitHubRepository();
                ghrepo.setName(repository.getName());
                ghrepo.setPriv(repository.isPrivate());
                rval.add(ghrepo);
            }
        } catch (IOException e) {
            logger.error("Error getting GitHub repositories.", e);
            throw new GitHubException("Error getting GitHub repositories.", e);
        }
        return rval;
    }
    
    /**
     * @see io.apicurio.hub.api.github.IGitHubSourceConnector#getBranches(java.lang.String, java.lang.String)
     */
    @Override
    public Collection<SourceCodeBranch> getBranches(String org, String repo)
            throws GitHubException, SourceConnectorException {
        logger.debug("Getting the branches from {} / {}", org, repo);
        Collection<SourceCodeBranch> rval = new HashSet<>();
        try {
            GitHubClient client = githubClient();
            
            RepositoryService repoService = new RepositoryService(client);
            Repository repository = repoService.getRepository(org, repo);
            List<RepositoryBranch> branches = repoService.getBranches(repository);
            for (RepositoryBranch branch : branches) {
                SourceCodeBranch ghBranch = new SourceCodeBranch();
                ghBranch.setName(branch.getName());
                ghBranch.setCommitId(branch.getCommit().getSha());
                rval.add(ghBranch);
            }
        } catch (IOException e) {
            logger.error("Error getting GitHub branches.", e);
            throw new GitHubException("Error getting GitHub branches.", e);
        }
        return rval;
    }
    
    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#createPullRequestFromZipContent(java.lang.String, java.lang.String, java.util.zip.ZipInputStream)
     */
    @Override
    public String createPullRequestFromZipContent(String repositoryUrl, String commitMessage, ZipInputStream generatedContent) throws SourceConnectorException {
        logger.debug("Creating new pull request from Zip content.");
        try {
            GitHubResource resource = resolver.resolve(repositoryUrl);

            String org = resource.getOrganization();
            String repo = resource.getRepository();
            String branch = resource.getBranch();
            String path = resource.getResourcePath();
            
            GitHubPullRequestCreator creator = new GitHubPullRequestCreator(generatedContent, org, repo,
                    branch, path, commitMessage);
            creator.setApiUrl(this.getBaseApiEndpointUrl());
            creator.setToken(getExternalToken());
            GitHubPullRequest pullRequest = creator.create();
            return pullRequest.getHtml_url();
        } catch (Exception e) {
            logger.error("Error creating pull request.", e);
            throw new SourceConnectorException("Error creating pull request.", e);
        }
    }

    /**
     * @see io.apicurio.hub.api.connectors.AbstractSourceConnector#addSecurityTo(kong.unirest.HttpRequest)
     */
    @Override
    protected void addSecurityTo(HttpRequest request) throws SourceConnectorException {
        String idpToken = getExternalToken();
        request.header("Authorization", "Bearer " + idpToken);
    }

}
