-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: MySQL 5
-- Upgrades the DB schema from version 6 to version 7.
-- *********************************************************************

UPDATE apicurio SET prop_value = 7 WHERE prop_name = 'db_version';

ALTER TABLE api_designs MODIFY COLUMN description VARCHAR(1024);
