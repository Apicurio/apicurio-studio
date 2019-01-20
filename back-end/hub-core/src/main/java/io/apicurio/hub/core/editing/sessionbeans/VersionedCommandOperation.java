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
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.JsonNode;
import io.apicurio.hub.core.util.JsonUtil;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VersionedCommandOperation extends VersionedOperation {
    @JsonRawValue
    private JsonNode command;
    private Long commandId = null;

    @JsonIgnore
    public String getCommandStr() {
        return command.toString();
    }

    @JsonRawValue
    public JsonNode getCommand() {
        return command;
    }

    @JsonRawValue
    public VersionedCommandOperation setCommand(JsonNode command) {
        this.command = command;
        return this;
    }

    @JsonIgnore
    public VersionedCommandOperation setCommand(String command) {
        this.command = JsonUtil.toJsonTree(command);
        return this;
    }

    public Long getCommandId() {
        return commandId;
    }

    public VersionedCommandOperation setCommandId(Long commandId) {
        this.commandId = commandId;
        return this;
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

    public static void main(String... args) {
//        String str = "{\"type\":\"command\",\"commandId\":1543502845539," +
//                "\"command\":{\"__type\":\"NewOperationCommand_30\"," +
//                "\"_path\":\"/pets/{id}\",\"_method\":\"post\",\"_created\":true}}";

        String str = "{\"type\":\"command\",\"commandId\":123445,\"command\":{\"__type\":\"ChangeDescriptionCommand_30\",\"_newDescription\":\"T\",\"_oldDescription\":\"The Data Set API (DSAPICSV based data files searchable through API. Wiarchable. With the help of POST call, data can be fetched based on the filters on the field names. Please note that POST call is used to search the actual data. The reason for the POST call is that it allows users to specify any complex search criteria without worry about the GET size limitations as well as encoding of the input parameters.\"}}";

//        VersionedCommandOperation vco = JsonUtil.fromJson(str, VersionedCommandOperation.class);

        VersionedCommandOperation vco2 = VersionedCommandOperation.command(12345, "{\"foo\":\"bar\"}");


        String strout = JsonUtil.toJson(vco2);

        System.out.println(strout);

//        System.out.println(vco.getCommandStr());

    }
}
