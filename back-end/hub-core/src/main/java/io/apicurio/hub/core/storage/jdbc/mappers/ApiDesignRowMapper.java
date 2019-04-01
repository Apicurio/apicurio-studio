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
import java.util.HashSet;
import java.util.Set;

import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.ApiDesignType;

/**
 * A row mapper to read an api design from the DB (as a single row in a SELECT)
 * and return an ApiDesign instance.
 * @author eric.wittmann@gmail.com
 */
public class ApiDesignRowMapper implements RowMapper<ApiDesign> {
    
    public static final ApiDesignRowMapper instance = new ApiDesignRowMapper();

    /**
     * @see org.jdbi.v3.core.mapper.RowMapper#map(java.sql.ResultSet, org.jdbi.v3.core.statement.StatementContext)
     */
    @Override
    public ApiDesign map(ResultSet rs, StatementContext ctx) throws SQLException {
        ApiDesign design = new ApiDesign();
        design.setId(rs.getString("id"));
        design.setName(rs.getString("name"));
        design.setDescription(rs.getString("description"));
        design.setCreatedBy(rs.getString("created_by"));
        design.setCreatedOn(rs.getTimestamp("created_on"));
        String tags = rs.getString("tags");
        design.getTags().addAll(toSet(tags));
        design.setType(ApiDesignType.valueOf(rs.getString("api_type")));
        return design;
    }

    /**
     * Read CSV data and convert to a set of strings.
     * @param tags
     */
    private Set<String> toSet(String tags) {
        Set<String> rval = new HashSet<String>();
        if (tags != null && tags.length() > 0) {
            String[] split = tags.split(",");
            for (String tag : split) {
                rval.add(tag.trim());
            }
        }
        return rval;
    }

}