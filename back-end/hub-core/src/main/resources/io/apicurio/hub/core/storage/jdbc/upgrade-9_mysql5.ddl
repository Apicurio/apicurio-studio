-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: MySQL 5
-- Upgrades the DB schema from version 8 to version 9.
-- *********************************************************************

UPDATE apicurio SET prop_value = 9 WHERE prop_name = 'db_version';

CREATE TABLE validation_profiles (id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, owner VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(1024), severities MEDIUMTEXT NOT NULL);
CREATE INDEX IDX_vprof_1 ON validation_profiles(owner);
