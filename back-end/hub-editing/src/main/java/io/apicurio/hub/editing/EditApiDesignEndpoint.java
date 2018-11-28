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
import io.apicurio.hub.core.editing.ApicurioSessionContext;
import io.apicurio.hub.core.editing.IEditingMetrics;
import io.apicurio.hub.core.editing.IEditingSessionManager;
import io.apicurio.hub.core.editing.operationprocessors.ApicurioOperationProcessor;
import io.apicurio.hub.core.editing.sessionbeans.FullCommandOperation;
import io.apicurio.hub.core.exceptions.NotFoundException;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.hub.core.js.OaiCommandException;
import io.apicurio.hub.core.js.OaiCommandExecutor;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;
import io.apicurio.hub.core.util.JsonUtil;
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

    /**
     * Called when a web socket connection is made.  The format for the web socket URL endpoint is:
     * 
     *   /designs/{designId}?uuid={uuid}&user={user}&secret={secret}
     *   
     * The uuid, user, and secret query parameters must be present for a connection to be 
     * successfully made.
     * 
     * @param sessionx
     */
    @OnOpen
    public void onOpenSession(Session sessionx) {
        WebsocketSessionContextImpl session = new WebsocketSessionContextImpl(sessionx);

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

            // If no existing sessions, emit metrics event for creating session
            Set<ApicurioSessionContext> otherSessions = editingSession.getSessions();
            if (editingSession.isEmpty()) {
                this.metrics.editingSessionCreated(designId);
            }


            // Add session to local session list, and remote session if applicable
            editingSession.join(session, userId);
            
            // Send "join" messages for each user already in the session
            for (ApicurioSessionContext otherSession : otherSessions) {
                String otherUser = editingSession.getUser(otherSession);
                editingSession.sendJoinTo(session, otherUser, otherSession.getId());
            }
            
            // Send any commands that have been created since the user asked to join the editing session.
            List<ApiDesignCommand> commands = this.storage.listAllContentCommands(userId, designId, contentVersion);
            for (ApiDesignCommand command : commands) {
                FullCommandOperation operation = FullCommandOperation.fullCommand(command);
                String serialized = JsonUtil.toJson(operation);

                logger.debug("Sending command to client (onOpenSession): {}", serialized); // todo tostring instead?
                
                session.sendAsText(serialized);
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
     * @param sessionx websocket session
     * @param message payload as JSON
     */
    @OnMessage
    public void onMessage(Session sessionx, JsonNode message) {
        WebsocketSessionContextImpl session = new WebsocketSessionContextImpl(sessionx);

        String designId = session.getPathParameters().get("designId");
        ApiDesignEditingSession editingSession = editingSessionManager.getEditingSession(designId);
        String msgType = message.get("type").asText();

        logger.debug("Received a \"{}\" message from a client.", msgType);
        logger.debug("\tdesignId: {}", designId);

        // Route the call to an appropriate operation handler
        operationProcessor.process(editingSession, session, message);

        // logger.error("Unknown message type: {}", msgType);
        // TODO something went wrong if we got here - report an error of some kind
    }

    @OnClose
    public void onCloseSession(Session sessionx, CloseReason reason) {
        WebsocketSessionContextImpl session = new WebsocketSessionContextImpl(sessionx);

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
