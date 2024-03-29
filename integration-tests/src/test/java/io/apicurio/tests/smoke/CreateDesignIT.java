package io.apicurio.tests.smoke;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import io.apicurio.studio.rest.client.models.CreateDesign;
import io.apicurio.studio.rest.client.models.Design;
import io.apicurio.studio.rest.client.models.DesignOriginType;
import io.apicurio.studio.rest.client.models.DesignType;
import io.apicurio.tests.ApicurioStudioBaseIT;
import io.apicurio.tests.utils.Constants;
import io.apicurio.tests.utils.TestContent;
import io.quarkus.test.junit.QuarkusIntegrationTest;

@Tag(Constants.SMOKE)
@QuarkusIntegrationTest
class CreateDesignIT extends ApicurioStudioBaseIT {
    
    @Test
    @Tag(SMOKE)
    void createOpenApiDesign() throws Exception {
        String contentType = "application/json";
        String content = TestContent.OPENAPI_CONTENT;
        String name = "Empty Test";
        String description = "Just a simple, empty test API design.";
        DesignOriginType origin = DesignOriginType.Create;
        DesignType type = DesignType.OPENAPI;
        
        CreateDesign createDesign = new CreateDesign();
        createDesign.setContentType(contentType);
        createDesign.setContent(content);
        createDesign.setDescription(description);
        createDesign.setName(name);
        createDesign.setOrigin(origin);
        createDesign.setType(type);
        Design design = studioClient.designs().post(createDesign);
        
        assertNotNull(design);
        assertNotNull(design.getDesignId());
        assertEquals(name, design.getName());
        assertEquals(description, design.getDescription());
        assertEquals(origin, design.getOrigin());
        assertEquals(type, design.getType());
        
        var metadata = studioClient.designs().byDesignId(design.getDesignId()).get();
        assertEquals(design.getDesignId(), metadata.getDesignId());
        assertEquals(design.getCreatedBy(), metadata.getCreatedBy());
        assertEquals(design.getCreatedOn(), metadata.getCreatedOn());
        assertEquals(design.getDescription(), metadata.getDescription());
        assertEquals(design.getModifiedBy(), metadata.getModifiedBy());
        assertEquals(design.getModifiedOn(), metadata.getModifiedOn());
        assertEquals(design.getName(), metadata.getName());
        assertEquals(design.getOrigin(), metadata.getOrigin());
        assertEquals(design.getType(), metadata.getType());
    }

}

