/*
 * Copyright 2019 JBoss Inc
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

package io.apicurio.test.integration.arquillian.helpers;

import java.net.URI;
import java.util.ArrayDeque;
import java.util.Deque;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import io.apicurio.hub.core.editing.ops.BaseOperation;
import io.apicurio.hub.core.util.JsonUtil;

/**
 * A simple websockets client extending {@link WebSocketClient} to perform testing.
 *
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class ApicurioWebsocketsClient extends WebSocketClient {
    private final String clientName;
    private final Deque<String> inboundMessages = new ArrayDeque<>();

    /**
     * Constructor
     *
     * @param name local client name
     * @param serverURI URI to connect to
     */
    public ApicurioWebsocketsClient(String name, URI serverURI) {
        super(serverURI);
        this.clientName = name;
    }

    @Override
    public void onOpen(ServerHandshake handshakedata) {
        System.out.println("Opened WS connection. Status: " + handshakedata.getHttpStatusMessage());
    }

    @Override
    public void onMessage(String message) {
        System.out.println(clientName + " received WS message: " + message);
        inboundMessages.add(message);
    }

    @Override
    public void onClose(int code, String reason, boolean remote) {
        if(remote) {
            System.out.println("Connection closed by remote peer. Code: " + code + " Reason: " + reason);
        } else {
            System.out.println("Connection closed by " + clientName +  ". Code: " + code + " Reason: " + reason);
        }
    }

    // Fatal error will call onClose
    @Override
    public void onError(Exception ex) {
        ex.printStackTrace();
    }

    /**
     * Sends an operation over the wire.
     * @param operation
     */
    public void send(BaseOperation operation) {
        String message = JsonUtil.toJson(operation);
        this.send(message);
    }

    /**
     * Get queue of inbound messages received on this node
     * @return the deque of messages
     */
    public Deque<String> getInboundMessages() {
        return inboundMessages;
    }
}
