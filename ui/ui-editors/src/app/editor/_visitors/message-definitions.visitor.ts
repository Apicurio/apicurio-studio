/**
 * @license
 * Copyright 2022 Red Hat
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
import {CombinedVisitorAdapter, AaiMessage} from "@apicurio/data-models";

/**
 * Visitor used to find message definitions                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  tions.
 */
export class FindMessageDefinitionsVisitor extends CombinedVisitorAdapter {

    public messageDefinitions: AaiMessage[] = [];

    /**
     * C'tor.
     * @param filterCriteria
     */
    constructor(private filterCriteria: string) {
        super();
    }

    /**
     * Called when a message def is visited.
     * @param node
     */
    visitMessage(node: AaiMessage): void {
        if (this.acceptThroughFilter(node.getName())) {
            this.messageDefinitions.push(node);
        }
    }

    /**
     * Sorts and returns the message defs.
     */
    public getSortedMessageDefinitions(): AaiMessage[] {
        return this.messageDefinitions.sort( (messageDefinition1, messageDefinition2) => {
            return messageDefinition1.getName().localeCompare(messageDefinition2.getName());
        });
    }

    /**
     * Figures out the definition name regardless of the version of the model.
     * @param definition
     */
    public static definitionName(definition: AaiMessage): string {
        return definition.getName();
    }

    /**
     * Returns true if the given name is accepted by the current filter criteria.
     * @param name
     * @return
     */
    private acceptThroughFilter(name: string): boolean {
        if (this.filterCriteria === null) {
            return true;
        }
        return name.toLowerCase().indexOf(this.filterCriteria) != -1;
    }
}
