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
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.enterprise.context.ApplicationScoped;

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

import io.apicurio.hub.api.beans.ApiDesignResourceInfo;
import io.apicurio.hub.api.beans.Collaborator;
import io.apicurio.hub.api.beans.GitHubCreateCommitCommentRequest;
import io.apicurio.hub.api.beans.GitHubCreateFileRequest;
import io.apicurio.hub.api.beans.GitHubGetContentsResponse;
import io.apicurio.hub.api.beans.GitHubOrganization;
import io.apicurio.hub.api.beans.GitHubRepository;
import io.apicurio.hub.api.beans.GitHubUpdateFileRequest;
import io.apicurio.hub.api.beans.LinkedAccountType;
import io.apicurio.hub.api.beans.ResourceContent;
import io.apicurio.hub.api.connectors.AbstractSourceConnector;
import io.apicurio.hub.api.connectors.SourceConnectorException;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.github.GitHubException;
import io.apicurio.hub.api.github.GitHubResource;
import io.apicurio.hub.api.github.GitHubResourceResolver;
import io.apicurio.hub.api.github.IGitHubSourceConnector;
import io.apicurio.hub.api.util.OpenApiTools;
import io.apicurio.hub.api.util.OpenApiTools.NameAndDescription;

/**
 * Implementation of the GitHub source connector.
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
            GitHubResource resource = GitHubResourceResolver.resolve(repositoryUrl);



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
                    .replace(":org", resource.getOrganization())
                    .replace(":repo", resource.getRepository())
                    .replace(":path", resource.getResourcePath()));
            return info;
        } catch (IOException e) {
            throw new SourceConnectorException("Error checking that a GitHub resource exists.", e);
        }
    }

    /**
     * Gets the content of the given GitHub resource.  This is done by querying for the
     * content using the GH API.
     * @param resource
     */
    private String getResourceContent(GitHubResource resource) throws NotFoundException, SourceConnectorException {
        logger.debug("Getting resource content for: {}/{} - {}",
                resource.getOrganization(), resource.getRepository(), resource.getResourcePath());
        try {
            String contentUrl = this.endpoint("/repos/:owner/:repo/contents/:path")
                    .bind("owner", resource.getOrganization())
                    .bind("repo", resource.getRepository())
                    .bind("path", resource.getResourcePath())
                    .url();
            GetRequest request = Unirest.get(contentUrl).header("Accept", "application/json");
            addSecurityTo(request);
            HttpResponse<String> userResp = request.asString();
            if (userResp.getStatus() != 200) {
                throw new NotFoundException();
            } else {
                String json = userResp.getBody();
                return json;
            }
        } catch (UnirestException e) {
            throw new SourceConnectorException("Error getting GitHub resource content.", e);
        }
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#getCollaborators(String)
     */
    @Override
    public Collection<Collaborator> getCollaborators(String repositoryUrl) throws NotFoundException, SourceConnectorException {
        logger.debug("Getting collaborator information for repository url: {}", repositoryUrl);
        try {
            GitHubResource resource = GitHubResourceResolver.resolve(repositoryUrl);
            if (resource == null) {
                throw new NotFoundException();
            }

            String commitsUrl = endpoint("/repos/:org/:repo/commits")
                    .bind("org", resource.getOrganization())
                    .bind("repo", resource.getRepository())
                    .url();
            HttpRequest request = Unirest.get(commitsUrl).header("Accept", "application/json")
                    .queryString("path", resource.getResourcePath());
            addSecurityTo(request);
            HttpResponse<JsonNode> response = request.asJson();
            if (response.getStatus() != 200) {
                throw new UnirestException("Unexpected response from GitHub: " + response.getStatus() + "::" + response.getStatusText());
            }

            Map<String, Collaborator> cidx = new HashMap<>();
            JsonNode node = response.getBody();
            if (node.isArray()) {
                JSONArray array = node.getArray();
                if (array.length() == 0) {
                	throw new NotFoundException();
                }
                array.forEach( obj -> {
                    JSONObject jobj = (JSONObject) obj;
                    JSONObject authorObj = (JSONObject) jobj.get("author");
                    String user = authorObj.getString("login");
                    Collaborator collaborator = cidx.get(user);
                    if (collaborator == null) {
                        collaborator = new Collaborator();
                        collaborator.setName(user);
                        collaborator.setUrl(authorObj.getString("html_url"));
                        collaborator.setCommits(1);
                        cidx.put(user, collaborator);
                    } else {
                        collaborator.setCommits(collaborator.getCommits() + 1);
                    }
                });
            } else {
            	throw new NotFoundException();
            }
            return cidx.values();
        } catch (UnirestException e) {
            throw new SourceConnectorException("Error getting collaborator information for a GitHub resource.", e);
        }
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#getResourceContent(String)
     */
    @Override
    public ResourceContent getResourceContent(String repositoryUrl) throws NotFoundException, SourceConnectorException {
        try {
            GitHubResource resource = GitHubResourceResolver.resolve(repositoryUrl);
            String getContentUrl = this.endpoint("/repos/:org/:repo/contents/:path")
                    .bind("org", resource.getOrganization())
                    .bind("repo", resource.getRepository())
                    .bind("path", resource.getResourcePath())
                    .url();
            HttpRequest request = Unirest.get(getContentUrl).header("Accept", "application/json");
            addSecurityTo(request);
            HttpResponse<GitHubGetContentsResponse> response = request.asObject(GitHubGetContentsResponse.class);
            if (response.getStatus() == 404) {
            	throw new NotFoundException();
            }
            if (response.getStatus() != 200) {
                throw new UnirestException("Unexpected response from GitHub: " + response.getStatus() + "::" + response.getStatusText());
            }

            GitHubGetContentsResponse body = response.getBody();
            String b64Content = body.getContent();
            String content = new String(Base64.decodeBase64(b64Content), "utf-8");
            ResourceContent rval = new ResourceContent();
            rval.setContent(content);
            rval.setSha(body.getSha());
            return rval;
        } catch (UnirestException | UnsupportedEncodingException e) {
            throw new SourceConnectorException("Error getting Github resource content.", e);
        }
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#updateResourceContent(String, String, String, ResourceContent)
     */
    @Override
    public String updateResourceContent(String repositoryUrl, String commitMessage, String commitComment,
            ResourceContent content) throws SourceConnectorException {
        try {
            String b64Content = Base64.encodeBase64String(content.getContent().getBytes("utf-8"));

            GitHubUpdateFileRequest requestBody = new GitHubUpdateFileRequest();
            requestBody.setMessage(commitMessage);
            requestBody.setContent(b64Content);
            requestBody.setSha(content.getSha());

            GitHubResource resource = GitHubResourceResolver.resolve(repositoryUrl);
            String createContentUrl = this.endpoint("/repos/:org/:repo/contents/:path")
                .bind("org", resource.getOrganization())
                .bind("repo", resource.getRepository())
                .bind("path", resource.getResourcePath())
                .url();

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
        } catch (UnsupportedEncodingException | UnirestException e) {
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

        GitHubResource resource = GitHubResourceResolver.resolve(repositoryUrl);
        String addCommentUrl = this.endpoint("/repos/:org/:repo/commits/:sha/comments")
            .bind("org", resource.getOrganization())
            .bind("repo", resource.getRepository())
            .bind("path", resource.getResourcePath())
            .bind("sha", commitSha)
            .url();

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
        try {
            String b64Content = Base64.encodeBase64String(content.getBytes("utf-8"));

            GitHubCreateFileRequest requestBody = new GitHubCreateFileRequest();
            requestBody.setMessage(commitMessage);
            requestBody.setContent(b64Content);

            GitHubResource resource = GitHubResourceResolver.resolve(repositoryUrl);
            String createContentUrl = this.endpoint("/repos/:org/:repo/contents/:path")
                .bind("org", resource.getOrganization())
                .bind("repo", resource.getRepository())
                .bind("path", resource.getResourcePath())
                .url();

            HttpRequestWithBody request = Unirest.put(createContentUrl).header("Content-Type", "application/json; charset=utf-8");
            addSecurityTo(request);
            HttpResponse<InputStream> response = request.body(requestBody).asBinary();
            if (response.getStatus() != 201) {
                throw new UnirestException("Unexpected response from GitHub: " + response.getStatus() + "::" + response.getStatusText());
            }
        } catch (UnsupportedEncodingException | UnirestException e) {
            throw new SourceConnectorException("Error creating Github resource content.", e);
        }
    }

    /**
     * @see IGitHubSourceConnector#getOrganizations()
     */
    @Override
    public Collection<GitHubOrganization> getGroups()
        throws GitHubException, SourceConnectorException {

        try {
            Collection<GitHubOrganization> rval = new HashSet<>();

            HttpRequest request = Unirest.get("https://gitlab.com/api/v4/groups");
            request.getHeaders().put("PRIVATE-TOKEN", Arrays.asList("H-ogyvysLsvjtqRytJpy"));
            //            addSecurityTo(request);

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

        //GitLabApi api = new GitLabApi("https://gitlab.com/", getExternalToken());

        //        logger.debug("Getting organizations for current user.");
        //        try {
        //            Collection<GitHubOrganization> rval = new HashSet<>();
        //
        //            // Add the user's personal org
        //            String userUrl = endpoint("/user").url();
        //            HttpRequest request = Unirest.get(userUrl).header("Accept", "application/json");
        //            addSecurityTo(request);
        //            HttpResponse<JsonNode> response = request.asJson();
        //            if (response.getStatus() != 200) {
        //                throw new UnirestException("Unexpected response from GitHub: " + response.getStatus() + "::" + response.getStatusText());
        //            }
        //            String userLogin = response.getBody().getObject().getString("login");
        //            GitHubOrganization ghorg = new GitHubOrganization();
        //            ghorg.setId(userLogin);
        //            ghorg.setUserOrg(true);
        //            rval.add(ghorg);
        //
        //            // Add all the orgs visible to the user
        //            String orgsUrl = endpoint("/user/orgs").url();
        //            while (orgsUrl != null) {
        //                request = Unirest.get(orgsUrl).header("Accept", "application/json");
        //                addSecurityTo(request);
        //                response = request.asJson();
        //                if (response.getStatus() != 200) {
        //                    throw new UnirestException("Unexpected response from GitHub: " + response.getStatus() + "::" + response.getStatusText());
        //                }
        //
        //                JSONArray array = response.getBody().getArray();
        //                array.forEach( obj -> {
        //                    JSONObject org = (JSONObject) obj;
        //                    String login = org.getString("login");
        //                    GitHubOrganization gho = new GitHubOrganization();
        //                    gho.setId(login);
        //                    gho.setUserOrg(false);
        //                    rval.add(gho);
        //                });
        //
        //                String linkHeader = response.getHeaders().getFirst("Link");
        //                Map<String, String> links = parseLinkHeader(linkHeader);
        //                orgsUrl = links.get("next");
        //            }
        //
        //            return rval;
        //        } catch (UnirestException e) {
        //            throw new GitHubException("Error getting GitHub organizations.", e);
        //        }
    }

    /**
     * @see IGitHubSourceConnector#getRepositories(String)
     */
    @Override
    public Collection<GitHubRepository> getRepositories(String org) throws GitHubException, SourceConnectorException {
        logger.debug("Getting the repositories from organization {}", org);
        try {
            Collection<GitHubRepository> rval = new HashSet<>();

            String requestUrl = String.format("https://gitlab.com/api/v4/groups/%s/projects", org);

            HttpRequest request = Unirest.get(requestUrl);

            request.getHeaders().put("PRIVATE-TOKEN", Arrays.asList("H-ogyvysLsvjtqRytJpy"));
            //addSecurityTo(request);

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


            //
            //            // First get the user's login id
            //            String userUrl = endpoint("/user").url();
            //            HttpRequest request = Unirest.get(userUrl).header("Accept", "application/json");
            //            addSecurityTo(request);
            //            HttpResponse<JsonNode> response = request.asJson();
            //            if (response.getStatus() != 200) {
            //                throw new UnirestException("Unexpected response from GitHub: " + response.getStatus() + "::" + response.getStatusText());
            //            }
            //            String userLogin = response.getBody().getObject().getString("login");
            //
            //            // Figure out if we're listing the user's repos or an org's repos
            //            String reposUrl;
            //            if (org.equals(userLogin)) {
            //                reposUrl = endpoint("/users/:username/repos").bind("username", org).url();
            //            } else {
            //                reposUrl = endpoint("/orgs/:org/repos").bind("org", org).url();
            //            }
            //
            //            // Return all pages of repos
            //            Collection<GitHubRepository> rval = new HashSet<>();
            //            while (reposUrl != null) {
            //                request = Unirest.get(reposUrl).header("Accept", "application/json");
            //                addSecurityTo(request);
            //                response = request.asJson();
            //                if (response.getStatus() != 200) {
            //                    throw new UnirestException("Unexpected response from GitHub: " + response.getStatus() + "::" + response.getStatusText());
            //                }
            //
            //                JSONArray array = response.getBody().getArray();
            //                array.forEach( obj -> {
            //                    JSONObject repo = (JSONObject) obj;
            //                    GitHubRepository ghrepo = new GitHubRepository();
            //                    ghrepo.setName(repo.getString("name"));
            //                    ghrepo.setPriv(repo.getBoolean("private"));
            //                    rval.add(ghrepo);
            //                });
            //
            //                String linkHeader = response.getHeaders().getFirst("Link");
            //                Map<String, String> links = parseLinkHeader(linkHeader);
            //                reposUrl = links.get("next");
            //            }
            //            return rval;
        } catch (UnirestException e) {
            throw new GitHubException("Error getting GitHub repositories.", e);
        }
    }

    /**
     * @see AbstractSourceConnector#addSecurityTo(HttpRequest)
     */
    @Override
    protected void addSecurityTo(HttpRequest request) throws SourceConnectorException {
        String idpToken = getExternalToken();
        request.header("Authorization", "Bearer " + idpToken);
    }

    /**
     * Parses the HTTP "Link" header and returns a map of named links.  A typical link header value
     * might look like this:
     *
     * <https://api.github.com/user/1890703/repos?page=2>; rel="next", <https://api.github.com/user/1890703/repos?page=3>; rel="last"
     *
     * The return value for this would be a map with two items:
     *
     *   next=https://api.github.com/user/1890703/repos?page=2
     *   last=https://api.github.com/user/1890703/repos?page=3
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
