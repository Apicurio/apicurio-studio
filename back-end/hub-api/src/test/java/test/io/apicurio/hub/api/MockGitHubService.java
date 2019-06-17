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

package test.io.apicurio.hub.api;

import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.zip.ZipInputStream;

import io.apicurio.hub.api.beans.GitHubOrganization;
import io.apicurio.hub.api.beans.GitHubRepository;
import io.apicurio.hub.api.beans.ResourceContent;
import io.apicurio.hub.api.beans.SourceCodeBranch;
import io.apicurio.hub.api.connectors.SourceConnectorException;
import io.apicurio.hub.api.github.GitHubException;
import io.apicurio.hub.api.github.IGitHubSourceConnector;
import io.apicurio.hub.core.beans.ApiDesignResourceInfo;
import io.apicurio.hub.core.beans.ApiDesignType;
import io.apicurio.hub.core.beans.LinkedAccountType;
import io.apicurio.hub.core.exceptions.NotFoundException;

/**
 * @author eric.wittmann@gmail.com
 */
public class MockGitHubService implements IGitHubSourceConnector {
    
    public static final String STATIC_CONTENT = "{\r\n" + 
            "  \"swagger\" : \"2.0\",\r\n" + 
            "  \"info\" : {\r\n" + 
            "    \"title\": \"Swagger Sample App\",\r\n" + 
            "    \"version\": \"1.0.1\",\r\n" + 
            "    \"description\": \"This is a sample server Petstore server.\",\r\n" + 
            "    \"termsOfService\": \"http://swagger.io/terms/\",\r\n" + 
            "    \"contact\": {\r\n" + 
            "      \"name\": \"API Support\",\r\n" + 
            "      \"url\": \"http://www.swagger.io/support\",\r\n" + 
            "      \"email\": \"support@swagger.io\"\r\n" + 
            "    },\r\n" + 
            "    \"license\": {\r\n" + 
            "      \"name\": \"Apache 2.0\",\r\n" + 
            "      \"url\": \"http://www.apache.org/licenses/LICENSE-2.0.html\"\r\n" + 
            "    }\r\n" + 
            "  },\r\n" + 
            "  \"host\": \"example.org\",\r\n" + 
            "  \"basePath\" : \"/example-api\",\r\n" + 
            "  \"schemes\" : [\r\n" + 
            "    \"http\", \"https\"\r\n" + 
            "  ],\r\n" + 
            "  \"consumes\" : [\r\n" + 
            "    \"application/json\",\r\n" + 
            "    \"application/xml\"\r\n" + 
            "  ],\r\n" + 
            "  \"produces\" : [\r\n" + 
            "    \"application/json\"\r\n" + 
            "  ]\r\n" + 
            "}\r\n" + 
            "";
    
    private List<String> audit = new ArrayList<>();

    /**
     * @see io.apicurio.hub.api.github.IGitHubSourceConnector#validateResourceExists(java.lang.String)
     */
    @Override
    public ApiDesignResourceInfo validateResourceExists(String repositoryUrl) throws NotFoundException {
        getAudit().add("validateResourceExists::" + repositoryUrl);
        if (repositoryUrl.endsWith("new-api.json")) {
            throw new NotFoundException();
        }
        try {
            URI uri = new URI(repositoryUrl);
            String name = new File(uri.getPath()).getName();
            ApiDesignResourceInfo info = new ApiDesignResourceInfo();
            info.setName(name);
            info.setDescription(repositoryUrl);
            info.setTags(new HashSet<String>(Arrays.asList("tag1", "tag2")));
            info.setType(ApiDesignType.OpenAPI20);
            return info;
        } catch (URISyntaxException e) {
            throw new NotFoundException();
        }
    }
    
    /**
     * @see io.apicurio.hub.api.github.IGitHubSourceConnector#getResourceContent(java.lang.String)
     */
    @Override
    public ResourceContent getResourceContent(String repositoryUrl) throws NotFoundException {
        getAudit().add("getResourceContent::" + repositoryUrl);
        ResourceContent rval = new ResourceContent();
        rval.setContent(STATIC_CONTENT);
        rval.setSha(String.valueOf(STATIC_CONTENT.hashCode()));
        return rval;
    }
    
