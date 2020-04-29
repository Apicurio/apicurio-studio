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

import io.apicurio.hub.core.editing.ops.BaseOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author eric.wittmann@gmail.com
 * @author Ales Justin
 */
public abstract class AbstractEditingSession implements IEditingSession {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    private final String designId;
    private final Map<String, ISessionContext> sessions = new ConcurrentHashMap<>();
    private final Map<String, String> users = new ConcurrentHashMap<>();

    /**
     * Constructor.
     *
     * @param designId the design id
     */
    public AbstractEditingSession(String designId) {
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
     * @see IEditingSession#getDesignId()
     */
    @Override
    public String getDesignId() {
        return designId;
    }
    
    /**
     * @see IEditingSession#getUserContexts()
     */
    @Override
    public Set<ISessionContext> getUserContexts() {
        return new HashSet<>(this.sessions.values());
    }
    
    /**
     * @see IEditingSession#getUser(ISessionContext)
     */
    @Override
    public String getUser(ISessionContext context) {
        return users.get(context.getId());
    }

    /**
     * @see IEditingSession#join(ISessionContext, String)
     */
    @Override
    public void join(ISessionContext context, String user) {
        this.sessions.put(context.getId(), context);
        this.users.put(context.getId(), user);
    }

    /**
     * @see IEditingSession#leave(ISessionContext)
     */
    @Override
    public void leave(ISessionContext context) {
        this.sessions.remove(context.getId());
        this.users.remove(context.getId());
    }

    /**
     * @see IEditingSession#isEmpty()
     */
    @Override
    public boolean isEmpty() {
        return this.sessions.isEmpty();
    }

    /**
     * @see IEditingSession#sendTo(BaseOperation, ISessionContext)
     */
    @Override
    public void sendTo(BaseOperation operation, ISessionContext to) {
        try {
            to.sendAsText(operation);
        } catch (IOException e) {
            logger.error("Error sending (" + operation.getType() + ") operation/message to websocket with sessionId: " + to.getId(), e);
            // TODO what else can we do here??
        }
    }

}
