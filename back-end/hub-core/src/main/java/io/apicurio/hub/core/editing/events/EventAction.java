/*
 * Copyright 2020 Red Hat
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

package io.apicurio.hub.core.editing.events;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import io.apicurio.hub.core.editing.ops.BaseOperation;
import io.apicurio.hub.core.editing.ops.JoinLeaveOperation;
import io.apicurio.hub.core.editing.ops.OperationFactory;
import io.apicurio.hub.core.util.JsonUtil;

import java.util.List;

/**
 * @author Ales Justin
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class EventAction {
    private ActionType type;
    private String id;
    private byte[] op;
    private List<JoinLeaveOperation> ops;

    public EventAction() {
    }

    private EventAction(ActionType type, String id, BaseOperation op, List<JoinLeaveOperation> ops) {
        this.type = type;
        this.id = id;
        this.op = JsonUtil.toJsonBytes(op);
        this.ops = ops;
    }

    public static EventAction close(String uuid) {
        return new EventAction(ActionType.CLOSE, uuid, null, null);
    }

    public static EventAction rollup(String uuid) {
        return new EventAction(ActionType.ROLLUP, uuid, null, null);
    }

    public static EventAction sendToOthers(BaseOperation op, String excludedContextId) {
        return new EventAction(ActionType.SEND_TO_OTHERS, excludedContextId, op, null);
    }

    public static EventAction sendToList(String toContextId) {
        return new EventAction(ActionType.SEND_TO_LIST, toContextId, null, null);
    }

    public static EventAction sendToExecute(List<JoinLeaveOperation> ops, String toContextId) {
        return new EventAction(ActionType.SEND_TO_EXECUTE, toContextId, null, ops);
    }

    @Override
    public String toString() {
        return String.format("EventAction: %s", type);
    }

    public BaseOperation toBaseOperation() {
        JsonNode jsonNode = JsonUtil.toJsonTree(op);
        return OperationFactory.operation(jsonNode);
    }

    public ActionType getType() {
        return type;
    }

    public void setType(ActionType type) {
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public byte[] getOp() {
        return op;
    }

    public void setOp(byte[] op) {
        this.op = op;
    }

    public List<JoinLeaveOperation> getOps() {
        return ops;
    }

    public void setOps(List<JoinLeaveOperation> ops) {
        this.ops = ops;
    }
}
