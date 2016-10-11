import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {IApisService} from "../../services/apis.service";
import {Api} from "../../models/api.model";

/**
 * The Dashboard Page component - models the logical root path of the application.
 */
@Component({
    moduleId: module.id,
    selector: 'dashboard-page',
    templateUrl: 'dashboard.page.html',
    styleUrls: ['dashboard.page.css']
})
export class DashboardPageComponent implements OnInit {

    recentApis: Api[];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        @Inject(IApisService) private apis: IApisService) {
    }

    ngOnInit(): void {
        console.log("[DashboardPageComponent] onInit: " + JSON.stringify(this.route.data));
        this.route.data.subscribe( value => {
            this.recentApis = value["recentApis"];
        })
    }
}
