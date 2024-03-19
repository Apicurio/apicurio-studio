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
import {CombinedVisitorAdapter, Oas20ResponseDefinition, Oas30ResponseDefinition} from "@apicurio/data-models";

/**
 * Visitor used to find schema definitions.
 */
export class FindResponseDefinitionsVisitor extends CombinedVisitorAdapter {

    responseDefinitions: (Oas20ResponseDefinition|Oas30ResponseDefinition)[] = [];

    /**
     * C'tor.
     * @param filterCriteria
     */
    constructor(private filterCriteria: string) {
        super();
    }

    /**
     * Called when a schema definition is visited.
     * @param node
     */
    visitResponseDefinition(node: Oas20ResponseDefinition | Oas30ResponseDefinition): void {
        let name: string = FindResponseDefinitionsVisitor.definitionName(node);
        if (this.acceptThroughFilter(name)) {
            this.responseDefinitions.push(node);
        }
    }

    /**
     * Sorts and returns the path items.
     */
    public getSortedResponseDefinitions(): (Oas20ResponseDefinition | Oas30ResponseDefinition)[] {
        return this.responseDefinitions.sort( (def1, def2) => {
            let name1: string = FindResponseDefinitionsVisitor.definitionName(def1);
            let name2: string = FindResponseDefinitionsVisitor.definitionName(def2);
            return name1.localeCompare(name2);
        });
    }

    /**
     * Figures out the definition name regardless of the version of the model.
     * @param definition
     */
    public static definitionName(definition: Oas20ResponseDefinition|Oas30ResponseDefinition): string {
        return definition.getName();
    }

    /**
     * Returns true if the given name is accepted by the current filter criteria.
     * @param name
     */
    private acceptThroughFilter(name: string): boolean {
        //console.info("Accepting: %s through filter: %s", name, this.filterCriteria);
        if (this.filterCriteria === null) {
            return true;
        }
        return name.toLowerCase().indexOf(this.filterCriteria) != -1;
    }

}
