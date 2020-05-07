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

package io.apicurio.hub.editing;

import com.fasterxml.jackson.databind.JsonNode;
import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.editing.IEditingMetrics;
import io.apicurio.hub.core.editing.IEditingSession;
import io.apicurio.hub.core.editing.IEditingSessionManager;
import io.apicurio.hub.core.editing.ops.FullCommandOperation;
import io.apicurio.hub.core.editing.ops.OperationFactory;
import io.apicurio.hub.core.editing.ops.OperationProcessorException;
import io.apicurio.hub.core.editing.ops.processors.OperationProcessorDispatcher;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.websocket.CloseReason;
import javax.websocket.CloseReason.CloseCodes;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 * @author eric.wittmann@gmail.com
 */
@ServerEndpoint(
    value="/designs/{designId}",
    encoders={ MessageEncoder.class },
    decoders={ MessageDecoder.class }
)
@ApplicationScoped
public class EditApiDesignEndpoint {
    
    private static Logger logger = LoggerFactory.getLogger(EditApiDesignEndpoint.class);

    @Inject
    private IEditingSessionManager editingSessionManager;
    @Inject
    private IStorage storage;
    @Inject
    private IEditingMetrics metrics;
    @Inject
    private OperationProcessorDispatcher operationProcessor;

    /**
     * Called when a web socket connection is made.  The format for the web socket URL endpoint is:
     * 
     *   /designs/{designId}?uuid={uuid}&user={user}&secret={secret}
     *   
     * The uuid, user, and secret query parameters must be present for a connection to be 
     * successfully made.
     * 
     * @param wsSession the native session
     */
    @OnOpen
    public void onOpenSession(Session wsSession) {
        WebsocketSessionContext context = new WebsocketSessionContext(wsSession);

        String designId = context.getPathParameters().get("designId");
        logger.debug("WebSocket opened: {}", context.getId());
        logger.debug("\tdesignId: {}", designId);

        String uuid = context.getQueryParam("uuid");
        String userId = context.getQueryParam("user");
        String secret = context.getQueryParam("secret");
        
        this.metrics.socketConnected(designId, userId);

        logger.debug("\tdesignId: {}", designId);
        logger.debug("\tuuid: {}", uuid);
        logger.debug("\tuser: {}", userId);
        logger.debug("\tsecret: {}", secret);
        
        IEditingSession editingSession = null;

        try {
            /*
                Content version will be the latest FULL document (i.e. rolled up).

                This is determined by the REST API side of the application before WS is invoked.

                See DesignsResource#editDesign in hub-api.

                We must ensure that any subsequent commands that have not been rolled up are applied by the
                joining client, otherwise we may be unwittingly behind other live participants.
            */
            long contentVersion = editingSessionManager.validateSessionUuid(uuid, designId, userId, secret);

            // Join the editing session (or create a new one) for the API Design
            editingSession = this.editingSessionManager.getOrCreateEditingSession(designId);

            // If no existing sessions, emit metrics event for creating session
            if (editingSession.isEmpty()) {
                this.metrics.editingSessionCreated(designId);
            }

            // Send "join" messages for each user already in the session
            editingSession.sendTo(OperationFactory::join, context);

            // Add websocket context to the editing session
            editingSession.join(context, userId);
            
            // Send any commands that have been created since the user asked to join the editing session.
            List<ApiDesignCommand> commands = this.storage.listAllContentCommands(userId, designId, contentVersion);
            for (ApiDesignCommand command : commands) {
                FullCommandOperation operation = OperationFactory.fullCommand(command);

                logger.debug("Sending command to client (onOpenSession): {}", command.getCommand()); // todo tostring instead?
                
                editingSession.sendTo(operation, context);
            }
            
            // Send "join" message to each user already in the session
            editingSession.sendToOthers(OperationFactory.join(userId, context.getId()), context);
        } catch (ServerError | StorageException e) {
            if (editingSession != null) {
                editingSession.leave(context);
            }
            logger.error("Error validating editing session UUID for API Design ID: " + designId, e);
            try {
                context.close(new CloseReason(CloseCodes.CANNOT_ACCEPT, "Error opening editing session: " + e.getMessage()));
            } catch (IOException e1) {
                logger.error("Error closing web socket session (attempted to close due to error validating editing session UUID).", e1);
            }
        }
    }

    /**
     * Called when a message is received on a web socket connection.  All messages must
     * be of the following (JSON) format:
     * 
     * <pre>
     * {
     *    "type": "command|...",
     *    "command": {
     *       &lt;marshalled OAI command goes here>
     *    }
     * }
     * </pre>
     * 
     * @param wsSession websocket session
     * @param message payload as JSON
     */
    @OnMessage
    public void onMessage(Session wsSession, JsonNode message) {
        WebsocketSessionContext context = new WebsocketSessionContext(wsSession);

        String designId = context.getPathParameters().get("designId");
        IEditingSession editingSession = editingSessionManager.getEditingSession(designId);

        // Route the call to an appropriate operation handler
        try {
            operationProcessor.process(editingSession, context, message);
        } catch (OperationProcessorException e) {
            logger.error(e.getLocalizedMessage(), e);
        }
    }

    /**
     * Called when the websocket session closes.  Used to remove the user from the
     * editing session and to send a "leave" message to any active collaborators
     * still connected to the session.
     * @param wsSession
     * @param reason
     */
    @OnClose
    public void onCloseSession(Session wsSession, CloseReason reason) {
        WebsocketSessionContext context = new WebsocketSessionContext(wsSession);

        String designId = context.getPathParameters().get("designId");
        logger.debug("Closing a WebSocket due to: {}", reason.getReasonPhrase());
        logger.debug("\tdesignId: {}", designId);

        // Call 'leave' on the concurrent editing session for this user
        IEditingSession editingSession = editingSessionManager.getEditingSession(designId);
        String userId = editingSession.getUser(context);
        editingSession.leave(context);

        // Send the 'leave' message to everyone who might still be in the editing session
        editingSession.sendToOthers(OperationFactory.leave(userId, context.getId()), context);

        // If there are no more websockets connected to the editing session, close it.
        if (editingSession.isEmpty()) {
            // TODO race condition - the session may no longer be empty here!
            editingSessionManager.closeEditingSession(editingSession);
        }

    }
}
