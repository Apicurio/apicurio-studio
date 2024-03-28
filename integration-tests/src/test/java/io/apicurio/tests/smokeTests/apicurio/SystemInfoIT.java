package io.apicurio.tests.smokeTests.apicurio;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.studio.rest.client.models.SystemInfo;
import io.apicurio.tests.ApicurioStudioBaseIT;
import io.apicurio.tests.utils.Constants;
import io.quarkus.test.junit.QuarkusIntegrationTest;

@Tag(Constants.SMOKE)
@QuarkusIntegrationTest
class SystemInfoIT extends ApicurioStudioBaseIT {

    private static final Logger LOGGER = LoggerFactory.getLogger(SystemInfoIT.class);

    @Test
    @Tag(SMOKE)
    void createAvroDesign() throws Exception {
        SystemInfo systemInfo = studioClient.system().info().get();
        
        LOGGER.info("-----------------------------------------");
        LOGGER.info("Name:  " + systemInfo.getName());
        LOGGER.info("Desc:  " + systemInfo.getDescription());
        LOGGER.info("ApiV:  " + systemInfo.getApiVersion());
        LOGGER.info("GitId: " + systemInfo.getGitCommitId());
        LOGGER.info("-----------------------------------------");
        
        assertEquals("Apicurio Studio", systemInfo.getName());
        assertEquals("v1", systemInfo.getApiVersion());
    }

}

