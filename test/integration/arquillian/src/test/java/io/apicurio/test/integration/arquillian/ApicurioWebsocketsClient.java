package io.apicurio.test.integration.arquillian;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.drafts.Draft;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;


/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class ApicurioWebsocketsClient extends WebSocketClient {
    private static final ObjectMapper OM = new ObjectMapper();

    public Deque<String> getInboundMessages() {
        return inboundMessages;
    }

    private Deque<String> inboundMessages = new ArrayDeque<>();

    private boolean isClosed = false;

    public ApicurioWebsocketsClient(URI serverUri , Draft draft ) {
        super( serverUri, draft );
    }

    public ApicurioWebsocketsClient(URI serverURI ) {
        super( serverURI );
    }

    public ApicurioWebsocketsClient(URI serverUri, Map<String, String> httpHeaders ) {
        super(serverUri, httpHeaders);
    }

    @Override
    public void onOpen(ServerHandshake handshakedata) {
        System.err.println( "opened connection" );
    }

    @Override
    public void onMessage(String message) {
        System.err.println("received: " + message);
        inboundMessages.add(message);
    }

    @Override
    public void onClose(int code, String reason, boolean remote ) {
        System.err.println( "Connection closed by " + ( remote ? "remote peer" : "us" ) + " Code: " + code + " Reason: " + reason );
        boolean closed = true;
    }

    // if the error is fatal then onClose will be called additionally
    @Override
    public void onError( Exception ex ) {
        ex.printStackTrace();
    }

    public void send(Object objToJson) throws JsonProcessingException {
        OM.writeValueAsString(objToJson);
    }
}
