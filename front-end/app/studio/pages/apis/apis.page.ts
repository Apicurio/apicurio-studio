import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';

import {IApisService} from "../../services/apis.service";
import {Api} from "../../models/api.model";


const API_FILTERS_KEY = "apiman.studio.pages.apis.filters";


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

    public accepts(api:Api): boolean {
        let name: string = api.name.toLocaleLowerCase();
        let namef: string = this.nameFilter.toLocaleLowerCase();
        return name.indexOf(namef) >= 0;
    }

    public reset(): void {
        this.nameFilter = "";
        this.sortDirection = "ASC";
        this.layout = "card";
    }
}


@Component({
    moduleId: module.id,
    selector: 'apis-page',
    templateUrl: 'apis.page.html',
    styleUrls: ['apis.page.css']
})
export class ApisPageComponent implements OnInit, OnDestroy {

    private allApis: Api[];
    private filteredApis: Api[];
    private selectedApis: Api[];
    private filters: Filters = new Filters();

    constructor(@Inject(IApisService) private apis: IApisService) {
        this.filteredApis = [];
        this.selectedApis = [];
    }

    ngOnInit(): void {
        console.log("[DashboardPageComponent] onInit")
        let fsaved: string = sessionStorage.getItem(API_FILTERS_KEY);
        if (fsaved) {
            this.filters = new Filters(JSON.parse(fsaved));
        }
        this.apis.getAllApis().subscribe( apis => {
            this.allApis = apis;
            this.filterApis();
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
        return this.filteredApis;
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

    public onSelected(sapis: Api[]): void {
        console.info("Caught the onApisSelected event!  Data: %o", sapis);
        this.selectedApis = sapis;
    }

    public onDelete(): void {
        alert("Not yet implemented!");
        // TODO implement this - NOTE: get the intersection of "filterApis" and "selectedApis" to determine the list of items to operate on
    }

    public onListLayout(): void {
        this.filters.layout = 'list';
    }

    public onCardLayout(): void {
        this.filters.layout = 'card';
    }

    public onReset(): void {
        this.filters.reset();
    }

}
