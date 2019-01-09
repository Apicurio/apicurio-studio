-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: MySQL 5
-- Upgrades the DB schema from version 6 to version 7.
-- *********************************************************************

UPDATE apicurio SET prop_value = 8 WHERE prop_name = 'db_version';

ALTER TABLE api_designs ADD COLUMN api_type VARCHAR(255);

UPGRADER:io.apicurio.hub.core.storage.jdbc.upgraders.ApiDesignTypeUpgrader;

ALTER TABLE api_designs MODIFY api_type VARCHAR(255) NOT NULL;
