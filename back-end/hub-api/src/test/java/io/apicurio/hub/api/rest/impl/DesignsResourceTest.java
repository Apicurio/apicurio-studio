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

import io.apicurio.hub.api.beans.AddApiDesign;
import io.apicurio.hub.api.beans.ApiDesign;
import io.apicurio.hub.api.beans.Collaborator;
import io.apicurio.hub.api.beans.NewApiDesign;
import io.apicurio.hub.api.connectors.SourceConnectorFactory;
import io.apicurio.hub.api.exceptions.AlreadyExistsException;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.exceptions.ServerError;
import io.apicurio.hub.api.js.OaiCommandExecutor;
import io.apicurio.hub.api.rest.IDesignsResource;
import test.io.apicurio.hub.api.MockGitHubService;
import test.io.apicurio.hub.api.MockHttpServletRequest;
import test.io.apicurio.hub.api.MockHttpServletResponse;
import test.io.apicurio.hub.api.MockMetrics;
import test.io.apicurio.hub.api.MockSecurityContext;
import test.io.apicurio.hub.api.MockStorage;
import test.io.apicurio.hub.api.TestUtil;

/**
 * @author eric.wittmann@gmail.com
 */
public class DesignsResourceTest {
    
    private IDesignsResource resource;
    
    private MockStorage storage;
    private MockSecurityContext security;
    private MockGitHubService github;
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

        sourceConnectorFactory = new SourceConnectorFactory();
        github = new MockGitHubService();
        TestUtil.setPrivateField(sourceConnectorFactory, "gitHub", github);

        TestUtil.setPrivateField(resource, "storage", storage);
        TestUtil.setPrivateField(resource, "sourceConnectorFactory", sourceConnectorFactory);
        TestUtil.setPrivateField(resource, "security", security);
        TestUtil.setPrivateField(resource, "metrics", metrics);
        TestUtil.setPrivateField(resource, "oaiCommandExecutor", commandExecutor);
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
        AddApiDesign info = new AddApiDesign();
        info.setRepositoryUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        resource.addDesign(info);
        info = new AddApiDesign();
        info.setRepositoryUrl("https://github.com/Apicurio/api-samples/blob/master/apiman-rls/apiman-rls.json");
        resource.addDesign(info);
        
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
    public void testAddDesign() throws ServerError, AlreadyExistsException, NotFoundException {
        AddApiDesign info = new AddApiDesign();
        info.setRepositoryUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        ApiDesign design = resource.addDesign(info);
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
        AddApiDesign info = new AddApiDesign();
        info.setRepositoryUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        ApiDesign design = resource.addDesign(info);
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
        AddApiDesign info = new AddApiDesign();
        info.setRepositoryUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        ApiDesign design = resource.addDesign(info);
        Assert.assertEquals("1", design.getId());
        Assert.assertEquals("user", design.getCreatedBy());
        
        String designId = design.getId();
        
        Response content = resource.editDesign(designId);
        Assert.assertNotNull(content);
        Assert.assertEquals(new MediaType("application", "json", "utf-8"), content.getMediaType());
        Assert.assertEquals(703, content.getLength());
        Assert.assertEquals(MockGitHubService.STATIC_CONTENT, content.getEntity());
        Assert.assertEquals("SESSION:1", content.getHeaderString("X-Apicurio-EditingSessionId"));
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
        AddApiDesign info = new AddApiDesign();
        info.setRepositoryUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        ApiDesign design = resource.addDesign(info);

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
    public void testGetContent() throws ServerError, AlreadyExistsException, NotFoundException, InterruptedException {
        AddApiDesign info = new AddApiDesign();
        info.setRepositoryUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        ApiDesign design = resource.addDesign(info);
        
        Response content = resource.getContent(design.getId());
        Assert.assertNotNull(content);
        Assert.assertEquals(new MediaType("application", "json", "utf-8"), content.getMediaType());
        Assert.assertEquals(703, content.getLength());
        Assert.assertEquals(MockGitHubService.STATIC_CONTENT, content.getEntity());
        
        String ghLog = github.auditLog();
        Assert.assertNotNull(ghLog);
        Assert.assertEquals(
                "---\n" + 
                "validateResourceExists::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" + 
                "getResourceContent::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" + 
                "---", 
                ghLog);
    }

}
