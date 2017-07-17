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

/**
 * Shared base class for all sql statements.
 * @author eric.wittmann@gmail.com
 */
public abstract class CommonSqlStatements implements ISqlStatements {

    /**
     * @see io.apicurio.hub.api.storage.jdbc.ISqlStatements#insertApiDesign()
     */
    @Override
    public String insertApiDesign() {
        return "INSERT INTO api_designs (name, description, repository_url, created_by, created_on, modified_by, modified_on) VALUES (?, ?, ?, ?, ?, ?, ?)";
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
        return "UPDATE api_designs SET name = ?, description = ?, modified_by = ?, modified_on = ? WHERE id = ?";
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
