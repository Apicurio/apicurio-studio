/**
 * @license
 * Copyright 2020 JBoss Inc
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
import {CombinedVisitorAdapter, AaiCorrelationId} from "@apicurio/data-models";

/**
 * Visitor used to find message trait definitions.
 */
export class FindCorrelationIdDefinitionsVisitor extends CombinedVisitorAdapter {

    public correlationIdDefinitions: AaiCorrelationId[] = [];

    /**
     * C'tor.
     * @param filterCriteria
     */
    constructor(private filterCriteria: string) {
        super();
    }

    /**
     * Called when a correlation id def is visited.
     * @param node
     */
    visitCorrelationId(node: AaiCorrelationId): void {
        if (this.acceptThroughFilter(node.getName())) {
            this.correlationIdDefinitions.push(node);
        }
    }

    /**
     * Sorts and returns the correlation id defs.
     */
    public getSortedCorrelationIdDefinitions(): AaiCorrelationId[] {
        return this.correlationIdDefinitions.sort( (correlationIdDefinition1, correlationIdDefinition2) => {
            return correlationIdDefinition1.getName().localeCompare(correlationIdDefinition2.getName());
        });
    }

    /**
     * Figures out the definition name regardless of the version of the model.
     * @param definition
     */
    public static definitionName(definition: AaiCorrelationId): string {
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