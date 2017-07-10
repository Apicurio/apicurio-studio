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

import com.mashape.unirest.request.HttpRequest;

import io.apicurio.hub.api.beans.ApiDesignResourceInfo;
import io.apicurio.hub.api.beans.Collaborator;
import io.apicurio.hub.api.beans.ResourceContent;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.studio.shared.beans.User;
import test.io.apicurio.hub.api.MockSecurityContext;
import test.io.apicurio.hub.api.TestUtil;

/**
 * @author eric.wittmann@gmail.com
 */
@Ignore
public class GitHubServiceTest {
    
    // Add your github token here but don't commit it!!
    private static final String GITHUB_AUTH_TOKEN = "3ed0985cc1c120cc68e830455595357b4707e1c3";
    private static final String GITHUB_USERNAME = "EricWittmann";

    private IGitHubService service;

    @Before
    public void setUp() {
        service = new GitHubService();
        TestUtil.setPrivateField(service, "security", new MockSecurityContext());
    }
    
    @After
    public void tearDown() throws Exception {
    }

    /**
     * Test method for {@link io.apicurio.hub.api.github.GitHubService#validateResourceExists(java.lang.String)}.
     */
    @Test
    public void testValidateResourceExists() throws NotFoundException, GitHubException {
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
     * Test method for {@link io.apicurio.hub.api.github.GitHubService#getCollaborators(String)}.
     */
    @Test
    public void testGetCollaborators() throws NotFoundException, GitHubException {
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
     * Test method for {@link io.apicurio.hub.api.github.GitHubService#getResourceContent(String)}.
     */
    @Test
    public void testGetResourceContent() throws NotFoundException, GitHubException {
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
     * Test method for {@link io.apicurio.hub.api.github.GitHubService#getOrganizations()}.
     */
    @Test
    public void testGetOrganizations() throws GitHubException {
        TestUtil.setPrivateField(service, "security", new MockSecurityContext() {
            @Override
            public void addSecurity(HttpRequest request) {
                request.header("Authorization", "token " + GITHUB_AUTH_TOKEN);
            }
        });

        Collection<String> organizations = service.getOrganizations();
        Assert.assertNotNull(organizations);
        Assert.assertTrue(organizations.size() > 0);
        Assert.assertTrue(organizations.contains("apiman"));
    }

    /**
     * Test method for {@link io.apicurio.hub.api.github.GitHubService#getRepositories(String)}.
     */
    @Test
    public void testGetRepositories() throws GitHubException {
        TestUtil.setPrivateField(service, "security", new MockSecurityContext() {
            @Override
            public User getCurrentUser() {
                User user = super.getCurrentUser();
                user.setLogin(GITHUB_USERNAME);
                return user;
            }
            @Override
            public void addSecurity(HttpRequest request) {
                request.header("Authorization", "token " + GITHUB_AUTH_TOKEN);
            }
        });

        Collection<String> repositories = service.getRepositories("EricWittmann");
        Assert.assertNotNull(repositories);
        System.out.println("Found " + repositories.size() + " repositories!");
        repositories.forEach( repo -> {
            System.out.println("\t" + repo);
        });
        Assert.assertTrue(repositories.size() > 0);
        Assert.assertTrue(repositories.contains("apiman"));
    }

    /**
     * Test method for {@link io.apicurio.hub.api.github.GitHubService#getRepositories(String)}.
     */
    @Test
    public void testParseLinkHeader() {
        Map<String, String> map = GitHubService.parseLinkHeader("<https://api.github.com/user/1890703/repos?page=2>; rel=\"next\", <https://api.github.com/user/1890703/repos?page=3>; rel=\"last\"");
        Assert.assertNotNull(map);
        Assert.assertEquals(2, map.size());
        Assert.assertEquals("https://api.github.com/user/1890703/repos?page=2", map.get("next"));
        Assert.assertEquals("https://api.github.com/user/1890703/repos?page=3", map.get("last"));
    }
    
}
