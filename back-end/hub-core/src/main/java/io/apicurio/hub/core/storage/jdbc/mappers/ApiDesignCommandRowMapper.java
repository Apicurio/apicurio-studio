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

import io.apicurio.hub.core.beans.ApiDesignCommand;

/**
 * A row mapper to read a 'document' style row from the api_content table.
 * @author eric.wittmann@gmail.com
 */
public class ApiDesignCommandRowMapper implements RowMapper<ApiDesignCommand> {
    
    public static final ApiDesignCommandRowMapper instance = new ApiDesignCommandRowMapper();

    /**
     * @see org.jdbi.v3.core.mapper.RowMapper#map(java.sql.ResultSet, org.jdbi.v3.core.statement.StatementContext)
     */
    @Override
    public ApiDesignCommand map(ResultSet rs, StatementContext ctx) throws SQLException {
        try {
            ApiDesignCommand cmd = new ApiDesignCommand();
            cmd.setContentVersion(rs.getLong("version"));
            cmd.setCommand(IOUtils.toString(rs.getCharacterStream("data")));
            cmd.setAuthor(rs.getString("created_by"));
            cmd.setReverted(rs.getInt("reverted") > 0);
            return cmd;
        } catch (IOException e) {
            throw new SQLException(e);
        }
    }

}