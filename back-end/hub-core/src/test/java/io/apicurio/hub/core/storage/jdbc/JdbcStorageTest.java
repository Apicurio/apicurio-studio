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

package io.apicurio.hub.core.storage.jdbc;

import java.sql.Driver;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;

import io.apicurio.hub.core.beans.StoredApiTemplate;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.dbcp.BasicDataSource;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import io.apicurio.hub.core.beans.ApiContentType;
import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.ApiDesignChange;
import io.apicurio.hub.core.beans.ApiDesignCollaborator;
import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.beans.ApiDesignContent;
import io.apicurio.hub.core.beans.ApiDesignType;
import io.apicurio.hub.core.beans.ApiMock;
import io.apicurio.hub.core.beans.ApiPublication;
import io.apicurio.hub.core.beans.CodegenProject;
import io.apicurio.hub.core.beans.CodegenProjectType;
import io.apicurio.hub.core.beans.Contributor;
import io.apicurio.hub.core.beans.Invitation;
import io.apicurio.hub.core.beans.LinkedAccount;
import io.apicurio.hub.core.beans.LinkedAccountType;
import io.apicurio.hub.core.beans.SharingConfiguration;
import io.apicurio.hub.core.beans.SharingLevel;
import io.apicurio.hub.core.beans.ValidationProfile;
import io.apicurio.hub.core.beans.ValidationSeverity;
import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.exceptions.AlreadyExistsException;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.storage.StorageException;
import io.apicurio.test.core.TestUtil;

/**
 * @author eric.wittmann@gmail.com
 */
public class JdbcStorageTest {
    
    public static int counter = 0;
    static {
        System.setProperty("org.slf4j.simpleLogger.logFile", "System.out");
    }

    private JdbcStorage storage;
    private BasicDataSource ds;

    @Before
    public void setUp() {
        storage = new JdbcStorage();
        ds = createInMemoryDatasource();
        HubConfiguration config = new HubConfiguration();
        H2SqlStatements sqlStatements = new H2SqlStatements(config);

        TestUtil.setPrivateField(storage, "config", config);
        TestUtil.setPrivateField(storage, "dataSource", ds);
        TestUtil.setPrivateField(storage, "sqlStatements", sqlStatements);
        
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
    public void testOwnerPermission() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);
        
        String id = storage.createApiDesign("user", design, "{}");
        Assert.assertNotNull(id);
        Assert.assertEquals("1", id);
        
        Assert.assertTrue(storage.hasOwnerPermission("user", id));
        Assert.assertFalse(storage.hasOwnerPermission("user2", id));
        Assert.assertFalse(storage.hasOwnerPermission("user3", id));
        
        storage.createPermission(id, "user2", "owner");
        Assert.assertTrue(storage.hasOwnerPermission("user", id));
        Assert.assertTrue(storage.hasOwnerPermission("user2", id));
        Assert.assertFalse(storage.hasOwnerPermission("user3", id));
        
        storage.createPermission(id, "user3", "collaborator");
        Assert.assertTrue(storage.hasOwnerPermission("user", id));
        Assert.assertTrue(storage.hasOwnerPermission("user2", id));
        Assert.assertFalse(storage.hasOwnerPermission("user3", id));
        
        storage.updatePermission(id, "user3", "owner");
        Assert.assertTrue(storage.hasOwnerPermission("user", id));
        Assert.assertTrue(storage.hasOwnerPermission("user2", id));
        Assert.assertTrue(storage.hasOwnerPermission("user3", id));
        
