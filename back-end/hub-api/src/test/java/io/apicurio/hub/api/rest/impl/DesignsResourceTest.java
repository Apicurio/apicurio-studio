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

package io.apicurio.hub.api.rest.impl;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Comparator;
import java.util.Iterator;
import java.util.TreeSet;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.apicurio.hub.api.beans.ImportApiDesign;
import io.apicurio.hub.api.beans.NewApiDesign;
import io.apicurio.hub.api.beans.UpdateCollaborator;
import io.apicurio.hub.api.bitbucket.BitbucketResourceResolver;
import io.apicurio.hub.api.connectors.SourceConnectorFactory;
import io.apicurio.hub.api.github.GitHubResourceResolver;
import io.apicurio.hub.api.gitlab.GitLabResourceResolver;
import io.apicurio.hub.api.rest.IDesignsResource;
import io.apicurio.hub.core.auth.IAuthorizationService;
import io.apicurio.hub.core.auth.impl.AuthorizationService;
import io.apicurio.hub.core.beans.ApiContentType;
import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.ApiDesignCollaborator;
import io.apicurio.hub.core.beans.ApiDesignType;
import io.apicurio.hub.core.beans.Contributor;
import io.apicurio.hub.core.beans.Invitation;
import io.apicurio.hub.core.beans.SharingConfiguration;
import io.apicurio.hub.core.beans.SharingLevel;
import io.apicurio.hub.core.beans.UpdateSharingConfiguration;
import io.apicurio.hub.core.cmd.OaiCommandExecutor;
import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.content.AbsoluteReferenceResolver;
import io.apicurio.hub.core.content.ContentAccessibilityAsserter;
import io.apicurio.hub.core.content.SharedReferenceResolver;
import io.apicurio.hub.core.exceptions.AccessDeniedException;
import io.apicurio.hub.core.exceptions.AlreadyExistsException;
import io.apicurio.hub.core.exceptions.ApiValidationException;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.test.core.TestUtil;
import test.io.apicurio.hub.api.MockEditingSessionManager;
import test.io.apicurio.hub.api.MockEventsService;
import test.io.apicurio.hub.api.MockGitHubService;
import test.io.apicurio.hub.api.MockMetrics;
import test.io.apicurio.hub.api.MockSecurityContext;
import test.io.apicurio.hub.api.MockStorage;
import test.io.apicurio.hub.api.MockStorage.MockContentRow;

/**
 * @author eric.wittmann@gmail.com
 */
public class DesignsResourceTest {

    private IDesignsResource resource;

    private MockStorage storage;
    private MockSecurityContext security;
    private MockGitHubService github;
    private MockEditingSessionManager editingSessionManager;
    private HubConfiguration config;
    private OaiCommandExecutor commandExecutor;
    private SourceConnectorFactory sourceConnectorFactory;
    private GitHubResourceResolver gitHubResolver;
    private GitLabResourceResolver gitLabResolver;
    private BitbucketResourceResolver bitbucketResolver;
    private MockMetrics metrics;
    private MockEventsService eventsService;
    private IAuthorizationService authorizationService;
    private ContentAccessibilityAsserter accessibilityAsserter;
    private AbsoluteReferenceResolver absoluteResolver;
    private SharedReferenceResolver sharedReferenceResolver;

