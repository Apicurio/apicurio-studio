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

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Shared base class for all sql statements.
 * @author eric.wittmann@gmail.com
 */
public abstract class CommonSqlStatements implements ISqlStatements {

    /**
     * Returns the database type identifier.
     */
    protected abstract String dbType();

    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#databaseInitialization()
     */
    @Override
    public List<String> databaseInitialization() {
        DdlParser parser = new DdlParser();
        try (InputStream input = getClass().getResourceAsStream("hub_" + dbType() + ".ddl")) {
            return parser.parse(input);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#databaseUpgrade(int, int)
     */
    @Override
    public List<String> databaseUpgrade(int fromVersion, int toVersion) {
        List<String> statements = new ArrayList<>();
        DdlParser parser = new DdlParser();
        
        for (int version = fromVersion + 1; version <= toVersion; version++) {
            try (InputStream input = getClass().getResourceAsStream("upgrade-" + version + "_" + dbType() + ".ddl")) {
                statements.addAll(parser.parse(input));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        
        return statements;
    }
    
    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#getDatabaseVersion()
     */
    @Override
    public String getDatabaseVersion() {
        return "SELECT a.prop_value FROM apicurio a WHERE a.prop_name = ?";
    }

    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#insertLinkedAccount()
     */
    @Override
    public String insertLinkedAccount() {
        return "INSERT INTO accounts (user_id, type, linked_on, used_on, nonce) VALUES (?, ?, ?, ?, ?)";
    }
    
    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#selectLinkedAccountByType()
     */
    @Override
    public String selectLinkedAccountByType() {
        return "SELECT a.* FROM accounts a WHERE a.user_id = ? AND a.type = ?";
    }
    
    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#updateLinkedAccount()
     */
    @Override
    public String updateLinkedAccount() {
        return "UPDATE accounts SET used_on = ?, linked_on = ?, nonce = ? WHERE user_id = ? AND type = ?";
    }

    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#selectLinkedAccounts()
     */
    @Override
    public String selectLinkedAccounts() {
        return "SELECT a.* FROM accounts a WHERE a.user_id = ?";
    }
    
    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#deleteLinkedAccount()
     */
    @Override
    public String deleteLinkedAccount() {
        return "DELETE FROM accounts WHERE user_id = ? AND type = ?";
    }
    
    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#deleteLinkedAccounts()
     */
    @Override
    public String deleteLinkedAccounts() {
        return "DELETE FROM accounts WHERE user_id = ?";
    }

    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#insertApiDesign()
     */
    @Override
    public String insertApiDesign() {
        return "INSERT INTO api_designs (name, description, repository_url, created_by, created_on, modified_by, modified_on, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    }
    
    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#deleteApiDesign()
     */
    @Override
    public String deleteApiDesign() {
        return "DELETE FROM api_designs WHERE id = ?";
    }
    
    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#selectApiDesigns()
     */
    @Override
    public String selectApiDesigns() {
        return "SELECT d.* FROM api_designs d INNER JOIN acl a ON a.design_id = d.id WHERE a.user_id = ?";
    }

    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#selectApiDesignById()
     */
    @Override
    public String selectApiDesignById() {
        return "SELECT d.* FROM api_designs d INNER JOIN acl a ON a.design_id = d.id WHERE d.id = ? AND a.user_id = ?";
    }
    
    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#updateApiDesign()
     */
    @Override
    public String updateApiDesign() {
        return "UPDATE api_designs SET name = ?, description = ?, modified_by = ?, modified_on = ?, tags = ? WHERE id = ?";
    }
    
    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#insertAcl()
     */
    @Override
    public String insertAcl() {
        return "INSERT INTO acl (user_id, design_id, role) VALUES (?, ?, ?)";
    }
    
    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#clearAcl()
     */
    @Override
    public String clearAcl() {
        return "DELETE FROM acl WHERE design_id = ?";
    }
    
    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#hasWritePermission()
     */
    @Override
    public String hasWritePermission() {
        return "SELECT COUNT(*) FROM acl a WHERE a.design_id = ? AND a.user_id = ? AND (a.role = 'owner' OR a.role = 'editor')";
    }
}
