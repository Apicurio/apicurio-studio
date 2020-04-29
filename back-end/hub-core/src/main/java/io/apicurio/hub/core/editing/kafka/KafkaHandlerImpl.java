/*
 * Copyright 2020 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.apicurio.hub.core.editing.kafka;

import io.apicurio.hub.core.cmd.OaiCommandException;
import io.apicurio.hub.core.config.HubConfiguration;
import io.apicurio.hub.core.editing.events.ActionType;
import io.apicurio.hub.core.editing.events.EventAction;
import io.apicurio.hub.core.editing.events.IEditingSessionExt;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.storage.IRollupExecutor;
import io.apicurio.hub.core.storage.StorageException;
import io.apicurio.registry.utils.IoUtil;
import io.apicurio.registry.utils.kafka.AsyncProducer;
import io.apicurio.registry.utils.kafka.ConsumerContainer;
import io.apicurio.registry.utils.kafka.Oneof2;
import io.apicurio.registry.utils.kafka.ProducerActions;
import org.apache.kafka.clients.CommonClientConfigs;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.Properties;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Future;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

/**
 * Kafka handler - producer / consumer.
 *
 * @author Ales Justin
 */
@ApplicationScoped
public class KafkaHandlerImpl implements KafkaHandler {
    private static final Logger log = LoggerFactory.getLogger(KafkaHandlerImpl.class);

    @Inject
    HubConfiguration configuration;

    @Inject
    IRollupExecutor rollupExecutor;

    private ProducerActions<String, EventAction> producer;
    private ConsumerContainer.DynamicPool<String, EventAction> consumer;

    private Map<String, IEditingSessionExt> sessions = new ConcurrentHashMap<>();

    private Map<String, Future<?>> rollups = new ConcurrentHashMap<>();
    private ScheduledExecutorService executorService;

    public synchronized void start() {
        if (consumer != null) {
            return;
        }

        executorService = new ScheduledThreadPoolExecutor(configuration.getKafkaThreads());

        String bootstrapServers = configuration.getKafkaBootstrapServers();
        Properties properties = new Properties();
        properties.put(CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);

        JsonSerde serde = new JsonSerde();

        Properties producerProperties = new Properties();
        producerProperties.putAll(properties);
        producer = new AsyncProducer<>(
            producerProperties,
            new StringSerializer(),
            serde
        );

        String groupId = configuration.getKafkaGroupId();
        Properties consumerProperties = new Properties();
        consumerProperties.putAll(properties);
        // each consumer has it's own UNIQUE group, so they all consume all messages
        // if possible, use repeatable (but UNIQUE) string, e.g. for a restarted node
        consumerProperties.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        consumer = new ConsumerContainer.DynamicPool<>(
            consumerProperties,
            new StringDeserializer(),
            serde,
            configuration.getKafkaTopic(),
            configuration.getKafkaConsumers(),
            Oneof2.first(this::consume)
        );
        consumer.start();
    }

    @PreDestroy
    public void close() {
        try {
            IoUtil.closeIgnore(producer);
            if (consumer != null && consumer.isRunning()) {
                consumer.stop();
            }
        } finally {
            if (executorService != null) {
                executorService.shutdown();
            }
        }
    }

    @Override
    public void addSession(IEditingSessionExt session) {
        sessions.put(session.getDesignId(), session);
    }

    @Override
    public void removeSession(IEditingSessionExt session) {
        String designId = session.getDesignId();
        sessions.remove(designId);

        // schedule for rollup, if nobody replies that it's still alive
        // not thread safe .. if this causes serious issues, we need to re-impl this
        String uuid = UUID.randomUUID().toString();
        log.debug(
            "Scheduling rollup in {}s: {} [{}]",
            configuration.getKafkaTimeout(), uuid, designId
        );
        ScheduledFuture<?> schedule = executorService.schedule(
            () -> rollup(uuid, designId),
            configuration.getKafkaTimeout(),
            TimeUnit.SECONDS
        );
        rollups.put(uuid, schedule);
        send(designId, EventAction.close(uuid));
    }

    private void rollup(String uuid, String designId) {
        log.debug("Executing rollup: {} [{}]", uuid, designId);
        rollups.remove(uuid);
        try {
            this.rollupExecutor.rollupCommands(designId);
        } catch (NotFoundException | StorageException | OaiCommandException e) {
            log.error("Error detected closing an Editing Session.", e);
        }
    }

    @Override
    public void send(String designId, EventAction action) {
        producer.apply(new ProducerRecord<>(configuration.getKafkaTopic(), designId, action))
                .whenComplete((rmd, t) -> {
                    if (t != null) {
                        log.error("Error sending action: {} [{}]", action, designId, t);
                    } else {
                        log.debug("Action {} [{}] sent!", action, designId);
                    }
                });
    }

    private void consume(ConsumerRecord<String, EventAction> cr) {
        String designId = cr.key();
        EventAction action = cr.value();
        ActionType type = action.getType();
        String id = action.getId();

        IEditingSessionExt session = sessions.get(designId);
        if (session != null && type != ActionType.ROLLUP) {
            switch (type) {
                case CLOSE:
                    if (session.isEmpty() == false) {
                        send(designId, EventAction.rollup(id));
                    }
                    return;
                case SEND_TO_OTHERS:
                    session.sendToOthers(action.toBaseOperation(), id);
                    return;
                case SEND_TO_LIST:
                    session.sendTo(id);
                    break;
                case SEND_TO_EXECUTE:
                    session.sendTo(action.getOps(), id);
                    return;
            }
        }

        if (type == ActionType.ROLLUP) {
            Future<?> rollup = rollups.remove(id);
            if (rollup != null) {
                // still some session contexts somewhere, cancel rollup
                log.debug("Canceling rollup - sessions are still alive: {} [{}]", id, designId);
                rollup.cancel(false);
            }
        }
    }
}
