-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: H2
-- Upgrades the DB schema from version 8 to version 9.
-- *********************************************************************

UPDATE apicurio SET prop_value = 9 WHERE prop_name = 'db_version';

CREATE TABLE validation_profiles (id BIGINT AUTO_INCREMENT NOT NULL, owner VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(1024), severities CLOB NOT NULL);
ALTER TABLE validation_profiles ADD PRIMARY KEY (id);
CREATE INDEX IDX_vprof_1 ON validation_profiles(owner);
