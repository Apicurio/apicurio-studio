-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: MySQL 5+
-- Upgrades the DB schema from version 0 to version 1.
-- *********************************************************************

CREATE TABLE apicurio (prop_name VARCHAR(255) NOT NULL, prop_value VARCHAR(255));
ALTER TABLE apicurio ADD PRIMARY KEY (prop_name);
INSERT INTO apicurio (prop_name, prop_value) VALUES ('db_version', 1);

ALTER TABLE api_designs ADD COLUMN tags VARCHAR(2048);