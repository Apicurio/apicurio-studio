-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: PostgreSQL 9+
-- Upgrades the DB schema from version 1 to version 2.
-- *********************************************************************

UPDATE apicurio SET prop_value = 2 WHERE prop_name = 'db_version';

DELETE FROM acl;
DELETE FROM api_designs;

ALTER TABLE api_designs DROP COLUMN repository_url;
ALTER TABLE api_designs DROP COLUMN modified_by;
ALTER TABLE api_designs DROP COLUMN modified_on;
ALTER TABLE api_designs ALTER COLUMN description DROP NOT NULL;

CREATE TABLE api_content (design_id BIGINT NOT NULL, version BIGSERIAL NOT NULL, type SMALLINT NOT NULL, data TEXT NOT NULL, created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP WITHOUT TIME ZONE NOT NULL);
ALTER TABLE api_content ADD PRIMARY KEY (design_id, version);
CREATE INDEX IDX_content_1 ON api_content(version);
CREATE INDEX IDX_content_2 ON api_content(type);
CREATE INDEX IDX_content_3 ON api_content(created_by);

CREATE TABLE session_uuids (uuid VARCHAR(255) NOT NULL PRIMARY KEY, design_id BIGINT NOT NULL, user_id VARCHAR(255) NOT NULL, secret VARCHAR(255) NOT NULL, version BIGINT NOT NULL, expires_on BIGINT NOT NULL);
CREATE INDEX IDX_uuids_1 ON session_uuids(uuid, design_id, secret);
