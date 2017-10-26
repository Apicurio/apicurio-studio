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

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import io.apicurio.hub.api.rest.ICurrentUserResource;
import io.apicurio.studio.shared.beans.User;
import io.apicurio.test.core.TestUtil;
import test.io.apicurio.hub.api.MockSecurityContext;

/**
 * @author eric.wittmann@gmail.com
 */
public class CurrentUserResourceTest {
    
    private ICurrentUserResource resource;

    @Before
    public void setUp() {
        resource = new CurrentUserResource();
        TestUtil.setPrivateField(resource, "security", new MockSecurityContext());
    }
    
    @After
    public void tearDown() throws Exception {
    }
    
    @Test
    public void testGetCurrentUser() {
        User user = resource.getCurrentUser();
        Assert.assertNotNull(user);
        Assert.assertEquals("avatar.jpg", user.getAvatar());
        Assert.assertEquals("user@example.org", user.getEmail());
        Assert.assertEquals(1, user.getId());
        Assert.assertEquals("user", user.getLogin());
        Assert.assertEquals("User", user.getName());
    }

}
