-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: Postgres
-- Upgrades the DB schema from version 12 to version 13.
-- *********************************************************************

UPDATE apicurio SET prop_value = 13 WHERE prop_name = 'db_version';

ALTER TABLE validation_profiles ADD COLUMN external_ruleset VARCHAR(255);