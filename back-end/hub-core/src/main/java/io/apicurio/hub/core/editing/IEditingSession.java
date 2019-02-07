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

package io.apicurio.hub.core.editing;

import java.io.Closeable;
import java.util.Set;

import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.beans.ApiDesignCommandAck;
import io.apicurio.hub.core.beans.ApiDesignUndoRedo;
import io.apicurio.hub.core.beans.ApiDesignUndoRedoAck;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;

/**
 * @author eric.wittmann@gmail.com
 */
public interface IEditingSession extends Closeable {

    /**
     * Gets the design id associated with this editing session.
     * @return the designId
     */
    public String getDesignId();
    
    /**
     * Resolves the given session context to a user name.
     * @param context
     */
    public String getUser(ISessionContext context);

    /**
     * Join the session context to this editing session.
     */
    public void join(ISessionContext session, String user);

    /**
     * Removes a session context from this editing session.
     * @param context
     */
    public void leave(ISessionContext context);

    /**
     * @return true if the editing session has no more users
     */
    public boolean isEmpty();

    /**
     * Returns a set of all members currently connected (in the form of a set of session contexts).
     */
    public Set<ISessionContext> getMembers();

    /**
     * Sends the given command to all other members of the editing session.
     * @param exclude
     * @param user
     * @param command
     */
    public void sendCommandToOthers(ISessionContext exclude, String user, ApiDesignCommand command);

    /**
     * Sends the "undo" signal to all other members of the editing session.
     * @param excludeSession
     * @param user
     * @param undo
     */
    public void sendUndoToOthers(ISessionContext excludeSession, String user, ApiDesignUndoRedo undo);

    /**
     * Sends the "undo" signal to all other members of the editing session.
     * @param excludeSession
     * @param user
     * @param redo
     */
    public void sendRedoToOthers(ISessionContext excludeSession, String user, ApiDesignUndoRedo redo);

    /**
     * Sends the given selection change event to all other members of the editing session.
     * @param excludeSession
     * @param user
     * @param newSelection
     */
    public void sendUserSelectionToOthers(ISessionContext excludeSession, String user, String newSelection);

    /**
     * Sends an acknowledgement message to the given client.
     * @param toSession
     * @param ack
     */
    public void sendAckTo(ISessionContext toSession, ApiDesignCommandAck ack);

    /**
     * Sends an acknowledgement message to the given client.
     * @param toSession
     * @param ack
     */
    public void sendAckTo(ISessionContext toSession, ApiDesignUndoRedoAck ack);

    /**
     * Sends a message to the other users that userId has joined the session.
     * @param joinedSession
     * @param joinedUser
     */
    public void sendJoinToOthers(ISessionContext joinedSession, String joinedUser);

    /**
     * Sends a message to the other users that userId has joined the session.
     * @param leftSession
     * @param leftUser
     */
    public void sendLeaveToOthers(ISessionContext leftSession, String leftUser);

    /**
     * Sends a "join" message to the given session.  The join message will include the user Id and 
     * session ID of the user joining the session.
     * @param toSession
     * @param joinedUser
     * @param joinedId
     */
    public void sendJoinTo(ISessionContext toSession, String joinedUser, String joinedId);

    public void sendToAllSessions(ISessionContext excludeSession, BaseOperation operation);
    
    public void sendJoinToRemote();
}
