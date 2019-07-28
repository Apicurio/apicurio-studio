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

import {Component, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

import {ApisService} from "../../services/apis.service";
import {Api} from "../../models/api.model";
import {ArrayUtils} from "../../util/common";
import {AbstractPageComponent} from "../../components/page-base.component";
import {Title} from "@angular/platform-browser";
import {CommandFactory, ICommand, MarshallCompat} from "apicurio-data-models";


const API_FILTERS_KEY = "apicurio.studio.pages.apis.filters";


class Filters {
    nameFilter: string;
    sortDirection: string;
    layout: string;

    constructor(params?: any) {
        this.reset();
        if (params) {
            for (let key in params) {
                let value: string = params[key];
                this[key] = value;
            }
        }
    }

    public accepts(api: Api): boolean {
        let name: string = api.name.toLocaleLowerCase();
        let namef: string = this.nameFilter.toLocaleLowerCase();
        if (name.indexOf(namef) >= 0) {
            return true;
        }
        if (api.tags && api.tags.length > 0) {
            return api.tags.map(tag => {
                return tag.toLocaleLowerCase() == namef;
            }).reduce( (v1, v2) => {
                return v1 || v2;
            });
        }
        return false;
    }

    public reset(): void {
        this.nameFilter = "";
        this.sortDirection = "ASC";
        this.layout = "card";
    }
}


@Component({
    moduleId: module.id,
    selector: "apis-page",
    templateUrl: "apis.page.html",
    styleUrls: ["apis.page.css"]
})
export class ApisPageComponent extends AbstractPageComponent implements OnDestroy {

    public allApis: Api[] = [];
    public filteredApis: Api[];
    public selectedApis: Api[];
    public filters: Filters = new Filters();

    public numApisToDelete: number = 0;

    /**
     * C'tor.
     * @param apis
     * @param route
     * @param titleService
     */
    constructor(private apis: ApisService, route: ActivatedRoute, titleService: Title) {
        super(route, titleService);
        this.filteredApis = [];
        this.selectedApis = [];

        let fsaved: string = sessionStorage.getItem(API_FILTERS_KEY);
        if (fsaved) {
            this.filters = new Filters(JSON.parse(fsaved));
        }
    }

    /**
     * The page title.
     * 
     */
    protected pageTitle(): string {
        return "Apicurio Studio - API Listing";
    }

    /**
     * Called to asynchronously load data needed by the page.
     */
    public loadAsyncPageData(): void {
        console.log("[ApisPageComponent] loadAsyncPageData")
        this.apis.getApis().then( apis => {
            this.allApis = apis;
            this.filterApis();
            this.loaded("apis");
        }).catch( error => {
            console.error("[ApisPageComponent] Error fetching API list.");
            this.error(error);
        });
    }

    ngOnDestroy(): void {
        sessionStorage.setItem(API_FILTERS_KEY, JSON.stringify(this.filters));
    }

    /**
     * Filters and sorts the list of apis based on the user's
     */
    private filterApis(): Api[] {
        // Clear the array first.
        this.filteredApis.splice(0, this.filteredApis.length);
        for (let api of this.allApis) {
            if (this.filters.accepts(api)) {
                this.filteredApis.push(api);
            }
        }
        this.filteredApis.sort( (a1:Api, a2:Api) => {
            let rval: number = a1.name.localeCompare(a2.name);
            if (this.filters.sortDirection === "DESC") {
                rval *= -1;
            }
            return rval;
        });

        this.selectedApis = ArrayUtils.intersect(this.selectedApis, this.filteredApis);

        return this.filteredApis;
    }

    public isFiltered(): boolean {
        return this.allApis.length !== this.filteredApis.length;
    }

    public toggleSortDirection(): void {
        if (this.filters.sortDirection === "ASC") {
            this.filters.sortDirection = "DESC";
        } else {
            this.filters.sortDirection = "ASC";
        }
        this.filterApis();
    }

    public clearFilters(): void {
        this.filters.nameFilter = "";
        this.filterApis();
    }

    public onSelected(api: Api): void {
        this.selectedApis.push(api);
    }

    public onDeselected(api: Api): void {
        this.selectedApis.splice(this.selectedApis.indexOf(api), 1);
    }

    public onTagSelected(tag: string): void {
        this.filters.nameFilter = tag;
        this.filterApis();
    }

    /**
     * Called to delete all selected APIs.
     */
    public deleteApis(): void {
        // Note: we can only delete selected items that we can see in the UI.
        let itemsToDelete: Api[] = ArrayUtils.intersect(this.selectedApis, this.filteredApis);
        console.log("[ApisPageComponent] Deleting %s selected APIs.", itemsToDelete.length);
        this.numApisToDelete = itemsToDelete.length;

        this.selectedApis = [];
        this.deleteNextApi(itemsToDelete, 0);
    }

    private deleteNextApi(apisToDelete: Api[], fromIdx: number): void {
        if (fromIdx >= apisToDelete.length) {
            return;
        }
        let api: Api = apisToDelete[fromIdx];
        this.apis.deleteApi(api).then( () => {
            this.removeApiFromList(api);
            this.filterApis();
            this.numApisToDelete--;
            console.info("Deleted API with id: %s - Number of APIs remaining to delete: %d", api.id, this.numApisToDelete);
            this.deleteNextApi(apisToDelete, fromIdx + 1);
        }).catch( error => {
            console.error("[ApisPageComponent] Error deleting an API with ID %s", api.id);
            this.error(error);
        });

    }

    public setListLayout(): void {
        this.filters.layout = "list";
    }

    public setCardLayout(): void {
        this.filters.layout = "card";
    }

    public onReset(): void {
        this.filters.reset();
    }

    private removeApiFromList(api: Api) {
        this.allApis.splice(this.allApis.indexOf(api), 1);
    }
}
