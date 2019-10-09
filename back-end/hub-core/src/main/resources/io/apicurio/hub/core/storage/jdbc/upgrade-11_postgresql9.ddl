-- *********************************************************************
-- DDL for the Apicurio Studio Hub API - Database: PostgreSQL 9+
-- Upgrades the DB schema from version 10 to version 11.
-- *********************************************************************

UPDATE apicurio SET prop_value = 11 WHERE prop_name = 'db_version';

DROP TABLE sharing;

CREATE TABLE sharing (design_id BIGINT NOT NULL PRIMARY KEY, uuid VARCHAR(255) NOT NULL, level VARCHAR(64) NOT NULL);
ALTER TABLE sharing ADD CONSTRAINT FK_shar_1 FOREIGN KEY (design_id) REFERENCES api_designs (id);
CREATE INDEX IDX_shar_1 ON sharing(uuid);
CREATE INDEX IDX_shar_2 ON sharing(level);

CREATE FUNCTION upsert_sharing(i BIGINT, u VARCHAR(255), l VARCHAR(64)) RETURNS VOID AS
$$
BEGIN
    LOOP
        -- first try to update
        UPDATE sharing SET level = l WHERE design_id = i;
        IF found THEN
            RETURN;
        END IF;
        -- not there, so try to insert the data
        BEGIN
            INSERT INTO sharing(design_id, uuid, level) VALUES (i, u, l);
            RETURN;
        EXCEPTION WHEN unique_violation THEN
            -- do nothing, and loop to try the UPDATE again
        END;
    END LOOP;
END;
$$
LANGUAGE plpgsql;

