-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: Postgresql
-- Upgrades the DB schema from version 8 to version 9.
-- *********************************************************************

UPDATE apicurio SET prop_value = 9 WHERE prop_name = 'db_version';

CREATE TABLE validation_profiles (id BIGSERIAL NOT NULL PRIMARY KEY, owner VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(1024), severities TEXT NOT NULL);
CREATE INDEX IDX_vprof_1 ON validation_profiles(owner);
