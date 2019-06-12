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

import io.apicurio.hub.core.cmd.OaiCommandException;
import io.apicurio.hub.core.editing.ops.BaseOperation;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.storage.IRollupExecutor;
import io.apicurio.hub.core.storage.StorageException;

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

    private final IRollupExecutor rollupExecutor;

    /**
     * Constructor.
     * @param designId
     * @param rollupExecutor
     */
    public EditingSession(String designId, IRollupExecutor rollupExecutor) {
        this.designId = designId;
        this.rollupExecutor = rollupExecutor;
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
     * @see io.apicurio.hub.core.editing.IEditingSession#getUserContexts()
     */
    @Override
    public Set<ISessionContext> getUserContexts() {
        return new HashSet<>(this.sessions.values());
    }
    
    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#getUser(io.apicurio.hub.core.editing.ISessionContext)
     */
    @Override
    public String getUser(ISessionContext context) {
        return users.get(context.getId());
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#join(io.apicurio.hub.core.editing.ISessionContext, java.lang.String)
     */
    @Override
    public void join(ISessionContext context, String user) {
        this.sessions.put(context.getId(), context);
        this.users.put(context.getId(), user);
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#leave(io.apicurio.hub.core.editing.ISessionContext)
     */
    @Override
    public void leave(ISessionContext context) {
        this.sessions.remove(context.getId());
        this.users.remove(context.getId());
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
        try {
            this.rollupExecutor.rollupCommands(designId);
        } catch (NotFoundException | StorageException | OaiCommandException e) {
            logger.error("Error detected closing an Editing Session.", e);
        }
    }
    
    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#sendTo(io.apicurio.hub.core.editing.ops.BaseOperation, io.apicurio.hub.core.editing.ISessionContext)
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
    
    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#sendToOthers(io.apicurio.hub.core.editing.ops.BaseOperation, io.apicurio.hub.core.editing.ISessionContext)
     */
    @Override
    public void sendToOthers(BaseOperation operation, ISessionContext exclude) {
        for (ISessionContext otherSession : this.sessions.values()) {
            if (!otherSession.getId().equals(exclude.getId())) {
                this.sendTo(operation, otherSession);
            }
        }
    }
    
}
