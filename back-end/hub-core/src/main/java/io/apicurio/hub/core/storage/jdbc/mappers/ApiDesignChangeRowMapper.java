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

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.commons.io.IOUtils;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

import io.apicurio.hub.core.beans.ApiContentType;
import io.apicurio.hub.core.beans.ApiDesignChange;

/**
 * A row mapper to read a single row from the content db as an {@link ApiDesignChange}.
 * @author eric.wittmann@gmail.com
 */
public class ApiDesignChangeRowMapper implements RowMapper<ApiDesignChange> {
    
    public static final ApiDesignChangeRowMapper instance = new ApiDesignChangeRowMapper();

    /**
     * @see org.jdbi.v3.core.mapper.RowMapper#map(java.sql.ResultSet, org.jdbi.v3.core.statement.StatementContext)
     */
    @Override
    public ApiDesignChange map(ResultSet rs, StatementContext ctx) throws SQLException {
        try {
            ApiDesignChange change = new ApiDesignChange();
            change.setApiId(rs.getString("design_id"));
            change.setApiName(rs.getString("name"));
            change.setBy(rs.getString("created_by"));
            change.setData(IOUtils.toString(rs.getCharacterStream("data")));
            change.setOn(rs.getTimestamp("created_on"));
            change.setType(ApiContentType.fromId(rs.getInt("type")));
            change.setVersion(rs.getLong("version"));
            return change;
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

}