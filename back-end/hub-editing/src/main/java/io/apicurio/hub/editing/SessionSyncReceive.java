//package io.apicurio.hub.editing;
//
//import javax.ejb.ActivationConfigProperty;
//import javax.ejb.MessageDriven;
//import javax.jms.JMSException;
//import javax.jms.Message;
//import javax.jms.MessageListener;
//
///**
// * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
// */
//
//@MessageDriven(name = "SessionSync", activationConfig = {
//        @ActivationConfigProperty(propertyName = "destinationLookup", propertyValue = SessSyncSend.SESSION_SYNC_TOPIC),
//        @ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Topic"),
//
//})
//public class SessionSyncReceive implements MessageListener {
//
//    @Override
//    public void onMessage(Message message) {
//    	try {
//			String body = message.getBody(String.class);
//	        System.out.println("Received this interesting message: " + body);
//		} catch (JMSException e) {
//			throw new RuntimeException(e);
//		}
//
//    }
//}
