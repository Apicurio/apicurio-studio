-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: PostgreSQL 9+
-- Upgrades the DB schema from version 3 to version 4.
-- *********************************************************************

UPDATE apicurio SET prop_value = 4 WHERE prop_name = 'db_version';

CREATE INDEX IDX_content_4 ON api_content(created_on);
ALTER TABLE api_content ADD CONSTRAINT FK_content_1 FOREIGN KEY (design_id) REFERENCES api_designs (id);
