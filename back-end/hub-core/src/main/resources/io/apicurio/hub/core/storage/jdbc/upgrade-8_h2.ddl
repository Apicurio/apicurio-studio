-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: H2
-- Upgrades the DB schema from version 7 to version 8.
-- *********************************************************************

UPDATE apicurio SET prop_value = 8 WHERE prop_name = 'db_version';

ALTER TABLE api_designs ADD COLUMN api_type VARCHAR(255);

UPGRADER:io.apicurio.hub.core.storage.jdbc.upgraders.ApiDesignTypeUpgrader;

ALTER TABLE api_designs ALTER COLUMN api_type SET NOT NULL;
