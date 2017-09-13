-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: H2
-- *********************************************************************

CREATE TABLE apicurio (prop_name VARCHAR(255) NOT NULL, prop_value VARCHAR(255));
ALTER TABLE apicurio ADD PRIMARY KEY (prop_name);
INSERT INTO apicurio (prop_name, prop_value) VALUES ("db_version", 1);

CREATE TABLE accounts (user_id VARCHAR(255) NOT NULL, type VARCHAR(32) NOT NULL, linked_on TIMESTAMP, used_on TIMESTAMP, nonce VARCHAR(255));
ALTER TABLE accounts ADD PRIMARY KEY (user_id, type);
CREATE INDEX IDX_accounts_1 ON accounts(user_id);

CREATE TABLE api_designs (id BIGINT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, repository_url VARCHAR(1024) NOT NULL, created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP NOT NULL, modified_by VARCHAR(255) NOT NULL, modified_on TIMESTAMP NOT NULL);
ALTER TABLE api_designs ADD PRIMARY KEY (id);
ALTER TABLE api_designs ADD CONSTRAINT UK_designs_1 UNIQUE (repository_url);

CREATE TABLE acl (user_id VARCHAR(255) NOT NULL, design_id BIGINT NOT NULL, role VARCHAR(255) NOT NULL);
ALTER TABLE acl ADD PRIMARY KEY (user_id, design_id);
ALTER TABLE acl ADD CONSTRAINT FK_acl_1 FOREIGN KEY (design_id) REFERENCES api_designs (id);
CREATE INDEX IDX_acl_1 ON acl(role);
