/*
 * Copyright 2017 JBoss Inc
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

package io.apicurio.hub.core.editing;

import java.io.Closeable;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.websocket.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.beans.ApiDesignCommandAck;

/**
 * Models a single, shared editing session for an API Design.
 * @author eric.wittmann@gmail.com
 */
public class ApiDesignEditingSession implements Closeable {

    private static Logger logger = LoggerFactory.getLogger(ApiDesignEditingSession.class);

    private final String designId;
    private final Map<String, Session> sessions = new HashMap<>();
    
    /**
     * Constructor.
     * @param designId
     */
    public ApiDesignEditingSession(String designId) {
        this.designId = designId;
    }

    /**
     * Join the websocket session to this design editing session.
     * @param session
     */
    public void join(Session session) {
        // TODO notify other sessions that the user has joined?  or handle that elsewhere?
        this.sessions.put(session.getId(), session);
    }

    /**
     * Removes a websocket session from this design editing session.
     * @param session
     */
    public void leave(Session session) {
        // TODO notify other sessions that the user has left?  or handle that elsewhere?
        this.sessions.remove(session.getId());
    }

    /**
     * @return true if the editing session has no more websocket sessions
     */
    public boolean isEmpty() {
        return this.sessions.isEmpty();
    }

    /**
     * @see java.io.Closeable#close()
     */
    @Override
    public void close() {
        // TODO anything to do here?
    }

    /**
     * Sends the given command to all other members of the editing session.
     * @param session
     * @param user
     * @param content
     * @param contentVersion
     */
    public void sendCommandToOthers(Session session, String user, ApiDesignCommand command) {
        StringBuilder builder = new StringBuilder();
        builder.append("{");
        builder.append("\"type\": \"command\", ");
        builder.append("\"contentVersion\": ");
        builder.append(command.getContentVersion());
        builder.append(", ");
        builder.append("\"command\": ");
        builder.append(command.getCommand());
        builder.append("}");
        
        for (Session otherSession : this.sessions.values()) {
            if (otherSession != session) {
                try {
                    otherSession.getBasicRemote().sendText(builder.toString());
                } catch (IOException e) {
                    // TODO what to do if this fails??
                    logger.error("Error sending command to websocket with sessionId: " + otherSession.getId(), e);
                }
            }
        }
    }

    /**
     * Sends an acknowledgement message to the given client.
     * @param session
     * @param ack
     */
    public void sendAck(Session session, ApiDesignCommandAck ack) {
        StringBuilder builder = new StringBuilder();
        builder.append("{");
        builder.append("\"type\": \"ack\", ");
        builder.append("\"contentVersion\": ");
        builder.append(ack.getContentVersion());
        builder.append(", ");
        builder.append("\"commandId\": ");
        builder.append(ack.getCommandId());
        builder.append("}");
        try {
            session.getBasicRemote().sendText(builder.toString());
        } catch (IOException e) {
            // TODO what to do if this fails??
            logger.error("Error sending ACK to websocket with sessionId: " + session.getId(), e);
        }
    }

    /**
     * @return the designId
     */
    public String getDesignId() {
        return designId;
    }

}
