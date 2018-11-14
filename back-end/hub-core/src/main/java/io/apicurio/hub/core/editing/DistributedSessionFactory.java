package io.apicurio.hub.core.editing;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.apicurio.hub.core.beans.ApiDesignCommand;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.enterprise.context.ApplicationScoped;
import javax.jms.ConnectionFactory;
import javax.jms.JMSConsumer;
import javax.jms.JMSContext;
import javax.jms.JMSException;
import javax.jms.JMSProducer;
import javax.jms.Message;
import javax.jms.TextMessage;
import javax.jms.Topic;
import java.io.Closeable;
import java.io.IOException;
import java.io.UncheckedIOException;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */

@ApplicationScoped //-- there seems to be a bug where if I use @applicationscoped Weld breaks?
//@Singleton
//@javax.ejb.Singleton
public class DistributedSessionFactory {
//    public static final String SESSION_SYNC_TOPIC = "java:/jms/topic/sessionsync";
    public static final String JAVA_JMS_TOPIC_SESSION = "java:/jms/topic/session/";

    // InVMConnectionFactory, if you use standard pooled-connection-factory it won't work
    @Resource(lookup = "java:/ConnectionFactory") 
    private ConnectionFactory connectionFactory;
    
    private JMSContext context;

    private static ObjectMapper mapper = new ObjectMapper();
    
//    public static final class SessionCommand {
//    	public String sessionId;
//    	//public Operation operation;
//    }

    @PostConstruct
    public void setup() {
    	context = connectionFactory.createContext();
    }

    public interface CommandHandler {
        void consumeCommand(ApiDesignCommand apiDesignCommand);
        // ConsumeAck?
    }

    public final class MessagingSessionContainer implements Closeable {
        private final String sessionId;
        private final Topic topic;
        private final JMSConsumer consumer;
        private final JMSProducer producer;
        private CommandHandler commandHandler;

        public MessagingSessionContainer(String sessionId,
                                         Topic topic,
                                         JMSConsumer consumer,
                                         JMSProducer producer,
                                         CommandHandler commandHandler) {

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
                    ApiDesignCommand incomingCommand = fromTextMessage(message, ApiDesignCommand.class);
                    commandHandler.consumeCommand(incomingCommand);
                } catch (JMSException e) {
                    throw new RuntimeException(e);
                }
            });
        }

        public void sendCommand(ApiDesignCommand command) {
            producer.send(topic, toJson(command));
        }

        public void setCommandHandler(CommandHandler commandHandler) {
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
    public MessagingSessionContainer joinSession(String id, CommandHandler handler) {
        Topic sessionTopic = context.createTopic(JAVA_JMS_TOPIC_SESSION + id);
        // Subscribe to the topic
        JMSConsumer consumer = context.createConsumer(sessionTopic, null, true);
        return new MessagingSessionContainer(id, sessionTopic, consumer, context.createProducer(), handler);
    }

    private static <O> String toJson(O object) {
        try {
            return mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private static <O> O fromTextMessage(Message input, Class<O> klazz) throws JMSException {
        return fromJson(((TextMessage)input).getText(), klazz);
    }

    private static <O> O fromJson(String input, Class<O> klazz) {
        try {
            return mapper.readValue(input, klazz);
        } catch (IOException ioe) {
            throw new UncheckedIOException(ioe);
        }
    }

//    public void shareSession(ApiDesignEditingSession session) {
        // Create a shared topic, assuming we don't already have it.
        //if ()

        //Topic sessionTopic = context.createTopic(session.getDesignId());
        //TextMessage message = context.createTextMessage(toJson());





//        for(int i=0; i<10; i++) {
//            try {
//            	System.out.println("Sending..?");
//                context.createProducer().send(topic, "{\"foo\":\"" + i + "\"}");
//                context.createTopic("foo");
//                sleep(500);
//            } catch (Exception e) {
//            	System.out.println("At messaging layer");
//            	e.printStackTrace();
//            	System.out.println("----");
//                throw new RuntimeException(e);
//            }
//        }
//    }

}
