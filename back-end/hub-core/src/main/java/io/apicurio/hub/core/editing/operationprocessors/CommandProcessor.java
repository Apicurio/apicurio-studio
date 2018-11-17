package io.apicurio.hub.core.editing.operationprocessors;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import io.apicurio.hub.core.beans.ApiContentType;
import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.beans.ApiDesignCommandAck;
import io.apicurio.hub.core.editing.ApiDesignEditingSession;
import io.apicurio.hub.core.editing.IEditingMetrics;
import io.apicurio.hub.core.editing.sessionbeans.VersionedCommandOperation;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.websocket.Session;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class CommandProcessor implements IOperationProcessor {

    private static Logger logger = LoggerFactory.getLogger(CommandProcessor.class);

    @Inject
    private IStorage storage;

    @Inject
    private IEditingMetrics metrics;

    @Override
    public void process(ApiDesignEditingSession editingSession, Session session, JsonNode message) {
        String user = editingSession.getUser(session);

        long localCommandId = -1;
        if (message.has("commandId")) {
            localCommandId = message.get("commandId").asLong();
        }
        String content;
        long cmdContentVersion;

        this.metrics.contentCommand(editingSession.getDesignId());

        logger.debug("\tuser:" + user);
        try {
            content = mapper.writeValueAsString(message.get("command"));
        } catch (JsonProcessingException e) {
            logger.error("Error writing command as string.", e);
            // TODO do something sensible here - send a msg to the client?
            return;
        }
        try {
            cmdContentVersion = storage.addContent(user, designId, ApiContentType.Command, content);
        } catch (StorageException e) {
            logger.error("Error storing the command.", e);
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
        command.setCommand(content);
        command.setContentVersion(cmdContentVersion);
        command.setAuthor(user);
        command.setReverted(false);
        editingSession.sendCommandToOthers(session, user, command);
        logger.debug("Command propagated to 'other' clients.");

    }
}
