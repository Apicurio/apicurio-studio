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

import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.beans.ApiDesignCommandAck;
import io.apicurio.hub.core.beans.ApiDesignUndoRedo;
import io.apicurio.hub.core.beans.ApiDesignUndoRedoAck;
import io.apicurio.hub.core.editing.distributed.IDistributedSessionFactory;
import io.apicurio.hub.core.editing.operationprocessors.OperationProcessorDispatcher;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
import io.apicurio.hub.core.editing.sessionbeans.JoinLeaveOperation;
import io.apicurio.hub.core.editing.sessionbeans.ListClientsOperation;
import io.apicurio.hub.core.editing.sessionbeans.SelectionOperation;
import io.apicurio.hub.core.editing.sessionbeans.VersionedAck;
import io.apicurio.hub.core.editing.sessionbeans.VersionedCommandOperation;
import io.apicurio.hub.core.editing.sessionbeans.VersionedOperation;
import io.apicurio.hub.core.util.JsonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Closeable;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Models a single, shared editing session for an API Design.
 * @author eric.wittmann@gmail.com
 */
public class ApiDesignEditingSession implements Closeable {

    private static Logger logger = LoggerFactory.getLogger(ApiDesignEditingSession.class);
    private final String designId;
    private final Map<String, ISessionContext> sessions = new HashMap<>();
    private final Map<String, String> users = new HashMap<>();
    private final ISharedApicurioSession distributedSession;

    /**
     * Constructor.
     * @param designId
     * @param factory
     * @param operationProcessor
     */
    public ApiDesignEditingSession(String designId,
                                   IDistributedSessionFactory factory,
                                   OperationProcessorDispatcher operationProcessor) {
        this.designId = designId;
        // Join a remote session (if there is one configured).
        this.distributedSession = factory.joinSession(designId, payload -> {
            operationProcessor.process(this, null, JsonUtil.toJsonTree(payload));
        });
        // Discover any WS clients connected to other nodes so we can draw their icons, etc.
        sendListClientsToOthers();
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
    public String getUser(ISessionContext session) {
        return users.get(session.getId());
    }

    /**
     * Join the websocket session to this design editing session.
     */
    public void join(ISessionContext session, String user) {
        this.sessions.put(session.getId(), session);
        this.users.put(session.getId(), user);
    }

    /**
     * Removes a websocket session from this design editing session.
     * @param session
     */
    public void leave(ISessionContext session) {
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
        distributedSession.close();
    }

    private void sendListClientsToOthers() {
        distributedSession.sendOperation(ListClientsOperation.listClients());
    }
    
    /**
     * Returns a set of all sessions currently connected.
     */
    public Set<ISessionContext> getSessions() {
        return new HashSet<>(this.sessions.values());
    }

    /**
     * Sends the given command to all other members of the editing session.
     * @param excludeSession
     * @param user
     * @param command
     */
    public void sendCommandToOthers(ISessionContext excludeSession, String user, ApiDesignCommand command) {
        VersionedCommandOperation versionedCommand = VersionedCommandOperation.command(command.getContentVersion(), command.getCommand());
        sendToAllSessions(excludeSession, versionedCommand);
    }

    /**
     * Sends the "undo" signal to all other members of the editing session.
     * @param excludeSession
     * @param user
     * @param undo
     */
    public void sendUndoToOthers(ISessionContext excludeSession, String user, ApiDesignUndoRedo undo) {
        VersionedOperation undoOperation = VersionedOperation.undo(undo.getContentVersion());
        sendToAllSessions(excludeSession, undoOperation);
    }

    /**
     * Sends the "undo" signal to all other members of the editing session.
     * @param excludeSession
     * @param user
     * @param redo
     */
    public void sendRedoToOthers(ISessionContext excludeSession, String user, ApiDesignUndoRedo redo) {
        VersionedOperation redoOperation = VersionedOperation.redo(redo.getContentVersion());
        sendToAllSessions(excludeSession, redoOperation);
    }

    /**
     * Sends the given selection change event to all other members of the editing session.
     * @param excludeSession
     * @param user
     * @param newSelection
     */
    public void sendUserSelectionToOthers(ISessionContext excludeSession, String user, String newSelection) {
        SelectionOperation selectionOperation = SelectionOperation.select(user, excludeSession.getId(), newSelection);
        sendToAllSessions(excludeSession, selectionOperation);
    }

    /**
     * Sends an acknowledgement message to the given client.
     * @param toSession
     * @param ack
     */
    public void sendAckTo(ISessionContext toSession, ApiDesignCommandAck ack) {
        // TODO can we meld this with ApiDesignCommandAck ?
        VersionedAck commandIdAction = VersionedAck.ack(ack.getContentVersion(), ack.getCommandId());
        try {
            toSession.sendAsText(commandIdAction);
        } catch (IOException e) {
            logger.error("Error sending ACK to websocket with sessionId: " + toSession.getId(), e);
        }
    }

    /**
     * Sends an acknowledgement message to the given client.
     * @param toSession
     * @param ack
     */
    public void sendAckTo(ISessionContext toSession, ApiDesignUndoRedoAck ack) {
        VersionedAck commandIdAction = VersionedAck.ack(ack.getContentVersion());
        try {
            toSession.sendAsText(commandIdAction);
        } catch (IOException e) {
            logger.error("Error sending ACK to websocket with sessionId: " + toSession.getId(), e);
        }
    }

    /**
     * Sends a message to the other users that userId has joined the session.
     * @param joinedSession
     * @param joinedUser
     */
    public void sendJoinToOthers(ISessionContext joinedSession, String joinedUser) {
        JoinLeaveOperation joinOperation = JoinLeaveOperation.join(joinedUser, joinedSession.getId());
        sendToAllSessions(joinedSession, joinOperation);
    }

    /**
     * Sends a message to the other users that userId has joined the session.
     * @param leftSession
     * @param leftUser
     */
    public void sendLeaveToOthers(ISessionContext leftSession, String leftUser) {
        JoinLeaveOperation leaveOperation = JoinLeaveOperation.leave(leftUser, leftSession.getId());
        // Don't send the message to the user who is leaving
        sendToAllSessions(leftSession, leaveOperation);
    }

    /**
     * Sends a "join" message to the given session.  The join message will include the user Id and 
     * session ID of the user joining the session.
     * @param toSession
     * @param joinedUser
     * @param joinedId
     */
    public void sendJoinTo(ISessionContext toSession, String joinedUser, String joinedId) {
        JoinLeaveOperation joinOperation = JoinLeaveOperation.join(joinedUser, joinedId);
        try {
            toSession.sendAsText(joinOperation);
        } catch (IOException e) {
            logger.error("Error sending 'join' to websocket with sessionId: " + toSession.getId(), e);
        }
    }

    public void sendToAllSessions(ISessionContext excludeSession, BaseOperation operation) {
        for (ISessionContext otherSession : this.sessions.values()) {
            if (otherSession != excludeSession) {
                try {
                    otherSession.sendAsText(operation);
                } catch (IOException e) {
                    logger.error("Error sending {} to websocket with sessionId: {}", operation.getType(), otherSession.getId(), e);
                }
            }
        }
        // Finally, send on the shared channel.
        distributedSession.sendOperation(operation);
    }

    public void sendJoinToRemote() {
        for (ISessionContext otherSession : this.sessions.values()) {
            JoinLeaveOperation joinOperation = JoinLeaveOperation.join(getUser(otherSession), otherSession.getId());
            distributedSession.sendOperation(joinOperation);
        }
    }
}
