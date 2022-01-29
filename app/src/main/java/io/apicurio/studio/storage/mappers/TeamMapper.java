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

package io.apicurio.studio.storage.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import io.apicurio.common.apps.storage.sql.jdbi.RowMapper;
import io.apicurio.studio.rest.v1.beans.Team;

/**
 * @author eric.wittmann@gmail.com
 */
public class TeamMapper implements RowMapper<Team> {

    public static final TeamMapper instance = new TeamMapper();

    /**
     * Constructor.
     */
    private TeamMapper() {
    }

    /**
     * @see io.apicurio.registry.storage.impl.sql.jdb.RowMapper#map(java.sql.ResultSet)
     */
    @Override
    public Team map(ResultSet rs) throws SQLException {
        Team team = new Team();
        team.setName(rs.getString("name"));
        team.setDescription(rs.getString("description"));
        team.setCreatedBy(rs.getString("createdBy"));
        return team;
    }

}