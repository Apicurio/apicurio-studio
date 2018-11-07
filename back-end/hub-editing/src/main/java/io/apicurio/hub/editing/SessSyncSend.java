package io.apicurio.hub.editing;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.apicurio.hub.core.editing.ApiDesignEditingSession;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.inject.Inject;
import javax.jms.JMSConsumer;
import javax.jms.JMSContext;
import javax.jms.JMSException;
import javax.jms.TextMessage;
import javax.jms.Topic;
import java.util.Map;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */

//@ApplicationScoped -- there seems to be a bug where if I use @applicationscoped Weld breaks?
//@Singleton
@javax.ejb.Singleton
public class SessSyncSend {
    public static final String SESSION_SYNC_TOPIC = "java:/jms/topic/sessionsync";

    @Inject
    private JMSContext context;

    @Resource(lookup = SESSION_SYNC_TOPIC)
    private Topic topic;

    private static ObjectMapper mapper = new ObjectMapper();
    static {
        //mapper.setSerializationInclusion(Include.NON_NULL);
    }
    
//    public static final class SessionCommand {
//    	public String sessionId;
//    	public Operation operation;
//    }

    private Map<String, Topic> activeSessions;

    @PostConstruct
    public void setup() {
        listenForSessions();
    }

    private void listenForSessions() {
        System.out.println("listenForSessions");
        JMSConsumer consumer = context.createConsumer(topic);
        consumer.setMessageListener(message -> {
            try {
                String sessionId = ((TextMessage) message).getText();
                if (activeSessions.containsKey(sessionId)) {

                } else {
                    System.out.println("A new session has been instantiated " + sessionId);

                }
            } catch (JMSException e) {
                throw new RuntimeException(e);
            }
        });
    }
    
    public void notifySession(ApiDesignEditingSession session) {
    	// Send design ID 
    	context.createProducer().send(topic, session.getDesignId());
    	//context
    }

    private static <O> String toJson(O object) {
        try {
            return mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public void shareSession(ApiDesignEditingSession session) {
        // Create a shared topic, assuming we don't already have it.
        //if ()

        Topic sessionTopic = context.createTopic(session.getDesignId());
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
    }

}
