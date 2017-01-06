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

import {Component, OnInit, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiDefinition} from "../../../../models/api.model";
import {IApisService} from "../../../../services/apis.service";

@Component({
    moduleId: module.id,
    selector: 'api-editor-page',
    templateUrl: 'api-editor.page.html',
    styleUrls: ['api-editor.page.css']
})
export class ApiEditorPageComponent implements OnInit {

    public apiDefinition: ApiDefinition;

    public dataLoaded: Map<string, boolean> = new Map<string, boolean>();

    /**
     * Constructor.
     * @param router
     * @param route
     * @param apis
     */
    constructor(private router: Router,
                private route: ActivatedRoute,
                @Inject(IApisService) private apis: IApisService) {
        this.apiDefinition = new ApiDefinition();
    }

    public ngOnInit(): void {
        this.route.data.subscribe( value => {
            this.apiDefinition = value["apiDefinition"];
            console.info("[ApiEditorPageComponent] API definition resolved successfully.");
        });
    }

}
