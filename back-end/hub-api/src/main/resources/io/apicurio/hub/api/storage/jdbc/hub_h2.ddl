-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: H2
-- *********************************************************************

-- The API Designs table
CREATE TABLE api_designs (id BIGINT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, repository_url VARCHAR(1024) NOT NULL, created_by VARCHAR(255) NOT NULL, created_on TIMESTAMP NOT NULL, modified_by VARCHAR(255) NOT NULL, modified_on TIMESTAMP NOT NULL);
ALTER TABLE api_designs ADD PRIMARY KEY (id);
ALTER TABLE api_designs ADD CONSTRAINT UK_designs_1 UNIQUE (repository_url);