    /**
     * @see io.apicurio.hub.api.github.IGitHubSourceConnector#updateResourceContent(java.lang.String, java.lang.String, java.lang.String, io.apicurio.hub.api.beans.ResourceContent)
     */
    @Override
    public String updateResourceContent(String repositoryUrl, String commitMessage, String commitComment,
            ResourceContent content) throws SourceConnectorException {
        getAudit().add("updateResourceContent::" + repositoryUrl + "::" + commitMessage + "::" + commitComment
                + "::" + content.getSha() + "::" + content.getContent().hashCode());
        // do nothing - mock only
        return UUID.randomUUID().toString();
    }
    
    /**
     * @see io.apicurio.hub.api.github.IGitHubSourceConnector#createResourceContent(java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public void createResourceContent(String repositoryUrl, String commitMessage, String content) {
        getAudit().add("createResourceContent::" + repositoryUrl + "::" + commitMessage + "::" + content.hashCode());
        // do nothing - mock only
    }
    
    /**
     * @see io.apicurio.hub.api.github.IGitHubSourceConnector#getOrganizations()
     */
    @Override
    public Collection<GitHubOrganization> getOrganizations() {
        getAudit().add("getOrganizations");
        Set<GitHubOrganization> orgs = new HashSet<>();
        orgs.add(org("Org1"));
        orgs.add(org("Org2"));
        orgs.add(org("Org3"));
        return orgs;
    }
    
    /**
     * Creates an org.
     */
    private GitHubOrganization org(String name) {
        GitHubOrganization org = new GitHubOrganization();
        org.setId(name);
        org.setUserOrg(false);
        return org;
    }

    /**
     * @see io.apicurio.hub.api.github.IGitHubSourceConnector#getRepositories(java.lang.String)
     */
    @Override
    public Collection<GitHubRepository> getRepositories(String org) {
        getAudit().add("getRepositories::" + org);
        Set<GitHubRepository> repos = new HashSet<>();
        repos.add(repo(org + "-Repo1"));
        repos.add(repo(org + "-Repo2"));
        repos.add(repo(org + "-Repo3"));
        return repos;
    }
    
    /**
     * @see io.apicurio.hub.api.github.IGitHubSourceConnector#getBranches(java.lang.String, java.lang.String)
     */
    @Override
    public Collection<SourceCodeBranch> getBranches(String org, String repo)
            throws GitHubException, SourceConnectorException {
        getAudit().add("getBranches::" + org);
        Set<SourceCodeBranch> branches = new HashSet<>();
        branches.add(branch(org + "-" + repo + "-Branch1"));
        branches.add(branch(org + "-" + repo +"-Branch2"));
        branches.add(branch(org + "-" + repo +"-Branch3"));
        return branches;
    }
    
    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#createPullRequestFromZipContent(java.lang.String, java.lang.String, java.util.zip.ZipInputStream)
     */
    @Override
    public String createPullRequestFromZipContent(String repositoryUrl, String commitMessage,
            ZipInputStream generatedContent) throws SourceConnectorException {
        return null;
    }

    /**
     * Creates a branch.
     */
    private SourceCodeBranch branch(String name) {
        SourceCodeBranch branch = new SourceCodeBranch();
        branch.setName(name);
        branch.setCommitId(String.valueOf(name.hashCode()));
        return branch;
    }

    /**
     * Creates a repo.
     */
    private GitHubRepository repo(String name) {
        GitHubRepository repo = new GitHubRepository();
        repo.setName(name);
        repo.setPriv(false);
        return repo;
    }

    /**
     * @return the audit
     */
    public List<String> getAudit() {
        return audit;
    }

    public String auditLog() {
        StringBuffer buffer = new StringBuffer();
        buffer.append("---\n");
        for (String auditEntry : this.audit) {
            buffer.append(auditEntry.trim());
            buffer.append("\n");
        }
        buffer.append("---");
        return buffer.toString();
    }

    /**
     * @see io.apicurio.hub.api.connectors.ISourceConnector#getType()
     */
    @Override
    public LinkedAccountType getType() {
        return LinkedAccountType.GitHub;
    }
}