        storage.deletePermission(id, "user2");
        Assert.assertTrue(storage.hasOwnerPermission("user", id));
        Assert.assertFalse(storage.hasOwnerPermission("user2", id));
        Assert.assertTrue(storage.hasOwnerPermission("user3", id));
    }

    @Test
    public void testWritePermission() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);

        String id = storage.createApiDesign("user", design, "{}");
        Assert.assertNotNull(id);
        Assert.assertEquals("1", id);
        
        Assert.assertTrue(storage.hasWritePermission("user", id));
        Assert.assertFalse(storage.hasWritePermission("user2", id));
        Assert.assertFalse(storage.hasWritePermission("user3", id));

        storage.createPermission(id, "user2", "owner");
        Assert.assertTrue(storage.hasWritePermission("user", id));
        Assert.assertTrue(storage.hasWritePermission("user2", id));
        Assert.assertFalse(storage.hasWritePermission("user3", id));

        storage.createPermission(id, "user3", "collaborator");
        Assert.assertTrue(storage.hasWritePermission("user", id));
        Assert.assertTrue(storage.hasWritePermission("user2", id));
        Assert.assertTrue(storage.hasWritePermission("user3", id));
        
    }

    @Test
    public void testListPermission() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);

        String id = storage.createApiDesign("user", design, "{}");
        Assert.assertNotNull(id);
        Assert.assertEquals("1", id);
        
        storage.createPermission(id, "user2", "owner");
        storage.createPermission(id, "user3", "collaborator");
        storage.updatePermission(id, "user3", "owner");

        Collection<ApiDesignCollaborator> permissions = storage.listPermissions(id);
        Assert.assertNotNull(permissions);
        Assert.assertEquals(3, permissions.size());
        Assert.assertEquals("owner", permissions.iterator().next().getRole());
        Assert.assertEquals("user", permissions.iterator().next().getUserId());
        Assert.assertEquals("user", permissions.iterator().next().getUserName());
    }

    @Test
    public void testListApiDesigns() throws Exception {
        Collection<ApiDesign> designs = storage.listApiDesigns("user");
        Assert.assertNotNull(designs);
        Assert.assertEquals(0, designs.size());

        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setType(ApiDesignType.OpenAPI20);
        
        // Add five designs as user1
        design.setName("API 1");
        storage.createApiDesign("user", design, "{}");
        design.setName("API 2");
        storage.createApiDesign("user", design, "{}");
        design.setName("API 3");
        storage.createApiDesign("user", design, "{}");
        design.setName("API 4");
        storage.createApiDesign("user", design, "{}");
        design.setName("API 5");
        storage.createApiDesign("user", design, "{}");

        // Now a couple more as user2
        design.setName("API 6");
        storage.createApiDesign("user2", design, "{}");
        design.setName("API 7");
        storage.createApiDesign("user2", design, "{}");

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
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);

        String id = storage.createApiDesign("user", design, "{}");
        Assert.assertNotNull(id);
        Assert.assertEquals("1", id);
    }
    
    @Test
    public void testCreateApiDesignWithLotsOfTags() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);
        Set<String> tags = new TreeSet<>();
        // We won't be able to store them all.  But try to put a whole bunch in there.  Only 76 will 
        // fit in the 2048 characters we have allotted for the column.
        for (int tagId = 0; tagId < 100; tagId++) {
            tags.add("long-tag-name-goes-here-" + tagId);
        }
        design.setTags(tags);

        String id = storage.createApiDesign("user", design, "{}");
        Assert.assertNotNull(id);
        Assert.assertEquals("1", id);
        
        ApiDesign storedDesign = storage.getApiDesign("user", id);
        Set<String> storedTags = storedDesign.getTags();
        System.out.println(storedTags);
        Assert.assertEquals(76, storedTags.size());
        
        String actual = String.join(",", new TreeSet<>(storedTags));
        String expected = "long-tag-name-goes-here-0,long-tag-name-goes-here-1,long-tag-name-goes-here-10,long-tag-name-goes-here-11,long-tag-name-goes-here-12,long-tag-name-goes-here-13,long-tag-name-goes-here-14,long-tag-name-goes-here-15,long-tag-name-goes-here-16,long-tag-name-goes-here-17,long-tag-name-goes-here-18,long-tag-name-goes-here-19,long-tag-name-goes-here-2,long-tag-name-goes-here-20,long-tag-name-goes-here-21,long-tag-name-goes-here-22,long-tag-name-goes-here-23,long-tag-name-goes-here-24,long-tag-name-goes-here-25,long-tag-name-goes-here-26,long-tag-name-goes-here-27,long-tag-name-goes-here-28,long-tag-name-goes-here-29,long-tag-name-goes-here-3,long-tag-name-goes-here-30,long-tag-name-goes-here-31,long-tag-name-goes-here-32,long-tag-name-goes-here-33,long-tag-name-goes-here-34,long-tag-name-goes-here-35,long-tag-name-goes-here-36,long-tag-name-goes-here-37,long-tag-name-goes-here-38,long-tag-name-goes-here-39,long-tag-name-goes-here-4,long-tag-name-goes-here-40,long-tag-name-goes-here-41,long-tag-name-goes-here-42,long-tag-name-goes-here-43,long-tag-name-goes-here-44,long-tag-name-goes-here-45,long-tag-name-goes-here-46,long-tag-name-goes-here-47,long-tag-name-goes-here-48,long-tag-name-goes-here-49,long-tag-name-goes-here-5,long-tag-name-goes-here-50,long-tag-name-goes-here-51,long-tag-name-goes-here-52,long-tag-name-goes-here-53,long-tag-name-goes-here-54,long-tag-name-goes-here-55,long-tag-name-goes-here-56,long-tag-name-goes-here-57,long-tag-name-goes-here-58,long-tag-name-goes-here-59,long-tag-name-goes-here-6,long-tag-name-goes-here-60,long-tag-name-goes-here-61,long-tag-name-goes-here-62,long-tag-name-goes-here-63,long-tag-name-goes-here-64,long-tag-name-goes-here-65,long-tag-name-goes-here-66,long-tag-name-goes-here-67,long-tag-name-goes-here-68,long-tag-name-goes-here-69,long-tag-name-goes-here-7,long-tag-name-goes-here-70,long-tag-name-goes-here-71,long-tag-name-goes-here-72,long-tag-name-goes-here-73,long-tag-name-goes-here-74,long-tag-name-goes-here-75,long-tag-name-goes-here-76,long-tag-name-goes-here-77";
        Assert.assertEquals(expected, actual);
    }

    @Test
    public void testDeleteApiDesign() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);

        String designId = storage.createApiDesign("user", design, "{}");
        
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
        design.setName("API Name");
        design.getTags().add("tag1");
        design.getTags().add("tag2");
        design.setType(ApiDesignType.OpenAPI20);

        String designId = storage.createApiDesign("user", design, "{}");
        
        // Fetch it by its ID
        ApiDesign dbDesign = storage.getApiDesign("user", designId);
        Assert.assertNotNull(dbDesign);
        Assert.assertEquals(design.getCreatedBy(), dbDesign.getCreatedBy());
        Assert.assertEquals(now, dbDesign.getCreatedOn());
        Assert.assertEquals(design.getDescription(), dbDesign.getDescription());
        Assert.assertEquals(design.getName(), dbDesign.getName());
        Assert.assertEquals(design.getType(), dbDesign.getType());
        Assert.assertEquals(new HashSet<String>(Arrays.asList("tag1", "tag2")), dbDesign.getTags());
        
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
        
        // AsyncAPI design
        design = new ApiDesign();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("An async api.");
        design.setName("Async API");
        design.setType(ApiDesignType.AsyncAPI20);

        designId = storage.createApiDesign("user", design, "{}");
        
        // Fetch it by its ID
        dbDesign = storage.getApiDesign("user", designId);
        Assert.assertNotNull(dbDesign);
        Assert.assertEquals(design.getCreatedBy(), dbDesign.getCreatedBy());
        Assert.assertEquals(now, dbDesign.getCreatedOn());
        Assert.assertEquals(design.getDescription(), dbDesign.getDescription());
        Assert.assertEquals(design.getName(), dbDesign.getName());
        Assert.assertEquals(design.getType(), dbDesign.getType());
    }
    
    @Test
    public void testUpdateApiDesign() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setName("API Name");
        design.getTags().add("tag1");
        design.getTags().add("tag2");
        design.setType(ApiDesignType.OpenAPI20);

        String designId = storage.createApiDesign("user", design, "{}");
        design.setId(designId);
        
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
        Assert.assertEquals(design.getCreatedBy(), updatedDesign.getCreatedBy());
        Assert.assertEquals(design.getCreatedOn(), updatedDesign.getCreatedOn());
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

    @Test
    public void testGetContributors() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);

        String id = storage.createApiDesign("user", design, "{}");
        Assert.assertNotNull(id);
        Assert.assertEquals("1", id);
        
        Collection<Contributor> contributors = storage.listContributors("user", id);
        Assert.assertNotNull(contributors);
        Assert.assertFalse(contributors.isEmpty());
        Assert.assertEquals(1, contributors.size());
        Assert.assertEquals("user", contributors.iterator().next().getName());
        Assert.assertEquals(1, contributors.iterator().next().getEdits());
        
        storage.addContent("user", id, ApiContentType.Command, "{1}");
        storage.addContent("user", id, ApiContentType.Command, "{2}");
        storage.addContent("user2", id, ApiContentType.Command, "{3}");
        storage.addContent("user2", id, ApiContentType.Command, "{4}");

        contributors = storage.listContributors("user", id);
        Assert.assertNotNull(contributors);
        Assert.assertFalse(contributors.isEmpty());
        Assert.assertEquals(2, contributors.size());
        
        Iterator<Contributor> iter = contributors.iterator();
        Contributor c1 = iter.next();
        Contributor c2 = iter.next();
        
        Assert.assertTrue(c1.getName().startsWith("user"));
        Assert.assertTrue(c2.getName().startsWith("user"));
        
        if (c1.getName().equals("user")) {
            Assert.assertEquals(3, c1.getEdits());
            Assert.assertEquals(2, c2.getEdits());
        } else {
            Assert.assertEquals(2, c1.getEdits());
            Assert.assertEquals(3, c2.getEdits());
        }
        
        // Add another api design to complicate the data in the tables...
        design = new ApiDesign();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Another design.");
        design.setName("Another API");
        design.setType(ApiDesignType.OpenAPI20);
        storage.createApiDesign("user", design, "{}");

        // The same contributors data should get returned.
        contributors = storage.listContributors("user", id);
        Assert.assertNotNull(contributors);
        Assert.assertFalse(contributors.isEmpty());
        Assert.assertEquals(2, contributors.size());
    }

    @Test
    public void testGetLatestContentDocument() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);
        
        String id = storage.createApiDesign("user", design, "{}");
        Assert.assertNotNull(id);
        Assert.assertEquals("1", id);
        
        storage.addContent("user", id, ApiContentType.Command, "{1}");
        storage.addContent("user", id, ApiContentType.Command, "{2}");
        storage.addContent("user2", id, ApiContentType.Command, "{3}");
        storage.addContent("user2", id, ApiContentType.Document, "{ROLLUP:123}");
        storage.addContent("user2", id, ApiContentType.Command, "{4}");
        
        ApiDesignContent content = storage.getLatestContentDocument("user", id);
        Assert.assertNotNull(content);
        Assert.assertEquals("{ROLLUP:123}", content.getDocument());
        Assert.assertNotNull(content.getContentVersion());
    }

    @Test
    public void testGetContentCommands() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);

        String id = storage.createApiDesign("user", design, "{}");
        Assert.assertNotNull(id);
        Assert.assertEquals("1", id);
        
        storage.addContent("user", id, ApiContentType.Command, "{1}");
        storage.addContent("user", id, ApiContentType.Command, "{2}");
        storage.addContent("user2", id, ApiContentType.Command, "{3}");
        long sinceVersion = storage.addContent("user2", id, ApiContentType.Document, "{ROLLUP:123}");
        storage.addContent("user2", id, ApiContentType.Command, "{4}");
        storage.addContent("user", id, ApiContentType.Command, "{5}");
        
        List<ApiDesignCommand> commands = storage.listContentCommands("user", id, sinceVersion);
        Assert.assertNotNull(commands);
        Assert.assertFalse(commands.isEmpty());
        Assert.assertEquals(2, commands.size());
        Iterator<ApiDesignCommand> iter = commands.iterator();
        Assert.assertEquals("{4}", iter.next().getCommand());
        Assert.assertEquals("{5}", iter.next().getCommand());
    }

    @Test
    public void testGetApiDesignActivity() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);

        String id = storage.createApiDesign("user", design, "{}");
        Assert.assertNotNull(id);
        Assert.assertEquals("1", id);
        
        // Note: the thread.sleep calls are needed to ensure time-based ordering of the content rows.  Without
        // these calls the test would be somewhat non-deterministic (two rows with the same moment in time).
        
        Thread.sleep(5);
        storage.addContent("user", id, ApiContentType.Command, "{1}");
        Thread.sleep(5);
        storage.addContent("user", id, ApiContentType.Command, "{2}");
        Thread.sleep(5);
        storage.addContent("user2", id, ApiContentType.Command, "{3}");
        Thread.sleep(5);
        storage.addContent("user2", id, ApiContentType.Document, "{ROLLUP:123}");
        Thread.sleep(5);
        storage.addContent("user1", id, ApiContentType.Publish, "{PUBLISH:1}");
        Thread.sleep(5);
        storage.addContent("user2", id, ApiContentType.Command, "{4}");
        Thread.sleep(5);
        storage.addContent("user", id, ApiContentType.Command, "{5}");
        
        Collection<ApiDesignChange> activity = storage.listApiDesignActivity(id, 0, 2);
        Assert.assertNotNull(activity);
        Assert.assertFalse(activity.isEmpty());
        Assert.assertEquals(2, activity.size());
        Iterator<ApiDesignChange> iter = activity.iterator();
        Assert.assertEquals("{5}", iter.next().getData());
        Assert.assertEquals("{4}", iter.next().getData());
        
        activity = storage.listApiDesignActivity(id, 1, 3);
        Assert.assertNotNull(activity);
        Assert.assertFalse(activity.isEmpty());
        Assert.assertEquals(2, activity.size());
        iter = activity.iterator();
        Assert.assertEquals("{4}", iter.next().getData());
        Assert.assertEquals("{PUBLISH:1}", iter.next().getData());
        
        activity = storage.listApiDesignActivity(id, 1, 5);
        Assert.assertNotNull(activity);
        Assert.assertFalse(activity.isEmpty());
        Assert.assertEquals(4, activity.size());
        iter = activity.iterator();
        Assert.assertEquals("{4}", iter.next().getData());
        Assert.assertEquals("{PUBLISH:1}", iter.next().getData());
        Assert.assertEquals("{3}", iter.next().getData());
        Assert.assertEquals("{2}", iter.next().getData());

        activity = storage.listApiDesignActivity(id, 1, 50);
        Assert.assertNotNull(activity);
        Assert.assertFalse(activity.isEmpty());
        Assert.assertEquals(5, activity.size());
        iter = activity.iterator();
        Assert.assertEquals("{4}", iter.next().getData());
        Assert.assertEquals("{PUBLISH:1}", iter.next().getData());
        Assert.assertEquals("{3}", iter.next().getData());
        Assert.assertEquals("{2}", iter.next().getData());
        Assert.assertEquals("{1}", iter.next().getData());
        
        Assert.assertEquals("API Name", activity.iterator().next().getApiName());
        Assert.assertEquals(id, activity.iterator().next().getApiId());
    }
    
    @Test
    public void testEditingSessionUuids() throws Exception {
        String user = "user1";
        String secret = "123456789-0";
        
        // First, create an API
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy(user);
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);
        String designId = storage.createApiDesign(user, design, "{}");
        ApiDesignContent content = storage.getLatestContentDocument(user, designId);
        long contentVersion = content.getContentVersion();

        // Now create an editing session UUID
        String uuid = UUID.randomUUID().toString();
        String hash = DigestUtils.sha512Hex("12345" + user + secret);
        storage.createEditingSessionUuid(uuid, designId, user, hash, contentVersion, System.currentTimeMillis() + 10000);
        
        // Lookup the created UUID
        long uuidContentVersion = storage.lookupEditingSessionUuid(uuid, designId, user, hash);
        Assert.assertEquals(contentVersion, uuidContentVersion);
        
        // Try to look up an invalid one - should fail.
        try {
            storage.lookupEditingSessionUuid(uuid, designId, user, hash + "-invalid");
            Assert.fail("Expected to get a StorageException!");
        } catch (StorageException e) {
            // Expected
        }
        
        // Now consume the UUID row
        boolean consumed = storage.consumeEditingSessionUuid(uuid, designId, user, hash);
        Assert.assertTrue(consumed);

        // Try to look up the UUID again - should fail now that it's consumed.
        try {
            storage.lookupEditingSessionUuid(uuid, designId, user, hash);
            Assert.fail("Expected to get a StorageException!");
        } catch (StorageException e) {
            // Expected
        }
        
        // Try to consume the UUID row again - rval should be false
        consumed = storage.consumeEditingSessionUuid(uuid, designId, user, hash);
        Assert.assertFalse(consumed);
    }

    @Test
    public void testCreateCollaborationInvite() throws Exception {
        // First create an API design.
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);

        String id = storage.createApiDesign("user", design, "{}");

        // Now create a collaboration invite
        String inviteId = UUID.randomUUID().toString();
        String designId = id;
        String userId = "user";
        String username = "User";
        String role = "collaborator";
        String subject = "Name of the King";
        storage.createCollaborationInvite(inviteId, designId, userId, username, role, subject);
    }

    @Test
    public void testListCollaborationInvites() throws Exception {
        // First create an API design.
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);

        String id = storage.createApiDesign("user", design, "{}");

        String designId = id;
        String userId = "user";
        String username = "User";
        String role = "collaborator";
        String subject = "Tale of Two Cities";
        
        // Now create a few collaboration invites
        storage.createCollaborationInvite(UUID.randomUUID().toString(), designId, userId, username, role, subject);
        storage.createCollaborationInvite(UUID.randomUUID().toString(), designId, userId, username, role, subject);
        storage.createCollaborationInvite(UUID.randomUUID().toString(), designId, userId, username, role, subject);
        
        // Now get the list of invites
        List<Invitation> invites = storage.listCollaborationInvites(designId, "user");
        Assert.assertNotNull(invites);
        Assert.assertEquals(3, invites.size());

        // What if the user doesn't have access?
        invites = storage.listCollaborationInvites(designId, "user2");
        Assert.assertNotNull(invites);
        Assert.assertTrue(invites.isEmpty());

        // Now some extra data...
        String designId2 = storage.createApiDesign("user", design, "{}");
        storage.createCollaborationInvite(UUID.randomUUID().toString(), designId2, userId, username, role, subject);
        storage.createCollaborationInvite(UUID.randomUUID().toString(), designId2, userId, username, role, subject);

        // Same invite list
        invites = storage.listCollaborationInvites(designId, "user");
        Assert.assertNotNull(invites);
        Assert.assertEquals(3, invites.size());
        Assert.assertEquals(designId, invites.get(0).getDesignId());
        Assert.assertEquals("user", invites.get(0).getCreatedBy());
        Assert.assertNotNull(invites.get(0).getInviteId());
        Assert.assertEquals("pending", invites.get(0).getStatus());
        Assert.assertEquals(subject, invites.get(0).getSubject());
    }
    

    @Test
    public void testUpdateCollaborationInviteStatus() throws Exception {
        // First create an API design.
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);

        String id = storage.createApiDesign("user", design, "{}");

        String designId = id;
        String userId = "user";
        String username = "User";
        String role = "collaborator";
        String subject = "Jumping Jack Flash";
        
        // Now create an invite
        String inviteId = UUID.randomUUID().toString();
        storage.createCollaborationInvite(inviteId, designId, userId, username, role, subject);
        
        // Now get the list of invites
        List<Invitation> invites = storage.listCollaborationInvites(designId, "user");
        Assert.assertNotNull(invites);
        Assert.assertEquals(1, invites.size());
        Assert.assertEquals(designId, invites.get(0).getDesignId());
        Assert.assertEquals("user", invites.get(0).getCreatedBy());
        Assert.assertNotNull(invites.get(0).getInviteId());
        Assert.assertEquals("pending", invites.get(0).getStatus());
        Assert.assertNull(invites.get(0).getModifiedBy());
        Assert.assertNull(invites.get(0).getModifiedOn());
        Assert.assertEquals(subject, invites.get(0).getSubject());
        
        // Now change the invite status
        boolean b = storage.updateCollaborationInviteStatus(inviteId, "pending", "accepted", "user2");
        Assert.assertTrue(b);

        // Now get the list of invites again - the status should be updated
        invites = storage.listCollaborationInvites(designId, "user");
        Assert.assertNotNull(invites);
        Assert.assertEquals(1, invites.size());
        Assert.assertEquals(designId, invites.get(0).getDesignId());
        Assert.assertEquals("user", invites.get(0).getCreatedBy());
        Assert.assertNotNull(invites.get(0).getInviteId());
        Assert.assertEquals("accepted", invites.get(0).getStatus());
        Assert.assertEquals("user2", invites.get(0).getModifiedBy());
        Assert.assertNotNull(invites.get(0).getModifiedOn());
        
        // Now try again to change the invite status - should fail! (can only accept once)
        b = storage.updateCollaborationInviteStatus(inviteId, "pending", "accepted", "user3");
        Assert.assertFalse(b);
    }

    @Test
    public void testGetCollaborationInvite() throws Exception {
        // First create an API design.
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);

        String id = storage.createApiDesign("user", design, "{}");

        String inviteId = UUID.randomUUID().toString();
        String designId = id;
        String userId = "user";
        String username = "User";
        String role = "collaborator";
        String subject = "Along Came a Spider";
        
        storage.createCollaborationInvite(inviteId, designId, userId, username, role, subject);
        
        Invitation invite = storage.getCollaborationInvite(designId, inviteId);
        Assert.assertNotNull(invite);
        Assert.assertEquals(userId, invite.getCreatedBy());
        Assert.assertNotNull(invite.getCreatedOn());
        Assert.assertEquals(designId, invite.getDesignId());
        Assert.assertEquals(inviteId, invite.getInviteId());
        Assert.assertNull(invite.getModifiedBy());
        Assert.assertNull(invite.getModifiedOn());
        Assert.assertEquals("pending", invite.getStatus());
        Assert.assertEquals(subject, invite.getSubject());
        
        storage.updateCollaborationInviteStatus(inviteId, "pending", "accepted", userId);
        invite = storage.getCollaborationInvite(designId, inviteId);
        Assert.assertNotNull(invite);
        Assert.assertEquals(userId, invite.getCreatedBy());
        Assert.assertNotNull(invite.getCreatedOn());
        Assert.assertEquals(designId, invite.getDesignId());
        Assert.assertEquals(inviteId, invite.getInviteId());
        Assert.assertEquals(userId, invite.getModifiedBy());
        Assert.assertNotNull(invite.getModifiedOn());
        Assert.assertEquals("accepted", invite.getStatus());
    }

    @Test
    public void testGetUserActivity() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user1");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);

        String id = storage.createApiDesign("user", design, "{}");
        Assert.assertNotNull(id);
        Assert.assertEquals("1", id);
        
        // Note: the thread.sleep calls are needed to ensure time-based ordering of the content rows.  Without
        // these calls the test would be somewhat non-deterministic (two rows with the same moment in time).
        
        Thread.sleep(5);
        storage.addContent("user1", id, ApiContentType.Command, "{1}");
        Thread.sleep(5);
        storage.addContent("user1", id, ApiContentType.Command, "{2}");
        Thread.sleep(5);
        storage.addContent("user2", id, ApiContentType.Command, "{3}");
        Thread.sleep(5);
        storage.addContent("user2", id, ApiContentType.Document, "{ROLLUP:123}");
        Thread.sleep(5);
        storage.addContent("user1", id, ApiContentType.Publish, "{PUBLISH:1}");
        Thread.sleep(5);
        storage.addContent("user2", id, ApiContentType.Command, "{4}");
        Thread.sleep(5);
        storage.addContent("user1", id, ApiContentType.Command, "{5}");
        
        Collection<ApiDesignChange> activity = storage.listUserActivity("user1", 0, 2);
        Assert.assertNotNull(activity);
        Assert.assertFalse(activity.isEmpty());
        Assert.assertEquals(2, activity.size());
        Iterator<ApiDesignChange> iter = activity.iterator();
        Assert.assertEquals("{5}", iter.next().getData());
        Assert.assertEquals("{PUBLISH:1}", iter.next().getData());
        
        activity = storage.listUserActivity("user1", 1, 3);
        Assert.assertNotNull(activity);
        Assert.assertFalse(activity.isEmpty());
        Assert.assertEquals(2, activity.size());
        iter = activity.iterator();
        Assert.assertEquals("{PUBLISH:1}", iter.next().getData());
        Assert.assertEquals("{2}", iter.next().getData());
        
        activity = storage.listUserActivity("user1", 1, 50);
        Assert.assertNotNull(activity);
        Assert.assertFalse(activity.isEmpty());
        Assert.assertEquals(3, activity.size());
        iter = activity.iterator();
        Assert.assertEquals("{PUBLISH:1}", iter.next().getData());
        Assert.assertEquals("{2}", iter.next().getData());
        Assert.assertEquals("{1}", iter.next().getData());
        
        Assert.assertEquals("API Name", activity.iterator().next().getApiName());
        Assert.assertEquals(id, activity.iterator().next().getApiId());
    }
    
    @Test
    public void testGetPublications() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);

        String id = storage.createApiDesign("user", design, "{}");
        Assert.assertNotNull(id);
        Assert.assertEquals("1", id);
        
        // Note: the thread.sleep calls are needed to ensure time-based ordering of the content rows.  Without
        // these calls the test would be somewhat non-deterministic (two rows with the same moment in time).
        
        Thread.sleep(5);
        storage.addContent("user", id, ApiContentType.Command, "{1}");
        Thread.sleep(5);
        storage.addContent("user", id, ApiContentType.Command, "{2}");
        Thread.sleep(5);
        storage.addContent("user", id, ApiContentType.Publish, "{Publish-3}");
        Thread.sleep(5);
        /*long sinceVersion = */storage.addContent("user2", id, ApiContentType.Document, "{ROLLUP:123}");
        Thread.sleep(5);
        storage.addContent("user", id, ApiContentType.Command, "{4}");
        Thread.sleep(5);
        storage.addContent("user2", id, ApiContentType.Publish, "{Publish-5}");
        
        Collection<ApiPublication> activity = storage.listApiDesignPublications(id, 0, 10);
        Assert.assertNotNull(activity);
        Assert.assertFalse(activity.isEmpty());
        Assert.assertEquals(2, activity.size());
        Iterator<ApiPublication> iter = activity.iterator();
        ApiPublication first = iter.next();
        ApiPublication second = iter.next();
        Assert.assertEquals("{Publish-5}", first.getInfo());
        Assert.assertEquals("{Publish-3}", second.getInfo());
        
        activity = storage.listApiDesignPublicationsBy(id, "user", 0, 10);
        Assert.assertNotNull(activity);
        Assert.assertFalse(activity.isEmpty());
        Assert.assertEquals(1, activity.size());

        activity = storage.listApiDesignPublicationsBy(id, "user2", 0, 10);
        Assert.assertNotNull(activity);
        Assert.assertFalse(activity.isEmpty());
        Assert.assertEquals(1, activity.size());
    }

    @Test
    public void testGetMocks() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);

        String id = storage.createApiDesign("user", design, "{}");
        Assert.assertNotNull(id);
        Assert.assertEquals("1", id);
        
        // Note: the thread.sleep calls are needed to ensure time-based ordering of the content rows.  Without
        // these calls the test would be somewhat non-deterministic (two rows with the same moment in time).
        
        Thread.sleep(5);
        storage.addContent("user", id, ApiContentType.Command, "{1}");
        Thread.sleep(5);
        storage.addContent("user", id, ApiContentType.Command, "{2}");
        Thread.sleep(5);
        storage.addContent("user", id, ApiContentType.Mock, "{Mock-3}");
        Thread.sleep(5);
        /*long sinceVersion = */storage.addContent("user2", id, ApiContentType.Document, "{ROLLUP:123}");
        Thread.sleep(5);
        storage.addContent("user", id, ApiContentType.Command, "{4}");
        Thread.sleep(5);
        storage.addContent("user", id, ApiContentType.Publish, "{Publish-5}");
        Thread.sleep(5);
        storage.addContent("user", id, ApiContentType.Mock, "{Mock-6}");
        
        Collection<ApiMock> activity = storage.listApiDesignMocks(id, 0, 10);
        Assert.assertNotNull(activity);
        Assert.assertFalse(activity.isEmpty());
        Assert.assertEquals(2, activity.size());
        Iterator<ApiMock> iter = activity.iterator();
        ApiMock first = iter.next();
        ApiMock second = iter.next();
        Assert.assertEquals("{Mock-6}", first.getInfo());
        Assert.assertEquals("{Mock-3}", second.getInfo());
    }

    
    @Test
    public void testGetRecentApiDesigns() throws Exception {
        Collection<ApiDesign> designs = storage.listApiDesigns("user");
        Assert.assertNotNull(designs);
        Assert.assertEquals(0, designs.size());

        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setDescription("Just added the design!");
        design.setType(ApiDesignType.OpenAPI20);

        // Add 8 designs as user1
        design.setName("API 1");
        String did1 = storage.createApiDesign("user", design, "{}");
        design.setName("API 2");
        String did2 = storage.createApiDesign("user", design, "{}");
        design.setName("API 3");
        String did3 = storage.createApiDesign("user", design, "{}");
        design.setName("API 4");
        String did4 = storage.createApiDesign("user", design, "{}");
        design.setName("API 5");
        String did5 = storage.createApiDesign("user", design, "{}");
        design.setName("API 6");
        String did6 = storage.createApiDesign("user", design, "{}");
        design.setName("API 7");
        String did7 = storage.createApiDesign("user", design, "{}");
        design.setName("API 8");
        String did8 = storage.createApiDesign("user", design, "{}");

        Thread.sleep(5);
        storage.addContent("user", did1, ApiContentType.Command, "{1}");
        Thread.sleep(5);
        storage.addContent("user", did2, ApiContentType.Command, "{2}");
        Thread.sleep(5);
        storage.addContent("user", did1, ApiContentType.Command, "{3}");
        Thread.sleep(5);
        storage.addContent("user", did3, ApiContentType.Document, "{ROLLUP:123}");
        Thread.sleep(5);
        storage.addContent("user", did5, ApiContentType.Command, "{6}");
        Thread.sleep(5);
        storage.addContent("user", did4, ApiContentType.Command, "{4}");
        Thread.sleep(5);
        storage.addContent("user", did2, ApiContentType.Command, "{5}");

        Thread.sleep(5);
        storage.addContent("user", did6, ApiContentType.Command, "{7}");
        Thread.sleep(5);
        storage.addContent("user", did6, ApiContentType.Command, "{8}");
        Thread.sleep(5);
        storage.addContent("user", did7, ApiContentType.Command, "{9}");
        Thread.sleep(5);
        storage.addContent("user", did8, ApiContentType.Command, "{10}");
        Thread.sleep(5);
        storage.addContent("user", did7, ApiContentType.Command, "{11}");

        Thread.sleep(5);
        storage.addContent("user", did8, ApiContentType.Command, "{12}");
        Thread.sleep(5);
        storage.addContent("user", did5, ApiContentType.Command, "{13}");
        Thread.sleep(5);
        storage.addContent("user", did1, ApiContentType.Command, "{14}");

        designs = storage.getRecentApiDesigns("user");
        Assert.assertNotNull(designs);
        Assert.assertEquals(5, designs.size());
        
        Iterator<ApiDesign> iter = designs.iterator();
		ApiDesign first = iter.next();
		ApiDesign second = iter.next();
		ApiDesign third = iter.next();
        
		Assert.assertEquals("1", first.getId());
		Assert.assertEquals("5", second.getId());
		Assert.assertEquals("8", third.getId());
    }

    @Test
    public void testCodegenProjects() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setName("API Name (1)");
        design.setType(ApiDesignType.OpenAPI20);
        
        String designId1 = storage.createApiDesign("user", design, "{}");
        Assert.assertNotNull(designId1);
        Assert.assertEquals("1", designId1);

        ApiDesign design2 = new ApiDesign();
        design2.setCreatedBy("user");
        design2.setCreatedOn(now);
        design2.setName("API Name (2)");
        design2.setType(ApiDesignType.OpenAPI20);

        String designId2 = storage.createApiDesign("user", design2, "{}");
        Assert.assertNotNull(designId2);
        Assert.assertEquals("2", designId2);
        
        // Create a codegen project
        CodegenProject project = new CodegenProject();
        project.setCreatedBy("user");
        project.setCreatedOn(now);
        project.setType(CodegenProjectType.thorntail);
        project.setDesignId(designId1);
        project.setAttributes(new HashMap<>());
        project.getAttributes().put("property-1", "value-1");
        project.getAttributes().put("property-2", "value-2");
        String projectId = storage.createCodegenProject("user", project);
        
        // Verify it
        Collection<CodegenProject> projects = storage.listCodegenProjects("user", designId1);
        Assert.assertFalse(projects.isEmpty());
        CodegenProject listedProject = projects.iterator().next();
        Assert.assertNotNull(listedProject.getId());
        Assert.assertEquals(projectId, listedProject.getId());
        Assert.assertEquals(project.getCreatedBy(), listedProject.getCreatedBy());
        Assert.assertEquals(project.getDesignId(), listedProject.getDesignId());
        Assert.assertEquals(project.getCreatedBy(), listedProject.getModifiedBy());
        Assert.assertEquals(project.getAttributes(), listedProject.getAttributes());
        Assert.assertEquals(project.getType(), listedProject.getType());
        
        // Verify again
        CodegenProject fetchedProject = storage.getCodegenProject("user", designId1, projectId);
        Assert.assertNotNull(fetchedProject.getId());
        Assert.assertEquals(projectId, fetchedProject.getId());
        Assert.assertEquals(project.getCreatedBy(), fetchedProject.getCreatedBy());
        Assert.assertEquals(project.getDesignId(), fetchedProject.getDesignId());
        Assert.assertEquals(project.getCreatedBy(), listedProject.getModifiedBy());
        Assert.assertEquals(project.getAttributes(), fetchedProject.getAttributes());
        Assert.assertEquals(project.getType(), fetchedProject.getType());
        
        // Create two more projects
        project = new CodegenProject();
        project.setCreatedBy("user2");
        project.setCreatedOn(now);
        project.setType(CodegenProjectType.jaxrs);
        project.setDesignId(designId1);
        project.setAttributes(new HashMap<>());
        storage.createCodegenProject("user2", project);
        project = new CodegenProject();
        project.setCreatedBy("user2");
        project.setCreatedOn(now);
        project.setType(CodegenProjectType.springBoot);
        project.setDesignId(designId1);
        project.setAttributes(new HashMap<>());
        storage.createCodegenProject("user2", project);
        
        // Verify them
        projects = storage.listCodegenProjects("user", designId1);
        Assert.assertFalse(projects.isEmpty());
        Assert.assertEquals(3, projects.size());
        
        // Update a project
        project = new CodegenProject();
        project.setId(projectId);
        project.setCreatedBy("user");
        project.setCreatedOn(now);
        project.setType(CodegenProjectType.vertx);
        project.setDesignId(designId1);
        project.setAttributes(new HashMap<>());
        project.getAttributes().put("property-3", "value-3");
        project.getAttributes().put("property-4", "value-4");
        storage.updateCodegenProject("user", project);

        // Verify it
        projects = storage.listCodegenProjects("user", designId1);
        Assert.assertFalse(projects.isEmpty());
        listedProject = projects.iterator().next();
        Assert.assertNotNull(listedProject.getId());
        Assert.assertEquals(project.getCreatedBy(), listedProject.getCreatedBy());
        Assert.assertEquals(project.getDesignId(), listedProject.getDesignId());
        Assert.assertEquals("user", listedProject.getModifiedBy());
        Assert.assertEquals(project.getAttributes(), listedProject.getAttributes());
        Assert.assertEquals(project.getType(), listedProject.getType());
        
        // Delete 1
        storage.deleteCodegenProject("user", designId1, projectId);
        // Verify
        projects = storage.listCodegenProjects("user", designId1);
        Assert.assertEquals(2, projects.size());

        // Delete all
        storage.deleteCodegenProjects("user", designId1);
        // Verify
        projects = storage.listCodegenProjects("user", designId1);
        Assert.assertTrue(projects.isEmpty());
    }

    @SuppressWarnings("unused")
    @Test
    public void testUndoRedoContent() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setName("API Name");
        design.setType(ApiDesignType.OpenAPI20);

        String id = storage.createApiDesign("user", design, "{}");
        Assert.assertNotNull(id);
        Assert.assertEquals("1", id);

        long v1 = storage.addContent("user", id, ApiContentType.Command, "{1}");
        long v2 = storage.addContent("user", id, ApiContentType.Command, "{2}");
        long v3 = storage.addContent("user2", id, ApiContentType.Command, "{3}");
        long v4 = storage.addContent("user2", id, ApiContentType.Command, "{4}");
        long v5 = storage.addContent("user", id, ApiContentType.Command, "{5}");

        List<ApiDesignCommand> commands = storage.listContentCommands("user", id, v1);
        Assert.assertNotNull(commands);
        Assert.assertFalse(commands.isEmpty());
        Assert.assertEquals(4, commands.size());
        Iterator<ApiDesignCommand> iter = commands.iterator();
        Assert.assertEquals("{2}", iter.next().getCommand());
        Assert.assertEquals("{3}", iter.next().getCommand());
        Assert.assertEquals("{4}", iter.next().getCommand());
        Assert.assertEquals("{5}", iter.next().getCommand());
        
        if (!storage.undoContent("user", id, v2)) {
            Assert.fail("Failed to undo content.");
        }
        if (storage.undoContent("user", id, v3)) {
            Assert.fail("Was able to undo content but shouldn't have!");
        }

        commands = storage.listContentCommands("user", id, v1);
        Assert.assertNotNull(commands);
        Assert.assertFalse(commands.isEmpty());
        Assert.assertEquals(3, commands.size());
        iter = commands.iterator();
        Assert.assertEquals("{3}", iter.next().getCommand());
        Assert.assertEquals("{4}", iter.next().getCommand());
        Assert.assertEquals("{5}", iter.next().getCommand());
        
        // Can't undo v2 because it's already undone.
        if (storage.undoContent("user", id, v2)) {
            Assert.fail("Was able to undo content but shouldn't have!");
        }
        // Undo v5
        if (!storage.undoContent("user", id, v5)) {
            Assert.fail("Failed to undo content.");
        }
        // Redo v2 (restoring it)
        if (!storage.redoContent("user", id, v2)) {
            Assert.fail("Failed to redo content.");
        }
        // Can't redo v2 again (already done)
        if (storage.redoContent("user", id, v2)) {
            Assert.fail("Was able to redo content but shouldn't have!");
        }

        commands = storage.listContentCommands("user", id, v1);
        Assert.assertNotNull(commands);
        Assert.assertFalse(commands.isEmpty());
        Assert.assertEquals(3, commands.size());
        iter = commands.iterator();
        Assert.assertEquals("{2}", iter.next().getCommand());
        Assert.assertEquals("{3}", iter.next().getCommand());
        Assert.assertEquals("{4}", iter.next().getCommand());
    }
    
    @Test
    public void testValidationProfiles() throws Exception {
        Collection<ValidationProfile> profiles = storage.listValidationProfiles("user1");
        Assert.assertTrue(profiles.isEmpty());
        
        ValidationProfile profile = new ValidationProfile();
        profile.setName("Profile 1");
        profile.setDescription("This is the first profile.");
        profile.getSeverities().put("k-high", ValidationSeverity.high);
        profile.getSeverities().put("k-ignore", ValidationSeverity.ignore);
        profile.getSeverities().put("k-low", ValidationSeverity.low);
        profile.getSeverities().put("k-medium", ValidationSeverity.medium);
        long pid1 = storage.createValidationProfile("user1", profile);
        Assert.assertNotNull(pid1);
        Assert.assertTrue(pid1 >= 0);
        
        profiles = storage.listValidationProfiles("user1");
        Assert.assertFalse(profiles.isEmpty());
        Assert.assertEquals(1, profiles.size());
        ValidationProfile p = profiles.iterator().next();
        Assert.assertEquals(pid1, p.getId());
        Assert.assertEquals("Profile 1", p.getName());
        Assert.assertEquals("This is the first profile.", p.getDescription());
        Map<String, ValidationSeverity> severities = p.getSeverities();
        Assert.assertNotNull(severities);
        Assert.assertEquals(ValidationSeverity.high, severities.get("k-high"));
        Assert.assertEquals(ValidationSeverity.low, severities.get("k-low"));
        Assert.assertEquals(ValidationSeverity.medium, severities.get("k-medium"));
        Assert.assertEquals(ValidationSeverity.ignore, severities.get("k-ignore"));
        
        profile = new ValidationProfile();
        profile.setName("Profile 2");
        profile.setDescription("This is the second profile.");
        long pid2 = storage.createValidationProfile("user1", profile);
        Assert.assertNotNull(pid2);
        Assert.assertTrue(pid2 >= 0);
        
        profiles = storage.listValidationProfiles("user1");
        Assert.assertFalse(profiles.isEmpty());
        Assert.assertEquals(2, profiles.size());

        profiles = storage.listValidationProfiles("user2");
        Assert.assertTrue(profiles.isEmpty());
        
        storage.deleteValidationProfile("user1", pid2);
        profiles = storage.listValidationProfiles("user1");
        Assert.assertFalse(profiles.isEmpty());
        Assert.assertEquals(1, profiles.size());
        
        profile = new ValidationProfile();
        profile.setId(pid1);
        profile.setName("Profile 1 (updated)");
        profile.setDescription("This is the first profile (updated).");
        profile.getSeverities().put("k-high", ValidationSeverity.low);
        profile.getSeverities().put("k-ignore", ValidationSeverity.low);
        profile.getSeverities().put("k-low", ValidationSeverity.low);
        profile.getSeverities().put("k-medium", ValidationSeverity.high);
        storage.updateValidationProfile("user1", profile);
        
        profiles = storage.listValidationProfiles("user1");
        Assert.assertFalse(profiles.isEmpty());
        Assert.assertEquals(1, profiles.size());
        p = profiles.iterator().next();
        Assert.assertEquals(pid1, p.getId());
        Assert.assertEquals("Profile 1 (updated)", p.getName());
        Assert.assertEquals("This is the first profile (updated).", p.getDescription());
        severities = p.getSeverities();
        Assert.assertNotNull(severities);
        Assert.assertEquals(ValidationSeverity.low, severities.get("k-high"));
        Assert.assertEquals(ValidationSeverity.low, severities.get("k-low"));
        Assert.assertEquals(ValidationSeverity.high, severities.get("k-medium"));
        Assert.assertEquals(ValidationSeverity.low, severities.get("k-ignore"));
        
        try {
            storage.deleteValidationProfile("user1", pid2+1);
            Assert.fail();
        } catch (NotFoundException nfe) {}

    }

    @Test
    public void testSharing() throws Exception {
        ApiDesign design = new ApiDesign();
        Date now = new Date();
        design.setCreatedBy("user");
        design.setCreatedOn(now);
        design.setName("Shared API");
        design.setType(ApiDesignType.OpenAPI30);

        String id = storage.createApiDesign("user", design, "{}");
        Assert.assertNotNull(id);
        Assert.assertEquals("1", id);

        SharingConfiguration sc = storage.getSharingConfig("1");
        Assert.assertNull(sc);

        storage.setSharingConfig("1", "12345", SharingLevel.DOCUMENTATION);

        sc = storage.getSharingConfig("1");
        Assert.assertNotNull(sc);
        Assert.assertEquals("12345", sc.getUuid());
        Assert.assertEquals(SharingLevel.DOCUMENTATION, sc.getLevel());

        storage.setSharingConfig("1", "54321", SharingLevel.NONE);

        sc = storage.getSharingConfig("1");
        Assert.assertNotNull(sc);
        Assert.assertEquals("54321", sc.getUuid());
        Assert.assertEquals(SharingLevel.NONE, sc.getLevel());
    }

    @Test
    public void testCreateApiTemplate() throws Exception {
        StoredApiTemplate apiTemplate = new StoredApiTemplate(
                "uuid",
                ApiDesignType.OpenAPI30,
                "template 1",
                "a template",
                "test runner",
                "{}"
        );

        this.storage.createApiTemplate(apiTemplate);

        try {
            // Fail on conflict
            this.storage.createApiTemplate(apiTemplate);
            Assert.fail();
        } catch (StorageException e) {
            // expected
        }
    }

    @Test
    public void testGetStoredApiTemplate() throws Exception {
        StoredApiTemplate apiTemplate = new StoredApiTemplate(
                "uuid",
                ApiDesignType.OpenAPI30,
                "template 1",
                "a template",
                "test runner",
                "{}"
        );

        this.storage.createApiTemplate(apiTemplate);

        final StoredApiTemplate storedApiTemplate = this.storage.getStoredApiTemplate("uuid");

        Assert.assertNotNull(storedApiTemplate);
        Assert.assertEquals(apiTemplate.getTemplateId(), storedApiTemplate.getTemplateId());
        Assert.assertEquals(apiTemplate.getName(), storedApiTemplate.getName());
        Assert.assertEquals(apiTemplate.getDescription(), storedApiTemplate.getDescription());
        Assert.assertEquals(apiTemplate.getType(), storedApiTemplate.getType());
        Assert.assertEquals(apiTemplate.getOwner(), storedApiTemplate.getOwner());
        Assert.assertEquals(apiTemplate.getDocument(), storedApiTemplate.getDocument());

        try {
            // Fail on missing template
            this.storage.getStoredApiTemplate("nothing");
            Assert.fail("Expected a NotFoundException");
        } catch (NotFoundException e) {
            // expected
        }
    }

    @Test
    public void testGetStoredApiTemplates() throws Exception {
        StoredApiTemplate templateA = new StoredApiTemplate(
                "uuid1",
                ApiDesignType.OpenAPI30,
                "template A",
                "a template",
                "test runner",
                "{}"
        );
        StoredApiTemplate templateC = new StoredApiTemplate(
                "uuid2",
                ApiDesignType.OpenAPI30,
                "template C",
                "another template",
                "test runner",
                "{}"
        );
        StoredApiTemplate templateB = new StoredApiTemplate(
                "uuid3",
                ApiDesignType.OpenAPI20,
                "template B",
                "another other template",
                "test runner",
                "{}"
        );

        this.storage.createApiTemplate(templateA);
        this.storage.createApiTemplate(templateC);
        this.storage.createApiTemplate(templateB);

        List<StoredApiTemplate> storedApiTemplates = this.storage.getStoredApiTemplates();

        Assert.assertNotNull(storedApiTemplates);
        
        // Should be ordered by name: templateA, templateB, templateC
        Assert.assertEquals(3, storedApiTemplates.size());
        Assert.assertEquals(templateA.getName(), storedApiTemplates.get(0).getName());
        Assert.assertEquals(templateB.getName(), storedApiTemplates.get(1).getName());
        Assert.assertEquals(templateC.getName(), storedApiTemplates.get(2).getName());

        storedApiTemplates = this.storage.getStoredApiTemplates(ApiDesignType.OpenAPI30);

        Assert.assertNotNull(storedApiTemplates);
        // Should find templateA, templateC
        Assert.assertEquals(2, storedApiTemplates.size());
        Assert.assertEquals(templateA.getName(), storedApiTemplates.get(0).getName());
        Assert.assertEquals(templateC.getName(), storedApiTemplates.get(1).getName());

        storedApiTemplates = this.storage.getStoredApiTemplates(ApiDesignType.GraphQL);

        Assert.assertNotNull(storedApiTemplates);
        // Should find nothing
        Assert.assertEquals(0, storedApiTemplates.size());

    }

    @Test
    public void testUpdateApiTemplate() throws Exception {
        StoredApiTemplate apiTemplate = new StoredApiTemplate(
                "uuid",
                ApiDesignType.OpenAPI30,
                "template 1",
                "a template",
                "test runner",
                "{}"
        );

        this.storage.createApiTemplate(apiTemplate);

        apiTemplate.setName("Changed name"); // Should be reflected
        apiTemplate.setType(ApiDesignType.GraphQL); // Should not be reflected

        this.storage.updateApiTemplate(apiTemplate);

        StoredApiTemplate updatedApiTemplate = this.storage.getStoredApiTemplate(apiTemplate.getTemplateId());
        Assert.assertNotNull(updatedApiTemplate);
        Assert.assertEquals(apiTemplate.getName(), updatedApiTemplate.getName());
        Assert.assertNotEquals(apiTemplate.getType(), updatedApiTemplate.getType());

        try {
            // Fail on missing template
            StoredApiTemplate anotherTemplate = new StoredApiTemplate(
                    "nothing",
                    ApiDesignType.OpenAPI30,
                    "template 1",
                    "a template",
                    "test runner",
                    "{}"
            );
            this.storage.updateApiTemplate(anotherTemplate);
            Assert.fail("Expected a NotFoundException");
        } catch (NotFoundException e) {
            // expected
        }
    }

    @Test
    public void testDeleteApiTemplate() throws Exception {
        StoredApiTemplate apiTemplate = new StoredApiTemplate(
                "uuid",
                ApiDesignType.OpenAPI30,
                "template 1",
                "a template",
                "test runner",
                "{}"
        );

        this.storage.createApiTemplate(apiTemplate);
        
        this.storage.deleteApiTemplate(apiTemplate.getTemplateId());

        try {
            // Fail on missing template
            this.storage.deleteApiTemplate(apiTemplate.getTemplateId());
            Assert.fail("Expected a NotFoundException");
        } catch (NotFoundException e) {
            // expected
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
