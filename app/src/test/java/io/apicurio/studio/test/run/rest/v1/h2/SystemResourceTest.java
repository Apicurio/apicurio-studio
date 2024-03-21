package io.apicurio.studio.test.run.rest.v1.h2;

import io.apicurio.studio.test.shared.rest.v1.SystemResourceTestShared;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import jakarta.inject.Inject;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@QuarkusTest
class SystemResourceTest {

    @Inject
    SystemResourceTestShared srts;

    @Test
    void basic() {
        srts.runBasic();
    }
}