    @Before
    public void setUp() {
        resource = new DesignsResource();

        config = new HubConfiguration();
        storage = new MockStorage();
        security = new MockSecurityContext();
        metrics = new MockMetrics();
        commandExecutor = new OaiCommandExecutor();
        editingSessionManager = new MockEditingSessionManager();
        gitHubResolver = new GitHubResourceResolver();
        gitLabResolver = new GitLabResourceResolver();
        bitbucketResolver = new BitbucketResourceResolver();
        eventsService = new MockEventsService();
        authorizationService = new AuthorizationService();
        accessibilityAsserter = new ContentAccessibilityAsserter();
        absoluteResolver = new AbsoluteReferenceResolver();
        sharedReferenceResolver = new SharedReferenceResolver();

        sourceConnectorFactory = new SourceConnectorFactory();
        github = new MockGitHubService();
        TestUtil.setPrivateField(sourceConnectorFactory, "gitHub", github);
        TestUtil.setPrivateField(sourceConnectorFactory, "gitHubResolver", gitHubResolver);
        TestUtil.setPrivateField(sourceConnectorFactory, "gitLabResolver", gitLabResolver);
        TestUtil.setPrivateField(sourceConnectorFactory, "bitbucketResolver", bitbucketResolver);

        TestUtil.setPrivateField(gitHubResolver, "config", config);
        gitHubResolver.postConstruct();
        TestUtil.setPrivateField(gitLabResolver, "config", config);
        gitLabResolver.postConstruct();
        TestUtil.setPrivateField(bitbucketResolver, "config", config);
        bitbucketResolver.postConstruct();

        TestUtil.setPrivateField(authorizationService, "config", config);
        TestUtil.setPrivateField(authorizationService, "storage", storage);

        TestUtil.setPrivateField(accessibilityAsserter, "absoluteResolver", absoluteResolver);
        TestUtil.setPrivateField(accessibilityAsserter, "sharedReferenceResolver", sharedReferenceResolver);

        TestUtil.setPrivateField(sharedReferenceResolver, "storage", storage);

        TestUtil.setPrivateField(resource, "storage", storage);
        TestUtil.setPrivateField(resource, "sourceConnectorFactory", sourceConnectorFactory);
        TestUtil.setPrivateField(resource, "security", security);
        TestUtil.setPrivateField(resource, "metrics", metrics);
        TestUtil.setPrivateField(resource, "oaiCommandExecutor", commandExecutor);
        TestUtil.setPrivateField(resource, "editingSessionManager", editingSessionManager);
        TestUtil.setPrivateField(resource, "gitHubResolver", gitHubResolver);
        TestUtil.setPrivateField(resource, "gitLabResolver", gitLabResolver);
        TestUtil.setPrivateField(resource, "bitbucketResolver", bitbucketResolver);
        TestUtil.setPrivateField(resource, "eventsService", eventsService);
        TestUtil.setPrivateField(resource, "authorizationService", authorizationService);
        TestUtil.setPrivateField(resource, "accessibilityAsserter", accessibilityAsserter);
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void testListDesignsEmpty() throws ServerError {
        Collection<ApiDesign> apis = resource.listDesigns();
        Assert.assertNotNull(apis);
    }

    @Test
    public void testListDesigns() throws ServerError, AlreadyExistsException, NotFoundException, ApiValidationException {
        ImportApiDesign info = new ImportApiDesign();
        info.setUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        resource.importDesign(info);
        info = new ImportApiDesign();
        info.setUrl("https://github.com/Apicurio/api-samples/blob/master/apiman-rls/apiman-rls.json");
        resource.importDesign(info);

        Collection<ApiDesign> apis = resource.listDesigns();
        Assert.assertNotNull(apis);
        Assert.assertEquals(2, apis.size());

        TreeSet<ApiDesign> sortedApis = new TreeSet<>(new Comparator<ApiDesign>() {
            @Override
            public int compare(ApiDesign o1, ApiDesign o2) {
                return o1.getName().compareTo(o2.getName());
            }
        });
        sortedApis.addAll(apis);

        Iterator<ApiDesign> iter = sortedApis.iterator();
        ApiDesign design1 = iter.next();
        ApiDesign design2 = iter.next();

        Assert.assertNotNull(design1);
        Assert.assertNotNull(design2);

        Assert.assertEquals("apiman-rls.json", design1.getName());
        Assert.assertEquals("pet-store.json", design2.getName());

        String ghLog = github.auditLog();
        Assert.assertNotNull(ghLog);
        Assert.assertEquals(
                "---\n" +
                "validateResourceExists::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" +
                "getResourceContent::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" +
                "validateResourceExists::https://github.com/Apicurio/api-samples/blob/master/apiman-rls/apiman-rls.json\n" +
                "getResourceContent::https://github.com/Apicurio/api-samples/blob/master/apiman-rls/apiman-rls.json\n" +
                "---",
                ghLog);
    }

    @Test
    public void testImportDesign_GitHub() throws ServerError, AlreadyExistsException, NotFoundException, ApiValidationException {
        ImportApiDesign info = new ImportApiDesign();
        info.setUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        ApiDesign design = resource.importDesign(info);
        Assert.assertNotNull(design);
        Assert.assertEquals("1", design.getId());
        Assert.assertEquals("user", design.getCreatedBy());

        String ghLog = github.auditLog();
        Assert.assertNotNull(ghLog);
        Assert.assertEquals(
                "---\n" +
                "validateResourceExists::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" +
                "getResourceContent::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" +
                "---",
                ghLog);
    }

    @Test
    public void testImportDesign_Url() throws ServerError, AlreadyExistsException, NotFoundException, ApiValidationException {
        URL resourceUrl = getClass().getResource("DesignsResourceTest_import.json");

        ImportApiDesign info = new ImportApiDesign();
        info.setUrl(resourceUrl.toExternalForm());
        ApiDesign design = resource.importDesign(info);
        Assert.assertNotNull(design);
        Assert.assertEquals("1", design.getId());
        Assert.assertEquals("user", design.getCreatedBy());
        Assert.assertEquals("Rate Limiter API", design.getName());
        Assert.assertEquals("A REST API used by clients to access the standalone Rate Limiter micro-service.", design.getDescription());

        String ghLog = github.auditLog();
        Assert.assertNotNull(ghLog);
        Assert.assertEquals("---\n" +
                "---", ghLog);
    }

    @Test
    public void testImportDesign_Data() throws ServerError, AlreadyExistsException, NotFoundException, IOException, ApiValidationException {
        URL resourceUrl = getClass().getResource("DesignsResourceTest_import.json");
        String rawData = IOUtils.toString(resourceUrl, Charset.forName("UTF-8"));
        String b64Data = Base64.encodeBase64String(rawData.getBytes());

        ImportApiDesign info = new ImportApiDesign();
        info.setData(b64Data);
        ApiDesign design = resource.importDesign(info);
        Assert.assertNotNull(design);
        Assert.assertEquals("1", design.getId());
        Assert.assertEquals("user", design.getCreatedBy());
        Assert.assertEquals("Rate Limiter API", design.getName());
        Assert.assertEquals("A REST API used by clients to access the standalone Rate Limiter micro-service.", design.getDescription());

        String ghLog = github.auditLog();
        Assert.assertNotNull(ghLog);
        Assert.assertEquals("---\n" +
                "---", ghLog);

        info.setData("Invalid Data");
        try {
            resource.importDesign(info);
            Assert.fail("Expected a ServerError here.");
        } catch (ApiValidationException se) {
            // OK!
        }
    }

    @Test
    public void testImportDesign_Data_GraphQL() throws ServerError, AlreadyExistsException, NotFoundException, IOException, ApiValidationException {
        URL resourceUrl = getClass().getResource("DesignsResourceTest_import.graphql");
        String rawData = IOUtils.toString(resourceUrl, Charset.forName("UTF-8"));
        String b64Data = Base64.encodeBase64String(rawData.getBytes());

        ImportApiDesign info = new ImportApiDesign();
        info.setData(b64Data);
        ApiDesign design = resource.importDesign(info);
        Assert.assertNotNull(design);
        Assert.assertEquals("1", design.getId());
        Assert.assertEquals("user", design.getCreatedBy());
        Assert.assertEquals("Imported GraphQL Schema", design.getName());
        Assert.assertEquals("An imported GraphQL schema with the following 5 types: CacheControlScope, Continent, Country, Language, Query", design.getDescription());
    }

    @Test
    public void testCreateDesign() throws Exception {
        NewApiDesign info = new NewApiDesign();
        info.setSpecVersion("2.0");
        info.setName("My API");
        info.setDescription("Description of my API.");
        ApiDesign design = resource.createDesign(info);
        Assert.assertNotNull(design);
        Assert.assertEquals(info.getName(), design.getName());
        Assert.assertEquals(info.getDescription(), design.getDescription());
        Assert.assertEquals("1", design.getId());
        Assert.assertEquals("user", design.getCreatedBy());

        String ghLog = github.auditLog();
        Assert.assertNotNull(ghLog);
        Assert.assertEquals(
                "---\n" +
                "---",
                ghLog);

        Response response = resource.getContent(design.getId(), "json", null);
        String content = response.getEntity().toString();
        JsonNode jsonData = new ObjectMapper().reader().readTree(content);
        String version = jsonData.get("info").get("version").asText();
        Assert.assertEquals("1.0.0", version);
        String oaiVersion = jsonData.get("swagger").asText();
        Assert.assertEquals("2.0", oaiVersion);


        // 3.0 document
        info = new NewApiDesign();
        info.setSpecVersion("3.0.2");
        info.setName("My 3.0 API");
        info.setDescription("Description of my 3.0 API.");
        design = resource.createDesign(info);
        Assert.assertNotNull(design);
        Assert.assertEquals(info.getName(), design.getName());
        Assert.assertEquals(info.getDescription(), design.getDescription());
        Assert.assertEquals("2", design.getId());
        Assert.assertEquals("user", design.getCreatedBy());

        response = resource.getContent(design.getId(), "json", null);
        content = response.getEntity().toString();
        jsonData = new ObjectMapper().reader().readTree(content);
        version = jsonData.get("info").get("version").asText();
        Assert.assertEquals("1.0.0", version);
        oaiVersion = jsonData.get("openapi").asText();
        Assert.assertEquals("3.0.2", oaiVersion);

        // 3.0 document (type)
        info = new NewApiDesign();
        info.setType(ApiDesignType.OpenAPI30);
        info.setName("Empty 3.0 API");
        info.setDescription("Description of API.");
        design = resource.createDesign(info);
        Assert.assertNotNull(design);
        Assert.assertEquals(info.getName(), design.getName());
        Assert.assertEquals(info.getDescription(), design.getDescription());

        response = resource.getContent(design.getId(), "json", null);
        content = response.getEntity().toString();
        jsonData = new ObjectMapper().reader().readTree(content);
        version = jsonData.get("info").get("version").asText();
        Assert.assertEquals("1.0.0", version);
        oaiVersion = jsonData.get("openapi").asText();
        Assert.assertEquals("3.0.2", oaiVersion);

        // AsyncAPI document
        info = new NewApiDesign();
        info.setType(ApiDesignType.AsyncAPI20);
        info.setName("Async 3.0 API");
        info.setDescription("Description of async API.");
        design = resource.createDesign(info);
        Assert.assertNotNull(design);
        Assert.assertEquals(info.getName(), design.getName());
        Assert.assertEquals(info.getDescription(), design.getDescription());

        response = resource.getContent(design.getId(), "json", null);
        content = response.getEntity().toString();
        jsonData = new ObjectMapper().reader().readTree(content);
        version = jsonData.get("info").get("version").asText();
        Assert.assertEquals("1.0.0", version);
        oaiVersion = jsonData.get("asyncapi").asText();
        Assert.assertEquals("2.0.0", oaiVersion);

        // GraphQL document
        info = new NewApiDesign();
        info.setType(ApiDesignType.GraphQL);
        info.setName("GraphQL API");
        info.setDescription("Description of GraphQL API.");
        design = resource.createDesign(info);
        Assert.assertNotNull(design);
        Assert.assertEquals(info.getName(), design.getName());
        Assert.assertEquals(info.getDescription(), design.getDescription());

        response = resource.getContent(design.getId(), "sdl", null);
        content = response.getEntity().toString();
        Assert.assertNotNull(content);
        Assert.assertTrue(content.startsWith("# GraphQL Schema 'GraphQL API' created"));
    }

    @Test
    public void testDeleteDesign() throws ServerError, AlreadyExistsException, NotFoundException, ApiValidationException {
        ImportApiDesign info = new ImportApiDesign();
        info.setUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        ApiDesign design = resource.importDesign(info);
        String designId = design.getId();
        Assert.assertEquals("1", designId);

        resource.deleteDesign(designId);

        try {
            resource.getDesign(designId);
            Assert.fail("Expected a NotFoundException");
        } catch (NotFoundException e) {
            // should get here
        }

        String ghLog = github.auditLog();
        Assert.assertNotNull(ghLog);
        Assert.assertEquals(
                "---\n" +
                "validateResourceExists::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" +
                "getResourceContent::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" +
                "---",
                ghLog);
    }

    @Test
    public void testUpdateDesign() throws Exception {
        NewApiDesign info = new NewApiDesign();
        info.setSpecVersion("2.0");
        info.setName("My API");
        info.setDescription("Description of my API.");
        ApiDesign design = resource.createDesign(info);
        Assert.assertNotNull(design);
        Assert.assertEquals(info.getName(), design.getName());
        Assert.assertEquals(info.getDescription(), design.getDescription());
        Assert.assertEquals("1", design.getId());
        Assert.assertEquals("user", design.getCreatedBy());

        Response response = resource.getContent(design.getId(), "json", null);
        String content = response.getEntity().toString();
        JsonNode jsonData = new ObjectMapper().reader().readTree(content);
        String version = jsonData.get("info").get("version").asText();
        Assert.assertEquals("1.0.0", version);
        String oaiVersion = jsonData.get("swagger").asText();
        Assert.assertEquals("2.0", oaiVersion);

        // Now update the content
        URL resourceUrl = getClass().getResource("DesignsResourceTest_update.json");
        String rawData = IOUtils.toString(resourceUrl, Charset.forName("UTF-8"));
        ByteArrayInputStream istream = new ByteArrayInputStream(rawData.getBytes());
        resource.updateDesign(design.getId(), istream);

        // Make sure that worked!
        response = resource.getContent(design.getId(), "json", null);
        content = response.getEntity().toString();
        jsonData = new ObjectMapper().reader().readTree(content);
        version = jsonData.get("info").get("version").asText();
        Assert.assertEquals("1.0.1", version);
        oaiVersion = jsonData.get("swagger").asText();
        Assert.assertEquals("2.0", oaiVersion);
        Assert.assertEquals(rawData, content);
    }

    @Test
    public void testUpdateDesign_GraphQL() throws Exception {
        NewApiDesign info = new NewApiDesign();
        info.setType(ApiDesignType.GraphQL);
        info.setName("My GraphQL API");
        info.setDescription("Description of my GraphQL API.");
        ApiDesign design = resource.createDesign(info);
        Assert.assertNotNull(design);
        Assert.assertEquals(info.getName(), design.getName());
        Assert.assertEquals(info.getDescription(), design.getDescription());
        Assert.assertEquals("1", design.getId());
        Assert.assertEquals("user", design.getCreatedBy());

        Response response = resource.getContent(design.getId(), "sdl", null);
        String content = response.getEntity().toString();
        Assert.assertTrue(content.startsWith("# GraphQL Schema 'My GraphQL API'"));

        // Now update the content
        URL resourceUrl = getClass().getResource("DesignsResourceTest_update.graphql");
        String rawData = IOUtils.toString(resourceUrl, Charset.forName("UTF-8"));
        ByteArrayInputStream istream = new ByteArrayInputStream(rawData.getBytes());
        resource.updateDesign(design.getId(), istream);

        // Make sure that worked!
        response = resource.getContent(design.getId(), "sdl", null);
        content = response.getEntity().toString();
        Assert.assertEquals(rawData, content);
    }

    @Test
    public void testEditDesign() throws ServerError, AlreadyExistsException, NotFoundException, InterruptedException, ApiValidationException {
        ImportApiDesign info = new ImportApiDesign();
        info.setUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        ApiDesign design = resource.importDesign(info);
        Assert.assertEquals("1", design.getId());
        Assert.assertEquals("user", design.getCreatedBy());

        String designId = design.getId();

        Response content = resource.editDesign(designId);
        Assert.assertNotNull(content);
        Assert.assertEquals(new MediaType("application", "json", StandardCharsets.UTF_8.name()), content.getMediaType());
        Assert.assertEquals(703, content.getLength());
        Assert.assertEquals(MockGitHubService.STATIC_CONTENT, content.getEntity());
        Assert.assertNotNull(content.getHeaderString("X-Apicurio-EditingSessionUuid"));
        Assert.assertNotNull(content.getHeaderString("X-Apicurio-ContentVersion"));

        String ghLog = github.auditLog();
        Assert.assertNotNull(ghLog);
        Assert.assertEquals(
                "---\n" +
                "validateResourceExists::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" +
                "getResourceContent::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" +
                "---",
                ghLog);
    }

    @Test
    public void testGetConstributors() throws ServerError, AlreadyExistsException, NotFoundException, InterruptedException, ApiValidationException {
        ImportApiDesign info = new ImportApiDesign();
        info.setUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        ApiDesign design = resource.importDesign(info);

        Collection<Contributor> contributors = resource.getContributors(design.getId());
        Assert.assertNotNull(contributors);
        Assert.assertFalse(contributors.isEmpty());
        Assert.assertEquals(1, contributors.size());
        Contributor contributor = contributors.iterator().next();
        Assert.assertEquals(1, contributor.getEdits());
        Assert.assertEquals("user", contributor.getName());

        String ghLog = github.auditLog();
        Assert.assertNotNull(ghLog);
        Assert.assertEquals(
                "---\n" +
                "validateResourceExists::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" +
                "getResourceContent::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" +
                "---",
                ghLog);
    }

    @Test
    public void testGetContent() throws ServerError, AlreadyExistsException, NotFoundException, InterruptedException, JsonProcessingException, IOException, ApiValidationException {
        ImportApiDesign info = new ImportApiDesign();
        info.setUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        ApiDesign design = resource.importDesign(info);

        // Add a command to change the title
        MockContentRow contentRow = new MockContentRow();
        contentRow.createdBy = "user";
        contentRow.data = "{\r\n" +
                "  \"__type\": \"ChangeTitleCommand_20\",\r\n" +
                "  \"_newTitle\": \"testGetContent\"\r\n" +
                "}";
        contentRow.designId = design.getId();
        contentRow.type = ApiContentType.Command;
        this.storage.addContentRow(design.getId(), contentRow);

        // Add a command to change the description
        contentRow = new MockContentRow();
        contentRow.createdBy = "user";
        contentRow.data = "{\r\n" +
                "  \"__type\": \"ChangeDescriptionCommand_20\",\r\n" +
                "  \"_newDescription\": \"Ut enim ad minim veniam.\"\r\n" +
                "}";
        contentRow.designId = design.getId();
        contentRow.type = ApiContentType.Command;
        this.storage.addContentRow(design.getId(), contentRow);

        // Now ask for the content - the most recent Document should be mutated
        // by the two commands above to give a final value.
        Response content = resource.getContent(design.getId(), null, null);
        Assert.assertNotNull(content);
        Assert.assertEquals(new MediaType("application", "json", StandardCharsets.UTF_8.name()), content.getMediaType());

        String expectedOaiDoc = MockGitHubService.STATIC_CONTENT.replace("Swagger Sample App", "testGetContent")
                .replace("This is a sample server Petstore server.", "Ut enim ad minim veniam.");
        String actualOaiDoc = content.getEntity().toString();
        String expected = normalizeJson(expectedOaiDoc);
        String actual = normalizeJson(actualOaiDoc);
        Assert.assertEquals(expected, actual);

        String ghLog = github.auditLog();
        Assert.assertNotNull(ghLog);
        Assert.assertEquals(
                "---\n" +
                "validateResourceExists::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" +
                "getResourceContent::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" +
                "---",
                ghLog);

        content = resource.getContent(design.getId(), "yaml", null);
        Assert.assertNotNull(content);
        Assert.assertEquals(new MediaType("application", "x-yaml", StandardCharsets.UTF_8.name()), content.getMediaType());
        String actualYaml = content.getEntity().toString();
        Assert.assertNotNull(actualYaml);
        // TODO need a better test to assert that the content is really the expected YAML
        Assert.assertFalse(actualYaml.charAt(0) == '{');
        Assert.assertTrue(actualYaml.startsWith("---"));
    }

    @Test
    public void testGetContent_GraphQL() throws ServerError, AlreadyExistsException, NotFoundException, InterruptedException, JsonProcessingException, IOException, ApiValidationException {
        URL resourceUrl = getClass().getResource("DesignsResourceTest_import.graphql");
        String rawData = IOUtils.toString(resourceUrl, Charset.forName("UTF-8"));
        String b64Data = Base64.encodeBase64String(rawData.getBytes());

        ImportApiDesign info = new ImportApiDesign();
        info.setData(b64Data);
        ApiDesign design = resource.importDesign(info);

        // Now ask for the content
        Response content = resource.getContent(design.getId(), null, null);
        Assert.assertNotNull(content);
        Assert.assertEquals(new MediaType("application", "graphql", StandardCharsets.UTF_8.name()), content.getMediaType());

        String actualContent = content.getEntity().toString();
        String expected = rawData;
        Assert.assertEquals(expected, actualContent);

        // TODO enable this when serializing as JSON is supported
//        content = resource.getContent(design.getId(), "json");
//        Assert.assertNotNull(content);
//        Assert.assertEquals(new MediaType("application", "json", StandardCharsets.UTF_8.name()), content.getMediaType());
//        String actualJson = content.getEntity().toString();
//        Assert.assertNotNull(actualJson);
    }

    @Test
    public void testCreateInvitation() throws ServerError, NotFoundException, AccessDeniedException {
        NewApiDesign info = new NewApiDesign();
        info.setSpecVersion("3.0.2");
        info.setName("API: testCreateInvitation");
        ApiDesign design = resource.createDesign(info);
        Assert.assertNotNull(design);

        Invitation invite = resource.createInvitation(design.getId());
        Assert.assertNotNull(invite);
        Assert.assertNotNull(invite.getInviteId());
        Assert.assertNotNull(invite.getCreatedOn());
        Assert.assertEquals("user", invite.getCreatedBy());
        Assert.assertEquals(design.getId(), invite.getDesignId());
        Assert.assertEquals("pending", invite.getStatus());

        this.security.getCurrentUser().setLogin("user2");
        try {
            resource.createInvitation(design.getId());
            Assert.fail("Expected an AccessDeniedException");
        } catch (AccessDeniedException e) {
            // Expected
        } finally {
            this.security.getCurrentUser().setLogin("user");
        }
    }

    @Test
    public void testGetInvitations() throws ServerError, NotFoundException, AccessDeniedException {
        NewApiDesign info = new NewApiDesign();
        info.setSpecVersion("3.0.2");
        info.setName("API: testGetInvitations");
        ApiDesign design = resource.createDesign(info);
        Assert.assertNotNull(design);

        Invitation invite1 = resource.createInvitation(design.getId());
        Assert.assertNotNull(invite1);
        Invitation invite2 = resource.createInvitation(design.getId());
        Assert.assertNotNull(invite2);
        Invitation invite3 = resource.createInvitation(design.getId());
        Assert.assertNotNull(invite3);

        Collection<Invitation> invitations = resource.getInvitations(design.getId());
        Assert.assertNotNull(invitations);
        Assert.assertEquals(3, invitations.size());
    }

    @Test
    public void testGetInvitation() throws ServerError, NotFoundException, AccessDeniedException {
        NewApiDesign info = new NewApiDesign();
        info.setSpecVersion("3.0.2");
        info.setName("API: testGetInvitation");
        ApiDesign design = resource.createDesign(info);
        Assert.assertNotNull(design);

        Invitation invite = resource.createInvitation(design.getId());
        Assert.assertNotNull(invite);

        Invitation theInvite = resource.getInvitation(design.getId(), invite.getInviteId());
        Assert.assertNotNull(theInvite);
        Assert.assertNotNull(theInvite.getInviteId());
        Assert.assertNotNull(theInvite.getCreatedOn());
        Assert.assertEquals("user", theInvite.getCreatedBy());
        Assert.assertEquals(design.getId(), theInvite.getDesignId());
        Assert.assertEquals("pending", theInvite.getStatus());
    }

    @Test
    public void testAcceptInvitation() throws ServerError, NotFoundException, AccessDeniedException {
        NewApiDesign info = new NewApiDesign();
        info.setSpecVersion("3.0.2");
        info.setName("API: testAcceptInvitation");
        ApiDesign design = resource.createDesign(info);
        Assert.assertNotNull(design);

        Invitation invite = resource.createInvitation(design.getId());
        Assert.assertNotNull(invite);

        try {
            resource.acceptInvitation(design.getId(), invite.getInviteId());
            Assert.fail("Expected NotFound");
        } catch (NotFoundException e) {
            // Good
        }

        this.security.getCurrentUser().setLogin("user2");
        try {
            resource.acceptInvitation(design.getId(), invite.getInviteId());
        } finally {
            this.security.getCurrentUser().setLogin("user");
        }


        Invitation theInvite = resource.getInvitation(design.getId(), invite.getInviteId());
        Assert.assertNotNull(theInvite);
        Assert.assertEquals("accepted", theInvite.getStatus());
        Assert.assertEquals("user2", theInvite.getModifiedBy());
    }

    @Test
    public void testRejectInvitation() throws ServerError, NotFoundException, AccessDeniedException {
        NewApiDesign info = new NewApiDesign();
        info.setSpecVersion("3.0.2");
        info.setName("API: testRejectInvitation");
        ApiDesign design = resource.createDesign(info);
        Assert.assertNotNull(design);

        Invitation invite = resource.createInvitation(design.getId());
        Assert.assertNotNull(invite);

        resource.rejectInvitation(design.getId(), invite.getInviteId());

        Invitation theInvite = resource.getInvitation(design.getId(), invite.getInviteId());
        Assert.assertNotNull(theInvite);
        Assert.assertEquals("rejected", theInvite.getStatus());
    }

    @Test
    public void testGetCollaborators() throws ServerError, NotFoundException, AccessDeniedException {
        NewApiDesign info = new NewApiDesign();
        info.setSpecVersion("3.0.2");
        info.setName("API: testGetCollaborators");
        ApiDesign design = resource.createDesign(info);
        Assert.assertNotNull(design);

        Collection<ApiDesignCollaborator> collaborators = resource.getCollaborators(design.getId());
        Assert.assertNotNull(collaborators);
        Assert.assertEquals(1, collaborators.size());
        Assert.assertEquals("user", collaborators.iterator().next().getUserId());
        Assert.assertEquals("owner", collaborators.iterator().next().getRole());

        Invitation invite = resource.createInvitation(design.getId());
        Assert.assertNotNull(invite);

        this.security.getCurrentUser().setLogin("user2");
        try {
            resource.acceptInvitation(design.getId(), invite.getInviteId());
        } finally {
            this.security.getCurrentUser().setLogin("user");
        }

        collaborators = resource.getCollaborators(design.getId());
        Assert.assertNotNull(collaborators);
        Assert.assertEquals(2, collaborators.size());
    }

    @Test
    public void testDeleteCollaborator() throws ServerError, NotFoundException, AccessDeniedException {
        NewApiDesign info = new NewApiDesign();
        info.setSpecVersion("3.0.2");
        info.setName("API: testDeleteCollaborator");
        ApiDesign design = resource.createDesign(info);
        Assert.assertNotNull(design);

        Collection<ApiDesignCollaborator> collaborators = resource.getCollaborators(design.getId());
        Assert.assertNotNull(collaborators);
        Assert.assertEquals(1, collaborators.size());
        Assert.assertEquals("user", collaborators.iterator().next().getUserId());
        Assert.assertEquals("owner", collaborators.iterator().next().getRole());

        Invitation invite = resource.createInvitation(design.getId());
        Assert.assertNotNull(invite);

        this.security.getCurrentUser().setLogin("user2");
        try {
            resource.acceptInvitation(design.getId(), invite.getInviteId());
        } finally {
            this.security.getCurrentUser().setLogin("user");
        }

        collaborators = resource.getCollaborators(design.getId());
        Assert.assertNotNull(collaborators);
        Assert.assertEquals(2, collaborators.size());

        resource.deleteCollaborator(design.getId(), "user2");

        collaborators = resource.getCollaborators(design.getId());
        Assert.assertNotNull(collaborators);
        Assert.assertEquals(1, collaborators.size());
    }

    @Test
    public void testUpdateCollaborator() throws ServerError, NotFoundException, AccessDeniedException {
        NewApiDesign info = new NewApiDesign();
        info.setSpecVersion("3.0.2");
        info.setName("API: testUpdateCollaborator");
        ApiDesign design = resource.createDesign(info);
        Assert.assertNotNull(design);

        Collection<ApiDesignCollaborator> collaborators = resource.getCollaborators(design.getId());
        Assert.assertNotNull(collaborators);
        Assert.assertEquals(1, collaborators.size());
        Assert.assertEquals("user", collaborators.iterator().next().getUserId());
        Assert.assertEquals("owner", collaborators.iterator().next().getRole());

        Invitation invite = resource.createInvitation(design.getId());
        Assert.assertNotNull(invite);

        this.security.getCurrentUser().setLogin("user2");
        try {
            resource.acceptInvitation(design.getId(), invite.getInviteId());
        } finally {
            this.security.getCurrentUser().setLogin("user");
        }

        collaborators = resource.getCollaborators(design.getId());
        Assert.assertNotNull(collaborators);
        Assert.assertEquals(2, collaborators.size());
        Iterator<ApiDesignCollaborator> iterator = collaborators.iterator();
        iterator.next();
        ApiDesignCollaborator collaborator = iterator.next();
        Assert.assertEquals("user2", collaborator.getUserId());
        Assert.assertEquals("collaborator", collaborator.getRole());

        UpdateCollaborator update = new UpdateCollaborator();
        update.setNewRole("owner");
        resource.updateCollaborator(design.getId(), "user2", update);

        collaborators = resource.getCollaborators(design.getId());
        Assert.assertNotNull(collaborators);
        Assert.assertEquals(2, collaborators.size());
        iterator = collaborators.iterator();
        iterator.next();
        collaborator = iterator.next();
        Assert.assertEquals("user2", collaborator.getUserId());
        Assert.assertEquals("owner", collaborator.getRole());
    }

    @Test
    public void testSharing() throws Exception {
        NewApiDesign info = new NewApiDesign();
        info.setSpecVersion("3.0.2");
        info.setName("My Shared API");
        info.setDescription("Description of my shared API.");
        ApiDesign design = resource.createDesign(info);
        Assert.assertNotNull(design);
        Assert.assertEquals(info.getName(), design.getName());
        Assert.assertEquals(info.getDescription(), design.getDescription());
        Assert.assertEquals("1", design.getId());

        SharingConfiguration configuration = resource.getSharingConfiguration("1");
        Assert.assertEquals(SharingLevel.NONE, configuration.getLevel());
        Assert.assertNull(configuration.getUuid());

        UpdateSharingConfiguration update = new UpdateSharingConfiguration();
        update.setLevel(SharingLevel.DOCUMENTATION);
        resource.configureSharing("1", update);

        configuration = resource.getSharingConfiguration("1");
        Assert.assertEquals(SharingLevel.DOCUMENTATION, configuration.getLevel());
        Assert.assertNotNull(configuration.getUuid());

        update = new UpdateSharingConfiguration();
        update.setLevel(SharingLevel.NONE);
        resource.configureSharing("1", update);

        configuration = resource.getSharingConfiguration("1");
        Assert.assertEquals(SharingLevel.NONE, configuration.getLevel());
        Assert.assertNotNull(configuration.getUuid());
    }

    /**
     * Normalizes JSON into a standard format.
     * @param jsonContent
     * @throws IOException
     * @throws JsonProcessingException
     */
    private String normalizeJson(String jsonContent) throws JsonProcessingException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode expectedJson = mapper.readTree(jsonContent);
        String njson = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(expectedJson);
        return njson;
    }

}
