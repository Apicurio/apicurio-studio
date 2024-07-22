-- *********************************************************************
-- DDL for the Apicurio Studio - Database: H2
-- *********************************************************************

CREATE TABLE apicurio (prop_key VARCHAR(255) NOT NULL, prop_value VARCHAR(255));
ALTER TABLE apicurio ADD PRIMARY KEY (prop_key);
INSERT INTO apicurio (prop_key, prop_value) VALUES ('db_version', 3);

CREATE TABLE sequences (seq_key VARCHAR(32) NOT NULL, seq_value BIGINT NOT NULL);
ALTER TABLE sequences ADD PRIMARY KEY (seq_key);

CREATE TABLE designs (designId VARCHAR(128) NOT NULL, contentId BIGINT NOT NULL);
ALTER TABLE designs ADD PRIMARY KEY (designId);

CREATE TABLE content (contentId BIGINT NOT NULL, contentHash VARCHAR(64) NOT NULL, content BYTEA NOT NULL);
ALTER TABLE content ADD PRIMARY KEY (contentId);

CREATE TABLE design_metadata (designId VARCHAR(128) NOT NULL, name VARCHAR(512), description VARCHAR(1024), createdBy VARCHAR(256), createdOn TIMESTAMP WITHOUT TIME ZONE NOT NULL, modifiedBy VARCHAR(256), modifiedOn TIMESTAMP WITHOUT TIME ZONE NOT NULL, type VARCHAR(128), origin VARCHAR(128));
ALTER TABLE design_metadata ADD PRIMARY KEY (designId);

CREATE TABLE design_events (eventId VARCHAR(128) NOT NULL, designId VARCHAR(128) NOT NULL, createdOn TIMESTAMP WITHOUT TIME ZONE NOT NULL, type VARCHAR(128), data BYTEA NOT NULL);
ALTER TABLE design_events ADD PRIMARY KEY (eventId);

CREATE TABLE config (pname VARCHAR(255) NOT NULL, pvalue VARCHAR(1024), modifiedOn BIGINT NOT NULL);
ALTER TABLE config ADD PRIMARY KEY (pname);
CREATE INDEX IDX_config_1 ON config(modifiedOn);

CREATE TABLE outbox (id VARCHAR(128) NOT NULL, aggregatetype VARCHAR(255) NOT NULL, aggregateid VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, payload JSON NOT NULL);
ALTER TABLE outbox ADD PRIMARY KEY (id);