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

import io.apicurio.hub.core.editing.distributed.JMSSessionFactory;
import io.apicurio.hub.core.editing.operationprocessors.ApicurioOperationProcessor;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;
import org.apache.commons.codec.digest.DigestUtils;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * A class used to manage the concurrent editing sessions used by clients to make
 * changes to API Design documents.
 * 
 * @author eric.wittmann@gmail.com
 * 
 * TODO create a worker thread that will periodically check the storage layer for session UUIDs that have timed out
 */
@ApplicationScoped
public class EditingSessionManager implements IEditingSessionManager {
    
    // TODO parameterize the salt
    private static final String SALT = "a3b81d8d8328abc9";
    // TODO parameterize the UUID expiration time
    private static final long EXPIRATION_OFFSET = 60L * 1000L; // One minute

    @Inject
    private IStorage storage;
    
    private Map<String, ApiDesignEditingSession> editingSessions = new HashMap<>();

    @Inject
    private JMSSessionFactory distSessFactory;

    @Inject
    private ApicurioOperationProcessor operationProcessor;

    /**
     * @see io.apicurio.hub.core.editing.IEditingSessionManager#createSessionUuid(java.lang.String, java.lang.String, java.lang.String, long)
     */
    @Override
    public String createSessionUuid(String designId, String user, String secret, long contentVersion) throws ServerError {
        try {
            UUID uuid = UUID.randomUUID();
            String hash = DigestUtils.sha512Hex(SALT + user + secret);
            long expiresOn = System.currentTimeMillis() + EXPIRATION_OFFSET;
            this.storage.createEditingSessionUuid(uuid.toString(), designId, user, hash, contentVersion, expiresOn);
            return uuid.toString();
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.core.editing.IEditingSessionManager#validateSessionUuid(java.lang.String, java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public long validateSessionUuid(String uuid, String designId, String user, String secret) throws ServerError {
        try {
            String hash = DigestUtils.sha512Hex(SALT + user + secret);
            long contentVersion = this.storage.lookupEditingSessionUuid(uuid, designId, user, hash);
            if (this.storage.consumeEditingSessionUuid(uuid, designId, user, hash)) {
                return contentVersion;
            } else {
                throw new ServerError("Failed to connect to API editing session using UUID: " + uuid);
            }
        } catch (StorageException e) {
            throw new ServerError(e);
        }
    }
    
    /**
     * @see io.apicurio.hub.core.editing.IEditingSessionManager#getOrCreateEditingSession(java.lang.String)
     */
    @Override
    public synchronized ApiDesignEditingSession getOrCreateEditingSession(String designId) {
        ApiDesignEditingSession session = editingSessions.get(designId);
        if (session == null) {
            session = new ApiDesignEditingSession(designId, distSessFactory, operationProcessor);
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
        editingSession.close();
    }

}
