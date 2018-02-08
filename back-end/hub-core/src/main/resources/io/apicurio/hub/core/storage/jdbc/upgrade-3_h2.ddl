-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: H2
-- Upgrades the DB schema from version 2 to version 3.
-- *********************************************************************

UPDATE apicurio SET prop_value = 3 WHERE prop_name = 'db_version';

CREATE TABLE acl_invites (created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP NOT NULL, created_by_display VARCHAR(255), design_id BIGINT NOT NULL, role VARCHAR(16) NOT NULL, invite_id VARCHAR(64) NOT NULL, status VARCHAR(16) NOT NULL, modified_by VARCHAR(255), modified_on TIMESTAMP, subject VARCHAR(1024));
ALTER TABLE acl_invites ADD PRIMARY KEY (invite_id);
ALTER TABLE acl_invites ADD CONSTRAINT FK_invites_1 FOREIGN KEY (design_id) REFERENCES api_designs (id);
CREATE INDEX IDX_invites_1 ON acl_invites(status);
