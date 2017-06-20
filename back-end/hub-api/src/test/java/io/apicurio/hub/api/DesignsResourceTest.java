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

package io.apicurio.hub.api;

import java.util.Collection;

import javax.inject.Inject;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.archive.importer.MavenImporter;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;

import io.apicurio.hub.api.beans.AddApiDesign;
import io.apicurio.hub.api.beans.ApiDesign;
import io.apicurio.hub.api.exceptions.AlreadyExistsException;
import io.apicurio.hub.api.exceptions.ServerError;
import io.apicurio.hub.api.rest.IDesignsResource;

/**
 * @author eric.wittmann@gmail.com
 */
@RunWith(Arquillian.class)
public class DesignsResourceTest {
    
    @Deployment
    public static WebArchive deployment() {
        WebArchive war = ShrinkWrap.create(MavenImporter.class).loadPomFromFile("pom.xml")
                .importBuildOutput().as(WebArchive.class);
        System.out.println(war.toString(true));
        return war;
    }

    @Inject IDesignsResource resource;
    
    @Test
    public void testListDesignsEmpty() throws ServerError {
        Collection<ApiDesign> designs = resource.listDesigns();
        Assert.assertNotNull(designs);
    }
    
    @Test
    public void testAddDesign() throws ServerError, AlreadyExistsException {
        AddApiDesign info = new AddApiDesign();
        info.setRepositoryUrl("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        ApiDesign design = resource.addDesign(info);
        Assert.assertNotNull(design);
        Assert.assertEquals(info.getRepositoryUrl(), design.getRepositoryUrl());
        Assert.assertNotNull(design.getId());
        
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

}
