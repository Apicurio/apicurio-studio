import {Component, OnInit, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {IApisService} from "../../services/apis.service";
import {Api} from "../../models/api.model";

@Component({
    moduleId: module.id,
    selector: 'api-detail-page',
    templateUrl: 'api-detail.page.html',
    styleUrls: ['api-detail.page.css']
})
export class ApiDetailPageComponent implements OnInit {

    public api: Api;

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
        });
    }

}
