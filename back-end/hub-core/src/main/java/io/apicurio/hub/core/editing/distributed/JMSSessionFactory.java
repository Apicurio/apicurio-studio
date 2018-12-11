package io.apicurio.hub.core.editing.distributed;

import io.apicurio.hub.core.editing.OperationHandler;
import io.apicurio.hub.core.editing.SharedApicurioSession;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
import io.apicurio.hub.core.util.JsonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.enterprise.context.ApplicationScoped;
import javax.jms.ConnectionFactory;
import javax.jms.JMSConsumer;
import javax.jms.JMSContext;
import javax.jms.JMSException;
import javax.jms.JMSProducer;
import javax.jms.TextMessage;
import javax.jms.Topic;
import java.io.Closeable;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */

@ApplicationScoped //-- there seems to be a bug where if I use @applicationscoped Weld breaks?
//@Singleton
//@javax.ejb.Singleton
public class JMSSessionFactory implements ApicurioDistributedSessionFactory {
    private static final Logger logger = LoggerFactory.getLogger(JMSSessionFactory.class);
    private static final String JAVA_JMS_TOPIC_SESSION = "java:/jms/topic/apicurio/session/";

    // InVMConnectionFactory, if you use standard pooled-connection-factory it won't work
    // because of some EE spec limitations that block listener callback handlers being registered.
    @Resource(lookup = "java:/ConnectionFactory") 
    private ConnectionFactory connectionFactory;

    private JMSContext context;

    @PostConstruct
    public void setup() {
    	context = connectionFactory.createContext();
    }

    public final class MessagingSessionContainer implements Closeable, SharedApicurioSession {
        private final String sessionId;
        private final Topic topic;
        private final JMSConsumer consumer;
        private final JMSProducer producer;
        private OperationHandler commandHandler;

        public MessagingSessionContainer(String sessionId,
                                         Topic topic,
                                         JMSConsumer consumer,
                                         JMSProducer producer,
                                         OperationHandler commandHandler) {

            this.sessionId = sessionId;
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
                    throw new RuntimeException(e);
                }
            });
        }

        public void sendOperation(BaseOperation command) {
            if (command.getSource() == BaseOperation.SourceEnum.LOCAL) {
                logger.debug("Sending local command to remote subscribers (if there are any): {} as {}",
                        command,
                        JsonUtil.toJson(command));
                producer.send(topic, JsonUtil.toJson(command));
            } else {
                logger.debug("Will not retransmit remote operation over bus (prevents cycle): {}", command);
            }
        }

        public void setOperationHandler(OperationHandler commandHandler) {
            this.commandHandler = commandHandler; 
        }

        public void close() {
            consumer.close();
        }

        public String getSessionId() {
            return sessionId;
        }

        public Topic getTopic() {
            return topic;
        }
    }

    // Suggest API ID
    @Override
    public MessagingSessionContainer joinSession(String id, OperationHandler handler) {
        logger.debug("Joining session {}", id);
        Topic sessionTopic = context.createTopic(JAVA_JMS_TOPIC_SESSION + id);
        // Subscribe to the topic
        JMSConsumer consumer = context.createConsumer(sessionTopic, null, true);
        return new MessagingSessionContainer(id, sessionTopic, consumer, context.createProducer(), handler);
    }

    @Override
    public String getSessionType() {
        return "jms";
    }

}
