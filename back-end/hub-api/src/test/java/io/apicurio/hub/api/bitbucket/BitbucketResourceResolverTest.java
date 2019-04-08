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

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.test.core.TestUtil;

/**
 * @author eric.wittmann@gmail.com
 */
public class BitbucketResourceResolverTest {

    private BitbucketResourceResolver resolver;
    private HubConfiguration config;

    @Before
    public void setUp() {
        resolver = new BitbucketResourceResolver();
        config = new HubConfiguration();
        
        TestUtil.setPrivateField(resolver, "config", config);
        resolver.postConstruct();
    }
    
    @After
    public void tearDown() throws Exception {
    }

    /**
     * Test method for {@link BitbucketResourceResolver#resolve(String)}.
     */
    @Test
    public void testResolve() {
        BitbucketResource resource = resolver.resolve("https://bitbucket.org/innodays/apicurio_test/src/notmaster/api/fourthAPI.json");
        Assert.assertNotNull(resource);
        Assert.assertEquals("innodays", resource.getTeam());
        Assert.assertEquals("apicurio_test", resource.getRepository());
        Assert.assertEquals("notmaster", resource.getBranch());
        Assert.assertEquals("api/fourthAPI.json", resource.getResourcePath());
        
        resource = resolver.resolve("https://bitbucket.org/apicurio/apicurio-test/src/master/apis/pet-store.json?fileviewer=file-view-default");
        Assert.assertNotNull(resource);
        Assert.assertEquals("apicurio", resource.getTeam());
        Assert.assertEquals("apicurio-test", resource.getRepository());
        Assert.assertEquals("master", resource.getBranch());
        Assert.assertEquals("apis/pet-store.json", resource.getResourcePath());

        resource = resolver.resolve("https://bitbucket.org/apicurio/apicurio-test/raw/foo-branch/apis/pet-store.json");
        Assert.assertNull(resource);
    }

    /**
     * Test method for {@link BitbucketResourceResolver#resolve(String)}.
     */
    @Test
    public void testResolve_yaml() {
        BitbucketResource resource = resolver.resolve("https://bitbucket.org/innodays/apicurio_test/src/notmaster/api/fourthAPI.yaml");
        Assert.assertNotNull(resource);
        Assert.assertEquals("innodays", resource.getTeam());
        Assert.assertEquals("apicurio_test", resource.getRepository());
        Assert.assertEquals("notmaster", resource.getBranch());
        Assert.assertEquals("api/fourthAPI.yaml", resource.getResourcePath());
        
        resource = resolver.resolve("https://bitbucket.org/apicurio/apicurio-test/src/abcdefg/apis/pet-store.yml?at=master&fileviewer=file-view-default");
        Assert.assertNotNull(resource);
        Assert.assertEquals("apicurio", resource.getTeam());
        Assert.assertEquals("apicurio-test", resource.getRepository());
        Assert.assertEquals("abcdefg", resource.getBranch());
        Assert.assertEquals("apis/pet-store.yml", resource.getResourcePath());

        resource = resolver.resolve("https://bitbucket.org/apicurio/apicurio-test/raw/master2/apis/pet-store.yaml");
        Assert.assertNull(resource);
    }

}
