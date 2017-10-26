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

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import io.apicurio.hub.api.rest.IAccountsResource;
import test.io.apicurio.hub.api.MockMetrics;
import io.apicurio.hub.core.beans.LinkedAccount;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.test.core.TestUtil;
import test.io.apicurio.hub.api.MockSecurityContext;
import test.io.apicurio.hub.api.MockStorage;

/**
 * @author eric.wittmann@gmail.com
 */
public class AccountsResourceTest {

    private IAccountsResource resource;

    private MockStorage storage;
    private MockSecurityContext security;
    private MockMetrics metrics;

    @Before
    public void setUp() {
        resource = new AccountsResource();

        storage = new MockStorage();
        security = new MockSecurityContext();
        metrics = new MockMetrics();

        TestUtil.setPrivateField(resource, "storage", storage);
        TestUtil.setPrivateField(resource, "security", security);
        TestUtil.setPrivateField(resource, "metrics", metrics);
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void testListLinkedAccountsEmpty() throws ServerError {
        Collection<LinkedAccount> accounts = resource.listLinkedAccounts();
        Assert.assertNotNull(accounts);
    }

}
