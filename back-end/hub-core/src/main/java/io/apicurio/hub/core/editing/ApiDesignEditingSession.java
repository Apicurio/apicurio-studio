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
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

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
    private final Map<String, String> users = new HashMap<>();
    
    /**
     * Constructor.
     * @param designId
     */
    public ApiDesignEditingSession(String designId) {
        this.designId = designId;
    }

    /**
     * @return the designId
     */
    public String getDesignId() {
        return designId;
    }
    
    /**
     * Resolves the given session to a user name.
     * @param session
     */
    public String getUser(Session session) {
        return users.get(session.getId());
    }

    /**
     * Join the websocket session to this design editing session.
     * @param session
     * @param user
     */
    public void join(Session session, String user) {
        this.sessions.put(session.getId(), session);
        this.users.put(session.getId(), user);
    }

    /**
     * Removes a websocket session from this design editing session.
     * @param session
     */
    public void leave(Session session) {
        this.sessions.remove(session.getId());
        this.users.remove(session.getId());
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
     * Returns a set of all sessions currently connected.
     */
    public Set<Session> getSessions() {
        return new HashSet<>(this.sessions.values());
    }

    /**
     * Sends the given command to all other members of the editing session.
     * @param excludeSession
     * @param user
     * @param content
     * @param contentVersion
     */
    public void sendCommandToOthers(Session excludeSession, String user, ApiDesignCommand command) {
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
            if (otherSession != excludeSession) {
                try {
                    otherSession.getBasicRemote().sendText(builder.toString());
                } catch (IOException e) {
                    logger.error("Error sending command to websocket with sessionId: " + otherSession.getId(), e);
                }
            }
        }
    }

    /**
     * Sends the given selection change event to all other members of the editing session.
     * @param excludeSession
     * @param user
     * @param newSelection
     */
    public void sendUserSelectionToOthers(Session excludeSession, String user, String newSelection) {
        StringBuilder builder = new StringBuilder();
        builder.append("{");
        builder.append("\"type\": \"selection\", ");
        builder.append("\"user\": \"");
        builder.append(user);
        builder.append("\", ");
        builder.append("\"id\": \"");
        builder.append(excludeSession.getId());
        builder.append("\", ");
        builder.append("\"selection\": \"");
        // TODO may need to escape this string for JSON, or else build the payload using jackson instead of StringBuilder
        builder.append(newSelection);
        builder.append("\"}");
        
        for (Session otherSession : this.sessions.values()) {
            if (otherSession != excludeSession) {
                try {
                    otherSession.getBasicRemote().sendText(builder.toString());
                } catch (IOException e) {
                    logger.error("Error sending selection event to websocket with sessionId: " + otherSession.getId(), e);
                }
            }
        }
    }

    /**
     * Sends an acknowledgement message to the given client.
     * @param toSession
     * @param ack
     */
    public void sendAckTo(Session toSession, ApiDesignCommandAck ack) {
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
            toSession.getBasicRemote().sendText(builder.toString());
        } catch (IOException e) {
            logger.error("Error sending ACK to websocket with sessionId: " + toSession.getId(), e);
        }
    }

    /**
     * Sends a message to the other users that userId has joined the session.
     * @param joinedSession
     * @param joinedUser
     */
    public void sendJoinToOthers(Session joinedSession, String joinedUser) {
        StringBuilder builder = new StringBuilder();
        builder.append("{");
        builder.append("\"type\": \"join\", ");
        builder.append("\"user\": \"");
        builder.append(joinedUser);
        builder.append("\", ");
        builder.append("\"id\": \"");
        builder.append(joinedSession.getId());
        builder.append("\"");
        builder.append("}");
        
        for (Session otherSession : this.sessions.values()) {
            // Don't send the message to the user who is joining
            if (otherSession != joinedSession) {
                try {
                    otherSession.getBasicRemote().sendText(builder.toString());
                } catch (IOException e) {
                    logger.error("Error sending 'join' to websocket with sessionId: " + otherSession.getId(), e);
                }
            }
        }
    }

    /**
     * Sends a message to the other users that userId has joined the session.
     * @param leftSession
     * @param leftUser
     */
    public void sendLeaveToOthers(Session leftSession, String leftUser) {
        StringBuilder builder = new StringBuilder();
        builder.append("{");
        builder.append("\"type\": \"leave\", ");
        builder.append("\"user\": \"");
        builder.append(leftUser);
        builder.append("\", ");
        builder.append("\"id\": \"");
        builder.append(leftSession.getId());
        builder.append("\"");
        builder.append("}");
        
        for (Session otherSession : this.sessions.values()) {
            // Don't send the message to the user who is leaving
            if (otherSession != leftSession) {
                try {
                    otherSession.getBasicRemote().sendText(builder.toString());
                } catch (IOException e) {
                    logger.error("Error sending 'join' to websocket with sessionId: " + otherSession.getId(), e);
                }
            }
        }
    }

    /**
     * Sends a "join" message to the given session.  The join message will include the user Id and 
     * session ID of the user joining the session.
     * @param toSession
     * @param joinedUser
     * @param joinedId
     */
    public void sendJoinTo(Session toSession, String joinedUser, String joinedId) {
        StringBuilder builder = new StringBuilder();
        builder.append("{");
        builder.append("\"type\": \"join\", ");
        builder.append("\"user\": \"");
        builder.append(joinedUser);
        builder.append("\", ");
        builder.append("\"id\": \"");
        builder.append(joinedId);
        builder.append("\"");
        builder.append("}");
        
        try {
            toSession.getBasicRemote().sendText(builder.toString());
        } catch (IOException e) {
            logger.error("Error sending 'join' to websocket with sessionId: " + toSession.getId(), e);
        }
    }

}
