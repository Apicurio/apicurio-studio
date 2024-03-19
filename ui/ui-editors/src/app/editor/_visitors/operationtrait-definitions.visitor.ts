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
import {CombinedVisitorAdapter, AaiOperationTraitDefinition} from "@apicurio/data-models";

/**
 * Visitor used to find operation trait definitions.
 */
export class FindOperationTraitDefinitionsVisitor extends CombinedVisitorAdapter {

    public operationTraitDefinitions: AaiOperationTraitDefinition[] = [];

    /**
     * C'tor.
     * @param filterCriteria
     */
    constructor(private filterCriteria: string) {
        super();
    }

    /**
     * Called when a operation trait def is visited.
     * @param node
     */
    visitOperationTraitDefinition(node: AaiOperationTraitDefinition): void {
        if (this.acceptThroughFilter(node.getName())) {
            this.operationTraitDefinitions.push(node);
        }
    }

    /**
     * Sorts and returns the operation trait defs.
     */
    public getSortedOperationTraitDefinitions(): AaiOperationTraitDefinition[] {
        return this.operationTraitDefinitions.sort( (operationTraitDefinition1, operationTraitDefinition2) => {
            return operationTraitDefinition1.getName().localeCompare(operationTraitDefinition2.getName());
        });
    }

    /**
     * Figures out the definition name regardless of the version of the model.
     * @param definition
     */
    public static definitionName(definition: AaiOperationTraitDefinition): string {
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
