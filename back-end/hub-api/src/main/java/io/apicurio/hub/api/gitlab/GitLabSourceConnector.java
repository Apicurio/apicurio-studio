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

import org.apache.commons.codec.binary.Base64;
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
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mashape.unirest.request.HttpRequest;

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

    @Inject
    private HubConfiguration config;

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
            GitLabResource resource = GitLabResourceResolver.resolve(repositoryUrl);

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
        GitLabResource resource = GitLabResourceResolver.resolve(repositoryUrl);
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
     * @throws UnirestException
     * @throws SourceConnectorException
     */
    private void addCommitComment(String repositoryUrl, String commitSha, String commitComment)
            throws SourceConnectorException {

        GitLabResource resource = GitLabResourceResolver.resolve(repositoryUrl);

        String urlEncodedId = toEncodedId(resource);
        String addCommentUrl = this.endpoint("/api/v4/projects/:id/repository/commits/:sha/comments")
                .bind("id", urlEncodedId)
                .bind("sha", commitSha)
                .toString();

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
                        glg.setUserGroup(true);
                        rval.add(glg);
                    }
                }
            }

            
            // Now get all the groups the user has access to
            Collection<GitLabGroup> groups = getAllGroups(httpClient);
            rval.addAll(groups);
        } catch (IOException e) {
            throw new GitLabException("Error getting GitLab groups.", e);
        }
        return rval;
    }

    private Collection<GitLabGroup> getAllGroups(CloseableHttpClient httpClient) throws IOException, SourceConnectorException {
        int page = 1;
        int perPage = 100;
        Collection<GitLabGroup> groups = getGroups(httpClient, page, perPage);
        while (groups.size() == page*perPage){
            groups.addAll(getGroups(httpClient, ++page, perPage));
        }
        return groups;
    }

    private Collection<GitLabGroup> getGroups(CloseableHttpClient httpClient, int page, int perPage) throws IOException, SourceConnectorException {
        Collection<GitLabGroup> rval = new HashSet<>();
        Endpoint endpoint = this.endpoint("/api/v4/groups", page, perPage);
        String allAvailable = this.config.getGitLabGroupAllAvailable();
        if(allAvailable != null && !allAvailable.isEmpty()){
            endpoint.queryParam("all_available", allAvailable);
        }
        String minAccessLevel = this.config.getGitLabGroupMinAccessLevel();
        if(minAccessLevel != null && !minAccessLevel.isEmpty()){
            endpoint.queryParam("min_access_level", minAccessLevel);
        }
        HttpGet get = new HttpGet(endpoint.toString());
        get.addHeader("Accept", "application/json");
        addSecurity(get);
        try (CloseableHttpResponse response = httpClient.execute(get)) {
            if (response.getStatusLine().getStatusCode() != 200) {
                throw new SourceConnectorException("Error getting GitLab groups: " + response.getStatusLine().getReasonPhrase());
            }
            try (InputStream contentStream = response.getEntity().getContent()) {
                JsonNode node = mapper.readTree(contentStream);
                if (node.isArray()) {
                    ArrayNode array = (ArrayNode) node;
                    array.forEach(obj -> {
                        JsonNode org = (JsonNode) obj;
                        int id = org.get("id").asInt();
                        String name = org.get("name").asText();
                        String path = org.get("path").asText();
                        GitLabGroup glg = new GitLabGroup();
                        glg.setId(id);
                        glg.setName(name);
                        glg.setPath(path);
                        rval.add(glg);
                    });
                }
            }
        }
        return rval;
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
            String gitLabUsername = null;
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
                        gitLabUsername = node.get("username").asText();
                        gitLabUserId = node.get("id").asText();
                    }
                }
            }
            
            if (group != null && group.equalsIgnoreCase(gitLabUsername)) {
                // List all user projects
                //////////////////////////////
                Collection<GitLabProject> projects = getAllUserProjects(httpClient, gitLabUserId);
                rval.addAll(projects);
            } else {
                // List all group projects
                //////////////////////////////
                Collection<GitLabProject> projects = getAllGroupProjects(httpClient, group);
                rval.addAll(projects);
            }
        } catch (IOException e) {
            throw new GitLabException("Error getting GitLab repositories.", e);
        }
        return rval;
    }

    private Collection<GitLabProject> getAllGroupProjects(CloseableHttpClient httpClient, String group) throws IOException, SourceConnectorException {
        int page = 1;
        int perPage = 100;
        Collection<GitLabProject> projects = getGroupProjects(httpClient, page, perPage, group);
        while (projects.size() == page*perPage){
            projects.addAll(getGroupProjects(httpClient, ++page, perPage, group));
        }
        return projects;
    }

    private Collection<GitLabProject> getAllUserProjects(CloseableHttpClient httpClient, String gitLabUserId) throws IOException, SourceConnectorException {
        int page = 1;
        int perPage = 100;
        Collection<GitLabProject> projects = getUserProjects(httpClient, page, perPage, gitLabUserId);
        while (projects.size() == page*perPage){
            projects.addAll(getUserProjects(httpClient, ++page, perPage, gitLabUserId));
        }
        return projects;
    }

    private Collection<GitLabProject> getUserProjects(CloseableHttpClient httpClient, int page, int perPage, String gitLabUserId) throws IOException, SourceConnectorException {
        Collection<GitLabProject> rval = new HashSet<>();
        Endpoint endpoint = this.endpoint("/api/v4/users/:user_id/projects", page, perPage).bind("user_id", gitLabUserId);
        HttpGet get = new HttpGet(endpoint.toString());
        get.addHeader("Accept", "application/json");
        addSecurity(get);
        addProjects(httpClient, rval, get);
        return rval;
    }

    private Collection<GitLabProject> getGroupProjects(CloseableHttpClient httpClient, int page, int perPage, String group) throws IOException, SourceConnectorException {
        Collection<GitLabProject> rval = new HashSet<>();
        Endpoint endpoint = this.endpoint("/api/v4/groups/:group/projects", page, perPage).bind("group", group);
        HttpGet get = new HttpGet(endpoint.toString());
        get.addHeader("Accept", "application/json");
        addSecurity(get);
        addProjects(httpClient, rval, get);
        return rval;
    }

    private void addProjects(CloseableHttpClient httpClient, Collection<GitLabProject> rval, HttpGet get) throws IOException {
        try (CloseableHttpResponse response = httpClient.execute(get)) {
            try (InputStream contentStream = response.getEntity().getContent()) {
                JsonNode node = mapper.readTree(contentStream);
                if (node.isArray()) {
                    ArrayNode array = (ArrayNode) node;
                    array.forEach(obj -> {
                        JsonNode project = (JsonNode) obj;
                        int id = project.get("id").asInt();
                        String name = project.get("name").asText();
                        String path = project.get("path").asText();
                        GitLabProject glp = new GitLabProject();
                        glp.setId(id);
                        glp.setName(name);
                        glp.setPath(path);
                        rval.add(glp);
                    });
                }
            }
        }
    }

    /**
     * @see io.apicurio.hub.api.gitlab.IGitLabSourceConnector#getBranches(java.lang.String, java.lang.String)
     */
    @Override
    public Collection<SourceCodeBranch> getBranches(String group, String project)
            throws GitLabException, SourceConnectorException {
        logger.debug("Getting the branches from {} / {}", group, project);

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            return getAllBranches(httpClient, group, project);
        } catch (IOException e) {
            throw new GitLabException("Error getting GitLab branches.", e);
        }
    }

    private Collection<SourceCodeBranch> getAllBranches(CloseableHttpClient httpClient, String group, String project) throws IOException, SourceConnectorException {
        int page = 1;
        int perPage = 100;
        Collection<SourceCodeBranch> branches = getBranches(httpClient, page, perPage, group, project);
        while (branches.size() == page*perPage){
            branches.addAll(getBranches(httpClient, ++page, perPage, group, project));
        }
        return branches;
    }

    private Collection<SourceCodeBranch> getBranches(CloseableHttpClient httpClient, int page, int perPage, String group, String project) throws IOException, SourceConnectorException {
        Collection<SourceCodeBranch> rval = new HashSet<>();
        Endpoint endpoint = this.endpoint("/api/v4/projects/:id/repository/branches", page, perPage)
                .bind("id", toEncodedId(group, project));
        HttpGet get = new HttpGet(endpoint.toString());
        get.addHeader("Accept", "application/json");
        addSecurity(get);

        try (CloseableHttpResponse response = httpClient.execute(get)) {
            try (InputStream contentStream = response.getEntity().getContent()) {
                JsonNode node = mapper.readTree(contentStream);
                if (node.isArray()) {
                    ArrayNode array = (ArrayNode) node;
                    array.forEach(obj -> {
                        JsonNode branch = (JsonNode) obj;
                        SourceCodeBranch glBranch = new SourceCodeBranch();
                        glBranch.setName(branch.get("name").asText());
                        glBranch.setCommitId(branch.get("commit").get("id").asText());
                        rval.add(glBranch);
                    });
                }
                return rval;
            }
        }
    }

    private Endpoint endpoint(String path, int page, int perPage){
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
            GitLabResource resource = GitLabResourceResolver.resolve(repositoryUrl);

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
            post.setEntity(new StringEntity(mapper.writeValueAsString(body)));
            
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

    private ResourceContent getResourceContentFromGitLab(GitLabResource resource) throws NotFoundException, SourceConnectorException {
        try (CloseableHttpClient httpClient = HttpClients.createSystem()) {
            String getContentUrl = this.endpoint("/api/v4/projects/:id/repository/files/:path?ref=:branch")
                    .bind("id", toEncodedId(resource))
                    .bind("path", toEncodedPath(resource))
                    .bind("branch", toEncodedBranch(resource))
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

    private String toEncodedId(GitLabResource resource) {
        return toEncodedId(resource.getGroup(), resource.getProject());
    }

    private String toEncodedId(String group, String project) {
        String urlEncodedId;
        try {
            urlEncodedId = URLEncoder.encode(String.format("%s/%s", group, project), StandardCharsets.UTF_8.name());
        } catch (Exception ex) {
            return "";
        }
        return urlEncodedId;
    }

    private String toEncodedPath(GitLabResource resource) {
        String urlEncodedPath;
        try {
            urlEncodedPath = URLEncoder.encode(resource.getResourcePath(), StandardCharsets.UTF_8.name());
        } catch (Exception ex) {
            return "";
        }
        return urlEncodedPath;
    }

    private String toEncodedBranch(GitLabResource resource) {
        String urlEncodedBranch;
        try {
            urlEncodedBranch = URLEncoder.encode(resource.getBranch(), StandardCharsets.UTF_8.name());
        } catch (Exception ex) {
            return "";
        }
        return urlEncodedBranch;
    }
    
}
