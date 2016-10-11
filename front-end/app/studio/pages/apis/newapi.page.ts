import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {IApisService, ApiRepositoryType} from "../../services/apis.service";

@Component({
    moduleId: module.id,
    selector: 'newapi-page',
    templateUrl: 'newapi.page.html',
    styleUrls: ['newapi.page.css']
})
export class NewApiPageComponent implements OnInit {

    repositoryTypes: ApiRepositoryType[];

    constructor(
            private router: Router,
            @Inject(IApisService) private apis: IApisService) {
    }

    ngOnInit(): void {
        console.log("[DashboardPageComponent] onInit")
        this.repositoryTypes = this.apis.getSupportedRepositoryTypes();
    }

}
