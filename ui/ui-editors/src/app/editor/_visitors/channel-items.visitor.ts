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
import {CombinedVisitorAdapter, AaiChannelItem} from "@apicurio/data-models";

/**
 * Visitor used to find path items.
 */
export class FindChannelItemsVisitor extends CombinedVisitorAdapter {

    public channelItems: AaiChannelItem[] = [];

    /**
     * C'tor.
     * @param filterCriteria
     */
    constructor(private filterCriteria: string) {
        super();
    }

    /**
     * Called when a channel item is visited.
     * @param node
     */
    visitChannelItem(node: AaiChannelItem): void {
        if (this.acceptThroughFilter(node.getName())) {
            this.channelItems.push(node);
        }
    }

    /**
     * Sorts and returns the channel items.
     */
    public getSortedChannelItems(): AaiChannelItem[] {
        return this.channelItems.sort( (channelItem1, channelItem2) => {
            return channelItem1.getName().localeCompare(channelItem2.getName());
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
