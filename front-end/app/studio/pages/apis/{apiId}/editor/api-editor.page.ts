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

import {Component, OnInit, Inject, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiDefinition} from "../../../../models/api.model";
import {IApisService} from "../../../../services/apis.service";
import {ApiEditorComponent} from "./editor.component";

@Component({
    moduleId: module.id,
    selector: "api-editor-page",
    templateUrl: "api-editor.page.html",
    styleUrls: ["api-editor.page.css"]
})
export class ApiEditorPageComponent implements OnInit {

    public apiDefinition: ApiDefinition;

    protected isDirty: boolean = false;
    protected isSaving: boolean = false;

    @ViewChild("apiEditor") apiEditor: ApiEditorComponent;

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

    /**
     * Called when the API editor indicates a change in "dirtiness".
     * @param dirty
     */
    public onEditorDirty(dirty: boolean): void {
        this.isDirty = dirty;
    }

    /**
     * Called when the user chooses to save the editor changes back to their source repository (e.g. commit
     * to GitHub).
     */
    public saveChange(saveInfo: any): void {
        console.info("[ApiEditorPageComponent] Saving editor changes!");
        this.isSaving = true;
        let apiDef: ApiDefinition = this.apiEditor.getUpdatedApiDefinition();
        this.apis.updateApiDefinition(apiDef, saveInfo.summary, saveInfo.description).then(definition => {
            this.apiEditor.reset();
            this.apiDefinition = definition;
            this.isSaving = false;
        }).catch( error => {
            // TODO do something interesting with this error!
        });
    }

}
