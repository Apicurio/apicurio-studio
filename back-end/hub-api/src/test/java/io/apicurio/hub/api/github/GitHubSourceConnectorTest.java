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

import java.util.Collection;
import java.util.Map;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import io.apicurio.hub.api.beans.ApiDesignResourceInfo;
import io.apicurio.hub.api.beans.Collaborator;
import io.apicurio.hub.api.beans.GitHubOrganization;
import io.apicurio.hub.api.beans.GitHubRepository;
import io.apicurio.hub.api.beans.ResourceContent;
import io.apicurio.hub.api.config.HubApiConfiguration;
import io.apicurio.hub.api.connectors.SourceConnectorException;
import io.apicurio.hub.api.exceptions.NotFoundException;
import test.io.apicurio.hub.api.MockSecurityContext;
import test.io.apicurio.hub.api.TestUtil;

/**
 * @author eric.wittmann@gmail.com
 */
public class GitHubSourceConnectorTest {
    
    private static final String GITHUB_PAT = "";

    private IGitHubSourceConnector service;
    private HubApiConfiguration config;

    @Before
    public void setUp() {
        service = new GitHubSourceConnector() {
            @Override
            protected String getExternalToken() throws SourceConnectorException {
                return GITHUB_PAT;
            }
        };
        config = new HubApiConfiguration();
        
        TestUtil.setPrivateField(service, "security", new MockSecurityContext());
        TestUtil.setPrivateField(service, "config", config);
    }
    
    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void testParseExternalTokenResponse() {
        Map<String, String> response = ((GitHubSourceConnector) service).parseExternalTokenResponse("access_token=12345&scope=repo%2Cuser%3Aemail&token_type=bearer");
        Assert.assertNotNull(response);
        Assert.assertEquals("12345", response.get("access_token"));
        Assert.assertEquals("repo,user:email", response.get("scope"));
        Assert.assertEquals("bearer", response.get("token_type"));
    }

    /**
     * Test method for {@link io.apicurio.hub.api.github.GitHubSourceConnector#validateResourceExists(java.lang.String)}.
     */
    @Test
    @Ignore
    public void testValidateResourceExists() throws NotFoundException, SourceConnectorException {
        ApiDesignResourceInfo info = service.validateResourceExists("https://github.com/Apicurio/api-samples/blob/master/apiman-rls/apiman-rls.json");
        Assert.assertNotNull(info);
        Assert.assertEquals("Rate Limiter API", info.getName());
        Assert.assertEquals("A REST API used by clients to access the standalone Rate Limiter micro-service.", info.getDescription());

        info = service.validateResourceExists("https://raw.githubusercontent.com/Apicurio/api-samples/master/pet-store/pet-store.json");
        Assert.assertNotNull(info);
        Assert.assertEquals("Swagger Petstore", info.getName());
        Assert.assertEquals("This is a sample server Petstore server via JSON!", info.getDescription());

        try {
			info = service.validateResourceExists("https://raw.githubusercontent.com/Apicurio/api-samples/master/not-available/not-available.json");
			Assert.fail("Expected a NotFoundException");
		} catch (NotFoundException e) {
		}
    }

    /**
     * Test method for {@link io.apicurio.hub.api.github.GitHubSourceConnector#getCollaborators(String)}.
     */
    @Test
    @Ignore
    public void testGetCollaborators() throws NotFoundException, SourceConnectorException {
        Collection<Collaborator> collaborators = service.getCollaborators("https://raw.githubusercontent.com/Apicurio/api-samples/master/apiman-rls/apiman-rls.json");
        Assert.assertNotNull(collaborators);
        Assert.assertFalse(collaborators.isEmpty());
        Assert.assertEquals(1, collaborators.size());
        Collaborator collaborator = collaborators.iterator().next();
        Assert.assertEquals(5, collaborator.getCommits());
        Assert.assertEquals("EricWittmann", collaborator.getName());
        Assert.assertEquals("https://github.com/EricWittmann", collaborator.getUrl());
        
        try {
			service.getCollaborators("https://raw.githubusercontent.com/Apicurio/api-samples/master/not-available/not-available.json");
			Assert.fail("Expected NotFoundException");
		} catch (NotFoundException e) {
		}
    }

    /**
     * Test method for {@link io.apicurio.hub.api.github.GitHubSourceConnector#getResourceContent(String)}.
     */
    @Test
    @Ignore
    public void testGetResourceContent() throws NotFoundException, SourceConnectorException {
        ResourceContent content = service.getResourceContent("https://raw.githubusercontent.com/Apicurio/api-samples/master/apiman-rls/apiman-rls.json");
        Assert.assertTrue(content.getContent().contains("Rate Limiter API"));
        Assert.assertNotNull(content.getSha());
        
        try {
			service.getResourceContent("https://raw.githubusercontent.com/Apicurio/api-samples/master/not-available/not-available.json");
			Assert.fail("Expected NotFoundException");
		} catch (NotFoundException e) {
		}
    }

    /**
     * Test method for {@link io.apicurio.hub.api.github.GitHubSourceConnector#getOrganizations()}.
     */
    @Test
    @Ignore
    public void testGetOrganizations() throws GitHubException, SourceConnectorException {
        Collection<GitHubOrganization> organizations = service.getOrganizations();
        Assert.assertNotNull(organizations);
        Assert.assertTrue(organizations.size() > 0);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.github.GitHubSourceConnector#getRepositories(String)}.
     */
    @Test
    @Ignore
    public void testGetRepositories() throws GitHubException, SourceConnectorException {
        Collection<GitHubRepository> repositories = service.getRepositories("EricWittmann");
        Assert.assertNotNull(repositories);
        System.out.println("Found " + repositories.size() + " repositories!");
        repositories.forEach( repo -> {
            System.out.println("\t" + repo.getName());
        });
        Assert.assertTrue(repositories.size() > 0);
    }

    /**
     * Test method for {@link io.apicurio.hub.api.github.GitHubSourceConnector#getRepositories(String)}.
     */
    @Test
    public void testParseLinkHeader() {
        Map<String, String> map = GitHubSourceConnector.parseLinkHeader("<https://api.github.com/user/1890703/repos?page=2>; rel=\"next\", <https://api.github.com/user/1890703/repos?page=3>; rel=\"last\"");
        Assert.assertNotNull(map);
        Assert.assertEquals(2, map.size());
        Assert.assertEquals("https://api.github.com/user/1890703/repos?page=2", map.get("next"));
        Assert.assertEquals("https://api.github.com/user/1890703/repos?page=3", map.get("last"));
    }
    
}
