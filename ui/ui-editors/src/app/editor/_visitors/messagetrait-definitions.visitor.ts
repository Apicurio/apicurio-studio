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
import {CombinedVisitorAdapter, AaiMessageTraitDefinition} from "@apicurio/data-models";

/**
 * Visitor used to find message trait definitions.
 */
export class FindMessageTraitDefinitionsVisitor extends CombinedVisitorAdapter {

    public messageTraitDefinitions: AaiMessageTraitDefinition[] = [];

    /**
     * C'tor.
     * @param filterCriteria
     */
    constructor(private filterCriteria: string) {
        super();
    }

    /**
     * Called when a message trait def is visited.
     * @param node
     */
    visitMessageTraitDefinition(node: AaiMessageTraitDefinition): void {
        if (this.acceptThroughFilter(node.getName())) {
            this.messageTraitDefinitions.push(node);
        }
    }

    /**
     * Sorts and returns the message trait defs.
     */
    public getSortedMessageTraitDefinitions(): AaiMessageTraitDefinition[] {
        return this.messageTraitDefinitions.sort( (messageTraitDefinition1, messageTraitDefinition2) => {
            return messageTraitDefinition1.getName().localeCompare(messageTraitDefinition2.getName());
        });
    }

    /**
     * Figures out the definition name regardless of the version of the model.
     * @param definition
     */
    public static definitionName(definition: AaiMessageTraitDefinition): string {
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
