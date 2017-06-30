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

import io.apicurio.hub.api.beans.ApiDesignResourceInfo;
import io.apicurio.hub.api.exceptions.NotFoundException;
import test.io.apicurio.hub.api.MockSecurityContext;
import test.io.apicurio.hub.api.TestUtil;

/**
 * @author eric.wittmann@gmail.com
 */
public class GitHubServiceTest {

    private IGitHubService service;

    @Before
    public void setUp() {
        service = new GitHubService();
        TestUtil.setPrivateField(service, "security", new MockSecurityContext());
    }
    
    @After
    public void tearDown() throws Exception {
    }

    /**
     * Test method for {@link io.apicurio.hub.api.github.GitHubService#validateResourceExists(java.lang.String)}.
     */
    @Test
    public void testValidateResourceExists() throws NotFoundException {
        ApiDesignResourceInfo info = service.validateResourceExists("https://github.com/Apicurio/api-samples/blob/master/apiman-rls/apiman-rls.json");
        Assert.assertNotNull(info);
        Assert.assertEquals("Rate Limiter API", info.getName());
        Assert.assertEquals("A REST API used by clients to access the standalone Rate Limiter micro-service.", info.getDescription());

        info = service.validateResourceExists("https://raw.githubusercontent.com/Apicurio/api-samples/master/pet-store/pet-store.json");
        Assert.assertNotNull(info);
        Assert.assertEquals("Swagger Petstore", info.getName());
        Assert.assertEquals("This is a sample server Petstore server via JSON!", info.getDescription());
    }

}
