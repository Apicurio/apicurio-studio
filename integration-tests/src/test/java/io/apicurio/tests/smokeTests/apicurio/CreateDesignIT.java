package io.apicurio.tests.smokeTests.apicurio;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.nio.charset.StandardCharsets;

import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.studio.rest.client.models.ObjectReference;
import io.apicurio.tests.ApicurioStudioBaseIT;
import io.apicurio.tests.utils.Constants;
import io.quarkus.test.junit.QuarkusIntegrationTest;

@Tag(Constants.SMOKE)
@QuarkusIntegrationTest
class CreateDesignIT extends ApicurioStudioBaseIT {

    private static final Logger LOGGER = LoggerFactory.getLogger(CreateDesignIT.class);
    
    private static final String OPENAPI_CONTENT = "{\n"
            + "    \"openapi\": \"3.0.2\",\n"
            + "    \"info\": {\n"
            + "        \"title\": \"Empty Test\",\n"
            + "        \"version\": \"1.0.1\"\n"
            + "    },\n"
            + "    \"paths\": {\n"
            + "        \"/hello\": {\n"
            + "            \"get\": {\n"
            + "                \"responses\": {\n"
            + "                    \"200\": {\n"
            + "                        \"content\": {\n"
            + "                            \"application/json\": {\n"
            + "                                \"schema\": {\n"
            + "                                    \"type\": \"string\"\n"
            + "                                }\n"
            + "                            }\n"
            + "                        },\n"
            + "                        \"description\": \"Success.\"\n"
            + "                    }\n"
            + "                }\n"
            + "            }\n"
            + "        }\n"
            + "    }\n"
            + "}";

    @Test
    @Tag(SMOKE)
    void createOpenApiDesign() throws Exception {
        String contentType = "application/json";
        String content = OPENAPI_CONTENT;
        String name = "Empty Test";
        String description = "Just a simple, empty test API design.";
        String origin = "create";
        String type = "OPENAPI";
        
        ObjectReference designRef = studioClient.designs().post(IOUtils.toInputStream(content, StandardCharsets.UTF_8), contentType, (config) -> {
            config.headers.add("X-Studio-Name", name);
            config.headers.add("X-Studio-Description", description);
            config.headers.add("X-Studio-Origin", origin);
            config.headers.add("X-Studio-Type", type);
        });
        
        LOGGER.info("========================================= SUCCESS");
        LOGGER.info("ID: " + designRef.getId());
        LOGGER.info("Name: " + designRef.getName());
        LOGGER.info("Description: " + designRef.getDescription());
        LOGGER.info("========================================= SUCCESS");
        
        assertNotNull(designRef);
        assertNotNull(designRef.getId());
        assertEquals(name, designRef.getName());
        assertEquals(description, designRef.getDescription());
    }

}

