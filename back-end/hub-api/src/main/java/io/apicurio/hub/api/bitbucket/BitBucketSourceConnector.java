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

package io.apicurio.hub.api.bitbucket;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mashape.unirest.request.HttpRequest;
import com.mashape.unirest.request.HttpRequestWithBody;
import com.mashape.unirest.request.body.MultipartBody;
import io.apicurio.hub.api.beans.*;
import io.apicurio.hub.api.connectors.AbstractSourceConnector;
import io.apicurio.hub.api.connectors.SourceConnectorException;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.gitlab.GitLabResource;
import io.apicurio.hub.api.gitlab.GitLabResourceResolver;
import org.apache.commons.io.IOUtils;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Implementation of the GitLab source connector.
 *
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class BitBucketSourceConnector extends AbstractSourceConnector implements IBitBucketSourceConnector {

    private static Logger logger = LoggerFactory.getLogger(BitBucketSourceConnector.class);

    private static final String BITBUCKET_API_ENDPOINT = "https://api.bitbucket.org/2.0";
    protected static final Object TOKEN_TYPE_BASIC = "BASIC";
    protected static final Object TOKEN_TYPE_OAUTH = "OAUTH";

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#getType()
     */
    @Override
    public LinkedAccountType getType() {
        return LinkedAccountType.Bitbucket;
    }

    /**
     * @see AbstractSourceConnector#getBaseApiEndpointUrl()
     */
    @Override
    protected String getBaseApiEndpointUrl() {
        return BITBUCKET_API_ENDPOINT;
    }

    /**
     * @return the type of the external token (either private or oauth)
     */
    protected Object getExternalTokenType() {
        return TOKEN_TYPE_OAUTH;
    }

    /**
     * @see AbstractSourceConnector#parseExternalTokenResponse(String)
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
    public ApiDesignResourceInfo validateResourceExists(String repositoryUrl) throws NotFoundException, SourceConnectorException {
        logger.debug("Validating the existence of resource {}", repositoryUrl);
        try {
            BitBucketResource resource = BitBucketResourceResolver.resolve(repositoryUrl);

            if (resource == null) {
                throw new NotFoundException();
            }
            String content = getResourceContent(resource);

            String name = resource.getResourcePath();
            String description = "";
            OpenApi3Document document = mapper.reader(OpenApi3Document.class).readValue(content);
            if (document.getInfo() != null) {
                if (document.getInfo().getTitle() != null) {
                    name = document.getInfo().getTitle();
                }
                if (document.getInfo().getDescription() != null) {
                    description = document.getInfo().getDescription();
                }
            }

            ApiDesignResourceInfo info = new ApiDesignResourceInfo();
            info.setName(name);
            info.setDescription(description);
            info.setUrl(this.endpoint("/:team/:repo/blob/:branch/:path")
                    .bind("team", resource.getTeam())
                    .bind("repo", resource.getRepository())
                    .bind("branch", resource.getSlug())
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
    private String getResourceContent(BitBucketResource resource) throws NotFoundException, SourceConnectorException {
        logger.debug("Getting resource content for: {}/{} - {}",
                resource.getTeam(), resource.getRepository(), resource.getResourcePath());

        ResourceContent content = getResourceContentFromBitBucket(resource);

        return content.getContent();
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#getCollaborators(String)
     */
    @Override
    public Collection<Collaborator> getCollaborators(String repositoryUrl) throws NotFoundException, SourceConnectorException {
        logger.debug("Getting collaborator information for repository url: {}", repositoryUrl);

        BitBucketResource resource = BitBucketResourceResolver.resolve(repositoryUrl);

        try {
            String teamsUrl = endpoint("teams/:group/members").bind("group", resource.getTeam()).url();

            HttpRequest request = Unirest.get(teamsUrl);
            addSecurityTo(request);
            HttpResponse<com.mashape.unirest.http.JsonNode> response = request.asJson();

            JSONObject responseObj = response.getBody().getObject();

            if (response.getStatus() != 200) {
                throw new SourceConnectorException("Unexpected response from BitBucket: " + response.getStatus() + "::" + response.getStatusText());
            }

            Collection<Collaborator> rVal = new HashSet();

            responseObj.getJSONArray("values").forEach(obj -> {
                Collaborator bbc = new Collaborator();
                JSONObject collaborator = (JSONObject) obj;
                bbc.setName(collaborator.getString("username"));
                rVal.add(bbc);
            });

            return  rVal;
        } catch (UnirestException ex) {
            throw new SourceConnectorException("Error getting collaborators from BitBucket", ex);
        }
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#getResourceContent(String)
     */
    @Override
    public ResourceContent getResourceContent(String repositoryUrl) throws NotFoundException, SourceConnectorException {
        BitBucketResource resource = BitBucketResourceResolver.resolve(repositoryUrl);
        return getResourceContentFromBitBucket(resource);
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#updateResourceContent(String, String, String, ResourceContent)
     */
    @Override
    public String updateResourceContent(String repositoryUrl, String commitMessage, String commitComment,
                                        ResourceContent content) throws SourceConnectorException {
        throw new SourceConnectorException("BitBucket does not support editing a commit via the API");
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#createResourceContent(String, String, String)
     */
    @Override
    public void createResourceContent(String repositoryUrl, String commitMessage, String content) throws SourceConnectorException {
        commitToGitLab(repositoryUrl, content, commitMessage, true);
    }

    /**
     * @see IBitBucketSourceConnector#getTeams()
     */
    @Override
    public Collection<BitBucketTeam> getTeams() throws BitBucketException, SourceConnectorException {
        logger.debug("Getting the BitBucket teams for current user");


        try {
            String teamsUrl = endpoint("teams?role=member").url();

            HttpRequest request = Unirest.get(teamsUrl);
            addSecurityTo(request);
            HttpResponse<com.mashape.unirest.http.JsonNode> response = request.asJson();

            JSONObject responseObj = response.getBody().getObject();

            if (response.getStatus() != 200) {
                throw new UnirestException("Unexpected response from BitBucket: " + response.getStatus() + "::" + response.getStatusText());
            }

            Collection<BitBucketTeam> rVal =  new HashSet();

            responseObj.getJSONArray("values").forEach(obj -> {
                BitBucketTeam bbt = new BitBucketTeam();
                JSONObject team = (JSONObject) obj;
                bbt.setName(team.getString("display_name"));
                bbt.setUuid(team.getString("uuid"));
                rVal.add(bbt);
            });

            return rVal;

        } catch (UnirestException e) {
            throw new BitBucketException("Error getting BitBucket teams.", e);
        }
    }

    @Override
    public Collection<BitBucketRepository> getRepositories(String teamName) throws BitBucketException, SourceConnectorException {
        try {
            //@formatter:off
            String teamsUrl = endpoint("repositories/:uname")
                    .bind("uname", teamName)
                    .url();
            //@formatter:on;

            HttpRequest request = Unirest.get(teamsUrl);
            addSecurityTo(request);
            HttpResponse<com.mashape.unirest.http.JsonNode> response = request.asJson();

            JSONObject responseObj = response.getBody().getObject();

            if (response.getStatus() != 200) {
                throw new UnirestException("Unexpected response from BitBucket: " + response.getStatus() + "::" + response.getStatusText());
            }

            Collection<BitBucketRepository> rVal =  new HashSet();

            responseObj.getJSONArray("values").forEach(obj -> {
                BitBucketRepository bbr = new BitBucketRepository();
                JSONObject rep = (JSONObject) obj;
                bbr.setName(rep.getString("name"));
                bbr.setUuid(rep.getString("uuid"));
                rVal.add(bbr);
            });

            return rVal;

        } catch (UnirestException e) {
            throw new BitBucketException("Error getting BitBucket teams.", e);
        }
    }

    /**
     * Adds security information to the http request.
     * @param request
     */
    @Override
    protected void addSecurityTo(HttpRequest request) throws SourceConnectorException {
        if (this.getExternalTokenType() == TOKEN_TYPE_BASIC) {
            request.header("Authorization", "Basic " + getExternalToken());
        }
        if (this.getExternalTokenType() == TOKEN_TYPE_OAUTH) {
            request.header("Authorization", "Bearer " + getExternalToken());
        }
    }

    private BitBucketUser getUser() throws BitBucketException, SourceConnectorException {
        try {
            String userUrl = endpoint("user").url();

            HttpRequest request = Unirest.get(userUrl);
            addSecurityTo(request);
            HttpResponse<com.mashape.unirest.http.JsonNode> response = request.asJson();

            JSONObject responseObj = response.getBody().getObject();

            if (response.getStatus() != 200) {
                throw new UnirestException("Unexpected response from BitBucket: " + response.getStatus() + "::" + response.getStatusText());
            }

            BitBucketUser rVal = new BitBucketUser();

            rVal.setName(responseObj.getString("username"));
            rVal.setUuid(responseObj.getString("uuid"));

            return rVal;

        } catch (UnirestException e) {
            throw new BitBucketException("Error getting BitBucket teams.", e);
        }
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

        BitBucketResource resource = BitBucketResourceResolver.resolve(repositoryUrl);

        try {
            //@formatter:off
            String contentUrl = endpoint("repositories/:team/:repo/src")
                    .bind("team", resource.getTeam())
                    .bind("repo", resource.getRepository())
                    .url();
            //@formatter:on

            InputStream filesStream = null;
            try {
                filesStream = new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8.name()));
            } catch (UnsupportedEncodingException e) {
                throw new SourceConnectorException("Error writing content to file stream.");
            }

            HttpRequestWithBody request = Unirest.post(contentUrl);
            addSecurityTo(request);

            //@formatter:off
            HttpResponse<com.mashape.unirest.http.JsonNode> response = request
                    .field(resource.getResourcePath(), filesStream, resource.getResourcePath())
                    .field("message", commitMessage)
                    .field("branch", resource.getSlug())
                    .asJson();
            //@formatter:on

            if (response.getStatus() != 201) {
                throw new UnirestException("Unexpected response from BitBucket: " + response.getStatus() + "::" + response.getStatusText());
            }
        } catch (UnirestException e) {
            throw new SourceConnectorException(e);
        }

        return null;
    }

    private String getShaByResource(BitBucketResource resource) throws SourceConnectorException {
        try {
            //@formatter:off
            String contentUrl = endpoint("repositories/:team/:repo/src/:branch/:path?format=meta")
                    .bind("team", resource.getTeam())
                    .bind("repo", resource.getRepository())
                    .bind("branch", resource.getSlug())
                    .bind("path", resource.getResourcePath())
                    .url();
            //@formatter:on

            HttpRequest request = Unirest.get(contentUrl);
            addSecurityTo(request);
            HttpResponse<com.mashape.unirest.http.JsonNode> response = request.asJson();

            if (response.getStatus() != 200) {
                throw new UnirestException("Unexpected response from BitBucket: " + response.getStatus() + "::" + response.getStatusText());
            }

            JSONObject responseObj = response.getBody().getObject();
            JSONObject bbc = (JSONObject) responseObj.get("commit");

            return bbc.getString("hash");
        } catch (UnirestException e) {
            throw new SourceConnectorException(e);
        } catch (SourceConnectorException e) {
            throw new SourceConnectorException("Error creating BitBucket resource content.", e);
        }
    }

    private ResourceContent getResourceContentFromBitBucket(BitBucketResource resource) throws NotFoundException, SourceConnectorException {

        String sha = getShaByResource(resource);

        try {
            //@formatter:off
            String contentUrl = endpoint("repositories/:team/:repo/src/:branch/:path")
                    .bind("team", resource.getTeam())
                    .bind("repo", resource.getRepository())
                    .bind("branch", resource.getSlug())
                    .bind("path", resource.getResourcePath())
                    .url();
            //@formatter:on

            HttpRequest request = Unirest.get(contentUrl);
            addSecurityTo(request);
            HttpResponse<com.mashape.unirest.http.JsonNode> response = request.asJson();

            ResourceContent rVal = new ResourceContent();

            if (response.getStatus() != 200) {
                throw new UnirestException("Unexpected response from BitBucket: " + response.getStatus() + "::" + response.getStatusText());
            }

            String content = null;
            try {
                content = IOUtils.toString(response.getRawBody(), StandardCharsets.UTF_8);
            } catch (IOException e) {
                throw new SourceConnectorException("Error parsing file stream from BitBuckert");
            }

            rVal.setSha(sha);
            rVal.setContent(content);

            return rVal;

        } catch (UnirestException e) {
            throw new SourceConnectorException(e);
        }
    }
}
