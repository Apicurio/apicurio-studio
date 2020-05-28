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

import com.fasterxml.jackson.databind.JsonNode;

import io.apicurio.hub.core.editing.EditingSession;
import io.apicurio.hub.core.editing.ISessionContext;
import io.apicurio.hub.core.editing.ops.BaseOperation;
import io.apicurio.hub.core.editing.ops.JoinLeaveOperation;
import io.apicurio.hub.core.editing.ops.ListClientsOperation;
import io.apicurio.hub.core.editing.ops.OperationFactory;
import io.apicurio.hub.core.editing.ops.processors.OperationProcessorDispatcher;
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
     * @param jms
     * @param operationProcessor
     */
    public JMSEditingSession(String designId, JMSSessionFactory jms,
            OperationProcessorDispatcher operationProcessor) {
        super(designId, null); // OK to pass null for the rollup executor, because we override close()
        logger.debug("Creating a JMS editing session for id: {}", designId);
        this.distributedSession = jms.joinSession(designId, message -> {
            handleRemoteOperation(message);
        });
        sendListClients();
    }
    
    /**
     * Called when we receive a message from a remote editing session (via the JMS channel).  What
     * we want to do with that is blast it out to **all** of the websockets connected to us.  Unless
     * the message is a "list-clients", in which case we want to send back a "join" message for each
     * connected websocket client.
     * @param message
     */
    private void handleRemoteOperation(String message) {
        logger.debug("Message received from JMS channel for design id: {}", this.getDesignId());
        logger.debug("    Message: {}", message);
        JsonNode jsonMsg = JsonUtil.toJsonTree(message);
        BaseOperation op = OperationFactory.operation(jsonMsg);
        if (op.getType().equals("list-clients")) {
            this.sendJoinToRemote();
        } else {
            sendToAll(op);
        }
    }

    /**
     * @see java.io.Closeable#close()
     */
    @Override
    public void close() {
        // All local connections have terminated, so close the JMS session
        distributedSession.close();
    }
    
    /**
     * @see io.apicurio.hub.core.editing.EditingSession#sendToOthers(io.apicurio.hub.core.editing.ops.BaseOperation, io.apicurio.hub.core.editing.ISessionContext)
     */
    @Override
    public void sendToOthers(BaseOperation operation, ISessionContext exclude) {
        super.sendToOthers(operation, exclude);
        distributedSession.sendOperation(operation);
    }
    
    /**
     * Called to send the given operation to ALL connected websocket clients.
     * @param operation
     */
    private void sendToAll(BaseOperation operation) {
        logger.debug("Sending operation to all connected websocket clients: {}", operation.getType());
        for (ISessionContext context : this.getSessions().values()) {
            this.sendTo(operation, context);
        }
    }

    /**
     * Called to send a "join" message over the JMS channel for each connected websocket.
     */
    private void sendJoinToRemote() {
        for (ISessionContext context : this.getSessions().values()) {
            JoinLeaveOperation joinOperation = OperationFactory.join(getUser(context), context.getId());
            distributedSession.sendOperation(joinOperation);
        }
    }
    
    /**
     * Called to send the "list-clients" operation to all remote sessions.  This will cause
     * all of those remote sessions to respond with "join" messages for each websocket connected
     * to their respective sessions.
     */
    private void sendListClients() {
        distributedSession.sendOperation(ListClientsOperation.listClients());
    }

}
