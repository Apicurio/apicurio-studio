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

import {AfterViewInit, Component, HostListener, Injectable, NgZone, QueryList, ViewChildren} from "@angular/core";
import {ActivatedRoute, CanDeactivate, Router} from "@angular/router";
import {ApiDefinition} from "../../../../models/api.model";
import {ApisService} from "../../../../services/apis.service";
import {AbstractPageComponent} from "../../../../components/page-base.component";
import {Title} from "@angular/platform-browser";
import {ValidationService} from "../../../../services/validation.service";
import {ConfigService} from "../../../../services/config.service";
import {TextEditorComponent} from "./graphql-editor.component";


@Component({
    selector: "api-teditor-page",
    templateUrl: "api-teditor.page.html",
    styleUrls: ["api-teditor.page.css"]
})
export class ApiTextEditorPageComponent extends AbstractPageComponent implements AfterViewInit {

    public apiDefinition: ApiDefinition;

    protected editorAvailable: boolean = false;
    protected isDirty: boolean = false;
    protected isSaving: boolean = false;

    @ViewChildren("apiEditor") _apiEditor: QueryList<TextEditorComponent>;

    /**
     * Constructor.
     * @param router
     * @param route
     * @param zone
     * @param apis
     * @param titleService
     * @param validationService
     * @param config
     */
    constructor(private router: Router, route: ActivatedRoute, private zone: NgZone,
                private apis: ApisService, titleService: Title, private validationService: ValidationService,
                private config: ConfigService) {
        super(route, titleService);
        this.apiDefinition = new ApiDefinition();
    }

    /**
     * The page title.
     */
    protected pageTitle(): string {
        if (this.apiDefinition.name) {
            return "Apicurio Studio - API Editor :: " + this.apiDefinition.name;
        } else {
            return "Apicurio Studio - API Editor";
        }
    }

    /**
     * Called to kick off loading the page's async data.
     * @param params
     */
    public loadAsyncPageData(params: any): void {
        this.editorAvailable = false;

        console.info("[ApiTextEditorPageComponent] Loading async page data");
        let apiId: string = params["apiId"];
        this.apiDefinition.name = apiId;
        this.apiDefinition.id = apiId;

        this.apis.getApiDefinition(apiId).then(api => {
            this.apiDefinition = api;
            this.dataLoaded["api"] = true;
            this.updatePageTitle();
        }).catch(error => {
            console.error("[ApiTextEditorPageComponent] Error getting API");
            this.error(error);
        });
    }

    @HostListener('window:beforeunload', ['$event'])
    public handleBeforeUnload(event: any){
    }

    public ngAfterViewInit(): void {
        this._apiEditor.changes.subscribe( () => {
            if (this._apiEditor.first && !this.editorAvailable) {
                this.editorAvailable = true;
            }
        });
    }

    /**
     * Called when the page is destroyed.
     */
    public ngOnDestroy(): void {
    }

    /**
     * Saves the changes to the document.
     * @param content
     */
    public saveChanges(content: string): void {
        // TODO improve this - we need a spinner for "saving".  we also need to handle errors without losing the changes
        let newDef: ApiDefinition = ApiDefinition.fromApi(this.apiDefinition);
        newDef.spec = content;
        this.apis.updateApi(this.apiDefinition, content).then(() => {
            this.apiDefinition = newDef;
        }).catch(error => {
            this.error(error);
        });
    }

}


/**
 * Guards against the user losing changes to the editor.
 */
@Injectable()
export class ApiTextEditorPageGuard implements CanDeactivate<ApiTextEditorPageComponent> {

    /**
     * Called by angular to determine whether the user is allowed to navigate away from the
     * editor.
     * @param component
     */
    public canDeactivate(component: ApiTextEditorPageComponent): boolean {
        // TODO need a guard to check for "dirty" status of editor
        return true;
    }

}
