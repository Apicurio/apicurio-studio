-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: H2
-- Upgrades the DB schema from version 9 to version 10.
-- *********************************************************************

UPDATE apicurio SET prop_value = 10 WHERE prop_name = 'db_version';

CREATE TABLE sharing (design_id BIGINT NOT NULL, uuid VARCHAR(255) NOT NULL, level VARCHAR(64) NOT NULL);
ALTER TABLE sharing ADD PRIMARY KEY (design_id);
ALTER TABLE sharing ADD CONSTRAINT FK_shar_1 FOREIGN KEY (design_id) REFERENCES api_designs (id);
CREATE INDEX IDX_shar_1 ON sharing(uuid);
CREATE INDEX IDX_shar_2 ON sharing(level);
