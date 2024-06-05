package io.apicurio.studio.test.resource;

import io.debezium.testing.testcontainers.ConnectorConfiguration;
import io.debezium.testing.testcontainers.DebeziumContainer;
import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.lifecycle.Startables;
import org.testcontainers.utility.DockerImageName;

import java.util.Map;
import java.util.stream.Stream;

public class DebeziumContainerResource implements QuarkusTestResourceLifecycleManager {

    private static Network network = Network.newNetwork();

    private static KafkaContainer kafkaContainer = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka")
            .withTag("7.5.4.arm64"))
            .withNetwork(network);

    public static PostgreSQLContainer<?> postgresContainer =
            new PostgreSQLContainer<>(
                    DockerImageName.parse("quay.io/debezium/postgres:15")
                            .asCompatibleSubstituteFor("postgres"))
                    .withDatabaseName("studio")
                    .withUsername("postgres")
                    .withPassword("postgres")
                    .withNetwork(network)
                    .withNetworkAliases("postgres");

    public static DebeziumContainer debeziumContainer =
            new DebeziumContainer("quay.io/debezium/connect:2.6.2.Final")
                    .withNetwork(network)
                    .withKafka(kafkaContainer)
                    .dependsOn(kafkaContainer);

    @Override
    public Map<String, String> start() {
        //Start the postgresql database, kafka, and debezium
        Startables.deepStart(Stream.of(
                        kafkaContainer, postgresContainer, debeziumContainer))
                .join();

        //Register the postgresql connector
        ConnectorConfiguration connector = ConnectorConfiguration
                .forJdbcContainer(postgresContainer)
                .with("topic.prefix", "studio")
                .with("schema.include.list", "public")
                .with("table.include.list", "public.outbox")
                .with("tombstones.on.delete", "false");

        debeziumContainer.registerConnector("my-connector",
                connector);

        System.setProperty("bootstrap.servers", kafkaContainer.getBootstrapServers());

        return Map.of(
                "apicurio.datasource.url", postgresContainer.getJdbcUrl(),
                "apicurio.datasource.username", "postgres",
                "apicurio.datasource.password", "postgres"
        );
    }

    @Override
    public void stop() {
        debeziumContainer.stop();
        postgresContainer.stop();
        kafkaContainer.stop();
    }
}
