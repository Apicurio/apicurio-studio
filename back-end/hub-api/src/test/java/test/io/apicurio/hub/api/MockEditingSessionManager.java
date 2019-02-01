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

package test.io.apicurio.hub.api;

import io.apicurio.hub.core.editing.ApiDesignEditingSession;
import io.apicurio.hub.core.editing.IEditingSessionManager;
import io.apicurio.hub.core.exceptions.ServerError;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Mock version of the editing session manager.
 * @author eric.wittmann@gmail.com
 */
public class MockEditingSessionManager implements IEditingSessionManager {

    private Map<String, Long> data = new HashMap<>();
    private Map<String, ApiDesignEditingSession> editingSessions = new HashMap<>();

    /**
     * @see io.apicurio.hub.core.editing.IEditingSessionManager#createSessionUuid(java.lang.String, java.lang.String, java.lang.String, long)
     */
    @Override
    public String createSessionUuid(String designId, String user, String secret, long contentVersion) {
        UUID uuid = UUID.randomUUID();
        String key = uuid.toString() + "|" + designId + "|" + user + "|" + secret.hashCode();
        this.data.put(key, contentVersion);
        return uuid.toString();
    }
    
    /**
     * @see io.apicurio.hub.core.editing.IEditingSessionManager#validateSessionUuid(java.lang.String, java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public long validateSessionUuid(String uuid, String designId, String user, String secret) throws ServerError {
        String key = uuid.toString() + "|" + designId + "|" + user + "|" + secret.hashCode();
        Long version = this.data.remove(key);
        if (version == null) {
            throw new ServerError("Failed to connect to API editing session using UUID: " + uuid);
        }
        return version;
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSessionManager#getOrCreateEditingSession(java.lang.String)
     */
    @Override
    public synchronized ApiDesignEditingSession getOrCreateEditingSession(String designId) {
        ApiDesignEditingSession session = editingSessions.get(designId);
        if (session == null) {
            session = new ApiDesignEditingSession(designId, null, null); //TODO FIXME!!
            editingSessions.put(designId, session);
        }
        return session;
    }
    
    /**
     * @see io.apicurio.hub.core.editing.IEditingSessionManager#getEditingSession(java.lang.String)
     */
    @Override
    public synchronized ApiDesignEditingSession getEditingSession(String designId) {
        return editingSessions.get(designId);
    }
    
    /**
     * @see io.apicurio.hub.core.editing.IEditingSessionManager#closeEditingSession(io.apicurio.hub.core.editing.ApiDesignEditingSession)
     */
    @Override
    public synchronized void closeEditingSession(ApiDesignEditingSession editingSession) {
        editingSessions.remove(editingSession.getDesignId());
    }

}
