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

import javax.inject.Inject;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.archive.importer.MavenImporter;
import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;

import io.apicurio.hub.api.beans.SystemStatusBean;
import io.apicurio.hub.api.rest.ISystemResource;

/**
 * @author eric.wittmann@gmail.com
 */
@RunWith(Arquillian.class)
@Ignore
public class SystemResourceTest {
    
    @Deployment
    public static WebArchive deployment() {
        WebArchive war = ShrinkWrap.create(MavenImporter.class).loadPomFromFile("pom.xml")
                .importBuildOutput().as(WebArchive.class);
//        System.out.println(war.toString(true));
        return war;
    }

    @Inject ISystemResource system;
    
    @Test
    public void testStatus() {
        SystemStatusBean status = system.getStatus();
        Assert.assertNotNull(status);
        Assert.assertEquals("Apicurio Studio Hub API", status.getName());
    }

}
