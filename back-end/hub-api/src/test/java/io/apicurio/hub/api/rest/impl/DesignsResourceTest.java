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

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import io.apicurio.hub.api.beans.AddApiDesign;
import io.apicurio.hub.api.beans.ApiDesign;
import io.apicurio.hub.api.beans.Collaborator;
import io.apicurio.hub.api.beans.UpdateApiDesign;
import io.apicurio.hub.api.exceptions.AlreadyExistsException;
import io.apicurio.hub.api.exceptions.NotFoundException;
import io.apicurio.hub.api.exceptions.ServerError;
import io.apicurio.hub.api.rest.IDesignsResource;
import test.io.apicurio.hub.api.MockGitHubService;
import test.io.apicurio.hub.api.MockSecurityContext;
import test.io.apicurio.hub.api.MockStorage;
import test.io.apicurio.hub.api.TestUtil;

/**
 * @author eric.wittmann@gmail.com
 */
public class DesignsResourceTest {
    
    private IDesignsResource resource;
    private MockStorage storage;

    @Before
    public void setUp() {
        storage = new MockStorage();
        resource = new DesignsResource();
        TestUtil.setPrivateField(resource, "storage", storage);
        TestUtil.setPrivateField(resource, "security", new MockSecurityContext());
        TestUtil.setPrivateField(resource, "github", new MockGitHubService());
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
    }

    @Test
    public void testCreateDesign() throws ServerError, AlreadyExistsException {
        // TODO add test for Create Design
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
    }    

}
