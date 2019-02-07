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

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.beans.ApiDesignCommandAck;
import io.apicurio.hub.core.beans.ApiDesignUndoRedo;
import io.apicurio.hub.core.beans.ApiDesignUndoRedoAck;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
import io.apicurio.hub.core.editing.sessionbeans.JoinLeaveOperation;
import io.apicurio.hub.core.editing.sessionbeans.SelectionOperation;
import io.apicurio.hub.core.editing.sessionbeans.VersionedAck;
import io.apicurio.hub.core.editing.sessionbeans.VersionedCommandOperation;
import io.apicurio.hub.core.editing.sessionbeans.VersionedOperation;

/**
 * Models a single, shared editing session for an API Design.  This implementation only supports
 * collaborative editing on a single node.  If Apicurio is to be deployed in a scaled/scalable 
 * environment, this implementation of the editing session will be insufficient.  One of the
 * other implementations (e.g. JMSEditingSession) should be used instead.
 * @author eric.wittmann@gmail.com
 */
public class EditingSession implements IEditingSession {

    private static Logger logger = LoggerFactory.getLogger(EditingSession.class);
    
    private final String designId;
    private final Map<String, ISessionContext> sessions = new HashMap<>();
    private final Map<String, String> users = new HashMap<>();

    /**
     * Constructor.
     * @param designId
     */
    public EditingSession(String designId) {
        this.designId = designId;
    }
    
    /**
     * Getter for the users.
     */
    protected Map<String, String> getUsers() {
        return this.users;
    }
    
    /**
     * Getter for the sessions.
     */
    protected Map<String, ISessionContext> getSessions() {
        return this.sessions;
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#getDesignId()
     */
    @Override
    public String getDesignId() {
        return designId;
    }
    
    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#getUser(io.apicurio.hub.core.editing.ISessionContext)
     */
    @Override
    public String getUser(ISessionContext session) {
        return users.get(session.getId());
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#join(io.apicurio.hub.core.editing.ISessionContext, java.lang.String)
     */
    @Override
    public void join(ISessionContext session, String user) {
        this.sessions.put(session.getId(), session);
        this.users.put(session.getId(), user);
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#leave(io.apicurio.hub.core.editing.ISessionContext)
     */
    @Override
    public void leave(ISessionContext session) {
        this.sessions.remove(session.getId());
        this.users.remove(session.getId());
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#isEmpty()
     */
    @Override
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
     * @see io.apicurio.hub.core.editing.IEditingSession#getMembers()
     */
    @Override
    public Set<ISessionContext> getMembers() {
        return new HashSet<>(this.sessions.values());
    }
    
    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#sendCommandToOthers(io.apicurio.hub.core.editing.ISessionContext, java.lang.String, io.apicurio.hub.core.beans.ApiDesignCommand)
     */
    @Override
    public void sendCommandToOthers(ISessionContext excludeSession, String user, ApiDesignCommand command) {
        VersionedCommandOperation versionedCommand = VersionedCommandOperation.command(command.getContentVersion(), command.getCommand());
        sendToAllSessions(excludeSession, versionedCommand);
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#sendUndoToOthers(io.apicurio.hub.core.editing.ISessionContext, java.lang.String, io.apicurio.hub.core.beans.ApiDesignUndoRedo)
     */
    @Override
    public void sendUndoToOthers(ISessionContext excludeSession, String user, ApiDesignUndoRedo undo) {
        VersionedOperation undoOperation = VersionedOperation.undo(undo.getContentVersion());
        sendToAllSessions(excludeSession, undoOperation);
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#sendRedoToOthers(io.apicurio.hub.core.editing.ISessionContext, java.lang.String, io.apicurio.hub.core.beans.ApiDesignUndoRedo)
     */
    @Override
    public void sendRedoToOthers(ISessionContext excludeSession, String user, ApiDesignUndoRedo redo) {
        VersionedOperation redoOperation = VersionedOperation.redo(redo.getContentVersion());
        sendToAllSessions(excludeSession, redoOperation);
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#sendUserSelectionToOthers(io.apicurio.hub.core.editing.ISessionContext, java.lang.String, java.lang.String)
     */
    @Override
    public void sendUserSelectionToOthers(ISessionContext excludeSession, String user, String newSelection) {
        SelectionOperation selectionOperation = SelectionOperation.select(user, excludeSession.getId(), newSelection);
        sendToAllSessions(excludeSession, selectionOperation);
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#sendAckTo(io.apicurio.hub.core.editing.ISessionContext, io.apicurio.hub.core.beans.ApiDesignCommandAck)
     */
    @Override
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
     * @see io.apicurio.hub.core.editing.IEditingSession#sendAckTo(io.apicurio.hub.core.editing.ISessionContext, io.apicurio.hub.core.beans.ApiDesignUndoRedoAck)
     */
    @Override
    public void sendAckTo(ISessionContext toSession, ApiDesignUndoRedoAck ack) {
        VersionedAck commandIdAction = VersionedAck.ack(ack.getContentVersion());
        try {
            toSession.sendAsText(commandIdAction);
        } catch (IOException e) {
            logger.error("Error sending ACK to websocket with sessionId: " + toSession.getId(), e);
        }
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#sendJoinToOthers(io.apicurio.hub.core.editing.ISessionContext, java.lang.String)
     */
    @Override
    public void sendJoinToOthers(ISessionContext joinedSession, String joinedUser) {
        JoinLeaveOperation joinOperation = JoinLeaveOperation.join(joinedUser, joinedSession.getId());
        sendToAllSessions(joinedSession, joinOperation);
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#sendLeaveToOthers(io.apicurio.hub.core.editing.ISessionContext, java.lang.String)
     */
    @Override
    public void sendLeaveToOthers(ISessionContext leftSession, String leftUser) {
        JoinLeaveOperation leaveOperation = JoinLeaveOperation.leave(leftUser, leftSession.getId());
        // Don't send the message to the user who is leaving
        sendToAllSessions(leftSession, leaveOperation);
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#sendJoinTo(io.apicurio.hub.core.editing.ISessionContext, java.lang.String, java.lang.String)
     */
    @Override
    public void sendJoinTo(ISessionContext toSession, String joinedUser, String joinedId) {
        JoinLeaveOperation joinOperation = JoinLeaveOperation.join(joinedUser, joinedId);
        try {
            toSession.sendAsText(joinOperation);
        } catch (IOException e) {
            logger.error("Error sending 'join' to websocket with sessionId: " + toSession.getId(), e);
        }
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#sendToAllSessions(io.apicurio.hub.core.editing.ISessionContext, io.apicurio.hub.core.editing.sessionbeans.BaseOperation)
     */
    @Override
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
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#sendJoinToRemote()
     */
    @Override
    public void sendJoinToRemote() {
        // TODO remove this from interface, nothing to do when not JMS
    }
    
}
