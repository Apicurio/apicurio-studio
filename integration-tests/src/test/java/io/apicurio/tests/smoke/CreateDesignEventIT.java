package io.apicurio.tests.smoke;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import io.apicurio.studio.rest.client.models.CreateDesign;
import io.apicurio.studio.rest.client.models.CreateDesignEvent;
import io.apicurio.studio.rest.client.models.DesignEventData;
import io.apicurio.studio.rest.client.models.DesignEventDataCreate;
import io.apicurio.studio.rest.client.models.DesignEventType;
import io.apicurio.studio.rest.client.models.DesignOriginType;
import io.apicurio.studio.rest.client.models.DesignType;
import io.apicurio.tests.ApicurioStudioBaseIT;
import io.apicurio.tests.utils.Constants;
import io.apicurio.tests.utils.TestContent;
import io.quarkus.test.junit.QuarkusIntegrationTest;
import jakarta.ws.rs.core.MediaType;

@Tag(Constants.SMOKE)
@QuarkusIntegrationTest
class CreateDesignEventIT extends ApicurioStudioBaseIT {

    @Test
    @Tag(SMOKE)
    void createDesignEvent() throws Exception {
        String content1 = TestContent.OPENAPI_CONTENT;

        // Happy path

        var name1 = "design2";
        var cd = new CreateDesign();
        cd.setName(name1);
        cd.setType(DesignType.OPENAPI);
        cd.setOrigin(DesignOriginType.Create);
        cd.setContent(content1);
        cd.setContentType(MediaType.APPLICATION_JSON);
        
        var metadata1 = studioClient.designs().post(cd);

        CreateDesignEvent cde = new CreateDesignEvent();
        cde.setType(DesignEventType.CREATE);
        DesignEventData event = new DesignEventData();
        DesignEventDataCreate create = new DesignEventDataCreate();
        create.setTemplate("foo template");
        event.setCreate(create);
        cde.setData(event);
        var event1 = studioClient.designs().byDesignId(metadata1.getDesignId()).events().post(cde);

        assertEquals(metadata1.getDesignId(), event1.getDesignId());
        assertEquals(DesignEventType.CREATE, event1.getType());
        assertEquals("foo template", event1.getData().getCreate().getTemplate());
        assertNull(event1.getData().getImport());
        assertNull(event1.getData().getRegister());
        assertNull(event1.getData().getUpdate());

        var events1 = studioClient.designs().byDesignId(metadata1.getDesignId()).events().get();

        assertEquals(1, events1.size());
        assertNotNull(events1.get(0));
    }

}

