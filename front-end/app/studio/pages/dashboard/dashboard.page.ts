import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {IApisService} from "../../services/apis.service";

@Component({
    moduleId: module.id,
    selector: 'dashboard-page',
    templateUrl: 'dashboard.page.html',
    styleUrls: ['dashboard.page.css']
})
export class DashboardComponent implements OnInit {

    constructor(
        private router: Router,
        @Inject(IApisService) private apis: IApisService) {
    }

    ngOnInit(): void {
        console.log("Router: " + this.router);
        console.log("APIs: " + this.apis);
    }

}
