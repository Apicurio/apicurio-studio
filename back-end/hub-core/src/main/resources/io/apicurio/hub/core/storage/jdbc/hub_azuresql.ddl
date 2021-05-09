-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: AzureSQL
-- *********************************************************************

CREATE TABLE  apicurio (prop_name VARCHAR(255) NOT NULL, prop_value VARCHAR(255));
 ALTER TABLE  apicurio ADD PRIMARY KEY (prop_name);
INSERT INTO  apicurio (prop_name, prop_value) VALUES ('db_version', 11);
 CREATE TABLE  accounts (user_id VARCHAR(255) NOT NULL, type VARCHAR(32) NOT NULL, linked_on DATETIME, used_on DATETIME, nonce VARCHAR(255));
ALTER TABLE  accounts ADD PRIMARY KEY (user_id, type);
 CREATE INDEX IDX_accounts_1 ON  accounts(user_id);
 CREATE TABLE  api_designs (id BIGINT IDENTITY NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(1024), created_by VARCHAR(255) NOT NULL, created_on DATETIME NOT NULL, tags VARCHAR(2048), api_type VARCHAR(255) NOT NULL);
 ALTER TABLE  api_designs ADD PRIMARY KEY (id);
 CREATE TABLE  api_content (design_id BIGINT NOT NULL, version BIGINT IDENTITY NOT NULL, type TINYINT NOT NULL, data NTEXT NOT NULL, created_by VARCHAR(255) NOT NULL, created_on DATETIME NOT NULL, reverted TINYINT DEFAULT 0 NOT NULL, modified_on DATETIME);
 ALTER TABLE  api_content ADD PRIMARY KEY (design_id, version);
CREATE INDEX IDX_content_1 ON  api_content(version);
 CREATE INDEX IDX_content_2 ON  api_content(type);
 CREATE INDEX IDX_content_3 ON  api_content(created_by);
 CREATE INDEX IDX_content_4 ON  api_content(created_on);
 CREATE INDEX IDX_content_5 ON  api_content(reverted);
 ALTER TABLE  api_content ADD CONSTRAINT FK_content_1 FOREIGN KEY (design_id) REFERENCES  api_designs (id);

CREATE TABLE  acl (user_id VARCHAR(255) NOT NULL, design_id BIGINT NOT NULL, role VARCHAR(16) NOT NULL);
 ALTER TABLE  acl ADD PRIMARY KEY (user_id, design_id);
ALTER TABLE  acl ADD CONSTRAINT FK_acl_1 FOREIGN KEY (design_id) REFERENCES  api_designs (id);
CREATE INDEX IDX_acl_1 ON  acl(role);

CREATE TABLE  acl_invites (created_by VARCHAR(255) NOT NULL, created_on DATETIME NOT NULL, created_by_display VARCHAR(255), design_id BIGINT NOT NULL, role VARCHAR(16) NOT NULL, invite_id VARCHAR(64) NOT NULL, status VARCHAR(16) NOT NULL, modified_by VARCHAR(255), modified_on DATETIME, subject VARCHAR(1024));
ALTER TABLE  acl_invites ADD PRIMARY KEY (invite_id);
ALTER TABLE  acl_invites ADD CONSTRAINT FK_invites_1 FOREIGN KEY (design_id) REFERENCES  api_designs (id);
 CREATE INDEX IDX_invites_1 ON  acl_invites(status);

CREATE TABLE  session_uuids (uuid VARCHAR(255) NOT NULL, design_id BIGINT NOT NULL, user_id VARCHAR(255) NOT NULL, secret VARCHAR(255) NOT NULL, version BIGINT NOT NULL, expires_on BIGINT NOT NULL);
 ALTER TABLE  session_uuids ADD PRIMARY KEY (uuid);
CREATE INDEX IDX_uuids_1 ON  session_uuids(uuid, design_id, secret);

 CREATE TABLE  codegen (id BIGINT IDENTITY NOT NULL, created_by VARCHAR(255) NOT NULL, created_on DATETIME NOT NULL, modified_by VARCHAR(255), modified_on DATETIME, design_id BIGINT NOT NULL, ptype VARCHAR(64) NOT NULL, attributes NTEXT NOT NULL);
 ALTER TABLE  codegen ADD PRIMARY KEY (id);
 ALTER TABLE  codegen ADD CONSTRAINT FK_codegen_1 FOREIGN KEY (design_id) REFERENCES  api_designs (id);
 CREATE INDEX IDX_codegen_1 ON  codegen(ptype);
CREATE INDEX IDX_codegen_2 ON  codegen(design_id);
CREATE TABLE  validation_profiles (id BIGINT IDENTITY NOT NULL, owner VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(1024), severities NTEXT NOT NULL);
 ALTER TABLE  validation_profiles ADD PRIMARY KEY (id);
 CREATE INDEX IDX_vprof_1 ON  validation_profiles(owner);
CREATE TABLE  sharing (design_id BIGINT NOT NULL, uuid VARCHAR(255) NOT NULL, level VARCHAR(64) NOT NULL);
 ALTER TABLE  sharing ADD PRIMARY KEY (design_id);
ALTER TABLE  sharing ADD CONSTRAINT FK_shar_1 FOREIGN KEY (design_id) REFERENCES  api_designs (id);
CREATE INDEX IDX_shar_1 ON  sharing(uuid);
 CREATE INDEX IDX_shar_2 ON  sharing(level);
