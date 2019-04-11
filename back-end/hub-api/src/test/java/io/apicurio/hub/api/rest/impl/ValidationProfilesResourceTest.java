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

import java.sql.Driver;
import java.sql.SQLException;
import java.util.Collection;

import org.apache.commons.dbcp.BasicDataSource;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import io.apicurio.hub.api.metrics.IApiMetrics;
import io.apicurio.hub.api.rest.IValidationProfilesResource;
import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.core.beans.CreateValidationProfile;
import io.apicurio.hub.core.beans.UpdateValidationProfile;
import io.apicurio.hub.core.beans.ValidationProfile;
import io.apicurio.hub.core.beans.ValidationSeverity;
import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.storage.jdbc.H2SqlStatements;
import io.apicurio.hub.core.storage.jdbc.JdbcStorage;
import io.apicurio.test.core.TestUtil;
import test.io.apicurio.hub.api.MockMetrics;
import test.io.apicurio.hub.api.MockSecurityContext;

/**
 * @author eric.wittmann@gmail.com
 */
public class ValidationProfilesResourceTest {
    
    public static int counter = 0;
    static {
        System.setProperty("org.slf4j.simpleLogger.logFile", "System.out");
    }

    private IValidationProfilesResource resource;

    private JdbcStorage storage;
    private BasicDataSource ds;
    private ISecurityContext security;
    private IApiMetrics metrics;

    @Before
    public void setUp() {
        resource = new ValidationProfilesResource();

        storage = new JdbcStorage();
        ds = createInMemoryDatasource();
        security = new MockSecurityContext();
        metrics = new MockMetrics();

        // Init the storage
        HubConfiguration config = new HubConfiguration();
        H2SqlStatements sqlStatements = new H2SqlStatements(config);
        TestUtil.setPrivateField(storage, "config", config);
        TestUtil.setPrivateField(storage, "dataSource", ds);
        TestUtil.setPrivateField(storage, "sqlStatements", sqlStatements);
        storage.postConstruct();

        // Init the resource
        TestUtil.setPrivateField(resource, "storage", storage);
        TestUtil.setPrivateField(resource, "security", security);
        TestUtil.setPrivateField(resource, "metrics", metrics);
    }

    @After
    public void tearDown() throws Exception {
    }

    /**
     * Creates an in-memory datasource.
     * @throws SQLException
     */
    private static BasicDataSource createInMemoryDatasource() {
        BasicDataSource ds = new BasicDataSource();
        ds.setDriverClassName(Driver.class.getName());
        ds.setUsername("sa");
        ds.setPassword("");
        ds.setUrl("jdbc:h2:mem:vptest" + (counter++) + ";DB_CLOSE_DELAY=-1");
        return ds;
    }

    @Test
    public void testListProfiles() throws Exception {
        Collection<ValidationProfile> profiles = resource.listValidationProfiles();
        Assert.assertNotNull(profiles);
        Assert.assertTrue(profiles.isEmpty());
        
        CreateValidationProfile profile1 = new CreateValidationProfile();
        profile1.setName("Profile One");
        profile1.setDescription("The first profile.");
        profile1.getSeverities().put("KEY-1", ValidationSeverity.high);
        profile1.getSeverities().put("KEY-2", ValidationSeverity.low);
        
        CreateValidationProfile profile2 = new CreateValidationProfile();
        profile2.setName("Profile Two");
        profile2.setDescription("The second profile.");
        profile2.getSeverities().put("KEY-3", ValidationSeverity.medium);
        profile2.getSeverities().put("KEY-4", ValidationSeverity.ignore);
        
        resource.createValidationProfile(profile1);
        resource.createValidationProfile(profile2);
        
        profiles = resource.listValidationProfiles();
        Assert.assertNotNull(profiles);
        Assert.assertEquals(2, profiles.size());
        
        ValidationProfile profile = profiles.iterator().next();
        Assert.assertEquals("Profile One", profile.getName());
    }

    @Test
    public void testUpdateProfile() throws Exception {
        CreateValidationProfile profile1 = new CreateValidationProfile();
        profile1.setName("Profile One");
        profile1.setDescription("The first profile.");
        profile1.getSeverities().put("KEY-1", ValidationSeverity.high);
        profile1.getSeverities().put("KEY-2", ValidationSeverity.low);
        long pid = resource.createValidationProfile(profile1).getId();

        UpdateValidationProfile update = new UpdateValidationProfile();
        update.setName("Profile One (updated)");
        update.setDescription("The first profile.");
        update.getSeverities().put("KEY-1", ValidationSeverity.medium);
        update.getSeverities().put("KEY-2", ValidationSeverity.medium);
        update.getSeverities().put("KEY-3", ValidationSeverity.medium);
        resource.updateValidationProfile(String.valueOf(pid), update);
        
        ValidationProfile updatedProfile = resource.listValidationProfiles().iterator().next();
        Assert.assertEquals("Profile One (updated)", updatedProfile.getName());
        Assert.assertNotEquals(profile1.getSeverities(), updatedProfile.getSeverities());
        Assert.assertEquals(update.getSeverities(), updatedProfile.getSeverities());

        try {
            resource.updateValidationProfile(String.valueOf(pid + 1), update);
            Assert.fail();
        } catch (NotFoundException nfe) {
        }
    }

    @Test
    public void testDeleteProfile() throws Exception {
        CreateValidationProfile profile1 = new CreateValidationProfile();
        profile1.setName("Profile One");
        profile1.setDescription("The first profile.");
        profile1.getSeverities().put("KEY-1", ValidationSeverity.high);
        profile1.getSeverities().put("KEY-2", ValidationSeverity.low);
        long pid = resource.createValidationProfile(profile1).getId();

        resource.deleteValidationProfile(String.valueOf(pid));
        
        Collection<ValidationProfile> profiles = resource.listValidationProfiles();
        Assert.assertTrue(profiles.isEmpty());

        try {
            resource.deleteValidationProfile(String.valueOf(pid));
            Assert.fail();
        } catch (NotFoundException nfe) {
        }
    }
    
    
}
