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

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Collection;
import java.util.Date;
import java.util.Map;
import java.util.Properties;
import java.util.zip.ZipInputStream;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;

import io.apicurio.hub.api.beans.GitHubOrganization;
import io.apicurio.hub.api.beans.GitHubRepository;
import io.apicurio.hub.api.beans.ResourceContent;
import io.apicurio.hub.api.beans.SourceCodeBranch;
import io.apicurio.hub.api.connectors.SourceConnectorException;
import io.apicurio.hub.core.beans.ApiDesignResourceInfo;
import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.exceptions.ApiValidationException;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.test.core.TestUtil;
import test.io.apicurio.hub.api.MockSecurityContext;

/**
 * @author eric.wittmann@gmail.com
 */
public class GitHubSourceConnectorTest {
    
    private static String githubToken = null;

    private GitHubSourceConnector service;
    private GitHubResourceResolver resolver;
    private HubConfiguration config;

    @BeforeClass
    public static void globalSetUp() {
        File credsFile = new File(".github");
        if (!credsFile.isFile()) {
            return;
        }
        System.out.println("Loading GitHub credentials from: " + credsFile.getAbsolutePath());
        try (Reader reader = new FileReader(credsFile)) {
            Properties props = new Properties();
            props.load(reader);
            githubToken = props.getProperty("pat");
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Before
    public void setUp() {
        service = new GitHubSourceConnector() {
            @Override
            protected String getExternalToken() throws SourceConnectorException {
            	try {
                    if (githubToken == null) {
                        // Read the Personal Access Token from standard input so we don't accidentally check it in.
                        // This is a PITA because we have to copy/paste our PAT every time we run this test.  But it's 
                        // better than accidentally checking in a GitLab PAT!!
                        System.out.println("Enter your GitHub Personal Access Token:");
                        githubToken = new BufferedReader(new InputStreamReader(System.in)).readLine();
                    }
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                return githubToken;
            }
        };
        config = new HubConfiguration();
        resolver = new GitHubResourceResolver();

        TestUtil.setPrivateField(resolver, "config", config);
        resolver.postConstruct();

        TestUtil.setPrivateField(service, "security", new MockSecurityContext());
        TestUtil.setPrivateField(service, "config", config);
        TestUtil.setPrivateField(service, "resolver", resolver);
    }
    
    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void testParseExternalTokenResponse() {
        Map<String, String> response = service.parseExternalTokenResponse("access_token=12345&scope=repo%2Cuser%3Aemail&token_type=bearer");
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
    public void testValidateResourceExists() throws NotFoundException, SourceConnectorException, ApiValidationException {
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
     * Test method for {@link io.apicurio.hub.api.github.GitHubSourceConnector#getResourceContent(String)}.
     */
    @Test
    @Ignore
    public void testGetResourceContent() throws NotFoundException, SourceConnectorException {
        ResourceContent content = service.getResourceContent("https://github.com/EricWittmann/api-samples/blob/other-branch/3.0-other/simple-api-other.json");
        Assert.assertTrue(content.getContent().contains("Simple OAI 3.0.0 API (Other)"));
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
        System.out.println("Found " + organizations.size() + " organizations!");
        organizations.forEach( org -> {
        	System.out.print("\t" + org.getId());
        	if (org.isUserOrg()) {
        		System.out.println(" ***");
        	} else {
        		System.out.println("");
        	}
        });
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
     * Test method for {@link io.apicurio.hub.api.github.GitHubSourceConnector#getBranches(String, String)}.
     */
    @Test
    @Ignore
    public void testGetBranches() throws GitHubException, SourceConnectorException {
        Collection<SourceCodeBranch> branches = service.getBranches("EricWittmann", "api-samples");
        Assert.assertNotNull(branches);
        System.out.println("Found " + branches.size() + " branches!");
        branches.forEach( branch -> {
            System.out.println("\t" + branch.getName());
        });
        Assert.assertTrue(branches.size() > 0);
    }
    
    /**
     * Test method for {@link io.apicurio.hub.api.github.GitHubSourceConnector#createPullRequestFromZipContent(java.util.zip.ZipInputStream)}.
     */
    @Test
    @Ignore
    public void testCreatePullRequestFromZipContent() throws GitHubException, SourceConnectorException {
        ZipInputStream zipInput = new ZipInputStream(getClass().getResourceAsStream("beer-api.zip"));
        Assert.assertNotNull(zipInput);
        String repositoryUrl = resolver.create("EricWittmann", "generated-apis", "master", "/tests/2018-06-06");
        service.createPullRequestFromZipContent(repositoryUrl, "Testing from JUnit: " + new Date(), zipInput);
    }
    
}
