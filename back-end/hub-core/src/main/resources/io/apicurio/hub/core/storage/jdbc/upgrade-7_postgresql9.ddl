-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: Postgresql
-- Upgrades the DB schema from version 6 to version 7.
-- *********************************************************************

UPDATE apicurio SET prop_value = 7 WHERE prop_name = 'db_version';

ALTER TABLE api_designs ALTER COLUMN description TYPE VARCHAR(1024);
