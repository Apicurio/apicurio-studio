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
package io.apicurio.hub.core.editing.ops;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.JsonNode;

import io.apicurio.hub.core.util.JsonUtil;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
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

}
