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

import java.sql.Driver;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;

import org.apache.commons.dbcp.BasicDataSource;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import io.apicurio.hub.api.beans.ApiDesign;
import io.apicurio.hub.api.beans.LinkedAccount;
import io.apicurio.hub.api.beans.LinkedAccountType;
import io.apicurio.hub.api.config.HubApiConfiguration;
import io.apicurio.hub.api.exceptions.AlreadyExistsException;
import io.apicurio.hub.api.exceptions.NotFoundException;
import test.io.apicurio.hub.api.TestUtil;

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
        TestUtil.setPrivateField(storage, "config", new HubApiConfiguration());
        TestUtil.setPrivateField(storage, "dataSource", ds);
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
        Collection<ApiDesign> designs = storage.listApiDesigns("user");
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
        
        // Add five designs as user1
        design.setName("API 1");
        design.setRepositoryUrl(baseUrl + "#api1");
        storage.createApiDesign("user", design);
        design.setName("API 2");
        design.setRepositoryUrl(baseUrl + "#api2");
        storage.createApiDesign("user", design);
        design.setName("API 3");
        design.setRepositoryUrl(baseUrl + "#api3");
        storage.createApiDesign("user", design);
        design.setName("API 4");
        design.setRepositoryUrl(baseUrl + "#api4");
        storage.createApiDesign("user", design);
        design.setName("API 5");
        design.setRepositoryUrl(baseUrl + "#api5");
        storage.createApiDesign("user", design);

        // Now a couple more as user2
        design.setName("API 6");
        design.setRepositoryUrl(baseUrl + "#api6");
        storage.createApiDesign("user2", design);
        design.setName("API 7");
        design.setRepositoryUrl(baseUrl + "#api7");
        storage.createApiDesign("user2", design);

        // Fetch all 5 from user1
        designs = storage.listApiDesigns("user");
        Assert.assertNotNull(designs);
        Assert.assertEquals(5, designs.size());

        // Now both from user2
        designs = storage.listApiDesigns("user2");
        Assert.assertNotNull(designs);
        Assert.assertEquals(2, designs.size());
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
        
        String id = storage.createApiDesign("user", design);
        Assert.assertNotNull(id);
        Assert.assertEquals("1", id);
        
        try {
            storage.createApiDesign("user", design);
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
        
        String designId = storage.createApiDesign("user", design);
        
        // Fetch it by its ID
        design = storage.getApiDesign("user", designId);
        Assert.assertNotNull(design);
        
        // Try deleting it as a user without permission to do so
        try {
            storage.deleteApiDesign("user2", designId);
            Assert.fail("Expected NotFoundException");
        } catch (NotFoundException e) {
            // OK!
        }
        
        // Delete it with the proper user!
        storage.deleteApiDesign("user", designId);
        
        // Now fetch again and expect a NotFoundException
        try {
            storage.getApiDesign("user", designId);
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
        design.getTags().add("tag1");
        design.getTags().add("tag2");
        
        String designId = storage.createApiDesign("user", design);
        
        // Fetch it by its ID
        design = storage.getApiDesign("user", designId);
        Assert.assertNotNull(design);
        Assert.assertEquals("user", design.getCreatedBy());
        Assert.assertEquals("user", design.getModifiedBy());
        Assert.assertEquals(now, design.getCreatedOn());
        Assert.assertEquals(now, design.getModifiedOn());
        Assert.assertEquals("Just added the design!", design.getDescription());
        Assert.assertEquals("API Name", design.getName());
        Assert.assertEquals("urn://JdbcStorageTest.testCreateApiDesign", design.getRepositoryUrl());
        Assert.assertEquals(new HashSet<String>(Arrays.asList("tag1", "tag2")), design.getTags());
        
        try {
            storage.getApiDesign("user", "17");
            Assert.fail("Expected NotFoundException");
        } catch (NotFoundException e) {
            // OK!
        }
        
        try {
            storage.getApiDesign("user2", designId);
            Assert.fail("Expected NotFoundException");
        } catch (NotFoundException e) {
            // OK!
        }
    }
    
    @Test
    public void testUpdateApiDesign() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setModifiedBy("user");
        design.setModifiedOn(now);
        design.setName("API Name");
        design.setRepositoryUrl("urn://JdbcStorageTest.testCreateApiDesign");
        design.getTags().add("tag1");
        design.getTags().add("tag2");
        
        String designId = storage.createApiDesign("user", design);
        design.setId(designId);
        
        design.setModifiedBy("user2");
        design.setModifiedOn(new Date(now.getTime() + 100));
        design.setName("Updated API Name");
        design.setDescription("Updated description.");
        design.getTags().clear();
        design.getTags().add("tag3");
        design.getTags().add("tag4");
        design.getTags().add("tag5");
        storage.updateApiDesign("user", design);
        
        // now fetch the design from the storage and verify its values
        ApiDesign updatedDesign = storage.getApiDesign("user", designId);
        Assert.assertEquals(design.getId(), updatedDesign.getId());
        Assert.assertEquals(design.getName(), updatedDesign.getName());
        Assert.assertEquals(design.getDescription(), updatedDesign.getDescription());
        Assert.assertEquals(design.getRepositoryUrl(), updatedDesign.getRepositoryUrl());
        Assert.assertEquals(design.getCreatedBy(), updatedDesign.getCreatedBy());
        Assert.assertEquals(design.getCreatedOn(), updatedDesign.getCreatedOn());
        Assert.assertEquals(design.getModifiedBy(), updatedDesign.getModifiedBy());
        Assert.assertEquals(design.getModifiedOn(), updatedDesign.getModifiedOn());
        Assert.assertEquals(design.getTags(), updatedDesign.getTags());
        
        try {
            storage.updateApiDesign("user2", design);
            Assert.fail("Expected a NotFoundException");
        } catch (NotFoundException e) {
            // expected
        }
    }

    @Test
    public void testCreateLinkedAccount() throws Exception {
        LinkedAccount account = new LinkedAccount();
        Date now = new Date();
        account.setType(LinkedAccountType.GitHub);
        account.setLinkedOn(now);
        account.setUsedOn(now);
        
        storage.createLinkedAccount("user", account);
        
        try {
            storage.createLinkedAccount("user", account);
            Assert.fail("Expected an 'AlreadyExistsException'");
        } catch (AlreadyExistsException e) {
            // OK!
        }

        storage.createLinkedAccount("user2", account);
    }

    @Test
    public void testGetLinkedAccount() throws Exception {
        LinkedAccount account = new LinkedAccount();
        Date now = new Date();
        account.setType(LinkedAccountType.GitLab);
        account.setLinkedOn(now);
        account.setUsedOn(now);
        storage.createLinkedAccount("user", account);
        
        LinkedAccount fetchedAccount = storage.getLinkedAccount("user", LinkedAccountType.GitLab);
        Assert.assertNotNull(fetchedAccount);
        Assert.assertEquals(account.getType(), fetchedAccount.getType());
        Assert.assertEquals(account.getLinkedOn(), fetchedAccount.getLinkedOn());
        Assert.assertEquals(account.getUsedOn(), fetchedAccount.getUsedOn());
    }
    
    @Test
    public void testListLinkedAccounts() throws Exception {
        Collection<LinkedAccount> designs = storage.listLinkedAccounts("user");
        Assert.assertNotNull(designs);
        Assert.assertEquals(0, designs.size());
        
        LinkedAccount account = new LinkedAccount();
        Date now = new Date();
        account.setType(LinkedAccountType.Bitbucket);
        account.setLinkedOn(now);

        storage.createLinkedAccount("user", account);
        account.setType(LinkedAccountType.GitHub);
        storage.createLinkedAccount("user", account);
        account.setType(LinkedAccountType.GitLab);
        storage.createLinkedAccount("user", account);
        
        account.setType(LinkedAccountType.GitHub);
        storage.createLinkedAccount("user2", account);
        account.setType(LinkedAccountType.GitLab);
        storage.createLinkedAccount("user2", account);

        designs = storage.listLinkedAccounts("user");
        Assert.assertNotNull(designs);
        Assert.assertEquals(3, designs.size());

        designs = storage.listLinkedAccounts("user2");
        Assert.assertNotNull(designs);
        Assert.assertEquals(2, designs.size());
    }
    
    @Test
    public void testUpdateLinkedAccount() throws Exception {
        LinkedAccount account = new LinkedAccount();
        Date now = new Date();
        account.setType(LinkedAccountType.Bitbucket);
        account.setLinkedOn(now);
        account.setUsedOn(now);
        storage.createLinkedAccount("user", account);
        
        Thread.sleep(10);
        
        now = new Date();
        account.setUsedOn(now);
        storage.updateLinkedAccount("user", account);

        account = storage.getLinkedAccount("user", LinkedAccountType.Bitbucket);
        Assert.assertNotNull(account);
        Assert.assertEquals(now, account.getUsedOn());
        
        try {
            storage.updateLinkedAccount("user2", account);
            Assert.fail("Expected a NotFoundException");
        } catch (NotFoundException e) {
            // expected
        }
    }

    @Test
    public void testDeleteLinkedAccount() throws Exception {
        LinkedAccount account = new LinkedAccount();
        Date now = new Date();
        account.setType(LinkedAccountType.Bitbucket);
        account.setLinkedOn(now);
        account.setUsedOn(now);
        storage.createLinkedAccount("user", account);
        
        // Fetch it by its ID
        account = storage.getLinkedAccount("user", LinkedAccountType.Bitbucket);
        Assert.assertNotNull(account);
        
        // Try deleting it as the wrong user
        try {
            storage.deleteLinkedAccount("user2", LinkedAccountType.Bitbucket);
            Assert.fail("Expected NotFoundException");
        } catch (NotFoundException e) {
            // OK!
        }

        // Can still retrieve it?
        account = storage.getLinkedAccount("user", LinkedAccountType.Bitbucket);
        Assert.assertNotNull(account);

        
        // Delete it with the proper user!
        storage.deleteLinkedAccount("user", LinkedAccountType.Bitbucket);
        
        // Now fetch again and expect a NotFoundException
        try {
            storage.getLinkedAccount("user", LinkedAccountType.Bitbucket);
            Assert.fail("Expected NotFoundException");
        } catch (NotFoundException e) {
            // OK!
        }
    }

    @Test
    public void testDeleteLinkedAccounts() throws Exception {
        LinkedAccount account = new LinkedAccount();
        Date now = new Date();
        account.setType(LinkedAccountType.Bitbucket);
        account.setLinkedOn(now);
        account.setUsedOn(now);
        storage.createLinkedAccount("user", account);
        account.setType(LinkedAccountType.GitLab);
        storage.createLinkedAccount("user", account);
        
        // Fetch it by its ID
        account = storage.getLinkedAccount("user", LinkedAccountType.Bitbucket);
        Assert.assertNotNull(account);
        
        // Try deleting as the wrong user
        storage.deleteLinkedAccounts("user2");

        // Can still get it (not deleted)
        account = storage.getLinkedAccount("user", LinkedAccountType.Bitbucket);
        Assert.assertNotNull(account);

        // Delete it with the proper user!
        storage.deleteLinkedAccounts("user");
        
        // Now fetch again and expect a NotFoundException
        try {
            storage.getLinkedAccount("user", LinkedAccountType.Bitbucket);
            Assert.fail("Expected NotFoundException");
        } catch (NotFoundException e) {
            // OK!
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
