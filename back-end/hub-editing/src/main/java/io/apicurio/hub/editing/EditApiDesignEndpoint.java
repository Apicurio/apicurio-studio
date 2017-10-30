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

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.websocket.CloseReason;
import javax.websocket.CloseReason.CloseCodes;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.apicurio.hub.core.beans.ApiContentType;
import io.apicurio.hub.core.editing.ApiDesignEditingSession;
import io.apicurio.hub.core.editing.IEditingSessionManager;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.hub.core.storage.IStorage;
import io.apicurio.hub.core.storage.StorageException;

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
    private static final ObjectMapper mapper = new ObjectMapper();
    
    @Inject
    private IEditingSessionManager editingSessionManager;
    @Inject
    private IStorage storage;
    
    private Map<String, String> users = new HashMap<>();

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
        logger.debug("WebSocket opened: " + session.getId());
        logger.debug("\tdesignId: " + designId);

        String queryString = session.getQueryString();
        Map<String, String> queryParams = parseQueryString(queryString);
        String uuid = queryParams.get("uuid");
        String userId = queryParams.get("user");
        String secret = queryParams.get("secret");

        logger.debug("\tuuid:" + uuid);
        logger.debug("\tuser:" + userId);

        try {
            long contentVersion = editingSessionManager.validateSessionUuid(uuid, designId, userId, secret);

            // Create mapping between the session ID and the user associated with it.
            this.users.put(session.getId(), userId);

            // TODO find all commands since the above content version and send them to the client
            
            // Join the editing session (or create a new one) for the API Design
            ApiDesignEditingSession editingSession = this.editingSessionManager.getOrCreateEditingSession(designId);
            editingSession.join(session);
        } catch (ServerError e) {
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
        logger.debug("Received a 'command' message from a client.");
        logger.debug("\tdesignId:" + designId);

        ApiDesignEditingSession editingSession = editingSessionManager.getEditingSession(designId);
        String msgType = message.get("type").asText();
        if (msgType.equals("command")) {
            String user = this.users.get(session.getId());
            String content;
            long cmdContentVersion;
            
            logger.debug("\tuser:" + user);
            try {
                content = mapper.writeValueAsString(message.get("command"));
            } catch (JsonProcessingException e) {
                logger.error("Error writing command as string.", e);
                // TODO do something sensible here - send a msg to the client?
                throw new RuntimeException(e);
            }
            try {
                cmdContentVersion = storage.addContent(user, designId, ApiContentType.Command, content);
            } catch (StorageException e) {
                logger.error("Error storing the command.", e);
                // TODO do something sensible here - send a msg to the client?
                throw new RuntimeException(e);
            }
            // TODO send the new content version back to the originating user (with some sort of correlation)
            editingSession.sendCommandToOthers(session, user, content);
            return;
        }
        logger.error("Unknown message type: " + msgType);
        // TODO something went wrong if we got here - report an error of some kind
    }

    @OnClose
    public void onCloseSession(Session session, CloseReason reason) {
        String designId = session.getPathParameters().get("designId");
        logger.debug("Closing a WebSocket due to " + reason.getReasonPhrase());
        logger.debug("\tdesignId:" + designId);

        ApiDesignEditingSession editingSession = editingSessionManager.getEditingSession(designId);
        editingSession.leave(session);
        if (editingSession.isEmpty()) {
            editingSessionManager.closeEditingSession(editingSession);
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
