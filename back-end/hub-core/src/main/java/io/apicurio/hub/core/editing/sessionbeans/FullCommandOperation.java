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

import com.fasterxml.jackson.annotation.JsonInclude;
import io.apicurio.hub.core.beans.ApiDesignCommand;

/**
 * @author Marc Savy {@literal <marc@rhymewithgravy.com>}
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FullCommandOperation extends VersionedCommandOperation {
    private String author;
    private boolean reverted;

    public String getAuthor() {
        return author;
    }

    public FullCommandOperation setAuthor(String author) {
        this.author = author;
        return this;
    }


    public boolean isReverted() {
        return reverted;
    }

    public FullCommandOperation setReverted(boolean reverted) {
        this.reverted = reverted;
        return this;
    }

    public static FullCommandOperation fullCommand(ApiDesignCommand command) {
        return FullCommandOperation.fullCommand(command.getContentVersion(),
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

}
