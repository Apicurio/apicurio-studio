package io.apicurio.studio.test.shared;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
public class Utils {

    public static void assertTimeWithin(Instant timestamp, Duration interval) {
        final var now = Instant.now();
        interval = interval.dividedBy(2);
        assertTrue(timestamp.isAfter(now.minus(interval)));
        assertTrue(timestamp.isBefore(now.plus(interval)));
    }

    public static void assertTimeWithin(Date timestamp, Duration interval) {
        assertTimeWithin(timestamp.toInstant(), interval);
    }
}
