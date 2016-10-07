import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {IApisService} from "../../services/apis.service";

@Component({
    moduleId: module.id,
    selector: 'apis-page',
    templateUrl: 'apis.page.html',
    styleUrls: ['apis.page.css']
})
export class ApisPageComponent implements OnInit {

    constructor(
        private router: Router,
        @Inject(IApisService) private apis: IApisService) {
    }

    ngOnInit(): void {
    }

}
