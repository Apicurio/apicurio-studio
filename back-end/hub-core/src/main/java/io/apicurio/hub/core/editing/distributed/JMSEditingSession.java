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

package io.apicurio.hub.core.editing.distributed;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.core.editing.EditingSession;
import io.apicurio.hub.core.editing.ISessionContext;
import io.apicurio.hub.core.editing.ops.BaseOperation;
import io.apicurio.hub.core.editing.ops.JoinLeaveOperation;
import io.apicurio.hub.core.editing.ops.ListClientsOperation;
import io.apicurio.hub.core.editing.ops.processors.OperationProcessorDispatcher;
import io.apicurio.hub.core.editing.IDistributedEditingSession;
import io.apicurio.hub.core.util.JsonUtil;

/**
 * @author eric.wittmann@gmail.com
 */
public class JMSEditingSession extends EditingSession {

    private static Logger logger = LoggerFactory.getLogger(JMSEditingSession.class);
    
    private final IDistributedEditingSession distributedSession;

    /**
     * Constructor.
     * @param designId
     * @param factory
     * @param operationProcessor
     */
    public JMSEditingSession(String designId, IDistributedSessionFactory factory,
            OperationProcessorDispatcher operationProcessor) {
        super(designId, null); // OK to pass null for the rollup executor, because we override close()
        logger.debug("Creating a JMS editing session for id: {}", designId);
        this.distributedSession = factory.joinSession(designId, payload -> {
            operationProcessor.process(this, null, JsonUtil.toJsonTree(payload));
        });
        sendListClientsToOthers();
    }

    /**
     * @see java.io.Closeable#close()
     */
    @Override
    public void close() {
        distributedSession.close();
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#sendToAllSessions(io.apicurio.hub.core.editing.ISessionContext, io.apicurio.hub.core.editing.ops.BaseOperation)
     */
    @Override
    public void sendToAllSessions(ISessionContext excludeSession, BaseOperation operation) {
        super.sendToAllSessions(excludeSession, operation);
        // Finally, send on the shared channel.
        distributedSession.sendOperation(operation);
    }

    /**
     * @see io.apicurio.hub.core.editing.IEditingSession#sendJoinToRemote()
     */
    @Override
    public void sendJoinToRemote() {
        for (ISessionContext otherSession : this.getSessions().values()) {
            JoinLeaveOperation joinOperation = JoinLeaveOperation.join(getUser(otherSession), otherSession.getId());
            distributedSession.sendOperation(joinOperation);
        }
    }

    private void sendListClientsToOthers() {
        distributedSession.sendOperation(ListClientsOperation.listClients());
    }

}
