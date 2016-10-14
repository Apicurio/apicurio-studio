import {Component, OnInit, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {IApisService} from "../../services/apis.service";
import {Api} from "../../models/api.model";
import {ApiCollaborators} from "../../models/api-collaborators";

@Component({
    moduleId: module.id,
    selector: 'api-detail-page',
    templateUrl: 'api-detail.page.html',
    styleUrls: ['api-detail.page.css']
})
export class ApiDetailPageComponent implements OnInit {

    public api: Api;
    public collaborators: ApiCollaborators;

    public dataLoaded: Map<string, boolean> = new Map<string, boolean>();

    /**
     * Constructor.
     * @param route
     * @param apis
     */
    constructor(private route: ActivatedRoute, @Inject(IApisService) private apis: IApisService) {
        this.api = new Api();
    }

    public ngOnInit(): void {
        this.route.data.subscribe( value => {
            this.api = value["api"];
            console.info("[ApiDetailPageComponent] API from resolve: %o", this.api);
            this.loadAsyncPageData();
        });
    }

    /**
     * Called to kick off loading the page's async data.
     */
    public loadAsyncPageData(): void {
        console.info("[ApiDetailPageComponent] Loading async page data");
        this.apis.getCollaborators(this.api.id).then( collaborators => {
            console.info("[ApiDetailPageComponent] Collaborators data loaded: %o", collaborators);
            this.collaborators = collaborators;
            this.dataLoaded["collaborators"] = true;
        } );
    }

}
