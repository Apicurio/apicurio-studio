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

import java.io.IOException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Comparator;
import java.util.Iterator;
import java.util.TreeSet;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.apicurio.hub.api.beans.ImportApiDesign;
import io.apicurio.hub.api.beans.NewApiDesign;
import io.apicurio.hub.api.connectors.SourceConnectorFactory;
import io.apicurio.hub.api.rest.IDesignsResource;
import io.apicurio.hub.core.beans.ApiContentType;
import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.Collaborator;
import io.apicurio.hub.core.exceptions.AlreadyExistsException;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.hub.core.js.OaiCommandExecutor;
import io.apicurio.test.core.TestUtil;
import test.io.apicurio.hub.api.MockEditingSessionManager;
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
    private OaiCommandExecutor commandExecutor;
    private SourceConnectorFactory sourceConnectorFactory;
    private MockMetrics metrics;

    @Before
    public void setUp() {
        resource = new DesignsResource();

        storage = new MockStorage();
        security = new MockSecurityContext();
        metrics = new MockMetrics();
        commandExecutor = new OaiCommandExecutor();
        editingSessionManager = new MockEditingSessionManager();

        sourceConnectorFactory = new SourceConnectorFactory();
        github = new MockGitHubService();
        TestUtil.setPrivateField(sourceConnectorFactory, "gitHub", github);

        TestUtil.setPrivateField(resource, "storage", storage);
        TestUtil.setPrivateField(resource, "sourceConnectorFactory", sourceConnectorFactory);
        TestUtil.setPrivateField(resource, "security", security);
        TestUtil.setPrivateField(resource, "metrics", metrics);
        TestUtil.setPrivateField(resource, "oaiCommandExecutor", commandExecutor);
        TestUtil.setPrivateField(resource, "editingSessionManager", editingSessionManager);
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
    public void testListDesigns() throws ServerError, AlreadyExistsException, NotFoundException {
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
    public void testImportDesign_GitHub() throws ServerError, AlreadyExistsException, NotFoundException {
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
    public void testImportDesign_Url() throws ServerError, AlreadyExistsException, NotFoundException {
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
    public void testCreateDesign() throws ServerError, AlreadyExistsException {
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
    }

    @Test
    public void testDeleteDesign() throws ServerError, AlreadyExistsException, NotFoundException {
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
    public void testEditDesign() throws ServerError, AlreadyExistsException, NotFoundException, InterruptedException {
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
    public void testGetCollaborators() throws ServerError, AlreadyExistsException, NotFoundException, InterruptedException {
        ImportApiDesign info = new ImportApiDesign();
        info.setUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        ApiDesign design = resource.importDesign(info);

        Collection<Collaborator> collaborators = resource.getCollaborators(design.getId());
        Assert.assertNotNull(collaborators);
        Assert.assertFalse(collaborators.isEmpty());
        Assert.assertEquals(1, collaborators.size());
        Collaborator collaborator = collaborators.iterator().next();
        Assert.assertEquals(1, collaborator.getEdits());
        Assert.assertEquals("user", collaborator.getName());

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
    public void testGetContent() throws ServerError, AlreadyExistsException, NotFoundException, InterruptedException, JsonProcessingException, IOException {
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
        Response content = resource.getContent(design.getId(), null);
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
        
        content = resource.getContent(design.getId(), "yaml");
        Assert.assertNotNull(content);
        Assert.assertEquals(new MediaType("application", "x-yaml", StandardCharsets.UTF_8.name()), content.getMediaType());
        String actualYaml = content.getEntity().toString();
        Assert.assertNotNull(actualYaml);
        // TODO need a better test to assert that the content is really the expected YAML
        Assert.assertFalse(actualYaml.charAt(0) == '{');
        Assert.assertTrue(actualYaml.startsWith("---"));
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
