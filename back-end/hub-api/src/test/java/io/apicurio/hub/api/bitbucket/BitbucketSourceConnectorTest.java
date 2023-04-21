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

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Properties;

import kong.unirest.UnirestException;
import org.apache.commons.codec.binary.Base64;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;

import io.apicurio.hub.api.beans.BitbucketRepository;
import io.apicurio.hub.api.beans.BitbucketTeam;
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
public class BitbucketSourceConnectorTest {

    private BitbucketSourceConnector service;
    private HubConfiguration config;
    private BitbucketResourceResolver resolver;
    
    private static String basicAuth = null;
    
    @BeforeClass
    public static void globalSetUp() {
        File credsFile = new File(".bitbucket");
        if (!credsFile.isFile()) {
            return;
        }
        System.out.println("Loading Bitbucket credentials from: " + credsFile.getAbsolutePath());
        try (Reader reader = new FileReader(credsFile)) {
            Properties props = new Properties();
            props.load(reader);
            String userPass = props.getProperty("username") + ":" + props.getProperty("password");
            basicAuth = Base64.encodeBase64String(userPass.getBytes(StandardCharsets.UTF_8));
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Before
    public void setUp() {
        service = new BitbucketSourceConnector() {
            @Override
            protected String getExternalToken() throws SourceConnectorException {
                if (basicAuth == null) {
                    File credsFile = new File(".bitbucket");
                    throw new SourceConnectorException("Missing Bitbucket credentials.  Expected a Java properties file with Bitbucket 'username' and 'password' (personal or App password) located here: " + credsFile.getAbsolutePath());
                }
                return basicAuth;
            }

            /**
             * @see BitbucketSourceConnector#getExternalTokenType()
             */
            @Override
            protected Object getExternalTokenType() {
                return BitbucketSourceConnector.TOKEN_TYPE_BASIC;
            }
        };
        config = new HubConfiguration();
        resolver = new BitbucketResourceResolver();

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
    @Ignore
    public void testGetTeams() throws SourceConnectorException, BitbucketException {
        Collection<BitbucketTeam> teams = service.getTeams();
        Assert.assertNotNull(teams);
        Assert.assertFalse(teams.isEmpty());
        teams.forEach(team -> {
            System.out.println("Found team: " + team.getDisplayName() + " -- " + team.getUsername());
        });
    }

    @Test
    @Ignore
    public void testGetRepositories() throws SourceConnectorException, BitbucketException {
        String team = "apicurio";
        
        System.setProperty("apicurio.repository.filter", "oai");

        Collection<BitbucketRepository> repos = service.getRepositories(team);
        Assert.assertNotNull(repos);
        Assert.assertFalse(repos.isEmpty());
        
        repos.forEach( repo -> {
            System.out.println("Found repository: " + repo.getName() + " -- " + repo.getSlug());
        });
    }

    @Test
    @Ignore
    public void testGetBranches() throws SourceConnectorException, BitbucketException {
        String team = "apicurio";
        String repo = "apicurio-test";

        Collection<SourceCodeBranch> branches = service.getBranches(team, repo);
        Assert.assertNotNull(branches);
        Assert.assertFalse(branches.isEmpty());
        
        branches.forEach( branch -> {
            System.out.println("Found branch: " + branch.getName() + " -- " + branch.getCommitId());
        });
    }

    @Test
    @Ignore
    public void testGetResourceContent() throws SourceConnectorException, BitbucketException, NotFoundException {
        String url = "https://bitbucket.org/apicurio/apicurio-test/src/46163f44a4a398e0101ee9ff10affbbf57e066f9/apis/pet-store.json?at=master&fileviewer=file-view-default";

        ResourceContent content = service.getResourceContent(url);
        Assert.assertNotNull(content);
        Assert.assertNotNull(content.getSha());
        Assert.assertNotNull(content.getContent());
    }

    @Test
    @Ignore
    public void testValidateResourceExists() throws SourceConnectorException, BitbucketException, NotFoundException, ApiValidationException {
        String url = "https://bitbucket.org/apicurio/apicurio-test/src/46163f44a4a398e0101ee9ff10affbbf57e066f9/apis/pet-store.json?at=master&fileviewer=file-view-default";
        ApiDesignResourceInfo info = service.validateResourceExists(url);
        Assert.assertNotNull(info);

        url = "https://bitbucket.org/apicurio/apicurio-test/src/master/apis/pet-store.json";
        info = service.validateResourceExists(url);
        Assert.assertNotNull(info);

        url = "https://bitbucket.org/apicurio/apicurio-test/src/master/apis/NOT-FOUND.json";
        try {
            service.validateResourceExists(url);
            Assert.fail("Expected a NotFoundException!");
        } catch (NotFoundException e) {
            // This is what we expect
        }
    }

    @Test
    @Ignore
    public void testCreateResourceContent() throws SourceConnectorException, BitbucketException, NotFoundException, UnirestException {
        String url = "https://bitbucket.org/apicurio/apicurio-test/src/master/junit-apis/api-" + System.currentTimeMillis() + ".json";
        String content = "{\"swagger\":\"2.0\",\"info\":{\"title\":\"hello\",\"description\":\"hello\",\"version\":\"1.0.0\"}}";
        service.createResourceContent(url, "testing new message commit message for all", content);

        // Already exists - should error out.
        url = "https://bitbucket.org/apicurio/apicurio-test/src/master/junit-apis/already-exists.json";
        content = "{\"swagger\":\"2.0\",\"info\":{\"title\":\"hello\",\"description\":\"hello\",\"version\":\"1.0.0\"}}";
        try {
            service.createResourceContent(url, "testing new message commit message for all", content);
        } catch (SourceConnectorException e) {
            // Expected this
            Assert.assertTrue(e.getMessage().contains("already exists"));
        }
    }
    
    @Test
    @Ignore
    public void testUpdateResourceContent() throws SourceConnectorException, BitbucketException, NotFoundException,
            UnirestException, JsonProcessingException, IOException {
        String repositoryUrl = "https://bitbucket.org/apicurio/apicurio-test/src/1b684236c6434bc5c6644cbf62c46bbd8d40f3d1/junit-apis/test-update-content.json?at=master&fileviewer=file-view-default";
        
        ResourceContent content = service.getResourceContent(repositoryUrl);
        Assert.assertTrue(content.getContent().contains("swagger"));
        
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(content.getContent());
        ObjectNode info = (ObjectNode) root.get("info");
        long newVersion = System.currentTimeMillis();
        info.set("version", TextNode.valueOf(String.valueOf(newVersion)));
        
        System.out.println("Setting new version to: " + newVersion);
        
        String newContent = mapper.writeValueAsString(root);
        content.setContent(newContent);
        String newSha = service.updateResourceContent(repositoryUrl, "Unit Test: Update Content", "Updated the version of: " + repositoryUrl, content);
        System.out.println("New SHA: " + newSha);
    }
}
