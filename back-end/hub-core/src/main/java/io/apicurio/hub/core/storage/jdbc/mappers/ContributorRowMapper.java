/*
 * Copyright 2019 JBoss Inc
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

package io.apicurio.hub.core.storage.jdbc.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

import io.apicurio.hub.core.beans.Contributor;

/**
 * A row mapper to read contributor information from a result set.  Each row in 
 * the result set must have a 'created_by' column and an 'edits' column.
 * @author eric.wittmann@gmail.com
 */
public class ContributorRowMapper implements RowMapper<Contributor> {
    
    public static final ContributorRowMapper instance = new ContributorRowMapper();

    /**
     * @see org.jdbi.v3.core.mapper.RowMapper#map(java.sql.ResultSet, org.jdbi.v3.core.statement.StatementContext)
     */
    @Override
    public Contributor map(ResultSet rs, StatementContext ctx) throws SQLException {
        Contributor contributor = new Contributor();
        contributor.setName(rs.getString("created_by"));
        contributor.setEdits(rs.getInt("edits"));
        return contributor;
    }

}