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

import io.apicurio.hub.core.exceptions.ServerError;

/**
 * @author eric.wittmann@gmail.com
 */
public interface IEditingSessionManager {

    /**
     * Called to create a unique one-time-use UUID issued to a client so they
     * can connect to an editing session for an API design.
     * @param designId
     * @param user
     * @param secret
     * @param contentVersion
     * @return a UUID for connecting to an editing session
     * @throws ServerError
     */
    public String createSessionUuid(String designId, String user, String secret, long contentVersion) throws ServerError;

    /**
     * Called to validate a session UUID.  This confirms that an appropriate entry for the 
     * session exists and then consumes it, ensuring only one client can consume any given UUID.
     * @param uuid
     * @param designId
     * @param user
     * @param secret
     * @return the content version of the API design being edited
     * @throws ServerError
     */
    public long validateSessionUuid(String uuid, String designId, String user, String secret) throws ServerError;

    /**
     * Called to get or create an editing session for a given API Design.  This will either
     * return an existing session or create a new one if one doesn't exist.
     * @param designId
     */
    public IEditingSession getOrCreateEditingSession(String designId);

    /**
     * Called to get an editing session for a given API Design.  If no editing session
     * exists for the given design, then null is returned.
     * @param designId
     */
    public IEditingSession getEditingSession(String designId);

    /**
     * Called to close an editing session.  This should be called only when the editing
     * session is empty (has no more participants).
     * @param editingSession
     */
    public void closeEditingSession(IEditingSession editingSession);

}
