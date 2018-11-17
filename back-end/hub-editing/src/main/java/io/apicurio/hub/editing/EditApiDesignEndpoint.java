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
import io.apicurio.hub.core.beans.ApiContentType;
import io.apicurio.hub.core.beans.ApiDesign;
import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.beans.ApiDesignContent;
import io.apicurio.hub.core.beans.ApiDesignResourceInfo;
import io.apicurio.hub.core.editing.ApiDesignEditingSession;
import io.apicurio.hub.core.editing.IEditingMetrics;
import io.apicurio.hub.core.editing.IEditingSessionManager;
import io.apicurio.hub.core.editing.operationprocessors.ApicurioOperationProcessor;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.hub.core.js.OaiCommandException;
import io.apicurio.hub.core.js.OaiCommandExecutor;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.websocket.CloseReason;
import javax.websocket.CloseReason.CloseCodes;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
    private OaiCommandExecutor oaiCommandExecutor;
    @Inject
    private IEditingMetrics metrics;
    @Inject
    private ApicurioOperationProcessor operationProcessor;
    //@Inject
//    private SessionSyncSend sessionSync = new SessionSyncSend();
    //@Inject
    //private SessionSyncReceive receive;
    
//    @PostConstruct
//    public void foo() {
//    	System.out.println("Hello!");
//    	sessionSync.shareSession(null);
//    }

    /**
     * Called when a web socket connection is made.  The format for the web socket URL endpoint is:
     * 
     *   /designs/{designId}?uuid={uuid}&user={user}&secret={secret}
     *   
     * The uuid, user, and secret query parameters must be present for a connection to be 
     * successfully made.
     * 
     * @param session
     */
    @OnOpen
    public void onOpenSession(Session session) {
        String designId = session.getPathParameters().get("designId");
        logger.debug("WebSocket opened: {}", session.getId());
        logger.debug("\tdesignId: {}", designId);

        String queryString = session.getQueryString();
        Map<String, String> queryParams = parseQueryString(queryString);
        String uuid = queryParams.get("uuid");
        String userId = queryParams.get("user");
        String secret = queryParams.get("secret");
        
        this.metrics.socketConnected(designId, userId);

        logger.debug("\tuuid: {}", uuid);
        logger.debug("\tuser: {}", userId);
        
        ApiDesignEditingSession editingSession = null;

        try {
            long contentVersion = editingSessionManager.validateSessionUuid(uuid, designId, userId, secret);

            // Join the editing session (or create a new one) for the API Design
            editingSession = this.editingSessionManager.getOrCreateEditingSession(designId);
            Set<Session> otherSessions = editingSession.getSessions();
            if (editingSession.isEmpty()) {
                this.metrics.editingSessionCreated(designId);
            }
            editingSession.join(session, userId);
            
            // Send "join" messages for each user already in the session
            for (Session otherSession : otherSessions) {
                String otherUser = editingSession.getUser(otherSession);
                editingSession.sendJoinTo(session, otherUser, otherSession.getId());
            }
            
            // Send any commands that have been created since the user asked to join the editing session.
            List<ApiDesignCommand> commands = this.storage.listAllContentCommands(userId, designId, contentVersion);
            for (ApiDesignCommand command : commands) {
                String cmdData = command.getCommand();

                StringBuilder builder = new StringBuilder(); // TODO beanify this
                builder.append("{");
                builder.append("\"contentVersion\": ");
                builder.append(command.getContentVersion());
                builder.append(", ");
                builder.append("\"type\": \"command\", ");
                builder.append("\"author\": \"");
                builder.append(command.getAuthor());
                builder.append("\", ");
                builder.append("\"reverted\": ");
                builder.append(command.isReverted());
                builder.append(", ");
                builder.append("\"command\": ");
                builder.append(cmdData);
                builder.append("}");
                
                logger.debug("Sending command to client (onOpenSession): {}", builder.toString());
                
                session.getBasicRemote().sendText(builder.toString());
            }
            
            editingSession.sendJoinToOthers(session, userId);
        } catch (ServerError | StorageException | IOException e) {
            if (editingSession != null) {
                editingSession.leave(session);
            }
            logger.error("Error validating editing session UUID for API Design ID: " + designId, e);
            try {
                session.close(new CloseReason(CloseCodes.CANNOT_ACCEPT, "Error opening editing session: " + e.getMessage()));
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
     * @param session
     * @param message
     */
    @OnMessage
    public void onMessage(Session session, JsonNode message) {
        String designId = session.getPathParameters().get("designId");
        ApiDesignEditingSession editingSession = editingSessionManager.getEditingSession(designId);
        String msgType = message.get("type").asText();

        logger.debug("Received a \"{}\" message from a client.", msgType);
        logger.debug("\tdesignId: {}", designId);

        operationProcessor.process(editingSession, session, message);


        // Put this into a processor/factory/something -- give that entity to ApicurioSessionFactory join operations?
//        if (msgType.equals("command")) {
//            String user = editingSession.getUser(session);
//            long localCommandId = -1;
//            if (message.has("commandId")) {
//                localCommandId = message.get("commandId").asLong();
//            }
//            String content;
//            long cmdContentVersion;
//
//            this.metrics.contentCommand(designId);
//
//            logger.debug("\tuser:" + user);
//            try {
//                content = mapper.writeValueAsString(message.get("command"));
//            } catch (JsonProcessingException e) {
//                logger.error("Error writing command as string.", e);
//                // TODO do something sensible here - send a msg to the client?
//                return;
//            }
//            try {
//                cmdContentVersion = storage.addContent(user, designId, ApiContentType.Command, content);
//            } catch (StorageException e) {
//                logger.error("Error storing the command.", e);
//                // TODO do something sensible here - send a msg to the client?
//                return;
//            }
//
//            // Send an ack message back to the user
//            ApiDesignCommandAck ack = new ApiDesignCommandAck();
//            ack.setCommandId(localCommandId);
//            ack.setContentVersion(cmdContentVersion);
//            editingSession.sendAckTo(session, ack);
//            logger.debug("ACK sent back to client.");
//
//            // Now propagate the command to all other clients
//            ApiDesignCommand command = new ApiDesignCommand();
//            command.setCommand(content);
//            command.setContentVersion(cmdContentVersion);
//            command.setAuthor(user);
//            command.setReverted(false);
//            editingSession.sendCommandToOthers(session, user, command);
//            logger.debug("Command propagated to 'other' clients.");
//
//            return;
//        } else if (msgType.equals("selection")) {
//            String user = editingSession.getUser(session);
//            String selection = null;
//            if (message.has("selection")) {
//                JsonNode node = message.get("selection");
//                if (node != null) {
//                    selection = node.asText();
//                }
//            }
//            logger.debug("\tuser:" + user);
//            logger.debug("\tselection:" + selection);
//            editingSession.sendUserSelectionToOthers(session, user, selection);
//            logger.debug("User selection propagated to 'other' clients.");
//            return;
//        } else if (msgType.equals("ping")) {
//            logger.debug("PING message received.");
//            return;
//        } else if (msgType.equals("undo")) {
//            String user = editingSession.getUser(session);
//
//            long contentVersion = -1;
//            if (message.has("contentVersion")) {
//                contentVersion = message.get("contentVersion").asLong();
//            }
//
//            this.metrics.undoCommand(designId, contentVersion);
//
//            logger.debug("\tuser:" + user);
//            boolean reverted = false;
//            try {
//                reverted = storage.undoContent(user, designId, contentVersion);
//            } catch (StorageException e) {
//                logger.error("Error undoing a command.", e);
//                // TODO do something sensible here - send a msg to the client?
//                return;
//            }
//
//            // If the command wasn't successfully reverted (it was already reverted or didn't exist)
//            // then return without doing anything else.
//            if (!reverted) {
//                return;
//            }
//
//            // Send an ack message back to the user
//            ApiDesignUndoRedoAck ack = new ApiDesignUndoRedoAck();
//            ack.setContentVersion(contentVersion);
//            editingSession.sendAckTo(session, ack);
//            logger.debug("ACK sent back to client.");
//
//            // Now propagate the undo to all other clients
//            ApiDesignUndoRedo command = new ApiDesignUndoRedo();
//            command.setContentVersion(contentVersion);
//            editingSession.sendUndoToOthers(session, user, command);
//            logger.debug("Undo sent to 'other' clients.");
//
//            return;
//        } else if (msgType.equals("redo")) {
//            String user = editingSession.getUser(session);
//
//            long contentVersion = -1;
//            if (message.has("contentVersion")) {
//                contentVersion = message.get("contentVersion").asLong();
//            }
//
//            this.metrics.redoCommand(designId, contentVersion);
//
//            logger.debug("\tuser:" + user);
//            boolean restored = false;
//            try {
//                restored = storage.redoContent(user, designId, contentVersion);
//            } catch (StorageException e) {
//                logger.error("Error undoing a command.", e);
//                // TODO do something sensible here - send a msg to the client?
//                return;
//            }
//
//            // If the command wasn't successfully restored (it was already restored or didn't exist)
//            // then return without doing anything else.
//            if (!restored) {
//                return;
//            }
//
//            // Send an ack message back to the user
//            ApiDesignUndoRedoAck ack = new ApiDesignUndoRedoAck();
//            ack.setContentVersion(contentVersion);
//            editingSession.sendAckTo(session, ack);
//            logger.debug("ACK sent back to client.");
//
//            // Now propagate the redo to all other clients
//            ApiDesignUndoRedo command = new ApiDesignUndoRedo();
//            command.setContentVersion(contentVersion);
//            editingSession.sendRedoToOthers(session, user, command);
//            logger.debug("Redo sent to 'other' clients.");
//
//            return;
//        }
        logger.error("Unknown message type: {}", msgType);
        // TODO something went wrong if we got here - report an error of some kind
    }

    @OnClose
    public void onCloseSession(Session session, CloseReason reason) {
        String designId = session.getPathParameters().get("designId");
        logger.debug("Closing a WebSocket due to: {}", reason.getReasonPhrase());
        logger.debug("\tdesignId: {}", designId);

        // Call 'leave' on the concurrent editing session for this user
        ApiDesignEditingSession editingSession = editingSessionManager.getEditingSession(designId);
        String userId = editingSession.getUser(session);
        editingSession.leave(session);
        if (editingSession.isEmpty()) {
            // TODO race condition - the session may no longer be empty here!
            editingSessionManager.closeEditingSession(editingSession);
            
            try {
                rollupCommands(userId, designId);
            } catch (NotFoundException | StorageException | OaiCommandException e) {
                logger.error("Failed to rollup commands for API with id: " + designId, "Rollup error: ", e);
            }
        } else {
            editingSession.sendLeaveToOthers(session, userId);
        }
    }

    /**
     * Finds all commands executed since the last full content rollup and applies
     * them to the API design.  This produces a "latest" version of the API
     * and stores that as a new content entry in the storage.
     * @param userId
     * @param designId
     * @throws StorageException 
     * @throws NotFoundException 
     * @throws OaiCommandException 
     */
    private void rollupCommands(String userId, String designId) throws NotFoundException, StorageException, OaiCommandException {
        logger.debug("Rolling up commands for API with ID: {}", designId);
        ApiDesignContent designContent = this.storage.getLatestContentDocument(userId, designId);
        logger.debug("Using latest contentVersion {} for possible command rollup.", designContent.getContentVersion());
        List<ApiDesignCommand> apiCommands = this.storage.listContentCommands(userId, designId, designContent.getContentVersion());
        if (apiCommands.isEmpty()) {
            logger.debug("No hanging commands found, rollup of API {} canceled.", designId);
            return;
        }
        List<String> commands = new ArrayList<>(apiCommands.size());
        for (ApiDesignCommand apiCommand : apiCommands) {
            commands.add(apiCommand.getCommand());
        }
        String content = this.oaiCommandExecutor.executeCommands(designContent.getOaiDocument(), commands);
        long contentVersion = this.storage.addContent(userId, designId, ApiContentType.Document, content);
        logger.debug("Rollup of {} commands complete with new content version: {}", commands.size(), contentVersion);
        
        try {
            logger.debug("Updating meta-data for API design {} if necessary.", designId);
            ApiDesign design = this.storage.getApiDesign(userId, designId);
            ApiDesignResourceInfo info = ApiDesignResourceInfo.fromContent(content);
            boolean dirty = false;
            if (design.getName() == null || !design.getName().equals(info.getName())) {
                design.setName(info.getName());
                dirty = true;
            }
            if (design.getDescription() == null || !design.getDescription().equals(info.getDescription())) {
                design.setDescription(info.getDescription());
                dirty = true;
            }
            if (design.getTags() == null || !design.getTags().equals(info.getTags())) {
                design.setTags(info.getTags());
                dirty = true;
            }
            if (dirty) {
                logger.debug("API design {} meta-data changed, updating in storage.", designId);
                this.storage.updateApiDesign(userId, design);
            }
        } catch (Exception e) {
            // Not the end of the world if we fail to update the API's meta-data
            logger.error(e.getMessage(), e);
        }
    }

    /**
     * Parses the query string into a map.
     * @param queryString
     */
    protected static Map<String, String> parseQueryString(String queryString) {
        Map<String, String> rval = new HashMap<>();
        List<NameValuePair> list = URLEncodedUtils.parse(queryString, StandardCharsets.UTF_8);
        for (NameValuePair nameValuePair : list) {
            rval.put(nameValuePair.getName(), nameValuePair.getValue());
        }
        return rval;
    }
}
