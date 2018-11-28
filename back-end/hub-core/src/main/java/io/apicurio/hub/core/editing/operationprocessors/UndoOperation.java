package io.apicurio.hub.core.editing.operationprocessors;

import io.apicurio.hub.core.beans.ApiDesignUndoRedo;
import io.apicurio.hub.core.beans.ApiDesignUndoRedoAck;
import io.apicurio.hub.core.editing.ApiDesignEditingSession;
import io.apicurio.hub.core.editing.ApicurioSessionContext;
import io.apicurio.hub.core.editing.IEditingMetrics;
import io.apicurio.hub.core.editing.sessionbeans.BaseOperation;
import io.apicurio.hub.core.editing.sessionbeans.VersionedOperation;
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
public class UndoOperation implements IOperationProcessor {

    private static Logger logger = LoggerFactory.getLogger(UndoOperation.class);

    @Inject
    private IStorage storage;

    @Inject
    private IEditingMetrics metrics;

    @Override
    public void processLocal(ApiDesignEditingSession editingSession, ApicurioSessionContext session, BaseOperation op) {
        VersionedOperation undoOperation = (VersionedOperation) op;
        String user = editingSession.getUser(session);
        String designId = editingSession.getDesignId();

        long contentVersion = undoOperation.getContentVersion();

        this.metrics.undoCommand(designId, contentVersion);

        logger.debug("\tuser:" + user);
        boolean reverted = false;
        try {
            reverted = storage.undoContent(user, designId, contentVersion);
        } catch (StorageException e) {
            logger.error("Error undoing a command.", e);
            // TODO do something sensible here - send a msg to the client?
            return;
        }

        // If the command wasn't successfully reverted (it was already reverted or didn't exist)
        // then return without doing anything else.
        if (!reverted) {
            return;
        }

        // Send an ack message back to the user
        ApiDesignUndoRedoAck ack = new ApiDesignUndoRedoAck();
        ack.setContentVersion(contentVersion);
        editingSession.sendAckTo(session, ack);
        logger.debug("ACK sent back to client.");

        // Now propagate the undo to all other clients
        ApiDesignUndoRedo command = new ApiDesignUndoRedo();
        command.setContentVersion(contentVersion);
        editingSession.sendUndoToOthers(session, user, command);
        logger.debug("Undo sent to 'other' clients.");
    }

    @Override
    public String getOperationName() {
        return "undo";
    }

    @Override
    public Class<? extends BaseOperation> unmarshallKlazz() {
        return VersionedOperation.class;
    }
}
