package io.apicurio.studio.test.run.rest.v1.h2;

import io.apicurio.studio.test.shared.rest.v1.DesignsResourceTestShared;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@QuarkusTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class DesignsResourceTest {

    @Inject
    DesignsResourceTestShared drts;

    @Test
    void basicCRUD() {
        drts.runBasicCRUD();
    }

    @Test
    void createDesign() {
        drts.runCreateDesign();
    }

    @Test
    void createDesignEvent() {
        drts.runCreateDesignEvent();
    }

    @Test
    void searchDesigns() {
        drts.runSearchDesigns();
    }

    @AfterAll
    public void cleanUp() {
        drts.cleanUp();
    }
}
