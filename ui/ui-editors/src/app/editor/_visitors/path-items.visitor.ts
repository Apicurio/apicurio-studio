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
import {CombinedVisitorAdapter, OasPathItem} from "@apicurio/data-models";

/**
 * Visitor used to find path items.
 */
export class FindPathItemsVisitor extends CombinedVisitorAdapter {

    public pathItems: OasPathItem[] = [];

    /**
     * C'tor.
     * @param filterCriteria
     */
    constructor(private filterCriteria: string) {
        super();
    }

    /**
     * Called when a path item is visited.
     * @param node
     */
    visitPathItem(node: OasPathItem): void {
        if (this.acceptThroughFilter(node.getPath())) {
            this.pathItems.push(node);
        }
    }

    /**
     * Sorts and returns the path items.
     */
    public getSortedPathItems(): OasPathItem[] {
        return this.pathItems.sort( (pathItem1, pathItem2) => {
            return pathItem1.getPath().localeCompare(pathItem2.getPath());
        });
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
