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

import java.util.List;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;

import io.apicurio.common.apps.mt.TenantContext;
import io.apicurio.common.apps.storage.exceptions.AlreadyExistsException;
import io.apicurio.common.apps.storage.exceptions.StorageException;
import io.apicurio.common.apps.storage.sql.AbstractSqlStorage;
import io.apicurio.common.apps.util.IoUtil;
import io.apicurio.studio.rest.v1.beans.SortOrder;
import io.apicurio.studio.rest.v1.beans.Team;
import io.apicurio.studio.rest.v1.beans.TeamResults;
import io.apicurio.studio.rest.v1.beans.TeamSortBy;
import io.apicurio.studio.storage.mappers.TeamMapper;
import io.quarkus.security.identity.SecurityIdentity;

/**
 * Implementation of the storage layer.  This uses a standard database to store application state.
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class SqlStorage extends AbstractSqlStorage<SqlStatements> {
    private static int DB_VERSION = Integer.valueOf(
            IoUtil.toString(SqlStorage.class.getResourceAsStream("db-version"))).intValue();

    @Inject
    TenantContext tenantContext;

    @Inject
    SecurityIdentity securityIdentity;

    @PostConstruct
    @Transactional
    protected void initialize() {
        log.info("SqlStorage constructed successfully.");
        doInitialize();
    }

    /**
     * @see io.apicurio.common.apps.storage.sql.AbstractSqlStorage#dbVersion()
     */
    @Override
    protected int dbVersion() {
        return DB_VERSION;
    }

    /**
     * Gets the teams.
     * @param limit
     * @param offset
     * @param order
     * @param orderby
     * @throws StorageException
     */
    @Transactional
    public TeamResults getTeams(Integer limit, Integer offset, SortOrder order, TeamSortBy orderby) throws StorageException {
        log.debug("Getting a list of all teams.");
        return handles.withHandle( handle -> {
            String sql = sqlStatements.selectTeams();
            String countSql = sqlStatements.countTeams();

            StringBuilder orderByClause = new StringBuilder();
            StringBuilder limitByClause = new StringBuilder();

            orderByClause.append(" ORDER BY ");
            orderByClause.append(orderby.name());
            orderByClause.append(" ");
            orderByClause.append(order.name().toUpperCase());

            limitByClause.append(" LIMIT ? OFFSET ?");

            String query = sql + orderByClause.toString() + limitByClause.toString();
            List<Team> teams = handle.createQuery(query)
                    .bind(0, tenantContext.getTenantId())
                    .bind(1, limit)
                    .bind(2, offset)
                    .map(TeamMapper.instance)
                    .list();

            TeamResults results = TeamResults.builder().teams(teams).build();

            // We only need to run the COUNT query if we *might* have more rows.  We can
            // figure that out.
            if ((teams.isEmpty() && offset != 0) || teams.size() == limit) {
                String countQuery = countSql;
                Integer count = handle.createQuery(countQuery)
                        .bind(0, tenantContext.getTenantId())
                        .mapTo(Integer.class)
                        .one();
                results.setCount(count);
            } else {
                results.setCount(offset + teams.size());
            }

            return results;
        });
    }

    /**
     * Creates a new team in the DB.
     * @param team
     * @throws AlreadyExistsException
     * @throws StorageException
     */
    @Transactional
    public void createTeam(Team team) throws AlreadyExistsException, StorageException {
        log.debug("Inserting a team row for: {}", team.getName());
        this.handles.withHandle( handle -> {
            String sql = sqlStatements.insertTeam();
            handle.createUpdate(sql)
                  .bind(0, tenantContext.getTenantId())
                  .bind(1, team.getName())
                  .bind(2, team.getDescription())
                  .bind(3, team.getCreatedBy())
                  .execute();
            return null;
        });
    }

}
