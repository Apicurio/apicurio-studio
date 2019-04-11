-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: MySQL 5
-- Upgrades the DB schema from version 7 to version 8.
-- *********************************************************************

UPDATE apicurio SET prop_value = 8 WHERE prop_name = 'db_version';

ALTER TABLE api_designs ADD COLUMN api_type VARCHAR(255);

UPGRADER:io.apicurio.hub.core.storage.jdbc.upgraders.ApiDesignTypeUpgrader;

ALTER TABLE api_designs MODIFY api_type VARCHAR(255) NOT NULL;
