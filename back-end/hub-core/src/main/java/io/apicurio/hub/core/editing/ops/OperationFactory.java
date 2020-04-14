/*
 * Copyright 2019 JBoss Inc
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

package io.apicurio.hub.core.editing.ops;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import io.apicurio.hub.core.beans.ApiDesignCommand;
import io.apicurio.hub.core.editing.ISessionContext;
import io.apicurio.hub.core.util.JsonUtil;

import java.util.HashMap;
import java.util.Map;

/**
 * Creates operations!
 * @author eric.wittmann@gmail.com
 */
public final class OperationFactory {
    
    private static final Map<String, Class<? extends BaseOperation>> OP_CLASSES;
    static {
        OP_CLASSES = new HashMap<>();
        OP_CLASSES.put("batch", BatchOperation.class);
        OP_CLASSES.put("command", FullCommandOperation.class);
        OP_CLASSES.put("join", JoinLeaveOperation.class);
        OP_CLASSES.put("leave", JoinLeaveOperation.class);
        OP_CLASSES.put("selection", SelectionOperation.class);
        OP_CLASSES.put("undo", VersionedOperation.class);
        OP_CLASSES.put("redo", VersionedOperation.class);
        OP_CLASSES.put("ack", VersionedAck.class);
        OP_CLASSES.put("deferred", DeferredAction.class);
        OP_CLASSES.put("storageError", StorageError.class);
        OP_CLASSES.put("ping", PingOperation.class);
        OP_CLASSES.put("list-clients", ListClientsOperation.class);
    }
    
    public static BaseOperation operation(JsonNode message) {
        String type = null;
        if (message.has("type")) {
            type = message.get("type").asText();
        }
        if (type == null) {
            throw new IllegalArgumentException("Couldn't create Operation, missing 'type' property: " + JsonUtil.toJson(message));
        }
        Class<? extends BaseOperation> unmarshallClass = OP_CLASSES.get(type);
        if (unmarshallClass == null) {
            throw new IllegalArgumentException("Couldn't create Operation, unknown type: " + type);
        }
        
        // Handle batch a bit differently.
        if ("batch".equals(type)) {
            final BatchOperation batchOp = batch();
            if (message.has("operations")) {
                JsonNode operationsNode = message.get("operations");
                if (operationsNode.isArray()) {
                    ArrayNode array = (ArrayNode) operationsNode;
                    array.forEach(subop -> {
                        batchOp.getOperations().add(operation(subop));
                    });
                }
            }
            return batchOp;
        } else {
            return JsonUtil.fromJsonToOperation(message, unmarshallClass);
        }
    }
    
    public static BatchOperation batch() {
        return (BatchOperation) new BatchOperation()
                .setType("batch");
    }

    public static FullCommandOperation fullCommand(ApiDesignCommand command) {
        return OperationFactory.fullCommand(command.getContentVersion(),
                command.getCommand(),
                command.getAuthor(),
                command.isReverted());
    }

    public static FullCommandOperation fullCommand(long contentVersion, String commandContent, String author, boolean reverted) {
        return (FullCommandOperation) new FullCommandOperation()
                .setAuthor(author)
                .setReverted(reverted)
                .setCommand(commandContent)
                .setContentVersion(contentVersion)
                .setType("command");
    }

    public static FullCommandOperation fullCommand(long commandId, String commandContent) {
        return (FullCommandOperation) new FullCommandOperation()
                .setCommand(commandContent)
                .setCommandId(commandId)
                .setType("command");
    }

    public static JoinLeaveOperation join(String user, ISessionContext context) {
        return join(user, context.getId());
    }

    public static JoinLeaveOperation join(String user, String id) {
        return (JoinLeaveOperation) new JoinLeaveOperation()
                .setUser(user)
                .setId(id)
                .setType("join");
    }

    public static JoinLeaveOperation leave(String user, String id) {
        return (JoinLeaveOperation) new JoinLeaveOperation()
                .setUser(user)
                .setId(id)
                .setType("leave");
    }

    public static SelectionOperation select(String user, String id, String selection) {
        return (SelectionOperation) new SelectionOperation()
                .setUser(user)
                .setId(id)
                .setSelection(selection)
                .setType("selection");
    }

    public static SelectionOperation select(String selection) {
        return (SelectionOperation) new SelectionOperation()
                .setSelection(selection)
                .setType("selection");
    }

    public static VersionedAck ack(long contentVersion, long commandId, String ackType) {
        return (VersionedAck) new VersionedAck()
                .setAckType(ackType)
                .setCommandId(commandId)
                .setContentVersion(contentVersion)
                .setType("ack");
    }

    public static VersionedAck ack(long contentVersion, String ackType) {
        return (VersionedAck) new VersionedAck()
                .setAckType(ackType)
                .setContentVersion(contentVersion)
                .setType("ack");
    }
    
    public static DeferredAction deferred(long id, String actionType) {
        return (DeferredAction) new DeferredAction()
                .setActionType(actionType)
                .setId(id)
                .setType("deferred");
    }

    public static VersionedCommandOperation command(long contentVersion, String command) {
        return (VersionedCommandOperation) new VersionedCommandOperation()
                .setCommand(command)
                .setContentVersion(contentVersion)
                .setType("command");
    }

    public static VersionedCommandOperation command(long contentVersion, String command, Long commandId) {
        return (VersionedCommandOperation) new VersionedCommandOperation()
                .setCommand(command)
                .setCommandId(commandId)
                .setContentVersion(contentVersion)
                .setType("command");
    }

    public static VersionedOperation redo(long contentVersion) {
        return (VersionedOperation) new VersionedOperation()
                .setContentVersion(contentVersion)
                .setType("redo");
    }

    public static VersionedOperation undo(long contentVersion) {
        return (VersionedOperation) new VersionedOperation()
                .setContentVersion(contentVersion)
                .setType("undo");
    }
    
    public static StorageError storageError(long id, String failedType) {
        return (StorageError) new StorageError()
                .setId(id)
                .setFailedType(failedType)
                .setType("storageError");
    }

}
