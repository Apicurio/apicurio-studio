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
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.enterprise.context.ApplicationScoped;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.apicurio.hub.api.beans.*;
import io.apicurio.hub.api.github.GitHubException;
import io.apicurio.hub.api.github.IGitHubSourceConnector;
import org.apache.commons.codec.binary.Base64;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mashape.unirest.request.GetRequest;
import com.mashape.unirest.request.HttpRequest;
import com.mashape.unirest.request.HttpRequestWithBody;

import io.apicurio.hub.api.connectors.AbstractSourceConnector;
import io.apicurio.hub.api.connectors.SourceConnectorException;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.util.OpenApiTools;
import io.apicurio.hub.api.util.OpenApiTools.NameAndDescription;
import sun.misc.BASE64Decoder;

import static io.apicurio.hub.api.beans.GitLabAction.GitLabActionType.CREATE;
import static io.apicurio.hub.api.beans.GitLabAction.GitLabActionType.UPDATE;

/**
 * Implementation of the GitLab source connector.
 *
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class GitLabSourceConnector extends AbstractSourceConnector implements IGitLabSourceConnector {

    private static Logger logger = LoggerFactory.getLogger(GitLabSourceConnector.class);

    private static final String GITLAB_API_ENDPOINT = "https://gitlab.com";
    private static final String GITLAB_ENCODING = "base64";

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
            Map<String, Object> jsonContent = mapper.reader(Map.class).readValue(content);
            String b64Content = (String) jsonContent.get("content");

            content = new String(Base64.decodeBase64(b64Content), "UTF-8");
            NameAndDescription nad = OpenApiTools.getNameAndDescriptionFromSpec(content);

            ApiDesignResourceInfo info = new ApiDesignResourceInfo();
            info.setName(nad.name);
            info.setDescription(nad.description);
            info.setUrl("https://github.com/:org/:repo/blob/master/:path"
                    .replace(":org", resource.getGroup())
                    .replace(":repo", resource.getProject())
                    .replace(":path", resource.getResourcePath()));
            return info;
        } catch (IOException e) {
            throw new SourceConnectorException("Error checking that a GitHub resource exists.", e);
        }
    }

    /**
     * Gets the content of the given GitHub resource.  This is done by querying for the
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

        try {
            GitLabResource resource = GitLabResourceResolver.resolve(repositoryUrl);
            if (resource == null) {
                throw new NotFoundException();
            }

            String commitsUrl = endpoint("/api/v4/projects/:id/repository/contributors")
                    .bind("id", toEncodedId(resource))
                    .url();
            HttpRequest request = Unirest.get(commitsUrl).header("Accept", "application/json")
                    .queryString("path", resource.getResourcePath());
            addSecurityTo(request);
            HttpResponse<JsonNode> response = request.asJson();
            if (response.getStatus() != 200) {
                throw new UnirestException("Unexpected response from GitLab: " + response.getStatus() + "::" + response.getStatusText());
            }

            List<Collaborator> collaborators = new ArrayList<>();

            JsonNode node = response.getBody();
            if (node.isArray()) {
                JSONArray array = node.getArray();
                if (array.length() == 0) {
                    throw new NotFoundException();
                }
                array.forEach(obj -> {
                    JSONObject jobj = (JSONObject) obj;
                    String name = jobj.get("name").toString();
                    Collaborator collaborator = new Collaborator();
                    collaborator.setName(name);
                    collaborators.add(collaborator);
                });
            } else {
                throw new NotFoundException();
            }
            return collaborators;
        } catch (UnirestException e) {
            throw new SourceConnectorException("Error getting collaborator information for a GitHub resource.", e);
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
        return commitToGitLab(repositoryUrl, content.getContent(), commitMessage, UPDATE);
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
            throws UnirestException, SourceConnectorException {

        GitLabResource resource = GitLabResourceResolver.resolve(repositoryUrl);

        String urlEncodedId = toEncodedId(resource);

        String addCommentUrl = this.endpoint("/projects/:id/repository/commits/:sha/comments")
                .bind("id", urlEncodedId)
                .bind("sha", commitSha)
                .url();

        GitLabPostCommentToCommitRequest body = new GitLabPostCommentToCommitRequest();
        body.setNote(commitComment);
        body.setId(urlEncodedId);
        body.setSha(commitSha);

        HttpRequestWithBody request = Unirest.post(addCommentUrl).header("Content-Type", "application/json; charset=utf-8");
        addSecurityTo(request);
        HttpResponse<JsonNode> response = request.body(body).asJson();
        if (response.getStatus() != 201) {
            throw new UnirestException("Unexpected response from GitHub: " + response.getStatus() + "::" + response.getStatusText());
        }
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#createResourceContent(String, String, String)
     */
    @Override
    public void createResourceContent(String repositoryUrl, String commitMessage, String content) throws SourceConnectorException {
        commitToGitLab(repositoryUrl, content, commitMessage, CREATE);
    }

    /**
     * @see IGitLabSourceConnector#getGroups()
     */
    @Override
    public Collection<GitHubOrganization> getGroups()
            throws GitHubException, SourceConnectorException {

        try {
            Collection<GitHubOrganization> rval = new HashSet<>();

            HttpRequest request = Unirest.get("https://gitlab.com/api/v4/groups");
            addSecurityTo(request);

            HttpResponse<JsonNode> response = request.asJson();
            JSONArray array = response.getBody().getArray();

            array.forEach(obj -> {
                JSONObject org = (JSONObject) obj;
                String login = org.getString("name");
                GitHubOrganization gho = new GitHubOrganization();
                gho.setId(login);
                gho.setUserOrg(false);
                rval.add(gho);
            });

            return rval;
        } catch (UnirestException e) {
            throw new GitHubException("Error getting GitHub organizations.", e);
        }
    }

    /**
     * @see IGitLabSourceConnector#getRepositories(String)
     */
    @Override
    public Collection<GitHubRepository> getRepositories(String org) throws GitHubException, SourceConnectorException {
        logger.debug("Getting the repositories from organization {}", org);
        try {
            Collection<GitHubRepository> rval = new HashSet<>();

            String requestUrl = String.format("https://gitlab.com/api/v4/groups/%s/projects", org);

            HttpRequest request = Unirest.get(requestUrl);
            addSecurityTo(request);

            HttpResponse<JsonNode> response = request.asJson();
            JSONArray array = response.getBody().getArray();

            array.forEach(obj -> {
                JSONObject repo = (JSONObject) obj;
                String name = repo.getString("name");
                GitHubRepository gho = new GitHubRepository();
                gho.setName(name);
                rval.add(gho);
            });

            return rval;

        } catch (UnirestException e) {
            throw new GitHubException("Error getting GitHub repositories.", e);
        }
    }

    /**
     * @see AbstractSourceConnector#addSecurityTo(HttpRequest)
     */
    @Override
    protected void addSecurityTo(HttpRequest request) throws SourceConnectorException {
        //String idpToken = getExternalToken();
        //request.header("Authorization", "Bearer " + idpToken);

        request.getHeaders().put("PRIVATE-TOKEN", Arrays.asList("H-ogyvysLsvjtqRytJpy"));
    }

    private String commitToGitLab(String repositoryUrl, String content, String commitMessage, GitLabAction.GitLabActionType actionType) throws SourceConnectorException {
        try {
            String b64Content = Base64.encodeBase64String(content.getBytes("utf-8"));

            GitLabResource resource = GitLabResourceResolver.resolve(repositoryUrl);

            String urlEncodedId = toEncodedId(resource);

            String createContentUrl = this.endpoint("/api/v4/projects/:id/repository/commits")
                    //.bind("project", resource.getProject())
                    .bind("id", urlEncodedId)
                    .url();

            GitLabCreateFileRequest requestBody = new GitLabCreateFileRequest();
            requestBody.setCommitMessage(commitMessage);
            requestBody.setBranch(resource.getBranch());
            requestBody.setId(urlEncodedId);

            GitLabAction action = new GitLabAction();
            action.setGitLabAction(actionType);
            action.setEncoding(GITLAB_ENCODING);
            action.setContent(b64Content);
            action.setFilePath(resource.getResourcePath());

            requestBody.setActions(Arrays.asList(action));

            HttpRequestWithBody request = Unirest.post(createContentUrl).header("Content-Type", "application/json; charset=utf-8");
            addSecurityTo(request);

            HttpResponse<JsonNode> response = request.body(requestBody).asJson();

            if (response.getStatus() != 201) {
                throw new UnirestException("Unexpected response from GitLab: " + response.getStatus() + "::" + response.getStatusText());
            }

            return response.getBody().getObject().get("id").toString();

        } catch (UnsupportedEncodingException | UnirestException e) {
            throw new SourceConnectorException("Error creating GitLab resource content.", e);
        }
    }

    private ResourceContent getResourceContentFromGitLab(GitLabResource resource) throws NotFoundException, SourceConnectorException {
        try {
            String getContentUrl = this.endpoint("/api/v4/projects/:id/repository/files/:path?ref=:branch")
                    .bind("id", toEncodedId(resource))
                    .bind("path", resource.getResourcePath())
                    .bind("branch", resource.getBranch())
                    .url();

            HttpRequest request = Unirest.get(getContentUrl).header("Accept", "application/json");
            addSecurityTo(request);

            HttpResponse<JsonNode> response = request.asJson();

            if (response.getStatus() == 404) {
                throw new NotFoundException();
            }
            if (response.getStatus() != 200) {
                throw new UnirestException("Unexpected response from GitLab: " + response.getStatus() + "::" + response.getStatusText());
            }

            String b64Content = response.getBody().getObject().get("content").toString();
            String content = new String(Base64.decodeBase64(b64Content), "utf-8");
            ResourceContent rval = new ResourceContent();

            rval.setContent(new String(java.util.Base64.getDecoder().decode(content)));
            rval.setSha(response.getBody().getObject().get("commit_id").toString());

            return rval;
        } catch (UnirestException | UnsupportedEncodingException e) {
            throw new SourceConnectorException("Error getting Github resource content.", e);
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

    /**
     * Parses the HTTP "Link" header and returns a map of named links.  A typical link header value
     * might look like this:
     * <p>
     * <https://api.github.com/user/1890703/repos?page=2>; rel="next", <https://api.github.com/user/1890703/repos?page=3>; rel="last"
     * <p>
     * The return value for this would be a map with two items:
     * <p>
     * next=https://api.github.com/user/1890703/repos?page=2
     * last=https://api.github.com/user/1890703/repos?page=3
     *
     * @param linkHeader
     */
    static Map<String, String> parseLinkHeader(String linkHeader) {
        Map<String, String> rval = new HashMap<>();
        if (linkHeader != null) {
            String[] split = linkHeader.split(",");
            for (String item : split) {
                Pattern pattern = Pattern.compile("<(.+)>; rel=\"(.+)\"");
                Matcher matcher = pattern.matcher(item.trim());
                if (matcher.matches()) {
                    String url = matcher.group(1);
                    String name = matcher.group(2);
                    rval.put(name, url);
                }
            }
        }
        return rval;
    }


}
