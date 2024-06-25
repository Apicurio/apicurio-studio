package io.apicurio.studio.test.run.rest.v1.postgresql;

import io.apicurio.studio.test.profile.EventsTestProfile;
import io.apicurio.studio.test.shared.rest.v1.DesignsResourceTestShared;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import jakarta.inject.Inject;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.rnorth.ducttape.unreliables.Unreliables;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@QuarkusTest
@TestProfile(EventsTestProfile.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class DesignsEventsTest {

    @Inject
    DesignsResourceTestShared drts;

    private KafkaConsumer<String, String> consumer;

    @BeforeAll
    public void init() {
        consumer = getConsumer(System.getProperty("bootstrap.servers"));
        consumer.subscribe(List.of("outbox.event.DESIGN"));
    }

    @Test
    void createDesign() {
        //Create a new design
        drts.runCreateDesign();

        List<ConsumerRecord<String, String>> changeEvents =
                drain(consumer, 1);
    }

    private KafkaConsumer<String, String> getConsumer(String bootstrapServers) {
        return new KafkaConsumer<>(
                Map.of(
                        ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
                        bootstrapServers,
                        ConsumerConfig.GROUP_ID_CONFIG,
                        "tc-" + UUID.randomUUID(),
                        ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,
                        "earliest"),
                new StringDeserializer(),
                new StringDeserializer());
    }

    private List<ConsumerRecord<String, String>> drain(
            KafkaConsumer<String, String> consumer,
            int expectedRecordCount) {

        List<ConsumerRecord<String, String>> allRecords = new ArrayList<>();

        Unreliables.retryUntilTrue(10, TimeUnit.SECONDS, () -> {
            consumer.poll(Duration.ofMillis(50))
                    .iterator()
                    .forEachRemaining(allRecords::add);

            return allRecords.size() == expectedRecordCount;
        });

        return allRecords;
    }
}