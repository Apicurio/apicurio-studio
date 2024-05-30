-- *********************************************************************
-- DDL for the Apicurio Studio - Database: H2
-- Upgrades the DB schema from version 2 to version 3.
-- *********************************************************************

CREATE TABLE config (pname VARCHAR(255) NOT NULL, pvalue VARCHAR(1024), modifiedOn BIGINT NOT NULL);
ALTER TABLE config ADD PRIMARY KEY (pname);
CREATE INDEX IDX_config_1 ON config(modifiedOn);
