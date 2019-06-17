/*
 * Copyright 2018 JBoss Inc
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
package io.apicurio.hub.core.editing.distributed;

import java.io.Closeable;

import javax.jms.ConnectionFactory;
import javax.jms.JMSConsumer;
import javax.jms.JMSContext;
import javax.jms.JMSException;
import javax.jms.JMSProducer;
import javax.jms.Message;
import javax.jms.TextMessage;
import javax.jms.Topic;
import javax.naming.InitialContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.core.cmd.OaiCommandException;
import io.apicurio.hub.core.editing.ops.BaseOperation;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.storage.IRollupExecutor;
import io.apicurio.hub.core.storage.StorageException;
import io.apicurio.hub.core.util.JsonUtil;

/**
 * Implements a distributed session using JMS. Tested with Artemis.
 *
 * Avoids circular dependencies by labelling objects sent over the bus,
 * and never retransmitting.
 *
 * For every shared editing session, a topic is lazily created and joined,
 * using the document ID as a key (e.g. <tt>/jms/topic/apicurio/session/1234</tt>.
 *
 * Configuration of the Broker should ensure that topics with no consumers
 * or producers are flushed and deleted. In Artemis these options are:
 *
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class JMSSessionFactory {
    private static final Logger logger = LoggerFactory.getLogger(JMSSessionFactory.class);
    /**
     * The last element of the path MUST be the API ID.
     * @see BrokerManagementEventListener#getDesignId
     **/
    private static final String JAVA_JMS_TOPIC_SESSION = "java:/jms/topic/apicurio/session/";
    private static final String CONNECTION_FACTORY_JNDI_LOCATION = "java:/ApicurioConnectionFactory";

    // InVMConnectionFactory, if you use standard pooled-connection-factory it won't work
    // because of some EE spec limitations that block listener callback handlers being registered.
    //@Resource(lookup = "java:/ApicurioConnectionFactory")
    private ConnectionFactory connectionFactory;
    private BrokerManagementEventListener managementEventListener;
    private IRollupExecutor rollupExecutor;

    private final Object jmsMutex = new Object();

    /**
     * Initializes the JMS session factory.
     * @param rollupExecutor
     */
    public void initialize(IRollupExecutor rollupExecutor) {
        this.rollupExecutor = rollupExecutor;
        connectionFactory = lookupConnectionFactory();
        managementEventListener = new BrokerManagementEventListener();
        managementEventListener.listen();
    }

    /**
     * Looks up the connection factory in JNDI.  Fails if it could not be found.
     */
    private ConnectionFactory lookupConnectionFactory() {
        logger.debug("Looking up the JMS connection factory from: " +  CONNECTION_FACTORY_JNDI_LOCATION);
        ConnectionFactory cf;
        try {
            InitialContext ctx = new InitialContext();
            cf = (ConnectionFactory) ctx.lookup(CONNECTION_FACTORY_JNDI_LOCATION);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if (cf == null) {
            throw new RuntimeException("JMS Connection Factory not found: " + CONNECTION_FACTORY_JNDI_LOCATION); //$NON-NLS-1$
        }
        return cf;
    }

    /**
     * Called to add a consumer to the JMS topic specific to the given design id.
     * @param designId
     * @param handler
     */
    public synchronized MessagingSessionContainer joinSession(String designId, IOperationHandler handler) {
        logger.debug("Joining session {}", designId);
        JMSContext context = connectionFactory.createContext();
        Topic sessionTopic = context.createTopic(JAVA_JMS_TOPIC_SESSION + designId);
        // Subscribe to the topic
        JMSConsumer consumer = context.createConsumer(sessionTopic, null, true);
        // When a new node joins the distributed session, it doesn't know about the session(s) attached to the
        // other nodes already in the session(s).
        return new MessagingSessionContainer(sessionTopic, consumer, context.createProducer(), handler);
    }
    
    public final class MessagingSessionContainer implements Closeable, IDistributedEditingSession {
        private final Topic topic;
        private final JMSConsumer consumer;
        private final JMSProducer producer;
        private final IOperationHandler commandHandler;

        /**
         * Constructor.
         * @param topic
         * @param consumer
         * @param producer
         * @param commandHandler
         */
        MessagingSessionContainer(Topic topic,
                                  JMSConsumer consumer,
                                  JMSProducer producer,
                                  IOperationHandler commandHandler) {
            this.topic = topic;
            this.consumer = consumer;
            this.producer = producer;
            this.commandHandler = commandHandler;
            setupHandler();
        }

        private void setupHandler() {
            consumer.setMessageListener(message -> {
                try {
                    commandHandler.consumeOperation(((TextMessage) message).getText());
                } catch (JMSException e) {
                    // TODO: Fall back to database if messaging solution throws exceptions here and/or retry.
                    throw new RuntimeException(e);
                }
            });
        }

        /**
         * @see io.apicurio.hub.core.editing.distributed.IDistributedEditingSession#sendOperation(io.apicurio.hub.core.editing.ops.BaseOperation)
         */
        @Override
        public void sendOperation(BaseOperation operation) {
            String serialized = JsonUtil.toJson(operation);
            logger.debug("[MessagingSessionContainer] Sending operation to remote subscribers (if there are any): {} as {}",
                    operation,
                    serialized);
            // TODO: Fall back to database if messaging solution throws exceptions here and/or retry.
            // Ensure retry is set on the client config
            synchronized (jmsMutex) {
                producer.send(topic, serialized);
            }
        }

        /**
         * @see java.io.Closeable#close()
         */
        @Override
        public void close() {
            logger.debug("[MessagingSessionContainer] Closing consumer: {} ", consumer);
            synchronized (jmsMutex) {
                consumer.close();
            }
        }
    }

    /**
     * Listens for "Address Removed" Artemis Management Events and executes a rollup for the corresponding design.
     *
     * As of writing, broker.xml must enable the Artemis NotificationActiveMQServerPlugin, and enable
     * SEND_ADDRESS_NOTIFICATIONS within the plugin. This ensures that the ADDRESS_REMOVED event is fired which is
     * used to trigger a rollup.
     *
     * <pre>
     * {@code
     *   <broker-plugins>
     *     <broker-plugin class-name="org.apache.activemq.artemis.core.server.plugin.impl.NotificationActiveMQServerPlugin">
     *       <property key="SEND_ADDRESS_NOTIFICATIONS" value="true" />
     *     </broker-plugin>
     *   </broker-plugins>
     * }
     * </pre>
     *
     * One must also ensure that the <tt>management-notification-address</tt> in <tt>broker.xml</tt> is configured
     * such that JMS clients can access it.
     *
     * This complication occurs because the Artemis JMS client prepends <tt>jms.topic.</tt> to all subscriptions.
     * Hence, it is impossible to subscribe to the default <tt>management-notification-address</tt> of
     * <tt>activemq.notifications</tt> at present, as this will be translated into
     * <tt>jms.topic.activemq.notifications</tt> on the client side.
     *
     * The solution is to define <tt>management-notification-address</tt> as defined below:
     *
     * <pre>
     * {@code
     *   <management-notification-address>jms.topic.activemq.notifications</management-notification-address>
     * }
     * </pre>
     *
     * <em>This behaviour will change in a future release of Artemis, with the prefix no longer added by default</em>.
     *
     * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
     */
    public final class BrokerManagementEventListener {
        /**
         * Artemis constants are defined here manually to avoid pulling in large dependencies.
         *
         * See org.apache.activemq.artemis.api.core.management.CoreNotificationType
         */
        private static final String AMQ_ADDRESS_REMOVED = "ADDRESS_REMOVED";
        private static final String AMQ_NOTIFICATION_TYPE = "_AMQ_NotifType";
        private static final String AMQ_ADDRESS_PROP = "_AMQ_Address";

        private final Topic managementEventTopic;
        private final JMSConsumer consumer;
        private final JMSContext mgmtContext;

        BrokerManagementEventListener() {
            logger.debug("[BrokerManagementEventListener] Creating AMQ managaement notification listener");
            mgmtContext = connectionFactory.createContext();
            managementEventTopic = mgmtContext.createTopic("activemq.notifications");

            // A shared consumer is used so that only ONE consumer receives a given message.
            // This enables us to do a roll-up without all nodes trying at once.
            consumer = mgmtContext.createSharedConsumer(managementEventTopic,
                    "apicurio-session-management-event-subscription");
        }

        void listen() {
            consumer.setMessageListener(this::onAmqManagementMessage);
        }

        /**
         * On message, if an ADDRESS_REMOVED notification is received, then trigger a rollup.
         * The only pertinent information is which address was deleted, so the design ID
         * must be inferred from the address.
         *
         * For example: <tt>/jms/topic/apicurio/session/1234</tt> is design ID <tt>1234</tt>.
         *
         * @see #getDesignId(String)
         * @see #isRemoveEvent(Message)
         */
        private void onAmqManagementMessage(Message managementEvent) {
            String designId = null;
            try {
                logger.debug("Received management event: " + managementEvent.getStringProperty(AMQ_NOTIFICATION_TYPE));
                if (isRemoveEvent(managementEvent)) {
                    String address = managementEvent.getStringProperty(AMQ_ADDRESS_PROP);

                    if (address == null || address.isEmpty()) {
                        logger.error("Required {} field is missing from {} management event. Rollups may not be performed.",
                                AMQ_ADDRESS_PROP,
                                AMQ_ADDRESS_REMOVED);
                        return;
                    }

                    logger.debug("Last node has left an editing session {}, and its topic been removed from the broker.",
                            address);

                    designId = getDesignId(address);

                    logger.debug("Rollup will be performed on design {}", designId);

                    rollupExecutor.rollupCommands(designId);
                }
            } catch (JMSException e) {
                logger.error("JMS Error processing AMQ management message", e);
                // TODO handle case where JMS goes away gracefully (e.g. fall back to DB)
            } catch (NotFoundException | StorageException | OaiCommandException e) {
                logger.error("Failed to rollup commands for API with id: " + designId, "Rollup error: ", e);
            }
        }

        private String getDesignId(String address) {
            String[] split = address.split("/");
            String designId = split[split.length-1];
            logger.debug("Design ID inferred from JMS topic to be: {}", designId);
            return designId;
        }

        private boolean isRemoveEvent(Message managementEvent) throws JMSException {
            // AMQ_NOTIFICATION_TYPE == AMQ_ADDRESS_REMOVED
            return AMQ_ADDRESS_REMOVED.equals(managementEvent.getStringProperty(AMQ_NOTIFICATION_TYPE));
        }
    }
}
