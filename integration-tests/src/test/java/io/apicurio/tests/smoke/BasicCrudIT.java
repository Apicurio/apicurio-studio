package io.apicurio.tests.smoke;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import io.apicurio.studio.rest.client.models.CreateDesign;
import io.apicurio.studio.rest.client.models.DesignOriginType;
import io.apicurio.studio.rest.client.models.DesignType;
import io.apicurio.studio.rest.client.models.EditableDesignMetadata;
import io.apicurio.tests.ApicurioStudioBaseIT;
import io.apicurio.tests.utils.Constants;
import io.apicurio.tests.utils.TestContent;
import io.quarkus.test.junit.QuarkusIntegrationTest;
import jakarta.ws.rs.core.MediaType;

@Tag(Constants.SMOKE)
@QuarkusIntegrationTest
class BasicCrudIT extends ApicurioStudioBaseIT {

    //private static final Logger LOGGER = LoggerFactory.getLogger(BasicCrudIT.class);

    @Test
    @Tag(SMOKE)
    void basicCrudTest() throws Exception {
        CreateDesign cd = new CreateDesign();
        cd.setName("design1");
        cd.setType(DesignType.OPENAPI);
        cd.setOrigin(DesignOriginType.Create);
        cd.setContent(TestContent.OPENAPI_CONTENT);
        cd.setContentType(MediaType.APPLICATION_JSON);
        var metadata = studioClient.designs().post(cd);

        assertEquals("design1", metadata.getName());

        var metadata2 = studioClient.designs().byDesignId(metadata.getDesignId()).get();

        assertEquals(metadata.getDesignId(), metadata2.getDesignId());
        assertEquals(metadata.getName(), metadata2.getName());
        assertNull(metadata2.getDescription());
        assertEquals(metadata.getCreatedOn(), metadata2.getCreatedOn());
        assertEquals(metadata.getModifiedOn(), metadata2.getModifiedOn());
        
        Thread.sleep(1100);  // wait a bit so that the modified time will change

        var updatedMetadata = new EditableDesignMetadata();
        updatedMetadata.setDescription("foo");
        var metadata3 = studioClient.designs().byDesignId(metadata.getDesignId()).put(updatedMetadata);

        assertEquals(metadata.getDesignId(), metadata3.getDesignId());
        assertEquals(metadata.getName(), metadata3.getName());
        assertEquals("foo", metadata3.getDescription());
        assertEquals(metadata.getCreatedOn(), metadata3.getCreatedOn());
        assertNotEquals(metadata.getModifiedOn(), metadata3.getModifiedOn());

        InputStream contentStream = studioClient.designs().byDesignId(metadata.getDesignId()).content().get();
        String content2 = IOUtils.toString(contentStream, StandardCharsets.UTF_8);

        assertEquals(cd.getContent(), content2);

        studioClient.designs().byDesignId(metadata.getDesignId()).delete();

        assertThrows(Exception.class, () -> {
            studioClient.designs().byDesignId(metadata.getDesignId()).get();
        });
    }

}

