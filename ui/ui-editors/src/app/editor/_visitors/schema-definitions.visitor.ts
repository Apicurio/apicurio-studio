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
import {Oas20SchemaDefinition, Oas30SchemaDefinition, Aai20SchemaDefinition, CombinedVisitorAdapter} from "@apicurio/data-models";

/**
 * Visitor used to find schema definitions.
 */
export class FindSchemaDefinitionsVisitor extends CombinedVisitorAdapter {

    schemaDefinitions: (Oas20SchemaDefinition|Oas30SchemaDefinition)[] = [];

    /**
     * C'tor.
     * @param filterCriteria
     */
    constructor(private filterCriteria: string|((node:Oas20SchemaDefinition|Oas30SchemaDefinition) => boolean)) {
        super();
    }

    /**
     * Called when a schema definition is visited.
     * @param node
     */
    visitSchemaDefinition(node: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
        if (this.acceptThroughFilter(node)) {
            this.schemaDefinitions.push(node);
        }
    }

    /**
     * Sorts and returns the path items.
     */
    public getSortedSchemaDefinitions(): (Oas20SchemaDefinition | Oas30SchemaDefinition)[] {
        return this.schemaDefinitions.sort( (def1, def2) => {
            let name1: string = FindSchemaDefinitionsVisitor.definitionName(def1);
            let name2: string = FindSchemaDefinitionsVisitor.definitionName(def2);
            return name1.localeCompare(name2);
        });
    }

    /**
     * Figures out the definition name regardless of the version of the model.
     * @param definition
     */
    public static definitionName(definition: Oas20SchemaDefinition|Oas30SchemaDefinition): string {
        return definition.getName();
    }

    /**
     * Returns true if the given node is accepted by the current filter criteria.
     * @param node
     */
    private acceptThroughFilter(node: Oas20SchemaDefinition | Oas30SchemaDefinition): boolean {
        //console.info("Accepting: %s through filter: %s", name, this.filterCriteria);
        if (this.filterCriteria === null) {
            return true;
        }
        const name: string = node.getName();
        if (typeof this.filterCriteria == "string") {
            return name.toLowerCase().indexOf(this.filterCriteria) != -1;
        } else {
            return this.filterCriteria(node);
        }
    }

}

export class FindAaiSchemaDefinitionsVisitor extends CombinedVisitorAdapter {

    schemaDefinitions: Aai20SchemaDefinition[] = [];

    /**
     * C'tor.
     * @param filterCriteria can be a string or a function callback
     */
    constructor(private filterCriteria: string|((node:Aai20SchemaDefinition) => boolean)) {
        super();
    }

    /**
     * Called when a schema definition is visited.
     * @param node
     */
    visitSchemaDefinition(node: Aai20SchemaDefinition): void {
        if (this.acceptThroughFilter(node)) {
            this.schemaDefinitions.push(node);
        }
    }

    /**
     * Sorts and returns the path items.
     */
    public getSortedSchemaDefinitions(): Aai20SchemaDefinition[] {
        return this.schemaDefinitions.sort( (def1, def2) => {
            let name1: string = FindAaiSchemaDefinitionsVisitor.definitionName(def1);
            let name2: string = FindAaiSchemaDefinitionsVisitor.definitionName(def2);
            return name1.localeCompare(name2);
        });
    }

    /**
     * Figures out the definition name regardless of the version of the model.
     * @param definition
     */
    public static definitionName(definition: Aai20SchemaDefinition): string {
        return definition.getName();
    }

    /**
     * Returns true if the given node is accepted by the current filter criteria.
     * @param node
     */
    private acceptThroughFilter(node: Aai20SchemaDefinition): boolean {
        //console.info("Accepting: %s through filter: %s", name, this.filterCriteria);
        if (this.filterCriteria === null) {
            return true;
        }
        const name: string = node.getName();
        if (typeof this.filterCriteria == "string") {
            return name.toLowerCase().indexOf(this.filterCriteria) != -1;
        } else {
            return this.filterCriteria(node);
        }
    }

}
