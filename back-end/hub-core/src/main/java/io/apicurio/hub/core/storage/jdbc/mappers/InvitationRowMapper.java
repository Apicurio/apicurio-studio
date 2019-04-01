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

import io.apicurio.hub.core.beans.Invitation;

/**
 * A row mapper to read an invitation from a db row.
 * @author eric.wittmann@gmail.com
 */
public class InvitationRowMapper implements RowMapper<Invitation> {
    
    public static final InvitationRowMapper instance = new InvitationRowMapper();

    /**
     * @see org.jdbi.v3.core.mapper.RowMapper#map(java.sql.ResultSet, org.jdbi.v3.core.statement.StatementContext)
     */
    @Override
    public Invitation map(ResultSet rs, StatementContext ctx) throws SQLException {
        Invitation invite = new Invitation();
        invite.setCreatedBy(rs.getString("created_by"));
        invite.setCreatedOn(rs.getTimestamp("created_on"));
        invite.setDesignId(rs.getString("design_id"));
        invite.setInviteId(rs.getString("invite_id"));
        invite.setModifiedBy(rs.getString("modified_by"));
        invite.setModifiedOn(rs.getTimestamp("modified_on"));
        invite.setStatus(rs.getString("status"));
        invite.setRole(rs.getString("role"));
        invite.setSubject(rs.getString("subject"));
        return invite;
    }

}