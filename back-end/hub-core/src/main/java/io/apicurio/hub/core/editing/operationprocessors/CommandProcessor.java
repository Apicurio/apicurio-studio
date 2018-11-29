package io.apicurio.hub.core.editing.operationprocessors;

import io.apicurio.hub.core.beans.ApiContentType;
import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.beans.ApiDesignCommandAck;
import io.apicurio.hub.core.editing.ApiDesignEditingSession;
import io.apicurio.hub.core.editing.ApicurioSessionContext;
import io.apicurio.hub.core.editing.IEditingMetrics;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
import io.apicurio.hub.core.editing.sessionbeans.VersionedCommandOperation;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.inject.Singleton;

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

    public void process(ApiDesignEditingSession editingSession, ApicurioSessionContext session, BaseOperation bo) {
        VersionedCommandOperation vco = (VersionedCommandOperation) bo;
        if (bo.getSource() == BaseOperation.SourceEnum.LOCAL) {
            processLocal(editingSession, session, vco);
        } else {
            processRemote(editingSession, session, vco);
        }
    }

    private void processLocal(ApiDesignEditingSession editingSession, ApicurioSessionContext session, VersionedCommandOperation vco) {
        String user = editingSession.getUser(session);

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
        editingSession.sendAckTo(session, ack);
        logger.debug("ACK sent back to client.");

        // Now propagate the command to all other clients
        ApiDesignCommand command = new ApiDesignCommand();
        command.setCommand(vco.getCommandStr());
        command.setContentVersion(cmdContentVersion);
        command.setAuthor(user);
        command.setReverted(false);

        editingSession.sendCommandToOthers(session, user, command);
        logger.debug("Command propagated to 'other' clients.");
    }

    private void processRemote(ApiDesignEditingSession editingSession, ApicurioSessionContext session, VersionedCommandOperation vco) {
        // This command operation will be labelled as remote, so we know not to send it back over the messaging bus
        editingSession.sendToAllSessions(session, vco);
    }

    @Override
    public String getOperationName() {
        return "command";
    }

    @Override
    public Class<? extends BaseOperation> unmarshallKlazz() {
        return VersionedCommandOperation.class;
    }
}
