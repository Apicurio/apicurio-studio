-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: MySQL 5+
-- Upgrades the DB schema from version 4 to version 5.
-- *********************************************************************

UPDATE apicurio SET prop_value = 5 WHERE prop_name = 'db_version';

CREATE TABLE codegen (id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP NOT NULL, modified_by VARCHAR(255), modified_on TIMESTAMP, design_id BIGINT NOT NULL, ptype VARCHAR(64) NOT NULL, attributes TEXT NOT NULL);
ALTER TABLE codegen ADD CONSTRAINT FK_codegen_1 FOREIGN KEY (design_id) REFERENCES api_designs (id);
CREATE INDEX IDX_codegen_1 ON codegen(ptype);
