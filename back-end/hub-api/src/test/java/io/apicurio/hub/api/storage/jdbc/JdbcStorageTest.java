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

package io.apicurio.hub.api.storage.jdbc;

import java.lang.reflect.Field;
import java.sql.Driver;
import java.sql.SQLException;
import java.util.Collection;
import java.util.Date;

import org.apache.commons.dbcp.BasicDataSource;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import io.apicurio.hub.api.beans.ApiDesign;
import io.apicurio.hub.api.config.Configuration;
import io.apicurio.hub.api.exceptions.AlreadyExistsException;
import io.apicurio.hub.api.exceptions.NotFoundException;

/**
 * @author eric.wittmann@gmail.com
 */
public class JdbcStorageTest {
    
    private static int counter = 0;
    static {
        System.setProperty("org.slf4j.simpleLogger.logFile", "System.out");
    }

    private JdbcStorage storage;
    private BasicDataSource ds;

    @Before
    public void setUp() {
        storage = new JdbcStorage();
        ds = createInMemoryDatasource();
        setPrivateField(storage, "config", new Configuration());
        setPrivateField(storage, "dataSource", ds);
        storage.postConstruct();
    }
    
    @After
    public void tearDown() throws Exception {
        ds.close();
    }
    
    @Test
    public void testReInitDb() throws Exception {
        storage.postConstruct();
        // Should not have thrown an error because the DB is already initialized!
    }

    @Test
    public void testListApiDesigns() throws Exception {
        Collection<ApiDesign> designs = storage.listApiDesigns();
        Assert.assertNotNull(designs);
        Assert.assertEquals(0, designs.size());
        
        String baseUrl = "urn://JdbcStorageTest.testCreateApiDesign";
        
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setModifiedBy("user");
        design.setModifiedOn(now);
        
        
        design.setName("API 1");
        design.setRepositoryUrl(baseUrl + "#api1");
        storage.createApiDesign(design);
        design.setName("API 2");
        design.setRepositoryUrl(baseUrl + "#api2");
        storage.createApiDesign(design);
        design.setName("API 3");
        design.setRepositoryUrl(baseUrl + "#api3");
        storage.createApiDesign(design);
        design.setName("API 4");
        design.setRepositoryUrl(baseUrl + "#api4");
        storage.createApiDesign(design);
        design.setName("API 5");
        design.setRepositoryUrl(baseUrl + "#api5");
        storage.createApiDesign(design);

        designs = storage.listApiDesigns();
        Assert.assertNotNull(designs);
        Assert.assertEquals(5, designs.size());
    }
    
    @Test
    public void testCreateApiDesign() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setModifiedBy("user");
        design.setModifiedOn(now);
        design.setName("API Name");
        design.setRepositoryUrl("urn://JdbcStorageTest.testCreateApiDesign");
        
        String id = storage.createApiDesign(design);
        Assert.assertNotNull(id);
        Assert.assertEquals("1", id);
        
        try {
            storage.createApiDesign(design);
            Assert.fail("Expected an 'AlreadyExistsException'");
        } catch (AlreadyExistsException e) {
            // OK!
        }
    }

    @Test
    public void testDeleteApiDesign() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setModifiedBy("user");
        design.setModifiedOn(now);
        design.setName("API Name");
        design.setRepositoryUrl("urn://JdbcStorageTest.testCreateApiDesign");
        
        String designId = storage.createApiDesign(design);
        
        // Fetch it by its ID
        design = storage.getApiDesign(designId);
        Assert.assertNotNull(design);
        
        // Delete it
        storage.deleteApiDesign(designId);
        
        // Now fetch again and expect a NotFoundException
        try {
            storage.getApiDesign(designId);
            Assert.fail("Expected NotFoundException");
        } catch (NotFoundException e) {
            // OK!
        }
    }

    @Test
    public void testGetApiDesignById() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setModifiedBy("user");
        design.setModifiedOn(now);
        design.setName("API Name");
        design.setRepositoryUrl("urn://JdbcStorageTest.testCreateApiDesign");
        
        String designId = storage.createApiDesign(design);
        
        // Fetch it by its ID
        design = storage.getApiDesign(designId);
        Assert.assertNotNull(design);
        Assert.assertEquals("user", design.getCreatedBy());
        Assert.assertEquals("user", design.getModifiedBy());
        Assert.assertEquals(now, design.getCreatedOn());
        Assert.assertEquals(now, design.getModifiedOn());
        Assert.assertEquals("Just added the design!", design.getDescription());
        Assert.assertEquals("API Name", design.getName());
        Assert.assertEquals("urn://JdbcStorageTest.testCreateApiDesign", design.getRepositoryUrl());
        
        try {
            storage.getApiDesign("17");
            Assert.fail("Expected NotFoundException");
        } catch (NotFoundException e) {
            // OK!
        }
    }
    
    /**
     * Sets the value of a private field on a target object.
     * @param target
     * @param fieldName
     * @param fieldValue
     */
    private static void setPrivateField(Object target, String fieldName, Object fieldValue) {
        try {
            Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, fieldValue);
        } catch (NoSuchFieldException | SecurityException | IllegalArgumentException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
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
        ds.setUrl("jdbc:h2:mem:test" + (counter++) + ";DB_CLOSE_DELAY=-1");
        return ds;
    }

}
