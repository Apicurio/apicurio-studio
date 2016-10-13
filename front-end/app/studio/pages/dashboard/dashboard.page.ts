import {Component, OnInit, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

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

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.data.subscribe( value => {
            this.recentApis = value["recentApis"];
        });
    }
}
