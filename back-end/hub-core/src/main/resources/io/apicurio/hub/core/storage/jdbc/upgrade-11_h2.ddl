-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: H2
-- Upgrades the DB schema from version 10 to version 11.
-- *********************************************************************

UPDATE apicurio SET prop_value = 11 WHERE prop_name = 'db_version';
