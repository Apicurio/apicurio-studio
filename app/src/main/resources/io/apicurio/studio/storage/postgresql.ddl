-- *********************************************************************
-- DDL for the Apicurio API Studio - Database: PostgreSQL 10+
-- *********************************************************************

CREATE TABLE apicurio (prop_name VARCHAR(255) NOT NULL, prop_value VARCHAR(255));
ALTER TABLE apicurio ADD PRIMARY KEY (prop_name);
INSERT INTO apicurio (prop_name, prop_value) VALUES ('db_version', 1);

CREATE TABLE teams (tenantId VARCHAR(128) NOT NULL, name VARCHAR(128) NOT NULL, description VARCHAR(1024), createdBy VARCHAR(128));
ALTER TABLE teams ADD PRIMARY KEY (tenantId, name);
CREATE INDEX IDX_teams_1 ON teams(name);
CREATE INDEX IDX_teams_2 ON teams(createdBy);

CREATE TABLE config (tenantId VARCHAR(128) NOT NULL, pname VARCHAR(255) NOT NULL, ptype VARCHAR(255) NOT NULL, modifiedOn BIGINT NOT NULL);
ALTER TABLE config ADD PRIMARY KEY (tenantId, pname);
CREATE INDEX IDX_config_1 ON config(modifiedOn);