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

import io.apicurio.hub.core.beans.SharingInfo;
import io.apicurio.hub.core.beans.SharingLevel;

/**
 * @author eric.wittmann@gmail.com
 */
public class SharingInfoRowMapper implements RowMapper<SharingInfo> {
    
    public static final SharingInfoRowMapper instance = new SharingInfoRowMapper();

    /**
     * @see org.jdbi.v3.core.mapper.RowMapper#map(java.sql.ResultSet, org.jdbi.v3.core.statement.StatementContext)
     */
    @Override
    public SharingInfo map(ResultSet rs, StatementContext ctx) throws SQLException {
        SharingInfo design = new SharingInfo();
        design.setDesignId(rs.getString("design_id"));
        design.setShareUuid(rs.getString("uuid"));
        design.setLevel(SharingLevel.valueOf(rs.getString("level")));
        return design;
    }

}