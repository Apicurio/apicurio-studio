/*
 * Copyright 2017 JBoss Inc
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

package io.apicurio.hub.core.storage.jdbc;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.junit.Assert;
import org.junit.Test;

/**
 * @author eric.wittmann@gmail.com
 */
public class DdlParserTest {

    private static final String EXPECTED = "CREATE SEQUENCE hibernate_sequence START WITH 999\n" + 
            "---\n" + 
            "CREATE TABLE client_versions (id BIGINT NOT NULL, created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP NOT NULL, modified_by VARCHAR(255) NOT NULL, modified_on TIMESTAMP NOT NULL, published_on TIMESTAMP, retired_on TIMESTAMP, status VARCHAR(255) NOT NULL, version VARCHAR(255) NOT NULL, client_id VARCHAR(255), client_org_id VARCHAR(255), apikey VARCHAR(255) NOT NULL)\n" + 
            "---\n" + 
            "CREATE TABLE clients (id VARCHAR(255) NOT NULL, created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP NOT NULL, description VARCHAR(512), name VARCHAR(255) NOT NULL, organization_id VARCHAR(255) NOT NULL)\n" + 
            "---\n" + 
            "CREATE TABLE auditlog (id BIGINT NOT NULL, created_on TIMESTAMP NOT NULL, data VARCHAR(2147483647), entity_id VARCHAR(255), entity_type VARCHAR(255) NOT NULL, entity_version VARCHAR(255), organization_id VARCHAR(255) NOT NULL, what VARCHAR(255) NOT NULL, who VARCHAR(255) NOT NULL)\n" + 
            "---\n" + 
            "CREATE TABLE contracts (id BIGINT NOT NULL, created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP NOT NULL, clientv_id BIGINT, planv_id BIGINT, apiv_id BIGINT)\n" + 
            "---\n" + 
            "CREATE TABLE endpoint_properties (api_version_id BIGINT NOT NULL, value VARCHAR(255), name VARCHAR(255) NOT NULL)\n" + 
            "---\n" + 
            "CREATE TABLE gateways (id VARCHAR(255) NOT NULL, configuration VARCHAR(2147483647) NOT NULL, created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP NOT NULL, description VARCHAR(512), modified_by VARCHAR(255) NOT NULL, modified_on TIMESTAMP NOT NULL, name VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL)\n" + 
            "---\n" + 
            "CREATE TABLE memberships (id BIGINT NOT NULL, created_on TIMESTAMP, org_id VARCHAR(255), role_id VARCHAR(255), user_id VARCHAR(255))\n" + 
            "---\n" + 
            "CREATE TABLE organizations (id VARCHAR(255) NOT NULL, created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP NOT NULL, description VARCHAR(512), modified_by VARCHAR(255) NOT NULL, modified_on TIMESTAMP NOT NULL, name VARCHAR(255) NOT NULL)\n" + 
            "---\n" + 
            "CREATE TABLE pd_templates (policydef_id VARCHAR(255) NOT NULL, language VARCHAR(255), template VARCHAR(2048))\n" + 
            "---\n" + 
            "CREATE TABLE permissions (role_id VARCHAR(255) NOT NULL, permissions INT)\n" + 
            "---\n" + 
            "CREATE TABLE plan_versions (id BIGINT NOT NULL, created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP NOT NULL, locked_on TIMESTAMP, modified_by VARCHAR(255) NOT NULL, modified_on TIMESTAMP NOT NULL, status VARCHAR(255) NOT NULL, version VARCHAR(255) NOT NULL, plan_id VARCHAR(255), plan_org_id VARCHAR(255))\n" + 
            "---\n" + 
            "CREATE TABLE plans (id VARCHAR(255) NOT NULL, created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP NOT NULL, description VARCHAR(512), name VARCHAR(255) NOT NULL, organization_id VARCHAR(255) NOT NULL)\n" + 
            "---\n" + 
            "CREATE TABLE plugins (id BIGINT NOT NULL, artifact_id VARCHAR(255) NOT NULL, classifier VARCHAR(255), created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP NOT NULL, description VARCHAR(512), group_id VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, type VARCHAR(255), version VARCHAR(255) NOT NULL, deleted BOOLEAN)\n" + 
            "---\n" + 
            "CREATE TABLE policies (id BIGINT NOT NULL, configuration VARCHAR(2147483647), created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP NOT NULL, entity_id VARCHAR(255) NOT NULL, entity_version VARCHAR(255) NOT NULL, modified_by VARCHAR(255) NOT NULL, modified_on TIMESTAMP NOT NULL, name VARCHAR(255) NOT NULL, order_index INT NOT NULL, organization_id VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, definition_id VARCHAR(255) NOT NULL)\n" + 
            "---\n" + 
            "CREATE TABLE policydefs (id VARCHAR(255) NOT NULL, description VARCHAR(512) NOT NULL, form VARCHAR(255), form_type VARCHAR(255), icon VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, plugin_id BIGINT, policy_impl VARCHAR(255) NOT NULL, deleted BOOLEAN)\n" + 
            "---\n" + 
            "CREATE TABLE roles (id VARCHAR(255) NOT NULL, auto_grant BOOLEAN, created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP NOT NULL, description VARCHAR(512), name VARCHAR(255))\n" + 
            "---\n" + 
            "CREATE TABLE api_defs (id BIGINT NOT NULL, data BLOB, api_version_id BIGINT)\n" + 
            "---\n" + 
            "CREATE TABLE api_versions (id BIGINT NOT NULL, created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP NOT NULL, definition_type VARCHAR(255), endpoint VARCHAR(255), endpoint_type VARCHAR(255), endpoint_ct VARCHAR(255), modified_by VARCHAR(255) NOT NULL, modified_on TIMESTAMP NOT NULL, public_api BOOLEAN NOT NULL, published_on TIMESTAMP, retired_on TIMESTAMP, status VARCHAR(255) NOT NULL, version VARCHAR(255), api_id VARCHAR(255), api_org_id VARCHAR(255), parse_payload BOOLEAN)\n" + 
            "---\n" + 
            "CREATE TABLE apis (id VARCHAR(255) NOT NULL, created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP NOT NULL, description VARCHAR(512), name VARCHAR(255) NOT NULL, organization_id VARCHAR(255) NOT NULL, num_published INT)\n" + 
            "---\n" + 
            "CREATE TABLE api_gateways (api_version_id BIGINT NOT NULL, gateway_id VARCHAR(255) NOT NULL)\n" + 
            "---\n" + 
            "CREATE TABLE api_plans (api_version_id BIGINT NOT NULL, plan_id VARCHAR(255) NOT NULL, version VARCHAR(255) NOT NULL)\n" + 
            "---\n" + 
            "CREATE TABLE users (username VARCHAR(255) NOT NULL, email VARCHAR(255), full_name VARCHAR(255), joined_on TIMESTAMP)\n" + 
            "---\n" + 
            "CREATE TABLE downloads (id VARCHAR(255) NOT NULL, type VARCHAR(255), path VARCHAR(255), expires TIMESTAMP)\n" + 
            "---\n" + 
            "ALTER TABLE endpoint_properties ADD PRIMARY KEY (api_version_id, name)\n" + 
            "---\n" + 
            "ALTER TABLE api_gateways ADD PRIMARY KEY (api_version_id, gateway_id)\n" + 
            "---\n" + 
            "ALTER TABLE api_plans ADD PRIMARY KEY (api_version_id, plan_id, version)\n" + 
            "---\n" + 
            "ALTER TABLE client_versions ADD CONSTRAINT client_versionsPK PRIMARY KEY (id)\n" + 
            "---\n" + 
            "ALTER TABLE clients ADD CONSTRAINT clientsPK PRIMARY KEY (id, organization_id)\n" + 
            "---\n" + 
            "ALTER TABLE auditlog ADD CONSTRAINT auditlogPK PRIMARY KEY (id)\n" + 
            "---\n" + 
            "ALTER TABLE contracts ADD CONSTRAINT contractsPK PRIMARY KEY (id)\n" + 
            "---\n" + 
            "ALTER TABLE gateways ADD CONSTRAINT gatewaysPK PRIMARY KEY (id)\n" + 
            "---\n" + 
            "ALTER TABLE memberships ADD CONSTRAINT membershipsPK PRIMARY KEY (id)\n" + 
            "---\n" + 
            "ALTER TABLE organizations ADD CONSTRAINT organizationsPK PRIMARY KEY (id)\n" + 
            "---\n" + 
            "ALTER TABLE plan_versions ADD CONSTRAINT plan_versionsPK PRIMARY KEY (id)\n" + 
            "---\n" + 
            "ALTER TABLE plans ADD CONSTRAINT plansPK PRIMARY KEY (id, organization_id)\n" + 
            "---\n" + 
            "ALTER TABLE plugins ADD CONSTRAINT pluginsPK PRIMARY KEY (id)\n" + 
            "---\n" + 
            "ALTER TABLE policies ADD CONSTRAINT policiesPK PRIMARY KEY (id)\n" + 
            "---\n" + 
            "ALTER TABLE policydefs ADD CONSTRAINT policydefsPK PRIMARY KEY (id)\n" + 
            "---\n" + 
            "ALTER TABLE roles ADD CONSTRAINT rolesPK PRIMARY KEY (id)\n" + 
            "---\n" + 
            "ALTER TABLE api_defs ADD CONSTRAINT api_defsPK PRIMARY KEY (id)\n" + 
            "---\n" + 
            "ALTER TABLE api_versions ADD CONSTRAINT api_versionsPK PRIMARY KEY (id)\n" + 
            "---\n" + 
            "ALTER TABLE apis ADD CONSTRAINT apisPK PRIMARY KEY (id, organization_id)\n" + 
            "---\n" + 
            "ALTER TABLE users ADD CONSTRAINT usersPK PRIMARY KEY (username)\n" + 
            "---\n" + 
            "ALTER TABLE apis ADD CONSTRAINT FK_31hj3xmhp1wedxjh5bklnlg15 FOREIGN KEY (organization_id) REFERENCES organizations (id)\n" + 
            "---\n" + 
            "ALTER TABLE contracts ADD CONSTRAINT FK_6h06sgs4dudh1wehmk0us973g FOREIGN KEY (clientv_id) REFERENCES client_versions (id)\n" + 
            "---\n" + 
            "ALTER TABLE api_defs ADD CONSTRAINT FK_81fuw1n8afmvpw4buk7l4tyxk FOREIGN KEY (api_version_id) REFERENCES api_versions (id)\n" + 
            "---\n" + 
            "ALTER TABLE client_versions ADD CONSTRAINT FK_8epnoby31bt7xakegakigpikp FOREIGN KEY (client_id, client_org_id) REFERENCES clients (id, organization_id)\n" + 
            "---\n" + 
            "ALTER TABLE contracts ADD CONSTRAINT FK_8o6t1f3kg96rxy5uv51f6k9fy FOREIGN KEY (apiv_id) REFERENCES api_versions (id)\n" + 
            "---\n" + 
            "ALTER TABLE api_versions ADD CONSTRAINT FK_92erjg9k1lni97gd87nt6tq37 FOREIGN KEY (api_id, api_org_id) REFERENCES apis (id, organization_id)\n" + 
            "---\n" + 
            "ALTER TABLE endpoint_properties ADD CONSTRAINT FK_gn0ydqur10sxuvpyw2jvv4xxb FOREIGN KEY (api_version_id) REFERENCES api_versions (id)\n" + 
            "---\n" + 
            "ALTER TABLE clients ADD CONSTRAINT FK_jenpu34rtuncsgvtw0sfo8qq9 FOREIGN KEY (organization_id) REFERENCES organizations (id)\n" + 
            "---\n" + 
            "ALTER TABLE policies ADD CONSTRAINT FK_l4q6we1bos1yl9unmogei6aja FOREIGN KEY (definition_id) REFERENCES policydefs (id)\n" + 
            "---\n" + 
            "ALTER TABLE plans ADD CONSTRAINT FK_lwhc7xrdbsun1ak2uvfu0prj8 FOREIGN KEY (organization_id) REFERENCES organizations (id)\n" + 
            "---\n" + 
            "ALTER TABLE contracts ADD CONSTRAINT FK_nyw8xu6m8cx4rwwbtrxbjneui FOREIGN KEY (planv_id) REFERENCES plan_versions (id)\n" + 
            "---\n" + 
            "ALTER TABLE api_gateways ADD CONSTRAINT FK_p5dm3cngljt6yrsnvc7uc6a75 FOREIGN KEY (api_version_id) REFERENCES api_versions (id)\n" + 
            "---\n" + 
            "ALTER TABLE pd_templates ADD CONSTRAINT FK_prbnn7j7m6m3pxt2dsn9gwlw8 FOREIGN KEY (policydef_id) REFERENCES policydefs (id)\n" + 
            "---\n" + 
            "ALTER TABLE permissions ADD CONSTRAINT FK_sq51ihfrapwdr98uufenhcocg FOREIGN KEY (role_id) REFERENCES roles (id)\n" + 
            "---\n" + 
            "ALTER TABLE api_plans ADD CONSTRAINT FK_t7uvfcsswopb9kh8wpa86blqr FOREIGN KEY (api_version_id) REFERENCES api_versions (id)\n" + 
            "---\n" + 
            "ALTER TABLE plan_versions ADD CONSTRAINT FK_tonylvm2ypnq3efxqr1g0m9fs FOREIGN KEY (plan_id, plan_org_id) REFERENCES plans (id, organization_id)\n" + 
            "---\n" + 
            "ALTER TABLE plugins ADD CONSTRAINT UK_plugins_1 UNIQUE (group_id, artifact_id)\n" + 
            "---\n" + 
            "ALTER TABLE memberships ADD CONSTRAINT UK_memberships_1 UNIQUE (user_id, role_id, org_id)\n" + 
            "---\n" + 
            "ALTER TABLE plan_versions ADD CONSTRAINT UK_plan_versions_1 UNIQUE (plan_id, plan_org_id, version)\n" + 
            "---\n" + 
            "ALTER TABLE client_versions ADD CONSTRAINT UK_client_versions_1 UNIQUE (client_id, client_org_id, version)\n" + 
            "---\n" + 
            "ALTER TABLE client_versions ADD CONSTRAINT UK_client_versions_2 UNIQUE (apikey)\n" + 
            "---\n" + 
            "ALTER TABLE api_versions ADD CONSTRAINT UK_api_versions_1 UNIQUE (api_id, api_org_id, version)\n" + 
            "---\n" + 
            "ALTER TABLE api_defs ADD CONSTRAINT UK_api_defs_1 UNIQUE (api_version_id)\n" + 
            "---\n" + 
            "ALTER TABLE contracts ADD CONSTRAINT UK_contracts_1 UNIQUE (clientv_id, apiv_id)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_auditlog_1 ON auditlog(who)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_auditlog_2 ON auditlog(organization_id, entity_id, entity_version, entity_type)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_FK_pd_templates_1 ON pd_templates(policydef_id)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_users_1 ON users(username)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_users_2 ON users(full_name)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_FK_permissions_1 ON permissions(role_id)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_memberships_1 ON memberships(user_id)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_organizations_1 ON organizations(name)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_FK_plans_1 ON plans(organization_id)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_FK_clients_1 ON clients(organization_id)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_apis_1 ON apis(name)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_FK_apis_1 ON apis(organization_id)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_policies_1 ON policies(organization_id, entity_id, entity_version)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_policies_2 ON policies(order_index)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_FK_policies_1 ON policies(definition_id)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_FK_contracts_p ON contracts(planv_id)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_FK_contracts_s ON contracts(apiv_id)\n" + 
            "---\n" + 
            "CREATE INDEX IDX_FK_contracts_a ON contracts(clientv_id)\n" + 
            "---\n" + 
            "CREATE FUNCTION upsert_sharing(i BIGINT, u VARCHAR(255), l VARCHAR(64)) RETURNS VOID AS\n" + 
            "$$\n" + 
            "BEGIN\n" + 
            "    LOOP\n" + 
            "        -- first try to update\n" + 
            "        UPDATE sharing SET level = l WHERE design_id = i;\n" + 
            "        IF found THEN\n" + 
            "            RETURN;\n" + 
            "        END IF;\n" + 
            "        -- not there, so try to insert the data\n" + 
            "        BEGIN\n" + 
            "            INSERT INTO sharing(design_id, uuid, level) VALUES (i, u, l);\n" + 
            "            RETURN;\n" + 
            "        EXCEPTION WHEN unique_violation THEN\n" + 
            "            -- do nothing, and loop to try the UPDATE again\n" + 
            "        END;\n" + 
            "    END LOOP;\n" + 
            "END;\n" + 
            "$$\n" + 
            "LANGUAGE plpgsql\n" + 
            "---\n" + 
            "";

    /**
     * Test method for {@link io.apicurio.hub.core.storage.jdbc.apiman.common.util.ddl.DdlParser#parse(java.io.InputStream)}.
     */
    @Test
    public void testParseInputStream() {
        try (InputStream testDdlIS = getClass().getResourceAsStream("test.ddl")) {
            DdlParser parser = new DdlParser();
            List<String> statements = parser.parse(testDdlIS);
            StringBuilder builder = new StringBuilder();
            for (String statement : statements) {
                builder.append(statement).append("\n").append("---").append("\n");
            }
            Assert.assertEquals(EXPECTED, builder.toString());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


}
