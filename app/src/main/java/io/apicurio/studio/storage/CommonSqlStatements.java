/*
 * Copyright 2021 Red Hat
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

package io.apicurio.studio.storage;

import io.apicurio.common.apps.storage.sql.AbstractCommonSqlStatements;

/**
 * @author eric.wittmann@gmail.com
 */
public abstract class CommonSqlStatements extends AbstractCommonSqlStatements implements SqlStatements {

    /**
     * @see io.apicurio.mas.studio.storage.SqlStatements#insertTeam()
     */
    @Override
    public String insertTeam() {
        return "INSERT INTO teams (tenantId, name, description, createdBy) VALUES (?, ?, ?, ?)";
    }

    /**
     * @see io.apicurio.mas.studio.storage.SqlStatements#selectTeams()
     */
    @Override
    public String selectTeams() {
        return "SELECT t.* FROM teams t WHERE t.tenantId = ?";
    }

    /**
     * @see io.apicurio.mas.studio.storage.SqlStatements#countTeams()
     */
    @Override
    public String countTeams() {
        return selectTeams().replace("SELECT t.*", "SELECT count(t.name)");
    }

    /**
     * @see io.apicurio.mas.studio.storage.SqlStatements#deleteTeam()
     */
    @Override
    public String deleteTeam() {
        // TODO Auto-generated method stub
        return null;
    }

    /**
     * @see io.apicurio.mas.studio.storage.SqlStatements#updateTeam()
     */
    @Override
    public String updateTeam() {
        // TODO Auto-generated method stub
        return null;
    }

}
