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
import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.beans.ApiDesignCommandAck;
import io.apicurio.hub.core.editing.IEditingMetrics;
import io.apicurio.hub.core.editing.IEditingSession;
import io.apicurio.hub.core.editing.ISessionContext;
import io.apicurio.hub.core.editing.ops.BaseOperation;
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
    public void process(IEditingSession editingSession, ISessionContext context, BaseOperation bo) {
        VersionedCommandOperation vco = (VersionedCommandOperation) bo;
        if (bo.getSource() == BaseOperation.SourceEnum.LOCAL) {
            processLocal(editingSession, context, vco);
        } else {
            processRemote(editingSession, context, vco);
        }
    }

    private void processLocal(IEditingSession editingSession, ISessionContext context, VersionedCommandOperation vco) {
        String user = editingSession.getUser(context);

        long localCommandId = vco.getCommandId();

        long cmdContentVersion;
        String designId = editingSession.getDesignId();

        this.metrics.contentCommand(designId);

        logger.debug("\tuser:" + user);

        try {
            cmdContentVersion = storage.addContent(user, designId, ApiContentType.Command, vco.getCommandStr());
        } catch (StorageException e) {
            logger.error("Error storing the command {}.", vco.getCommandId(), e);
            // TODO do something sensible here - send a msg to the client?
            return;
        }

        // Send an ack message back to the user
        ApiDesignCommandAck ack = new ApiDesignCommandAck();
        ack.setCommandId(localCommandId);
        ack.setContentVersion(cmdContentVersion);
        editingSession.sendAckTo(context, ack);
        logger.debug("ACK sent back to client.");

        // Now propagate the command to all other clients
        ApiDesignCommand command = new ApiDesignCommand();
        command.setCommand(vco.getCommandStr());
        command.setContentVersion(cmdContentVersion);
        command.setAuthor(user);
        command.setReverted(false);

        editingSession.sendCommandToOthers(context, user, command);
        logger.debug("Command propagated to 'other' clients.");
    }

    private void processRemote(IEditingSession editingSession, ISessionContext context, VersionedCommandOperation vco) {
        // This command operation will be labelled as remote, so we know not to send it back over the messaging bus
        editingSession.sendToAllSessions(context, vco);
    }

    /**
     * @see io.apicurio.hub.core.editing.ops.processors.IOperationProcessor#getOperationName()
     */
    @Override
    public String getOperationName() {
        return "command";
    }

    /**
     * @see io.apicurio.hub.core.editing.ops.processors.IOperationProcessor#unmarshallClass()
     */
    @Override
    public Class<? extends BaseOperation> unmarshallClass() {
        return VersionedCommandOperation.class;
    }
}
