;             
CREATE USER IF NOT EXISTS "SA" SALT '3d8ef694b3222bda' HASH '6a8c4f251bfaf13edca5b13e1bfb1f225f44185006bd51d606f51cb2d4e11a77' ADMIN;         
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_19B93B77_B280_4F22_9AA2_B059FAC65FDC" START WITH 1 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_173C8BCF_93E1_49DE_A98B_3A98DE5FE89D" START WITH 33 BELONGS_TO_TABLE;               
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_8B807E2F_919C_4D76_955F_92EC8E6D2B9E" START WITH 33 BELONGS_TO_TABLE;               
CREATE CACHED TABLE "PUBLIC"."APICURIO"(
    "PROP_NAME" VARCHAR(255) NOT NULL,
    "PROP_VALUE" VARCHAR(255)
);           
ALTER TABLE "PUBLIC"."APICURIO" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_6" PRIMARY KEY("PROP_NAME");              
-- 1 +/- SELECT COUNT(*) FROM PUBLIC.APICURIO;
INSERT INTO "PUBLIC"."APICURIO" VALUES
('db_version', '7');  
CREATE CACHED TABLE "PUBLIC"."ACCOUNTS"(
    "USER_ID" VARCHAR(255) NOT NULL,
    "TYPE" VARCHAR(32) NOT NULL,
    "LINKED_ON" TIMESTAMP,
    "USED_ON" TIMESTAMP,
    "NONCE" VARCHAR(255)
);          
ALTER TABLE "PUBLIC"."ACCOUNTS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_A" PRIMARY KEY("USER_ID", "TYPE");        
-- 0 +/- SELECT COUNT(*) FROM PUBLIC.ACCOUNTS;
CREATE INDEX "PUBLIC"."IDX_ACCOUNTS_1" ON "PUBLIC"."ACCOUNTS"("USER_ID");     
CREATE CACHED TABLE "PUBLIC"."API_DESIGNS"(
    "ID" BIGINT DEFAULT (NEXT VALUE FOR "PUBLIC"."SYSTEM_SEQUENCE_173C8BCF_93E1_49DE_A98B_3A98DE5FE89D") NOT NULL NULL_TO_DEFAULT SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_173C8BCF_93E1_49DE_A98B_3A98DE5FE89D",
    "NAME" VARCHAR(255) NOT NULL,
    "DESCRIPTION" VARCHAR(1024),
    "CREATED_BY" VARCHAR(255) NOT NULL,
    "CREATED_ON" TIMESTAMP NOT NULL,
    "TAGS" VARCHAR(2048)
);    
ALTER TABLE "PUBLIC"."API_DESIGNS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_8" PRIMARY KEY("ID");  
-- 2 +/- SELECT COUNT(*) FROM PUBLIC.API_DESIGNS;             
INSERT INTO "PUBLIC"."API_DESIGNS" VALUES
(1, 'OpenAPI 2.0 API', 'This is a simple 2.0 API definition.', 'eric.wittmann@gmail.com', TIMESTAMP '2019-01-15 12:54:17.628', NULL),
(2, 'OpenAPI 3.0 API', 'The Data Set API (DSAPI) allows the public users to discover and search USPTO exported data sets. This is a generic API that allows USPTO users to make any CSV based data files searchable through API. With the help of GET call, it returns the list of d...', 'eric.wittmann@gmail.com', TIMESTAMP '2019-01-15 12:54:28.929', 'metadata,search');               
CREATE CACHED TABLE "PUBLIC"."API_CONTENT"(
    "DESIGN_ID" BIGINT NOT NULL,
    "VERSION" BIGINT DEFAULT (NEXT VALUE FOR "PUBLIC"."SYSTEM_SEQUENCE_8B807E2F_919C_4D76_955F_92EC8E6D2B9E") NOT NULL NULL_TO_DEFAULT SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_8B807E2F_919C_4D76_955F_92EC8E6D2B9E",
    "TYPE" TINYINT NOT NULL,
    "DATA" CLOB NOT NULL,
    "CREATED_BY" VARCHAR(255) NOT NULL,
    "CREATED_ON" TIMESTAMP NOT NULL,
    "REVERTED" TINYINT DEFAULT 0 NOT NULL,
    "MODIFIED_ON" TIMESTAMP
);          
ALTER TABLE "PUBLIC"."API_CONTENT" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_5" PRIMARY KEY("DESIGN_ID", "VERSION");
-- 2 +/- SELECT COUNT(*) FROM PUBLIC.API_CONTENT;             
CREATE TABLE IF NOT EXISTS SYSTEM_LOB_STREAM(ID INT NOT NULL, PART INT NOT NULL, CDATA VARCHAR, BDATA BINARY);
CREATE PRIMARY KEY SYSTEM_LOB_STREAM_PRIMARY_KEY ON SYSTEM_LOB_STREAM(ID, PART);              
CREATE ALIAS IF NOT EXISTS SYSTEM_COMBINE_CLOB FOR "org.h2.command.dml.ScriptCommand.combineClob";            
CREATE ALIAS IF NOT EXISTS SYSTEM_COMBINE_BLOB FOR "org.h2.command.dml.ScriptCommand.combineBlob";            
INSERT INTO SYSTEM_LOB_STREAM VALUES(0, 0, '{"openapi":"3.0.2","info":{"title":"OpenAPI 3.0 API","description":"The Data Set API (DSAPI) allows the public users to discover and search USPTO exported data sets. This is a generic API that allows USPTO users to make any CSV based data files searchable through API. With the help of GET call, it returns the list of data fields that are searchable. With the help of POST call, data can be fetched based on the filters on the field names. Please note that POST call is used to search the actual data. The reason for the POST call is that it allows users to specify any complex search criteria without worry about the GET size limitations as well as encoding of the input parameters.","contact":{"name":"Open Data Portal","url":"https://developer.uspto.gov","email":"developer@uspto.gov"},"version":"1.0.0"},"servers":[{"url":"{scheme}://developer.uspto.gov/ds-api","variables":{"scheme":{"enum":["https","http"],"default":"https","description":"The Data Set API is accessible via https and http"}}}],"paths":{"/":{"get":{"tags":["metadata"],"summary":"List available data sets","operationId":"list-data-sets","responses":{"200":{"description":"Returns a list of data sets","content":{"application/json":{"schema":{"$ref":"#/components/schemas/dataSetList"},"example":{"total":2,"apis":[{"apiKey":"oa_citations","apiVersionNumber":"v1","apiUrl":"https://developer.uspto.gov/ds-api/oa_citations/v1/fields","apiDocumentationUrl":"https://developer.uspto.gov/ds-api-docs/index.html?url=https://developer.uspto.gov/ds-api/swagger/docs/oa_citations.json"},{"apiKey":"cancer_moonshot","apiVersionNumber":"v1","apiUrl":"https://developer.uspto.gov/ds-api/cancer_moonshot/v1/fields","apiDocumentationUrl":"https://developer.uspto.gov/ds-api-docs/index.html?url=https://developer.uspto.gov/ds-api/swagger/docs/cancer_moonshot.json"}]}}}}}}},"/{dataset}/{version}/fields":{"get":{"tags":["metadata"],"summary":"Provides the general information about the API and the list of fields that can be used to query the dataset.","description":"This GET API returns the list of all the searchable field names that are in the oa_citations. Please see the ''fields'' attribute which returns an array of field names. Each field or a combination of fields can be searched using the syntax options shown below.","operationId":"list-searchable-fields","parameters":[{"name":"dataset","in":"path","description":"Name of the dataset.","required":true,"schema":{"type":"string"},"example":"oa_citations"},{"name":"version","in":"path","description":"Version of the dataset.","required":true,"schema":{"type":"string"},"example":"v1"}],"responses":{"200":{"description":"The dataset API for the given version is found and it is accessible to consume.","content":{"application/json":{"schema":{"type":"string"}}}},"404":{"description":"The combination of dataset name and version is not found in the system or it is not published yet to be consumed by public.","content":{"application/json":{"schema":{"type":"string"}}}}}}},"/{dataset}/{version}/records":{"post":{"tags":["search"],"summary":"Provides search capability for the data set with the given search criteria.","description":"This API is based on Solr/Lucense Search. The data is indexed using SOLR. This GET API returns the list of all the searchable field names that are in the Solr Index. Please see the ''fields'' attribute which returns an array of field names. Each field or a combination of fields can be searched using the Solr/Lucene Syntax. Please refer https://lucene.apache.org/core/3_6_2/queryparsersyntax.html#Overview for the query syntax. List of field names that are searchable can be determined using above GET api.","operationId":"perform-search","parameters":[{"name":"version","in":"path","description":"Version of the dataset.","required":true,"schema":{"default":"v1","type":"string"}},{"name":"dataset","in":"path","description":"Name of the dataset. In this case, the default value is oa_citations","required":true,"schema":{"default":"oa_citations","type":"string"}}],"requestBody":{"content":{"application/x-www-form-urlencoded":{"schema":{"r', NULL);     
INSERT INTO SYSTEM_LOB_STREAM VALUES(0, 1, 'equired":["criteria"],"type":"object","properties":{"criteria":{"description":"Uses Lucene Query Syntax in the format of propertyName:value, propertyName:[num1 TO num2] and date range format: propertyName:[yyyyMMdd TO yyyyMMdd]. In the response please see the ''docs'' element which has the list of record objects. Each record structure would consist of all the fields and their corresponding values.","default":"*:*","type":"string"},"start":{"description":"Starting record number. Default value is 0.","default":0,"type":"integer"},"rows":{"description":"Specify number of rows to be returned. If you run the search with default values, in the response you will see ''numFound'' attribute which will tell the number of records available in the dataset.","default":100,"type":"integer"}}}}}},"responses":{"200":{"description":"successful operation","content":{"application/json":{"schema":{"type":"array","items":{"type":"object","additionalProperties":{"type":"object"}}}}}},"404":{"description":"No matching record found for the given criteria."}}}}},"components":{"schemas":{"dataSetList":{"type":"object","properties":{"total":{"type":"integer"},"apis":{"type":"array","items":{"type":"object","properties":{"apiKey":{"description":"To be used as a dataset parameter value","type":"string"},"apiVersionNumber":{"description":"To be used as a version parameter value","type":"string"},"apiUrl":{"format":"uriref","description":"The URL describing the dataset''s fields","type":"string"},"apiDocumentationUrl":{"format":"uriref","description":"A URL to the API console for each API","type":"string"}}}}}}}},"tags":[{"name":"metadata","description":"Find out about the data sets"},{"name":"search","description":"Search a data set"}]}', NULL); 
INSERT INTO "PUBLIC"."API_CONTENT" VALUES
(1, 1, 0, '{"swagger":"2.0","info":{"title":"OpenAPI 2.0 API","description":"This is a simple 2.0 API definition.","license":{"name":"Apache 2.0","url":"https://www.apache.org/licenses/LICENSE-2.0"},"version":"1.0.0"},"consumes":["application/json"],"produces":["application/json"],"paths":{"/widgets":{"get":{"summary":"List All Widgets","description":"Gets a list of all `Widget` entities.","operationId":"getWidgets","responses":{"200":{"description":"Successful response - returns an array of `Widget` entities.","schema":{"type":"array","items":{"$ref":"#/definitions/Widget"}}}}},"post":{"summary":"Create a Widget","description":"Creates a new instance of a `Widget`.","operationId":"createWidget","parameters":[{"name":"body","in":"body","description":"A new `Widget` to be created.","required":true,"schema":{"$ref":"#/definitions/Widget"}}],"responses":{"201":{"description":"Successful response."}}}},"/widgets/{widgetId}":{"get":{"summary":"Get a Widget","description":"Gets the details of a single instance of a `Widget`.","operationId":"getWidget","responses":{"200":{"description":"Successful response - returns a single `Widget`.","schema":{"$ref":"#/definitions/Widget"}}}},"put":{"summary":"Update a Widget","description":"Updates an existing `Widget`.","operationId":"updateWidget","parameters":[{"name":"body","in":"body","description":"Updated `Widget` information.","required":true,"schema":{"$ref":"#/definitions/Widget"}}],"responses":{"202":{"description":"Successful response."}}},"delete":{"summary":"Delete a Widget","description":"Deletes an existing `Widget`.","operationId":"deleteWidget","responses":{"204":{"description":"Successful response."}}},"parameters":[{"name":"widgetId","in":"path","description":"A unique identifier for a `Widget`.","required":true,"type":"string"}]}},"definitions":{"Widget":{"title":"Root Type for Widget","description":"A very simple, generic data type.","type":"object","properties":{"name":{"description":"The name of the widget.","type":"string"},"description":{"description":"The description of the widget.","type":"string"}},"example":"{\n    \"name\": \"My Widget\",\n    \"description\": \"Just a little widget for your review.\"\n}"}}}', 'eric.wittmann@gmail.com', TIMESTAMP '2019-01-15 12:54:17.628', 0, NULL),
(2, 2, 0, SYSTEM_COMBINE_CLOB(0), 'eric.wittmann@gmail.com', TIMESTAMP '2019-01-15 12:54:28.929', 0, NULL);           
CREATE INDEX "PUBLIC"."IDX_CONTENT_1" ON "PUBLIC"."API_CONTENT"("VERSION");   
CREATE INDEX "PUBLIC"."IDX_CONTENT_2" ON "PUBLIC"."API_CONTENT"("TYPE");      
CREATE INDEX "PUBLIC"."IDX_CONTENT_3" ON "PUBLIC"."API_CONTENT"("CREATED_BY");
CREATE INDEX "PUBLIC"."IDX_CONTENT_4" ON "PUBLIC"."API_CONTENT"("CREATED_ON");
CREATE INDEX "PUBLIC"."IDX_CONTENT_5" ON "PUBLIC"."API_CONTENT"("REVERTED");  
CREATE CACHED TABLE "PUBLIC"."ACL"(
    "USER_ID" VARCHAR(255) NOT NULL,
    "DESIGN_ID" BIGINT NOT NULL,
    "ROLE" VARCHAR(16) NOT NULL
);              
ALTER TABLE "PUBLIC"."ACL" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_F" PRIMARY KEY("USER_ID", "DESIGN_ID");        
-- 2 +/- SELECT COUNT(*) FROM PUBLIC.ACL;     
INSERT INTO "PUBLIC"."ACL" VALUES
('eric.wittmann@gmail.com', 1, 'owner'),
('eric.wittmann@gmail.com', 2, 'owner');         
CREATE INDEX "PUBLIC"."IDX_ACL_1" ON "PUBLIC"."ACL"("ROLE");  
CREATE CACHED TABLE "PUBLIC"."ACL_INVITES"(
    "CREATED_BY" VARCHAR(255) NOT NULL,
    "CREATED_ON" TIMESTAMP NOT NULL,
    "CREATED_BY_DISPLAY" VARCHAR(255),
    "DESIGN_ID" BIGINT NOT NULL,
    "ROLE" VARCHAR(16) NOT NULL,
    "INVITE_ID" VARCHAR(64) NOT NULL,
    "STATUS" VARCHAR(16) NOT NULL,
    "MODIFIED_BY" VARCHAR(255),
    "MODIFIED_ON" TIMESTAMP,
    "SUBJECT" VARCHAR(1024)
);             
ALTER TABLE "PUBLIC"."ACL_INVITES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_E" PRIMARY KEY("INVITE_ID");           
-- 0 +/- SELECT COUNT(*) FROM PUBLIC.ACL_INVITES;             
CREATE INDEX "PUBLIC"."IDX_INVITES_1" ON "PUBLIC"."ACL_INVITES"("STATUS");    
CREATE CACHED TABLE "PUBLIC"."SESSION_UUIDS"(
    "UUID" VARCHAR(255) NOT NULL,
    "DESIGN_ID" BIGINT NOT NULL,
    "USER_ID" VARCHAR(255) NOT NULL,
    "SECRET" VARCHAR(255) NOT NULL,
    "VERSION" BIGINT NOT NULL,
    "EXPIRES_ON" BIGINT NOT NULL
);           
ALTER TABLE "PUBLIC"."SESSION_UUIDS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_FC" PRIMARY KEY("UUID");             
-- 0 +/- SELECT COUNT(*) FROM PUBLIC.SESSION_UUIDS;           
CREATE INDEX "PUBLIC"."IDX_UUIDS_1" ON "PUBLIC"."SESSION_UUIDS"("UUID", "DESIGN_ID", "SECRET");               
CREATE CACHED TABLE "PUBLIC"."CODEGEN"(
    "ID" BIGINT DEFAULT (NEXT VALUE FOR "PUBLIC"."SYSTEM_SEQUENCE_19B93B77_B280_4F22_9AA2_B059FAC65FDC") NOT NULL NULL_TO_DEFAULT SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_19B93B77_B280_4F22_9AA2_B059FAC65FDC",
    "CREATED_BY" VARCHAR(255) NOT NULL,
    "CREATED_ON" TIMESTAMP NOT NULL,
    "MODIFIED_BY" VARCHAR(255),
    "MODIFIED_ON" TIMESTAMP,
    "DESIGN_ID" BIGINT NOT NULL,
    "PTYPE" VARCHAR(64) NOT NULL,
    "ATTRIBUTES" CLOB NOT NULL
);   
ALTER TABLE "PUBLIC"."CODEGEN" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_62" PRIMARY KEY("ID");     
-- 0 +/- SELECT COUNT(*) FROM PUBLIC.CODEGEN; 
CREATE INDEX "PUBLIC"."IDX_CODEGEN_1" ON "PUBLIC"."CODEGEN"("PTYPE");         
CREATE INDEX "PUBLIC"."IDX_CODEGEN_2" ON "PUBLIC"."CODEGEN"("DESIGN_ID");     
DROP TABLE IF EXISTS SYSTEM_LOB_STREAM;       
CALL SYSTEM_COMBINE_BLOB(-1); 
DROP ALIAS IF EXISTS SYSTEM_COMBINE_CLOB;     
DROP ALIAS IF EXISTS SYSTEM_COMBINE_BLOB;     
ALTER TABLE "PUBLIC"."CODEGEN" ADD CONSTRAINT "PUBLIC"."FK_CODEGEN_1" FOREIGN KEY("DESIGN_ID") REFERENCES "PUBLIC"."API_DESIGNS"("ID") NOCHECK;               
ALTER TABLE "PUBLIC"."ACL" ADD CONSTRAINT "PUBLIC"."FK_ACL_1" FOREIGN KEY("DESIGN_ID") REFERENCES "PUBLIC"."API_DESIGNS"("ID") NOCHECK;       
ALTER TABLE "PUBLIC"."API_CONTENT" ADD CONSTRAINT "PUBLIC"."FK_CONTENT_1" FOREIGN KEY("DESIGN_ID") REFERENCES "PUBLIC"."API_DESIGNS"("ID") NOCHECK;           
ALTER TABLE "PUBLIC"."ACL_INVITES" ADD CONSTRAINT "PUBLIC"."FK_INVITES_1" FOREIGN KEY("DESIGN_ID") REFERENCES "PUBLIC"."API_DESIGNS"("ID") NOCHECK;           
