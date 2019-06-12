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

package io.apicurio.hub.core.editing;

import java.sql.Driver;
import java.sql.SQLException;
import java.util.Date;

import org.apache.commons.dbcp.BasicDataSource;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.ApiDesignType;
import io.apicurio.hub.core.cmd.OaiCommandExecutor;
import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.hub.core.storage.RollupExecutor;
import io.apicurio.hub.core.storage.jdbc.H2SqlStatements;
import io.apicurio.hub.core.storage.jdbc.JdbcStorage;
import io.apicurio.test.core.TestUtil;

/**
 * @author eric.wittmann@gmail.com
 */
public class EditingSessionManagerTest {
    
    private static int counter = 0;
    static {
        System.setProperty("org.slf4j.simpleLogger.logFile", "System.out");
    }

    private EditingSessionManager manager;
    private JdbcStorage storage;
    private BasicDataSource ds;

    @Before
    public void setUp() {
        storage = new JdbcStorage();
        ds = createInMemoryDatasource();
        HubConfiguration config = new HubConfiguration();
        H2SqlStatements sqlStatements = new H2SqlStatements(config);
        RollupExecutor rollupExecutor = new RollupExecutor();
        rollupExecutor.setStorage(storage);
        rollupExecutor.setOaiCommandExecutor(new OaiCommandExecutor());

        EditingSessionFactory editingSessionFactory = new EditingSessionFactory() {
            /**
             * @see io.apicurio.hub.core.editing.EditingSessionFactory#createEditingSession(java.lang.String)
             */
            @Override
            public IEditingSession createEditingSession(String designId) {
                return new EditingSession(designId, rollupExecutor);
            }
        };

        TestUtil.setPrivateField(storage, "config", config);
        TestUtil.setPrivateField(storage, "dataSource", ds);
        TestUtil.setPrivateField(storage, "sqlStatements", sqlStatements);

        storage.postConstruct();

        manager = new EditingSessionManager();

        TestUtil.setPrivateField(manager, "storage", storage);
        TestUtil.setPrivateField(manager, "editingSessionFactory", editingSessionFactory);
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
        ds.setUrl("jdbc:h2:mem:test" + (counter++) + ";DB_CLOSE_DELAY=-1");
        return ds;
    }

    /**
     * Test method for {@link io.apicurio.hub.core.editing.EditingSessionManager#createSessionUuid(java.lang.String, java.lang.String, java.lang.String, long)}.
     */
    @Test
    public void testCreateSessionUuid() throws Exception {
        ApiDesign design = new ApiDesign();
        design.setName("Test API");
        design.setDescription("A test API.");
        design.setCreatedBy("user");
        design.setCreatedOn(new Date());
        design.setType(ApiDesignType.OpenAPI20);
        String designId = storage.createApiDesign("user", design, "{}");
        String uuid = this.manager.createSessionUuid(designId, "user", "12345-6", 17);
        Assert.assertNotNull(uuid);
    }

    /**
     * Test method for {@link io.apicurio.hub.core.editing.EditingSessionManager#validateSessionUuid(java.lang.String, java.lang.String, java.lang.String, java.lang.String)}.
     */
    @Test
    public void testValidateSessionUuid() throws Exception {
        String user = "user";
        String secret = "12345-6";
        long contentVersion = 17;
        
        ApiDesign design = new ApiDesign();
        design.setName("Test API");
        design.setDescription("A test API.");
        design.setCreatedBy(user);
        design.setCreatedOn(new Date());
        design.setType(ApiDesignType.OpenAPI20);
        String designId = storage.createApiDesign(user, design, "{}");
        String uuid = this.manager.createSessionUuid(designId, "user", secret, contentVersion);
        Assert.assertNotNull(uuid);
        
        long cv = this.manager.validateSessionUuid(uuid, designId, user, secret);
        Assert.assertEquals(contentVersion, cv);
        
        try {
            this.manager.validateSessionUuid(uuid, designId, user, secret);
            Assert.fail("Expected a server error - cannot validate the session UUID twice.");
        } catch (ServerError e) {
            // expected!
        }
    }


    /**
     * Test method for {@link io.apicurio.hub.core.editing.EditingSessionManager#getOrCreateEditingSession(String)}
     */
    @Test
    public void testGetOrCreateEditingSession() throws Exception {
        IEditingSession session = this.manager.getOrCreateEditingSession("100");
        Assert.assertNotNull(session);
        Assert.assertEquals("100", session.getDesignId());
        IEditingSession session2 = this.manager.getOrCreateEditingSession("100");
        Assert.assertNotNull(session);
        Assert.assertEquals("100", session.getDesignId());
        Assert.assertEquals(session, session2);
        IEditingSession session3 = this.manager.getOrCreateEditingSession("101");
        Assert.assertNotNull(session3);
        Assert.assertNotEquals(session, session3);
        Assert.assertEquals("101", session3.getDesignId());
    }

    /**
     * Test method for {@link io.apicurio.hub.core.editing.EditingSessionManager#getEditingSession(String)}
     */
    @Test
    public void testGetEditingSession() throws Exception {
        IEditingSession session = this.manager.getOrCreateEditingSession("200");
        Assert.assertNotNull(session);
        Assert.assertEquals("200", session.getDesignId());
        IEditingSession session2 = this.manager.getEditingSession("200");
        Assert.assertNotNull(session);
        Assert.assertEquals("200", session.getDesignId());
        Assert.assertEquals(session, session2);
        IEditingSession session3 = this.manager.getEditingSession("201");
        Assert.assertNull(session3);
    }

    /**
     * Test method for {@link io.apicurio.hub.core.editing.EditingSessionManager#closeEditingSession(EditingSession)}
     */
    @Test
    public void testCloseEditingSession() throws Exception {
        IEditingSession session = this.manager.getOrCreateEditingSession("300");
        Assert.assertNotNull(session);
        Assert.assertEquals("300", session.getDesignId());
        IEditingSession session2 = this.manager.getEditingSession("300");
        Assert.assertNotNull(session);
        Assert.assertEquals("300", session.getDesignId());
        Assert.assertEquals(session, session2);
        
        this.manager.closeEditingSession(session);
        
        session2 = this.manager.getEditingSession("300");
        Assert.assertNull(session2);
    }
}
