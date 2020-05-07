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
 *
 * @author eric.wittmann@gmail.com
 * @author Ales Justin
 */
public class EditingSession extends AbstractEditingSession {

    private final IRollupExecutor rollupExecutor;

    /**
     * Constructor.
     *
     * @param designId the design id
     * @param rollupExecutor the rollup executor
     */
    public EditingSession(String designId, IRollupExecutor rollupExecutor) {
        super(designId);
        this.rollupExecutor = rollupExecutor;
    }

    /**
     * @see java.io.Closeable#close()
     */
    @Override
    public void close() {
        try {
            this.rollupExecutor.rollupCommands(getDesignId());
        } catch (NotFoundException | StorageException | OaiCommandException e) {
            logger.error("Error detected closing an Editing Session.", e);
        }
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#sendToOthers(io.apicurio.hub.core.editing.ops.BaseOperation, io.apicurio.hub.core.editing.ISessionContext)
     */
    @Override
    public void sendToOthers(BaseOperation operation, ISessionContext exclude) {
        for (ISessionContext otherSession : getSessions().values()) {
            if (!otherSession.getId().equals(exclude.getId())) {
                this.sendTo(operation, otherSession);
            }
        }
    }
    
}
