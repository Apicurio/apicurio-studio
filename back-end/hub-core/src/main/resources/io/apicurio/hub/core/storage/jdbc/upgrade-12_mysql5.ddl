-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: MyMySQL 5+
-- Upgrades the DB schema from version 11 to version 12.
-- *********************************************************************

UPDATE apicurio SET prop_value = 12 WHERE prop_name = 'db_version';

-- `api_type` column should be typed the same as `api_designs`' `api_type`
-- `owner` column should be typed the same as `api_content`'s `created_by`
-- `template` column should be typed the same as `api_content`'s `data`
CREATE TABLE templates (template_id VARCHAR(64) NOT NULL PRIMARY KEY, name VARCHAR(64) NOT NULL, api_type VARCHAR(255) NOT NULL, description VARCHAR(1024), owner VARCHAR(255) NOT NULL, template MEDIUMTEXT NOT NULL);
CREATE INDEX IDX_temp_1 ON templates(api_type);
