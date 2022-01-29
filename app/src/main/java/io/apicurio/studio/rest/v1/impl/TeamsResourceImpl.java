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

package io.apicurio.studio.rest.v1.impl;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.slf4j.Logger;

import io.apicurio.common.apps.logging.audit.Audited;
import io.apicurio.studio.logging.audit.AuditingConstants;
import io.apicurio.studio.rest.v1.TeamsResource;
import io.apicurio.studio.rest.v1.beans.NewTeam;
import io.apicurio.studio.rest.v1.beans.NewTeamMember;
import io.apicurio.studio.rest.v1.beans.SortOrder;
import io.apicurio.studio.rest.v1.beans.Team;
import io.apicurio.studio.rest.v1.beans.TeamMemberResults;
import io.apicurio.studio.rest.v1.beans.TeamMemberSortBy;
import io.apicurio.studio.rest.v1.beans.TeamResults;
import io.apicurio.studio.rest.v1.beans.TeamSortBy;
import io.apicurio.studio.rest.v1.beans.UpdateTeam;
import io.apicurio.studio.storage.SqlStorage;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class TeamsResourceImpl implements TeamsResource {

    @Inject
    Logger log;

    @Inject
    SqlStorage storage;

    @Override
    public TeamResults listTeams(Integer limit, Integer offset, SortOrder order, TeamSortBy orderby) {
        if (order == null) {
            order = SortOrder.asc;
        }
        if (orderby == null) {
            orderby = TeamSortBy.name;
        }
        if (offset == null) {
            offset = 0;
        }
        if (limit == null) {
            limit = 20;
        }

        return storage.getTeams(limit, offset, order, orderby);
    }

    /**
     * @see io.apicurio.mas.studio.rest.v1.TeamsResource#createTeam(io.apicurio.mas.studio.rest.v1.beans.NewTeam)
     */
    @Override
    @Audited(extractParameters = {"0", AuditingConstants.KEY_TEAM})
    public void createTeam(NewTeam data) {
        // TODO set the createdBy based on the authenticated user (if any).
        Team team = Team.builder().name(data.getName()).description(data.getDescription()).createdBy(null).build();
        storage.createTeam(team);
    }

    /**
     * @see io.apicurio.mas.studio.rest.v1.TeamsResource#getTeam(java.lang.String)
     */
    @Override
    public Team getTeam(String teamName) {
        // TODO Auto-generated method stub
        return null;
    }

    /**
     * @see io.apicurio.mas.studio.rest.v1.TeamsResource#updateTeam(java.lang.String, io.apicurio.mas.studio.rest.v1.beans.UpdateTeam)
     */
    @Override
    public void updateTeam(String teamName, UpdateTeam data) {
        // TODO Auto-generated method stub

    }

    /**
     * @see io.apicurio.mas.studio.rest.v1.TeamsResource#deleteTeam(java.lang.String)
     */
    @Override
    public void deleteTeam(String teamName) {
        // TODO Auto-generated method stub

    }

    /**
     * @see io.apicurio.mas.studio.rest.v1.TeamsResource#listMembers(java.lang.String, java.lang.Integer, java.lang.Integer, io.apicurio.mas.studio.rest.v1.beans.SortOrder, io.apicurio.mas.studio.rest.v1.beans.TeamMemberSortBy)
     */
    @Override
    public TeamMemberResults listMembers(String teamName, Integer limit, Integer offset, SortOrder order,
            TeamMemberSortBy orderby) {
        // TODO Auto-generated method stub
        return null;
    }

    /**
     * @see io.apicurio.mas.studio.rest.v1.TeamsResource#addTeamMember(java.lang.String, io.apicurio.mas.studio.rest.v1.beans.NewTeamMember)
     */
    @Override
    public void addTeamMember(String teamName, NewTeamMember data) {
        // TODO Auto-generated method stub

    }

    /**
     * @see io.apicurio.mas.studio.rest.v1.TeamsResource#deleteTeamMember(java.lang.String, java.lang.String)
     */
    @Override
    public void deleteTeamMember(String principal, String teamName) {
        // TODO Auto-generated method stub

    }

}
