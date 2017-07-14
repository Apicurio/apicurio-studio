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
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
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
import io.apicurio.hub.api.beans.UpdateApiDesign;
import io.apicurio.hub.api.exceptions.AlreadyExistsException;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.exceptions.ServerError;
import io.apicurio.hub.api.rest.IDesignsResource;
import test.io.apicurio.hub.api.MockGitHubService;
import test.io.apicurio.hub.api.MockHttpServletRequest;
import test.io.apicurio.hub.api.MockHttpServletResponse;
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

    @Before
    public void setUp() {
        resource = new DesignsResource();

        storage = new MockStorage();
        security = new MockSecurityContext();
        github = new MockGitHubService();

        TestUtil.setPrivateField(resource, "storage", storage);
        TestUtil.setPrivateField(resource, "security", security);
        TestUtil.setPrivateField(resource, "github", github);
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
                "validateResourceExists::https://github.com/Apicurio/api-samples/blob/master/apiman-rls/apiman-rls.json\n" + 
                "---", 
                ghLog);
    }

    @Test
    public void testAddDesign() throws ServerError, AlreadyExistsException, NotFoundException {
        AddApiDesign info = new AddApiDesign();
        info.setRepositoryUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        ApiDesign design = resource.addDesign(info);
        Assert.assertNotNull(design);
        Assert.assertEquals(info.getRepositoryUrl(), design.getRepositoryUrl());
        Assert.assertEquals("1", design.getId());
        Assert.assertEquals("user", design.getCreatedBy());
        Assert.assertEquals("user", design.getModifiedBy());
        Assert.assertEquals(design.getCreatedOn(), design.getModifiedOn());
        
        try {
            resource.addDesign(info);
            Assert.fail("Expected an error: AlreadyExistsException");
        } catch (AlreadyExistsException e) {
            // OK, expected
        }

        String ghLog = github.auditLog();
        Assert.assertNotNull(ghLog);
        Assert.assertEquals(
                "---\n" + 
                "validateResourceExists::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" + 
                "validateResourceExists::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" + 
                "---", 
                ghLog);
    }

    @Test
    public void testCreateDesign() throws ServerError, AlreadyExistsException {
        NewApiDesign info = new NewApiDesign();
        info.setName("My API");
        info.setDescription("Description of my API.");
        info.setRepositoryUrl("https://github.com/Apicurio/api-samples/blob/master/my-api/new-api.json");
        ApiDesign design = resource.createDesign(info);
        Assert.assertNotNull(design);
        Assert.assertEquals(info.getRepositoryUrl(), design.getRepositoryUrl());
        Assert.assertEquals(info.getName(), design.getName());
        Assert.assertEquals(info.getDescription(), design.getDescription());
        Assert.assertEquals("1", design.getId());
        Assert.assertEquals("user", design.getCreatedBy());
        Assert.assertEquals("user", design.getModifiedBy());
        Assert.assertEquals(design.getCreatedOn(), design.getModifiedOn());
        
        try {
            resource.createDesign(info);
            Assert.fail("Expected an error: AlreadyExistsException");
        } catch (AlreadyExistsException e) {
            // OK, expected
        }

        String ghLog = github.auditLog();
        Assert.assertNotNull(ghLog);
        String expectedContent = "{\"swagger\":\"2.0\",\"info\":{\"title\":\"My API\",\"description\":\"Description of my API.\",\"version\":\"1.0.0\"}}";
        Assert.assertEquals(
                "---\n" + 
                "validateResourceExists::https://github.com/Apicurio/api-samples/blob/master/my-api/new-api.json\n" + 
                "createResourceContent::https://github.com/Apicurio/api-samples/blob/master/my-api/new-api.json::Initial creation of API: My API::" + expectedContent.hashCode() + "\n" + 
                "validateResourceExists::https://github.com/Apicurio/api-samples/blob/master/my-api/new-api.json\n" + 
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
                "---", 
                ghLog);
    }

    @Test
    public void testUpdateDesign() throws ServerError, AlreadyExistsException, NotFoundException, InterruptedException {
        AddApiDesign info = new AddApiDesign();
        info.setRepositoryUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        ApiDesign design = resource.addDesign(info);
        Assert.assertEquals(info.getRepositoryUrl(), design.getRepositoryUrl());
        Assert.assertEquals("1", design.getId());
        Assert.assertEquals("user", design.getCreatedBy());
        Assert.assertEquals("user", design.getModifiedBy());
        Assert.assertEquals(design.getCreatedOn(), design.getModifiedOn());
        
        String designId = design.getId();
        
        UpdateApiDesign update = new UpdateApiDesign();
        update.setName("API Name");
        update.setDescription("API description.");
        
        // Slight delay to ensure that the modified time actually changes!
        Thread.sleep(10);
        resource.updateDesign(designId, update);
        
        ApiDesign updatedDesign = resource.getDesign(designId);
        Assert.assertEquals(info.getRepositoryUrl(), updatedDesign.getRepositoryUrl());
        Assert.assertEquals("1", updatedDesign.getId());
        Assert.assertEquals("user", updatedDesign.getCreatedBy());
        Assert.assertEquals("user", updatedDesign.getModifiedBy());
        Assert.assertEquals("API Name", updatedDesign.getName());
        Assert.assertEquals("API description.", updatedDesign.getDescription());
        Assert.assertNotEquals(updatedDesign.getCreatedOn().getTime(), updatedDesign.getModifiedOn().getTime());
        
        try {
            resource.updateDesign("n/a", update);
            Assert.fail("Expected a NotFoundException");
        } catch (NotFoundException e) {
            // should get here
        }

        String ghLog = github.auditLog();
        Assert.assertNotNull(ghLog);
        Assert.assertEquals(
                "---\n" + 
                "validateResourceExists::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" + 
                "---", 
                ghLog);
    }

    @Test
    public void testGetCollaborators() throws ServerError, AlreadyExistsException, NotFoundException, InterruptedException {
        AddApiDesign info = new AddApiDesign();
        info.setRepositoryUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        resource.addDesign(info);

        Collection<Collaborator> collaborators = resource.getCollaborators("1");
        Assert.assertNotNull(collaborators);
        Assert.assertFalse(collaborators.isEmpty());
        Assert.assertEquals(2, collaborators.size());
        Collaborator collaborator = collaborators.iterator().next();
        Assert.assertEquals(7, collaborator.getCommits());
        Assert.assertEquals("user1", collaborator.getName());
        Assert.assertEquals("urn:user1", collaborator.getUrl());

        String ghLog = github.auditLog();
        Assert.assertNotNull(ghLog);
        Assert.assertEquals(
                "---\n" + 
                "validateResourceExists::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" + 
                "getCollaborators::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" + 
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

    @Test
    public void testUpdateContent() throws ServerError, AlreadyExistsException, NotFoundException, InterruptedException {
        AddApiDesign info = new AddApiDesign();
        info.setRepositoryUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        ApiDesign design = resource.addDesign(info);
        
        String content = MockGitHubService.STATIC_CONTENT;
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("X-Content-SHA", "0123456789");
        headers.put("X-Apicurio-CommitMessage", "UpdateApiNow!");
        headers.put("X-Apicurio-CommitComment", "Just a comment.");
        MockHttpServletRequest request = new MockHttpServletRequest(headers, content);
        TestUtil.setPrivateField(resource, "request", request);
        MockHttpServletResponse response = new MockHttpServletResponse();
        TestUtil.setPrivateField(resource, "response", response);
        resource.updateContent(design.getId());
        
        String ghLog = github.auditLog();
        Assert.assertNotNull(ghLog);
        Assert.assertEquals(
                "---\n" + 
                "validateResourceExists::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json\n" + 
                "updateResourceContent::https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json::UpdateApiNow!::Just a comment.::0123456789::-1073691667\n" + 
                "---", 
                ghLog);
        Assert.assertNotNull(response.getHeader("X-Content-SHA"));
    }

}
