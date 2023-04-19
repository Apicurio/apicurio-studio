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

package io.apicurio.hub.api.gitlab;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipInputStream;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import kong.unirest.HttpRequest;
import org.apache.commons.codec.binary.Base64;
import org.apache.http.Header;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

import io.apicurio.hub.api.beans.GitLabAction;
import io.apicurio.hub.api.beans.GitLabAction.GitLabActionType;
import io.apicurio.hub.api.beans.GitLabCreateFileRequest;
import io.apicurio.hub.api.beans.GitLabGroup;
import io.apicurio.hub.api.beans.GitLabProject;
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
 * Implementation of the GitLab source connector.
 *
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class GitLabSourceConnector extends AbstractSourceConnector implements IGitLabSourceConnector {

    private static Logger logger = LoggerFactory.getLogger(GitLabSourceConnector.class);

    protected static final Object TOKEN_TYPE_PAT = "PAT";
    protected static final Object TOKEN_TYPE_OAUTH = "OAUTH";
    private static final int DEFAULT_PAGE_SIZE = 20;

    @Inject
    private HubConfiguration config;
    @Inject
    private GitLabResourceResolver resolver;

    private String apiUrl;

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#getType()
     */
    @Override
    public LinkedAccountType getType() {
        return LinkedAccountType.GitLab;
    }

    /**
     * @see AbstractSourceConnector#getBaseApiEndpointUrl()
     */
    @Override
    protected String getBaseApiEndpointUrl() {
        if (apiUrl == null) {
            apiUrl = this.config.getGitLabApiUrl();
        }
        return apiUrl;
    }

    /**
     * @see io.apicurio.hub.api.connectors.AbstractSourceConnector#parseExternalTokenResponse(java.lang.String)
     */
    @Override
    protected Map<String, String> parseExternalTokenResponse(String body) {
        try {
            Map<String, String> rval = new HashMap<>();
            JsonNode jsonNode = mapper.readTree(body);
            rval.put("access_token", jsonNode.get("access_token").asText());
            rval.put("token_type", jsonNode.get("token_type").asText());
            rval.put("refresh_token", jsonNode.get("refresh_token").asText());
            rval.put("scope", jsonNode.get("scope").asText());
            rval.put("created_at", jsonNode.get("created_at").asText());
            rval.put("id_token", jsonNode.get("id_token").asText());
            return rval;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#validateResourceExists(String)
     */
    @Override
    public ApiDesignResourceInfo validateResourceExists(String repositoryUrl) throws NotFoundException, SourceConnectorException, ApiValidationException {
        logger.debug("Validating the existence of resource {}", repositoryUrl);
        try {
            GitLabResource resource = resolver.resolve(repositoryUrl);

            if (resource == null) {
                throw new NotFoundException();
            }
            String content = getResourceContent(resource);

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
            throw new SourceConnectorException("Error checking that a GitLab resource exists.", e);
        }
    }

    /**
     * Gets the content of the given GitLab resource.  This is done by querying for the
     * content using the GH API.
     *
     * @param resource
     */
    private String getResourceContent(GitLabResource resource) throws NotFoundException, SourceConnectorException {
        logger.debug("Getting resource content for: {}/{} - {}",
                resource.getGroup(), resource.getProject(), resource.getResourcePath());

        ResourceContent content = getResourceContentFromGitLab(resource);

        return content.getContent();
    }

    /**
     * Adds security information to the http request.
     * @param request
     */
    protected void addSecurity(HttpRequestBase request) throws SourceConnectorException {
        if (this.getExternalTokenType() == TOKEN_TYPE_PAT) {
            request.addHeader("PRIVATE-TOKEN", getExternalToken());
        }
        if (this.getExternalTokenType() == TOKEN_TYPE_OAUTH) {
            request.addHeader("Authorization", "Bearer " + getExternalToken());
        }
    }

    /**
     * @return the type of the external token (either private or oauth)
     */
    protected Object getExternalTokenType() {
        return TOKEN_TYPE_OAUTH;
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#getResourceContent(String)
     */
    @Override
    public ResourceContent getResourceContent(String repositoryUrl) throws NotFoundException, SourceConnectorException {
        GitLabResource resource = resolver.resolve(repositoryUrl);
        return getResourceContentFromGitLab(resource);
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#updateResourceContent(String, String, String, ResourceContent)
     */
    @Override
    public String updateResourceContent(String repositoryUrl, String commitMessage, String commitComment,
                                        ResourceContent content) throws SourceConnectorException {
        String rval = commitToGitLab(repositoryUrl, content.getContent(), commitMessage, false);
        if (commitComment != null && !commitComment.trim().isEmpty()) {
            addCommitComment(repositoryUrl, rval, commitComment);
        }
        return rval;
    }

    /**
     * Uses the GH API to add a commit comment.
     *
     * @param repositoryUrl
     * @param commitSha
     * @param commitComment
     * @throws kong.unirest.UnirestException
     * @throws SourceConnectorException
     */
    private void addCommitComment(String repositoryUrl, String commitSha, String commitComment)
            throws SourceConnectorException {

        GitLabResource resource = resolver.resolve(repositoryUrl);

        String urlEncodedId = toEncodedId(resource);
        String addCommentUrl = this.endpoint("/api/v4/projects/:id/repository/commits/:sha/comments")
                .bind("id", urlEncodedId)
                .bind("sha", commitSha)
                .toString();

        // TODO reuse the HTTP client!!
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost post = new HttpPost(addCommentUrl);
            addSecurity(post);
            // Set note as a form body parameter
            List<NameValuePair> nvps = new ArrayList<NameValuePair>();
            nvps.add(new BasicNameValuePair("note", commitComment));
            post.setEntity(new UrlEncodedFormEntity(nvps));

            try (CloseableHttpResponse response = httpClient.execute(post)) {
                if (response.getStatusLine().getStatusCode() != 201) {
                    throw new SourceConnectorException("Unexpected response from GitLab: " + response.getStatusLine().toString());
                }
            }
        } catch (IOException e) {
            throw new SourceConnectorException("Error adding comment to GitLab commit.", e);
        }
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#createResourceContent(String, String, String)
     */
    @Override
    public void createResourceContent(String repositoryUrl, String commitMessage, String content) throws SourceConnectorException {
        commitToGitLab(repositoryUrl, content, commitMessage, true);
    }

    /**
     * @see IGitLabSourceConnector#getGroups()
     */
    @Override
    public Collection<GitLabGroup> getGroups() throws GitLabException, SourceConnectorException {
        logger.debug("Getting the GitLab groups for current user");

        Collection<GitLabGroup> rval = new HashSet<>();
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {

            // Get the user's personal group
            HttpGet get = new HttpGet(this.endpoint("/api/v4/user").toString());
            get.addHeader("Accept", "application/json");
            addSecurity(get);
            try (CloseableHttpResponse response = httpClient.execute(get)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw new SourceConnectorException("Error getting GitLab user information: " + response.getStatusLine().getReasonPhrase());
                }
                try (InputStream contentStream = response.getEntity().getContent()) {
                    JsonNode node = mapper.readTree(contentStream);
                    if (node.isObject()) {
                        int id = node.get("id").asInt();
                        String username = node.get("username").asText();
                        String fullName = node.get("name").asText();
                        GitLabGroup glg = new GitLabGroup();
                        glg.setId(id);
                        glg.setName(fullName);
                        glg.setPath(username);
                        glg.setFull_path(username);
                        glg.setUserGroup(true);
                        rval.add(glg);
                    }
                }
            }

            // Now get all the groups the user has access to
            Endpoint endpoint = pagedEndpoint("/api/v4/groups", 1, DEFAULT_PAGE_SIZE);

            // Set the "all_available" and "min_access_level" params, if configured.
            String allAvailable = this.config.getGitLabGroupAllAvailable();
            if (allAvailable != null && !allAvailable.isEmpty()) {
                endpoint.queryParam("all_available", allAvailable);
            }
            String minAccessLevel = this.config.getGitLabGroupMinAccessLevel();
            if (minAccessLevel != null && !minAccessLevel.isEmpty()) {
                endpoint.queryParam("min_access_level", minAccessLevel);
            }

            Collection<GitLabGroup> groups = getAllGroups(httpClient, endpoint);
            rval.addAll(groups);
        } catch (IOException e) {
            throw new GitLabException("Error getting GitLab groups.", e);
        }
        return rval;
    }

    /**
     * Gets the full list of groups - handles paged results.
     * @param httpClient
     * @param endpoint
     * @throws IOException
     * @throws SourceConnectorException
     */
    private Collection<GitLabGroup> getAllGroups(CloseableHttpClient httpClient, Endpoint endpoint) throws IOException, SourceConnectorException {
        Collection<GitLabGroup> groups = new ArrayList<>();

        String nextPageUrl = addGroups(httpClient, endpoint, groups);
        while (nextPageUrl != null) {
            Endpoint nextEndpoint = new Endpoint(nextPageUrl);
            nextPageUrl = addGroups(httpClient, nextEndpoint, groups);
        }
        return groups;
    }

    /**
     * Queries the given endpoint, reads the resulting groups, adds all of the groups it finds
     * to the collection of groups, and then returns a URL of the next page of results.
     * @param httpClient
     * @param endpoint
     * @param groups
     * @throws IOException
     * @throws SourceConnectorException
     */
    private String addGroups(CloseableHttpClient httpClient, Endpoint endpoint,
            Collection<GitLabGroup> groups) throws IOException, SourceConnectorException {
        HttpGet get = new HttpGet(endpoint.toString());
        get.addHeader("Accept", "application/json");
        addSecurity(get);
        try (CloseableHttpResponse response = httpClient.execute(get)) {
            if (response.getStatusLine().getStatusCode() != 200) {
                throw new SourceConnectorException(
                        "Error getting GitLab groups: " + response.getStatusLine().getReasonPhrase());
            }
            try (InputStream contentStream = response.getEntity().getContent()) {
                JsonNode node = mapper.readTree(contentStream);
                if (node.isArray()) {
                    ArrayNode array = (ArrayNode) node;
                    array.forEach(obj -> {
                        JsonNode org = obj;
                        int id = org.get("id").asInt();
                        String name = org.get("name").asText();
                        String path = org.get("path").asText();
                        String fullPath = org.get("full_path").asText();
                        GitLabGroup glg = new GitLabGroup();
                        glg.setId(id);
                        glg.setName(name);
                        glg.setPath(path);
                        glg.setFull_path(fullPath);
                        groups.add(glg);
                    });
                }
            }
            Header linkHeader = response.getFirstHeader("Link");
            return getNextPage(linkHeader);
        }
    }

    /**
     * @see io.apicurio.hub.api.gitlab.IGitLabSourceConnector#getProjects(java.lang.String)
     */
    @Override
    public Collection<GitLabProject> getProjects(String group) throws GitLabException, SourceConnectorException {
        logger.debug("Getting the projects from group {}", group);

        Collection<GitLabProject> rval = new HashSet<>();
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {

            // Get the user's personal group
//            String gitLabUsername = null;
            String gitLabUserId = null;
            HttpGet get = new HttpGet(this.endpoint("/api/v4/user").toString());
            get.addHeader("Accept", "application/json");
            addSecurity(get);
            try (CloseableHttpResponse response = httpClient.execute(get)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw new SourceConnectorException("Error getting GitLab user information: " + response.getStatusLine().getReasonPhrase());
                }
                try (InputStream contentStream = response.getEntity().getContent()) {
                    JsonNode node = mapper.readTree(contentStream);
                    if (node.isObject()) {
//                        gitLabUsername = node.get("username").asText();
                        gitLabUserId = node.get("id").asText();
                    }
                }
            }

            if (group != null && group.equalsIgnoreCase(gitLabUserId)) {
                // List all user projects
                //////////////////////////////
                Endpoint endpoint = pagedEndpoint("/api/v4/users/:user_id/projects", 1, DEFAULT_PAGE_SIZE).bind("user_id", gitLabUserId);
                Collection<GitLabProject> projects = getAllProjects(httpClient, endpoint);
                rval.addAll(projects);
            } else {
                // List all group projects
                //////////////////////////////
                String gid = toId(group);
                Endpoint endpoint = pagedEndpoint("/api/v4/groups/:group/projects", 1, DEFAULT_PAGE_SIZE).bind("group", gid);
                Collection<GitLabProject> projects = getAllProjects(httpClient, endpoint);
                rval.addAll(projects);
            }
        } catch (IOException e) {
            throw new GitLabException("Error getting GitLab repositories.", e);
        }
        return rval;
    }

    /**
     * Gets all of the projects using the given endpoint.  This handles paging by following the Link
     * HTTP header returned by GitLab.
     * @param httpClient
     * @param endpoint
     * @throws IOException
     * @throws SourceConnectorException
     */
    private Collection<GitLabProject> getAllProjects(CloseableHttpClient httpClient, Endpoint endpoint) throws IOException, SourceConnectorException {
        Collection<GitLabProject> projects = new ArrayList<>();

        String nextPageUrl = addProjects(httpClient, endpoint, projects);
        while (nextPageUrl != null) {
            Endpoint nextEndpoint = new Endpoint(nextPageUrl);
            nextPageUrl = addProjects(httpClient, nextEndpoint, projects);
        }
        return projects;
    }

    /**
     * Queries the given endpoint, reads the resulting projects, adds all of the projects it finds
     * to the collection of projects, and then returns a URL of the next page of results.
     * @param httpClient
     * @param endpoint
     * @param projects
     * @throws IOException
     * @throws SourceConnectorException
     */
    private String addProjects(CloseableHttpClient httpClient, Endpoint endpoint,
            Collection<GitLabProject> projects) throws IOException, SourceConnectorException {
        HttpGet get = new HttpGet(endpoint.toString());
        get.addHeader("Accept", "application/json");
        addSecurity(get);

        try (CloseableHttpResponse response = httpClient.execute(get)) {
            try (InputStream contentStream = response.getEntity().getContent()) {
                JsonNode node = mapper.readTree(contentStream);
                if (node.isArray()) {
                    ArrayNode array = (ArrayNode) node;
                    array.forEach(obj -> {
                        JsonNode project = obj;
                        int id = project.get("id").asInt();
                        String name = project.get("name").asText();
                        String path = project.get("path").asText();
                        String fullPath = project.get("path_with_namespace").asText();
                        GitLabProject glp = new GitLabProject();
                        glp.setId(id);
                        glp.setName(name);
                        glp.setPath(path);
                        glp.setFull_path(fullPath);
                        projects.add(glp);
                    });
                }
            }
            Header linkHeader = response.getFirstHeader("Link");
            return getNextPage(linkHeader);
        }
    }

    /**
     * @see io.apicurio.hub.api.gitlab.IGitLabSourceConnector#getBranches(java.lang.String)
     */
    @Override
    public Collection<SourceCodeBranch> getBranches(String projectId)
            throws GitLabException, SourceConnectorException {
        logger.debug("Getting the branches for {}", projectId);

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            Endpoint endpoint = pagedEndpoint("/api/v4/projects/:id/repository/branches", 1, DEFAULT_PAGE_SIZE)
                    .bind("id", toEncodedId(projectId));
            return getAllBranches(httpClient, endpoint);
        } catch (IOException e) {
            throw new GitLabException("Error getting GitLab branches.", e);
        }
    }

    /**
     * Gets all branches using the given endpoint.  Handles paging by following the Link HTTP header
     * returned by GitLab.
     * @param httpClient
     * @param endpoint
     * @throws IOException
     * @throws SourceConnectorException
     */
    private Collection<SourceCodeBranch> getAllBranches(CloseableHttpClient httpClient, Endpoint endpoint) throws IOException, SourceConnectorException {
        Collection<SourceCodeBranch> branches = new ArrayList<>();

        String nextPageUrl = addBranches(httpClient, endpoint, branches);
        while (nextPageUrl != null) {
            Endpoint nextEndpoint = new Endpoint(nextPageUrl);
            nextPageUrl = addBranches(httpClient, nextEndpoint, branches);
        }
        return branches;
    }

    /**
     * Queries the given endpoint, reads the resulting branches, adds all of the branches it finds
     * to the collection of branches, and then returns a URL of the next page of results.
     * @param httpClient
     * @param endpoint
     * @param branches
     * @throws IOException
     * @throws SourceConnectorException
     */
    private String addBranches(CloseableHttpClient httpClient, Endpoint endpoint,
            Collection<SourceCodeBranch> branches) throws IOException, SourceConnectorException {
        HttpGet get = new HttpGet(endpoint.toString());
        get.addHeader("Accept", "application/json");
        addSecurity(get);

        try (CloseableHttpResponse response = httpClient.execute(get)) {
            try (InputStream contentStream = response.getEntity().getContent()) {
                JsonNode node = mapper.readTree(contentStream);
                if (node.isArray()) {
                    ArrayNode array = (ArrayNode) node;
                    array.forEach(obj -> {
                        JsonNode branch = obj;
                        SourceCodeBranch glBranch = new SourceCodeBranch();
                        glBranch.setName(branch.get("name").asText());
                        glBranch.setCommitId(branch.get("commit").get("id").asText());
                        branches.add(glBranch);
                    });
                }
            }
            Header linkHeader = response.getFirstHeader("Link");
            return getNextPage(linkHeader);
        }
    }

    /**
     * Convenience for getting an endpoint with the page and page size configured.
     * @param path
     * @param page
     * @param perPage
     */
    private Endpoint pagedEndpoint(String path, int page, int perPage){
        return this.endpoint(path)
                .queryParam("page", String.valueOf(page))
                .queryParam("per_page", String.valueOf(perPage));
    }

    /**
     * @see AbstractSourceConnector#addSecurityTo(HttpRequest)
     */
    @Override
    protected void addSecurityTo(HttpRequest request) throws SourceConnectorException {
        // TODO: not currently supported because we're not using Unirest as our HTTP client.  We'll convert *all* clients to use Apache HTTP Client soon and this method will change
    }

    /**
     * Commits new repository file content to GitLab.
     * @param repositoryUrl
     * @param content
     * @param commitMessage
     * @param create
     * @throws SourceConnectorException
     */
    private String commitToGitLab(String repositoryUrl, String content, String commitMessage, boolean create) throws SourceConnectorException {

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            GitLabResource resource = resolver.resolve(repositoryUrl);

            String contentUrl = this.endpoint("/api/v4/projects/:id/repository/commits")
                    .bind("id", toEncodedId(resource))
                    .toString();

            HttpPost post = new HttpPost(contentUrl);
            post.addHeader("Content-Type", "application/json");
            addSecurity(post);

            GitLabCreateFileRequest body = new GitLabCreateFileRequest();
            body.setBranch(resource.getBranch());
            body.setCommitMessage(commitMessage);

            body.setActions(new ArrayList<>());
            GitLabAction action = new GitLabAction();
            String b64Content = Base64.encodeBase64String(content.getBytes(StandardCharsets.UTF_8));
            action.setGitLabAction(GitLabActionType.UPDATE);
            if (create) {
                action.setGitLabAction(GitLabActionType.CREATE);
            }
            action.setFilePath(resource.getResourcePath());
            action.setContent(b64Content);
            action.setEncoding("base64");
            body.getActions().add(action);

            // Set the POST body
            post.setEntity(new StringEntity(mapper.writeValueAsString(body),StandardCharsets.UTF_8));

            try (CloseableHttpResponse response = httpClient.execute(post)) {
                if (response.getStatusLine().getStatusCode() != 201) {
                    throw new SourceConnectorException("Unexpected response from GitLab: " + response.getStatusLine().toString());
                }
                try (InputStream contentStream = response.getEntity().getContent()) {
                    JsonNode node = mapper.readTree(contentStream);
                    return node.get("id").asText();
                }
            }
        } catch (IOException e) {
            throw new SourceConnectorException("Error creating GitLab resource content.", e);
        }
    }

    /**
     * Gets the actual content of a resource.  Returns the raw content and the commit id.
     * @param resource
     * @throws NotFoundException
     * @throws SourceConnectorException
     */
    private ResourceContent getResourceContentFromGitLab(GitLabResource resource) throws NotFoundException, SourceConnectorException {
        try (CloseableHttpClient httpClient = HttpClients.createSystem()) {
            String getContentUrl = this.endpoint("/api/v4/projects/:id/repository/files/:path")
                    .bind("id", toEncodedId(resource))
                    .bind("path", toEncodedPath(resource))
                    .queryParam("ref", resource.getBranch())
                    .toString();

            HttpGet get = new HttpGet(getContentUrl);
            get.addHeader("Accept", "application/json");
            get.addHeader("Cache-Control", "no-cache");
            get.addHeader("Postman-Token", "4d2517bb-72d0-9175-1cbe-04d61e9258a0");
            get.addHeader("DNT", "1");
            get.addHeader("Accept-Language", "en-US,en;q=0.8");

            try {
                addSecurity(get);
            } catch (Exception e) {
                // If adding security fails, just go ahead and try without security.  If it's a public
                // repository then this will work.  If not, then it will fail with a 404.
            }

            try (CloseableHttpResponse response = httpClient.execute(get)) {
                if (response.getStatusLine().getStatusCode() == 404) {
                    throw new NotFoundException();
                }
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw new SourceConnectorException("Unexpected response from GitLab: " + response.getStatusLine().toString());
                }

                try (InputStream contentStream = response.getEntity().getContent()) {
                    Map<String, Object> jsonContent = mapper.readerFor(Map.class).readValue(contentStream);
                    String b64Content = jsonContent.get("content").toString();
                    String content = new String(Base64.decodeBase64(b64Content), StandardCharsets.UTF_8);
                    ResourceContent rval = new ResourceContent();

                    rval.setContent(content);
                    rval.setSha(jsonContent.get("commit_id").toString());

                    return rval;
                }
            }
        } catch (IOException e) {
            throw new SourceConnectorException("Error getting GitLab resource content.", e);
        }
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#createPullRequestFromZipContent(java.lang.String, java.lang.String, java.util.zip.ZipInputStream)
     */
    @Override
    public String createPullRequestFromZipContent(String repositoryUrl, String commitMessage,
            ZipInputStream generatedContent) throws SourceConnectorException {
        return null;
    }

    private String toId(String value) {
        try {
            return URLEncoder.encode(value, StandardCharsets.UTF_8.name())
                    .replaceAll("\\+", "%20");
        } catch (UnsupportedEncodingException e) {
            return value;
        }
    }

    private String toEncodedId(GitLabResource resource) {
        return toEncodedId(resource.getGroup(), resource.getProject());
    }

    private String toEncodedId(String project) {
        return toId(String.format("%s",project));
    }

    private String toEncodedId(String group, String project) {
        return toId(String.format("%s/%s", group, project));
    }

    private String toEncodedPath(GitLabResource resource) {
        return toId(resource.getResourcePath());
    }

    private String getNextPage(Header linkHeader) {
        if (linkHeader != null) {
            String linkValue = linkHeader.getValue();
            if (linkValue != null) {
                String[] links = linkValue.split(",");
                for (String link : links) {
                    link = link.trim();
                    int idx = link.indexOf(">; rel=\"");
                    if (idx > 0) {
                        String label = link.substring(idx + 8, link.length() - 1);
                        if (label.equals("next")) {
                            return link.substring(1, idx);
                        }
                    }
                }
            }
        }
        return null;
    }
}
