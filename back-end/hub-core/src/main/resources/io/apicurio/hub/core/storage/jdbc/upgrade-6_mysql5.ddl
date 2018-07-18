-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: MySQL 5
-- Upgrades the DB schema from version 5 to version 6.
-- *********************************************************************

UPDATE apicurio SET prop_value = 6 WHERE prop_name = 'db_version';

ALTER TABLE api_content ADD reverted TINYINT DEFAULT 0 NOT NULL;
ALTER TABLE api_content ADD modified_on DATETIME;
CREATE INDEX IDX_content_5 ON api_content(reverted);
