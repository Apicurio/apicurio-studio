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

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.test.core.TestUtil;

/**
 * @author eric.wittmann@gmail.com
 */
public class GitHubResourceResolverTest {

    private GitHubResourceResolver resolver;
    private HubConfiguration config;

    @Before
    public void setUp() {
        resolver = new GitHubResourceResolver();
        config = new HubConfiguration();
        
        TestUtil.setPrivateField(resolver, "config", config);
        resolver.postConstruct();
    }
    
    @After
    public void tearDown() throws Exception {
    }

    /**
     * Test method for {@link io.apicurio.hub.api.github.GitHubResourceResolver#resolve(java.lang.String)}.
     */
    @Test
    public void testResolve() {
        GitHubResource resource = resolver.resolve("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.json");
        Assert.assertNotNull(resource);
        Assert.assertEquals("Apicurio", resource.getOrganization());
        Assert.assertEquals("api-samples", resource.getRepository());
        Assert.assertEquals("master", resource.getBranch());
        Assert.assertEquals("pet-store/pet-store.json", resource.getResourcePath());

        resource = resolver.resolve("https://github.com/Apicurio/api-samples/blob/master/apiman-rls/sub1/sub2/apiman-rls.json");
        Assert.assertNotNull(resource);
        Assert.assertEquals("Apicurio", resource.getOrganization());
        Assert.assertEquals("api-samples", resource.getRepository());
        Assert.assertEquals("master", resource.getBranch());
        Assert.assertEquals("apiman-rls/sub1/sub2/apiman-rls.json", resource.getResourcePath());

        resource = resolver.resolve("https://raw.githubusercontent.com/Apicurio/api-samples/master/apiman-rls/apiman-rls.json");
        Assert.assertNotNull(resource);
        Assert.assertEquals("Apicurio", resource.getOrganization());
        Assert.assertEquals("api-samples", resource.getRepository());
        Assert.assertEquals("master", resource.getBranch());
        Assert.assertEquals("apiman-rls/apiman-rls.json", resource.getResourcePath());

        resource = resolver.resolve("https://github.com/Apicurio/api-samples/blob/master/pet-store.json");
        Assert.assertNotNull(resource);
        Assert.assertEquals("Apicurio", resource.getOrganization());
        Assert.assertEquals("api-samples", resource.getRepository());
        Assert.assertEquals("master", resource.getBranch());
        Assert.assertEquals("pet-store.json", resource.getResourcePath());

        resource = resolver.resolve("https://github.com/EricWittmann/api-samples/blob/other-branch/3.0-other/simple-api-other.json");
        Assert.assertNotNull(resource);
        Assert.assertEquals("EricWittmann", resource.getOrganization());
        Assert.assertEquals("api-samples", resource.getRepository());
        Assert.assertEquals("other-branch", resource.getBranch());
        Assert.assertEquals("3.0-other/simple-api-other.json", resource.getResourcePath());
    }

    /**
     * Test method for {@link io.apicurio.hub.api.github.GitHubResourceResolver#resolve(java.lang.String)}.
     */
    @Test
    public void testResolve_yaml() {
        GitHubResource resource = resolver.resolve("https://github.com/Apicurio/api-samples/blob/master/pet-store/pet-store.yaml");
        Assert.assertNotNull(resource);
        Assert.assertEquals("Apicurio", resource.getOrganization());
        Assert.assertEquals("api-samples", resource.getRepository());
        Assert.assertEquals("master", resource.getBranch());
        Assert.assertEquals("pet-store/pet-store.yaml", resource.getResourcePath());

        resource = resolver.resolve("https://github.com/Apicurio/api-samples/blob/master/apiman-rls/sub1/sub2/apiman-rls.yaml");
        Assert.assertNotNull(resource);
        Assert.assertEquals("Apicurio", resource.getOrganization());
        Assert.assertEquals("api-samples", resource.getRepository());
        Assert.assertEquals("master", resource.getBranch());
        Assert.assertEquals("apiman-rls/sub1/sub2/apiman-rls.yaml", resource.getResourcePath());

        resource = resolver.resolve("https://raw.githubusercontent.com/Apicurio/api-samples/master/apiman-rls/apiman-rls.yml");
        Assert.assertNotNull(resource);
        Assert.assertEquals("Apicurio", resource.getOrganization());
        Assert.assertEquals("api-samples", resource.getRepository());
        Assert.assertEquals("master", resource.getBranch());
        Assert.assertEquals("apiman-rls/apiman-rls.yml", resource.getResourcePath());

        resource = resolver.resolve("https://github.com/Apicurio/api-samples/blob/master/pet-store.yaml");
        Assert.assertNotNull(resource);
        Assert.assertEquals("Apicurio", resource.getOrganization());
        Assert.assertEquals("api-samples", resource.getRepository());
        Assert.assertEquals("master", resource.getBranch());
        Assert.assertEquals("pet-store.yaml", resource.getResourcePath());
    }


    /**
     * Test method for {@link io.apicurio.hub.api.github.GitHubResourceResolver#create(String, String, String, String)}.
     */
    @Test
    public void testCreate() {
        String actual = resolver.create("ORG", "REPO", "BRANCH", "RESOURCE");
        Assert.assertEquals("https://github.com/ORG/REPO/blob/BRANCH/RESOURCE", actual);
        
        actual = resolver.create("apicurio", "apicurio-studio", "master", "/platforms/swarm/pom.xml");
        Assert.assertEquals("https://github.com/apicurio/apicurio-studio/blob/master/platforms/swarm/pom.xml", actual);
    }
}
