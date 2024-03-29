package io.apicurio.tests.smoke;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import io.apicurio.studio.rest.client.models.CreateDesign;
import io.apicurio.studio.rest.client.models.Design;
import io.apicurio.studio.rest.client.models.DesignOriginType;
import io.apicurio.studio.rest.client.models.DesignType;
import io.apicurio.studio.rest.client.models.SortBy;
import io.apicurio.studio.rest.client.models.SortOrder;
import io.apicurio.tests.ApicurioStudioBaseIT;
import io.apicurio.tests.utils.Constants;
import io.quarkus.test.junit.QuarkusIntegrationTest;

@Tag(Constants.SMOKE)
@QuarkusIntegrationTest
class SearchDesignsIT extends ApicurioStudioBaseIT {
    
    private void createDesign(String name, String description, DesignOriginType origin, DesignType type) {
        CreateDesign cd = new CreateDesign();
        cd.setName(name);
        cd.setDescription(description);
        cd.setOrigin(origin);
        cd.setType(type);
        cd.setContent("Some Content");
        cd.setContentType("text/plain");
        studioClient.designs().post(cd);
    }

    @Test
    @Tag(SMOKE)
    void getSystemInfo() throws Exception {
        // First, delete any designs that might already exist...
        studioClient.designs().get(config -> { config.queryParameters.pageSize = 100; }).getDesigns().forEach(design -> {
            studioClient.designs().byDesignId(design.getDesignId()).delete();
        });

        // Now create some designs to search over.
        createDesign(
                "red1",
                "foo",
                DesignOriginType.Create,
                DesignType.ASYNCAPI
        );
        createDesign(
                "green1",
                "foo bar",
                DesignOriginType.File,
                DesignType.ASYNCAPI
        );
        createDesign(
                "red2",
                "foo baz",
                DesignOriginType.Registry,
                DesignType.OPENAPI
        );
        createDesign(
                "green2",
                "baz",
                DesignOriginType.Url,
                DesignType.OPENAPI
        );

        // Order

        var search1 = studioClient.designs().get();
        assertEquals(4, search1.getCount());
        assertEquals(1, search1.getPage());
        assertEquals(20, search1.getPageSize());
        assertEquals(List.of("green2", "red2", "green1", "red1"), search1.getDesigns().stream().map(Design::getName).toList());

        var search2 = studioClient.designs().get(config -> {
            config.queryParameters.order = SortOrder.Asc;
        });
        assertEquals(List.of("red1", "green1", "red2", "green2"), search2.getDesigns().stream().map(Design::getName).toList());

        var search3 = studioClient.designs().get(config -> {
            config.queryParameters.orderby = SortBy.Name;
        });
        assertEquals(List.of("red2", "red1", "green2", "green1"), search3.getDesigns().stream().map(Design::getName).toList());

        // Filter
        var search4 = studioClient.designs().get(config -> {
            config.queryParameters.name = "green";
        });
        assertEquals(List.of("green2", "green1"), search4.getDesigns().stream().map(Design::getName).toList());

        var search5 = studioClient.designs().get(config -> {
            config.queryParameters.type = "OPENAPI";
            config.queryParameters.description = "f";
        });
        assertEquals(List.of("red2"), search5.getDesigns().stream().map(Design::getName).toList());

        // Paging
        var search6 = studioClient.designs().get(config -> {
            config.queryParameters.page = 2;
            config.queryParameters.pageSize = 2;
        });
        assertEquals(4, search6.getCount());
        assertEquals(2, search6.getPage());
        assertEquals(2, search6.getPageSize());
        assertEquals(List.of("green1", "red1"), search6.getDesigns().stream().map(Design::getName).toList());

    }

}

