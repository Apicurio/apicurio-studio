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
public class RedoOperation implements IOperationProcessor {

    private static Logger logger = LoggerFactory.getLogger(RedoOperation.class);

    @Inject
    private IStorage storage;

    @Inject
    private IEditingMetrics metrics;


    public void process(ApiDesignEditingSession editingSession, ApicurioSessionContext session, BaseOperation bo) {
        VersionedOperation redoOperation = (VersionedOperation) bo;

        if (bo.getSource() == BaseOperation.SourceEnum.LOCAL) {
            processLocal(editingSession, session, redoOperation);
        } else {
            processRemote(editingSession, session, redoOperation);
        }
    }

    public void processLocal(ApiDesignEditingSession editingSession, ApicurioSessionContext session, VersionedOperation redo) {
        String user = editingSession.getUser(session);

        long contentVersion = redo.getContentVersion();
        String designId = editingSession.getDesignId();

        this.metrics.redoCommand(designId, contentVersion);

        logger.debug("\tuser:" + user);
        boolean restored = false;
        try {
            restored = storage.redoContent(user, designId, contentVersion);
        } catch (StorageException e) {
            logger.error("Error undoing a command.", e);
            // TODO do something sensible here - send a msg to the client?
            return;
        }

        // If the command wasn't successfully restored (it was already restored or didn't exist)
        // then return without doing anything else.
        if (!restored) {
            return;
        }

        // Send an ack message back to the user
        ApiDesignUndoRedoAck ack = new ApiDesignUndoRedoAck();
        ack.setContentVersion(contentVersion);
        editingSession.sendAckTo(session, ack);
        logger.debug("ACK sent back to client.");

        // Now propagate the redo to all other clients
        ApiDesignUndoRedo command = new ApiDesignUndoRedo();
        command.setContentVersion(contentVersion);
        editingSession.sendRedoToOthers(session, user, command);
        logger.debug("Redo sent to 'other' clients.");
    }

    private void processRemote(ApiDesignEditingSession editingSession, ApicurioSessionContext session, VersionedOperation redo) {
        editingSession.sendToAllSessions(session, redo);
        logger.debug("Remote redo sent to local clients.");
    }

    @Override
    public String getOperationName() {
        return "redo";
    }

    @Override
    public Class<? extends BaseOperation> unmarshallKlazz() {
        return VersionedOperation.class;
    }
}
