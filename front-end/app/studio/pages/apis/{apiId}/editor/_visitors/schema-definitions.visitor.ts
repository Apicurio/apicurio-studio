/**
 * @license
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
import {Oas20SchemaDefinition, Oas30SchemaDefinition, OasPathItem} from "oai-ts-core";
import {AbstractCombinedVisitorAdapter} from "./base.visitor";

/**
 * Visitor used to find schema definitions.
 */
export class FindSchemaDefinitionsVisitor extends AbstractCombinedVisitorAdapter {

    schemaDefinitions: (Oas20SchemaDefinition|Oas30SchemaDefinition)[] = [];

    /**
     * C'tor.
     * @param {string} filterCriteria
     */
    constructor(private filterCriteria: string) {
        super();
    }

    /**
     * Called when a schema definition is visited.
     * @param {Oas20SchemaDefinition | Oas30SchemaDefinition} node
     */
    visitSchemaDefinition(node: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
        let name: string = FindSchemaDefinitionsVisitor.definitionName(node);
        if (this.acceptThroughFilter(name)) {
            this.schemaDefinitions.push(node);
        }
    }

    /**
     * Sorts and returns the path items.
     */
    public getSortedSchemaDefinitions() {
        return this.schemaDefinitions.sort( (def1, def2) => {
            let name1: string = FindSchemaDefinitionsVisitor.definitionName(def1);
            let name2: string = FindSchemaDefinitionsVisitor.definitionName(def2);
            return name1.localeCompare(name2);
        });
    }

    /**
     * Figures out the definition name regardless of the version of the model.
     * @param {Oas20SchemaDefinition | Oas30SchemaDefinition} definition
     * @return {string}
     */
    public static definitionName(definition: Oas20SchemaDefinition|Oas30SchemaDefinition): string {
        let name: string;
        if (definition['definitionName']) {
            name = (definition as Oas20SchemaDefinition).definitionName();
        } else {
            name = (definition as Oas30SchemaDefinition).name();
        }
        return name;
    }

    /**
     * Returns true if the given name is accepted by the current filter criteria.
     * @param name
     * @return {boolean}
     */
    private acceptThroughFilter(name: string): boolean {
        //console.info("Accepting: %s through filter: %s", name, this.filterCriteria);
        if (this.filterCriteria === null) {
            return true;
        }
        return name.toLowerCase().indexOf(this.filterCriteria) != -1;
    }

}