/*
 * Copyright 2018 JBoss Inc
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
package io.apicurio.hub.core.editing.ops.processors;

import javax.inject.Inject;
import javax.inject.Singleton;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.apicurio.hub.core.beans.ApiContentType;
import io.apicurio.hub.core.editing.IEditingMetrics;
import io.apicurio.hub.core.editing.IEditingSession;
import io.apicurio.hub.core.editing.ISessionContext;
import io.apicurio.hub.core.editing.ops.BaseOperation;
import io.apicurio.hub.core.editing.ops.FullCommandOperation;
import io.apicurio.hub.core.editing.ops.OperationFactory;
import io.apicurio.hub.core.editing.ops.OperationProcessorException;
import io.apicurio.hub.core.editing.ops.StorageError;
import io.apicurio.hub.core.editing.ops.VersionedAck;
import io.apicurio.hub.core.editing.ops.VersionedCommandOperation;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@Singleton
public class CommandProcessor implements IOperationProcessor {
    private static Logger logger = LoggerFactory.getLogger(CommandProcessor.class);

    @Inject
    private IStorage storage;

    @Inject
    private IEditingMetrics metrics;

    /**
     * @see io.apicurio.hub.core.editing.ops.processors.IOperationProcessor#process(io.apicurio.hub.core.editing.IEditingSession, io.apicurio.hub.core.editing.ISessionContext, io.apicurio.hub.core.editing.ops.BaseOperation)
     */
    @Override
    public void process(IEditingSession editingSession, ISessionContext context, BaseOperation operation) throws OperationProcessorException {
        VersionedCommandOperation vco = (VersionedCommandOperation) operation;
        String user = editingSession.getUser(context);

        long localCommandId = vco.getCommandId();

        long cmdContentVersion;
        String designId = editingSession.getDesignId();

        this.metrics.contentCommand(designId);

        logger.debug("\tuser: {}", user);

        try {
            cmdContentVersion = storage.addContent(user, designId, ApiContentType.Command, vco.getCommandStr());
        } catch (StorageException e) {
            // Let the browser know that we failed to store the user's command - so the browser needs to let the
            // user know and perhaps try again later...
            StorageError error = OperationFactory.storageError(localCommandId, "command");
            editingSession.sendTo(error, context);
            throw new OperationProcessorException("Error storing command: " + vco.getCommandId(), e);
        }

        // Send an ack message back to the user
        VersionedAck ack = OperationFactory.ack(cmdContentVersion, localCommandId, "command");
        editingSession.sendTo(ack, context);
        logger.debug("ACK sent back to client.");

        // Now propagate the command to all other clients
        FullCommandOperation cmd = OperationFactory.fullCommand(cmdContentVersion, vco.getCommandStr(), user, false);
        editingSession.sendToOthers(cmd, context);
        logger.debug("Command propagated to 'other' clients.");
    }

    /**
     * @see io.apicurio.hub.core.editing.ops.processors.IOperationProcessor#getOperationName()
     */
    @Override
    public String getOperationName() {
        return "command";
    }
}
