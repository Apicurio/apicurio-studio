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
import java.util.HashMap;
import java.util.Map;

import javax.websocket.Session;

/**
 * Models a single, shared editing session for an API Design.
 * @author eric.wittmann@gmail.com
 */
public class ApiDesignEditingSession implements Closeable {
    
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
     * @param session
     * @param user
     * @param content
     */
    public void sendCommandToOthers(Session session, String user, String content) {
        // TODO Send the command message to everyone *except* the session that generated it
    }

    /**
     * @return the designId
     */
    public String getDesignId() {
        return designId;
    }

}
