/*
 * Copyright 2018 JBoss Inc
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
package io.apicurio.hub.core.editing.sessionbeans;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import io.apicurio.hub.core.util.JsonUtil;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
public class VersionedCommandOperation extends VersionedOperation {
    private JsonNode command;
    private long commandId = -1;

    @JsonIgnore
    public String getCommandStr() {
        return command.toString();
    }

    public Object getCommand() {
        return command;
    }

    public VersionedCommandOperation setCommand(JsonNode command) {
        this.command = command;
        return this;
    }

    @JsonIgnore
    public VersionedCommandOperation setCommand(String command) {
        this.command = JsonUtil.toJsonTree(command);
        return this;
    }

    public long getCommandId() {
        return commandId;
    }

    public VersionedCommandOperation setCommandId(long commandId) {
        this.commandId = commandId;
        return this;
    }

    public static VersionedCommandOperation command(long contentVersion, String command) {
        return (VersionedCommandOperation) new VersionedCommandOperation()
                .setCommand(command)
                .setContentVersion(contentVersion)
                .setType("command");
    }

    public static VersionedCommandOperation command(long contentVersion, String command, long commandId) {
        return (VersionedCommandOperation) new VersionedCommandOperation()
                .setCommand(command)
                .setCommandId(commandId)
                .setContentVersion(contentVersion)
                .setType("command");
    }

    public static void main(String... args) {
        String str = "{\"type\":\"command\",\"commandId\":1543502845539," +
                "\"command\":{\"__type\":\"NewOperationCommand_30\"," +
                "\"_path\":\"/pets/{id}\",\"_method\":\"post\",\"_created\":true}}";

        VersionedCommandOperation vco = JsonUtil.fromJson(str, VersionedCommandOperation.class);

        JsonNode tree = JsonUtil.toJsonTree(str);

        System.out.println(tree);

        System.out.println(vco);

    }
}
