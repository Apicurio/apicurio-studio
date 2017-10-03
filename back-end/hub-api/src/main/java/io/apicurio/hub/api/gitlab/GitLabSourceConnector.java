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
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import javax.enterprise.context.ApplicationScoped;

import org.apache.commons.codec.binary.Base64;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
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

import io.apicurio.hub.api.beans.ApiDesignResourceInfo;
import io.apicurio.hub.api.beans.Collaborator;
import io.apicurio.hub.api.beans.GitLabAction;
import io.apicurio.hub.api.beans.GitLabCreateFileRequest;
import io.apicurio.hub.api.beans.GitLabGroup;
import io.apicurio.hub.api.beans.GitLabProject;
import io.apicurio.hub.api.beans.LinkedAccountType;
import io.apicurio.hub.api.beans.ResourceContent;
import io.apicurio.hub.api.beans.GitLabAction.GitLabActionType;
import io.apicurio.hub.api.connectors.AbstractSourceConnector;
import io.apicurio.hub.api.connectors.SourceConnectorException;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.util.OpenApiTools;
import io.apicurio.hub.api.util.OpenApiTools.NameAndDescription;

/**
 * Implementation of the GitLab source connector.
 *
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class GitLabSourceConnector extends AbstractSourceConnector implements IGitLabSourceConnector {

    private static Logger logger = LoggerFactory.getLogger(GitLabSourceConnector.class);

    private static final String GITLAB_API_ENDPOINT = "https://gitlab.com";

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
        return GITLAB_API_ENDPOINT;
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#validateResourceExists(String)
     */
    @Override
    public ApiDesignResourceInfo validateResourceExists(String repositoryUrl) throws NotFoundException, SourceConnectorException {
        logger.debug("Validating the existence of resource {}", repositoryUrl);
        try {
            GitLabResource resource = GitLabResourceResolver.resolve(repositoryUrl);

            if (resource == null) {
                throw new NotFoundException();
            }
            String content = getResourceContent(resource);
            NameAndDescription nad = OpenApiTools.getNameAndDescriptionFromSpec(content);

            ApiDesignResourceInfo info = new ApiDesignResourceInfo();
            info.setName(nad.name);
            info.setDescription(nad.description);
            info.setUrl(this.endpoint("/:group/:project/blob/:branch/:path")
                    .bind("group", resource.getGroup())
                    .bind("project", resource.getProject())
                    .bind("branch", resource.getBranch())
                    .bind("path", resource.getResourcePath())
                    .url());
            return info;
        } catch (IOException e) {
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
     * @see io.apicurio.hub.api.connectors.ISourceConnector#getCollaborators(String)
     */
    @Override
    public Collection<Collaborator> getCollaborators(String repositoryUrl) throws NotFoundException, SourceConnectorException {
        logger.debug("Getting collaborator information for repository url: {}", repositoryUrl);

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            GitLabResource resource = GitLabResourceResolver.resolve(repositoryUrl);
            if (resource == null) {
                throw new NotFoundException();
            }

            // TODO should use list of commits instead, so we can get contributors specific to the repository file itself (not contributors on the project as a whole)
            String commitsUrl = endpoint("/api/v4/projects/:id/repository/contributors")
                    .bind("id", toEncodedId(resource))
                    .url();
            
            HttpGet get = new HttpGet(commitsUrl);
            get.addHeader("Accept", "application/json");
            get.addHeader("PRIVATE-TOKEN", getExternalToken());

            try (CloseableHttpResponse response = httpClient.execute(get)) {
                if (response.getStatusLine().getStatusCode() == 404) {
                    throw new NotFoundException();
                }
                
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw new SourceConnectorException("Unexpected response from GitLab: " + response.getStatusLine().toString());
                }
    
                List<Collaborator> collaborators = new ArrayList<>();
                
                try (InputStream contentStream = response.getEntity().getContent()) {
                    JsonNode node = mapper.readTree(contentStream);
                    if (node.isArray()) {
                        ArrayNode array = (ArrayNode) node;
                        if (array.size() == 0) {
                            throw new NotFoundException();
                        }
                        array.forEach(obj -> {
                            JsonNode jobj = (JsonNode) obj;
                            String name = jobj.get("name").asText();
                            Collaborator collaborator = new Collaborator();
                            collaborator.setName(name);
                            collaborator.setCommits(jobj.get("commits").asInt());
                            collaborator.setUrl(this.endpoint("/").url());
                            collaborators.add(collaborator);
                        });
                    } else {
                        throw new NotFoundException();
                    }
                    return collaborators;
                }
            }
        } catch (IOException e) {
            throw new SourceConnectorException("Error getting collaborator information for a GitLab resource.", e);
        }
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
                .url();

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost post = new HttpPost(addCommentUrl);
            post.addHeader("PRIVATE-TOKEN", getExternalToken());
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

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet get = new HttpGet(this.endpoint("/api/v4/groups").url());
            get.addHeader("Accept", "application/json");
            get.addHeader("PRIVATE-TOKEN", getExternalToken());

            try (CloseableHttpResponse response = httpClient.execute(get)) {
                Collection<GitLabGroup> rval = new HashSet<>();
                try (InputStream contentStream = response.getEntity().getContent()) {
                    JsonNode node = mapper.readTree(contentStream);
                    if (node.isArray()) {
                        ArrayNode array = (ArrayNode) node;
                        array.forEach(obj -> {
                            JsonNode org = (JsonNode) obj;
                            String login = org.get("name").asText();
                            GitLabGroup glg = new GitLabGroup();
                            glg.setId(login);
                            rval.add(glg);
                        });
                    }
                    return rval;
                }
            }
        } catch (IOException e) {
            throw new GitLabException("Error getting GitLab organizations.", e);
        }
    }
    
    /**
     * @see io.apicurio.hub.api.gitlab.IGitLabSourceConnector#getProjects(java.lang.String)
     */
    @Override
    public Collection<GitLabProject> getProjects(String group) throws GitLabException, SourceConnectorException {
        logger.debug("Getting the projects from group {}", group);

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            String requestUrl = this.endpoint("/api/v4/groups/:group/projects").bind("group", group).url();

            HttpGet get = new HttpGet(requestUrl);
            get.addHeader("Accept", "application/json");
            get.addHeader("PRIVATE-TOKEN", getExternalToken());

            try (CloseableHttpResponse response = httpClient.execute(get)) {
                Collection<GitLabProject> rval = new HashSet<>();
                try (InputStream contentStream = response.getEntity().getContent()) {
                    JsonNode node = mapper.readTree(contentStream);
                    if (node.isArray()) {
                        ArrayNode array = (ArrayNode) node;
                        array.forEach(obj -> {
                            JsonNode repo = (JsonNode) obj;
                            String name = repo.get("name").asText();
                            GitLabProject gho = new GitLabProject();
                            gho.setName(name);
                            rval.add(gho);
                        });
                    }
                    return rval;
                }
            }
        } catch (IOException e) {
            throw new GitLabException("Error getting GitLab repositories.", e);
        }
    }

    /**
     * @see AbstractSourceConnector#addSecurityTo(HttpRequest)
     */
    @Override
    protected void addSecurityTo(HttpRequest request) throws SourceConnectorException {
//        String idpToken = getExternalToken();
//        request.header("PRIVATE-TOKEN", idpToken);
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
                    .url();
            
            HttpPost post = new HttpPost(contentUrl);
            post.addHeader("Content-Type", "application/json");
            post.addHeader("PRIVATE-TOKEN", getExternalToken());

            GitLabCreateFileRequest body = new GitLabCreateFileRequest();
            body.setBranch(resource.getBranch());
            body.setCommitMessage(commitMessage);
            
            body.setActions(new ArrayList<>());
            GitLabAction action = new GitLabAction();
            String b64Content = Base64.encodeBase64String(content.getBytes("UTF-8"));
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
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            String getContentUrl = this.endpoint("/api/v4/projects/:id/repository/files/:path?ref=:branch")
                    .bind("id", toEncodedId(resource))
                    .bind("path", toEncodedPath(resource))
                    .bind("branch", toEncodedBranch(resource))
                    .url();
            
            HttpGet get = new HttpGet(getContentUrl);
            get.addHeader("Accept", "application/json");
            get.addHeader("PRIVATE-TOKEN", getExternalToken());
            try (CloseableHttpResponse response = httpClient.execute(get)) {
                if (response.getStatusLine().getStatusCode() == 404) {
                    throw new NotFoundException();
                }
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw new SourceConnectorException("Unexpected response from GitLab: " + response.getStatusLine().toString());
                }
    
                try (InputStream contentStream = response.getEntity().getContent()) {
                    Map<String, Object> jsonContent = mapper.reader(Map.class).readValue(contentStream);
                    String b64Content = jsonContent.get("content").toString();
                    String content = new String(Base64.decodeBase64(b64Content), "utf-8");
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


    private String toEncodedId(GitLabResource resource) {
        String urlEncodedId;
        try {
            urlEncodedId = URLEncoder.encode(String.format("%s/%s", resource.getGroup(), resource.getProject()), "UTF-8");
        } catch (Exception ex) {
            return "";
        }
        return urlEncodedId;
    }

    private String toEncodedPath(GitLabResource resource) {
        String urlEncodedPath;
        try {
            urlEncodedPath = URLEncoder.encode(resource.getResourcePath(), "UTF-8");
        } catch (Exception ex) {
            return "";
        }
        return urlEncodedPath;
    }

    private String toEncodedBranch(GitLabResource resource) {
        String urlEncodedBranch;
        try {
            urlEncodedBranch = URLEncoder.encode(resource.getBranch(), "UTF-8");
        } catch (Exception ex) {
            return "";
        }
        return urlEncodedBranch;
    }

}
