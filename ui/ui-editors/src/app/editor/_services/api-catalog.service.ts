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

import {Injectable} from "@angular/core";
import {Topic} from "apicurio-ts-core";
import {CombinedAllNodeVisitor, Document, Library, Node, TraverserDirection} from "@apicurio/data-models";
import * as YAML from 'js-yaml';


/**
 * A service to manage a collection of APIs that should be loaded to accommodate various bits
 * of functionality, but primarily to assist with resolving external references.  This service
 * itself does not resolve external resources, but requires a helper for that.
 *
 * TODO also maintain a list of errors - populated when we fail to resolve a resource URL (and why)
 */
@Injectable()
export class ApiCatalogService {

    private apiCache: any; // a map of string to resolved API as js object data
    private readonly changeTopic: Topic<any>;
    private fetchCounter: number = 0;
    private fetcher: (externalReference: string) => Promise<any>;

    /**
     * Constructor.
     */
    constructor() {
        this.apiCache = {};
        this.changeTopic = new Topic();
    }

    /**
     * Sets the fetcher for the service.
     * @param fetcher
     */
    public setFetcher(fetcher: (externalReference: string) => Promise<any>): void {
        this.fetcher = fetcher;
    }

    /**
     * Called to refresh the API cache.  This will remove any cached APIs that are not needed by
     * the given document.
     * @param document
     */
    private refresh(document: Document): void {
        let changesMade: boolean = false;
        this.fetchCounter = 0;

        // Save the old API cache and make a new, empty one
        let oldCache: any = this.apiCache;
        this.apiCache = {};

        // Get all external refs from the document
        let allRefs: string[] = this.getAllRefs(document);
        console.debug("[ApiCatalogService] All external references from document: ", allRefs);

        // For each external ref, check to see if the old cache already had it.  If so, copy it to the new cache.
        // If the old cache DIDN'T have it, then fetch it.
        let newRefs: string[] = [];
        allRefs.forEach(externalRef => {
            if (oldCache[externalRef]) {
                console.debug("[ApiCatalogService] Retaining cached reference to: ", externalRef);
                this.apiCache[externalRef] = oldCache[externalRef]
                delete oldCache[externalRef];
            } else {
                changesMade = true;
                newRefs.push(externalRef);
                this.fetchCounter++;
                // Reserve a spot in the cache for this.
                this.apiCache[externalRef] = null;
            }
        });
        newRefs.forEach( ref => this.fetchAndCache(ref) );

        // If anything remains in oldCache then set changesMade=true (means that something was removed).
        if (Object.keys(oldCache).length > 0) {
            changesMade = true;
        }

        // If there are any refs remaining in the old cache, then we've made changes to the cache and
        // should fire that as an event to anyone listening.
        if (changesMade && this.fetchCounter == 0) {
            console.debug("[ApiCatalogService] Catalog changes detected, firing event.");
            this.changeTopic.send(this.apiCache);
        }
    }

    /**
     * Called to reset the API cache.  This will remove any cached APIs that are not needed by
     * the given document.
     * @param document
     */
    public reset(document: Document): void {
        console.info("[ApiCatalogService] Resetting the API catalog.");
        this.refresh(document);
    }

    /**
     * Called when the document changes in any way.  When that happens, we need to detect whether any new
     * external references have been added.  If so, we need to fetch them and update the cache.
     * @param document
     */
    public update(document: Document): void {
        console.info("[ApiCatalogService] Updating the API catalog.");
        this.refresh(document);
    }

    /**
     * Return the topic that consumers can use to listen when the contents of the api cache changes.
     */
    public changes(): Topic<any> {
        return this.changeTopic;
    }

    /**
     * Finds all the $refs anywhere in the given document.
     * @param document
     */
    private getAllRefs(document: Document): string[] {
        let refFinder: ReferenceFinder = new ReferenceFinder();
        Library.visitTree(document, refFinder, TraverserDirection.down);
        return refFinder.externalRefs();
    }

    /**
     * Fetches the given external reference (asynchronously) and caches the result if appropriate.
     * @param externalRef
     */
    private fetchAndCache(externalRef: string): void {
        console.info("[ApiCatalogService] Fetching external resource at: ", externalRef);
        // Use the fetcher to fetch the content (if we have one).
        if (this.fetcher) {
            this.fetcher(externalRef).then( content => {
                console.debug("[ApiCatalogService] Successfully fetched external content:");
                content = this.parseContent(content);
                this.cacheContent(externalRef, content);
            }).catch(error => {
                console.error("[ApiCatalogService] Error fetching external content.");
                console.error(error);
                this.cacheContent(externalRef, null);
            });
        } else {
            console.warn("[ApiCatalogService] Fetcher not installed.");
            this.cacheContent(externalRef, null);
        }
    }

    /**
     * Parses the given response body into a JS object.  This should support both JSON and YAML content.  If
     * parsing fails we should log an error and return null.  That will indicate to any consumers of the
     * cache that there *should* be an entry for the content but that the content failed to be fetched.
     * @param body
     */
    private parseContent(body: any): any {
        console.debug("[ApiCatalogService] Parsing external resource content.");
        if (typeof body === "object") {
            return body;
        }
        try { return JSON.parse(body); } catch (e) {}
        try { return YAML.safeLoad(body); } catch (e) {}
        // TODO debug or warning here
        return null;
    }

    /**
     * Extracts the design id from the given external ref of the form: apicurio:173827
     * @param externalRef
     */
    private toDesignId(externalRef: string): string {
        return externalRef.substring(externalRef.indexOf(":") + 1);
    }

    /**
     * Caches the given JS object content.  Also potentially fires a "changed" event.
     * @param content
     */
    private cacheContent(externalRef: string, content: any): any {
        console.info("[ApiCatalogService] Caching content for external URL: ", externalRef);
        this.apiCache[externalRef] = content;
        this.fetchCounter--;
        console.debug("[ApiCatalogService] Fetch counter is now: ", this.fetchCounter);
        // If the expected fetch counter is 0, we can fire an event that the cache has changed.
        // We could do this for every successful fetch, but we'd be potentially getting a lot of
        // events that consumers don't care about.
        if (this.fetchCounter === 0) {
            console.debug("[ApiCatalogService] Firing 'change' event.");
            this.changeTopic.send(this.apiCache);
        }
    }

    /**
     * Called to lookup a resource stored in the catalog.  Returns a JS object if one is found or null
     * if not found.
     * @param resourceUrl
     */
    public lookup(resourceUrl: string) {
        let rval: any = this.apiCache[resourceUrl];
        if (rval) {
            return rval;
        } else {
            return null;
        }
    }
}

/**
 * Visitor used to find all references in a document.
 * TODO consolidate this functionality in apicurio-data-models
 * TODO possibly use the Reference class in apicurio-data-models instead of using strings
 */
class ReferenceFinder extends CombinedAllNodeVisitor {

    public allRefs: any = {};

    public visitNode(node: Node): void {
        if (node["$ref"]) {
            let $ref: string = node["$ref"];
            if (this.isExternal($ref)) {
                let resourceUrl: string = this.toResourceUrl($ref);
                this.allRefs[resourceUrl] = true;
            }
        }
    }

    public externalRefs(): string[] {
        return Object.keys(this.allRefs);
    }

    private isExternal($ref: string): boolean {
        return $ref != null && $ref.indexOf("#") != 0;
    }

    private toResourceUrl($ref: string): string {
        let idx: number = $ref.indexOf("#");
        if (idx === -1) {
            return $ref;
        } else {
            return $ref.substring(0, idx);
        }
    }

}
