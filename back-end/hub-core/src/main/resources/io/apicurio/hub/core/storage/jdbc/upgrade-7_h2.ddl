-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: H2
-- Upgrades the DB schema from version 6 to version 7.
-- *********************************************************************

UPDATE apicurio SET prop_value = 7 WHERE prop_name = 'db_version';

ALTER TABLE api_designs ALTER COLUMN description VARCHAR(1024);
