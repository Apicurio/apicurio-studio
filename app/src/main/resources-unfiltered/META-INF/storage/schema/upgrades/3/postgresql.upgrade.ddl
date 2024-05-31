-- *********************************************************************
-- DDL for the Apicurio Studio - Database: H2
-- Upgrades the DB schema from version 2 to version 3.
-- *********************************************************************

CREATE TABLE outbox (id VARCHAR(128) NOT NULL, aggregatetype VARCHAR(255) NOT NULL, aggregateid VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, payload JSONB NOT NULL);
ALTER TABLE outbox ADD PRIMARY KEY (id);
