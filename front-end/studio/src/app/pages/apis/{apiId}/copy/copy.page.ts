/**
 * @license
 * Copyright 2018 JBoss Inc
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

import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {ApiDefinition} from "../../../../models/api.model";
import {AbstractPageComponent} from "../../../../components/page-base.component";
import {Title} from "@angular/platform-browser";
import {ApisService} from "../../../../services/apis.service";
import {ImportApi} from "../../../../models/import-api.model";
import {CommandFactory, Document, DocumentType, Library, Oas20Document, Oas30Document} from "@apicurio/data-models";
import {Base64} from "js-base64";

@Component({
    selector: "copy-page",
    templateUrl: "copy.page.html",
    styleUrls: ["copy.page.css"]
})
export class CopyPageComponent extends AbstractPageComponent {

    public api: ApiDefinition;
    public document: Document;

    public title: string;
    public convertApi: boolean;

    public copying: boolean = false;
    public copied: boolean = false;

    /**
     * Constructor.
     * @param router
     * @param route
     * @param apis
     * @param titleService
     */
    constructor(private router: Router, route: ActivatedRoute, private apis: ApisService, protected titleService: Title) {
        super(route, titleService);
        this.api = new ApiDefinition();
        this.api.name = "API";
    }

    /**
     * The page title.
     */
    protected pageTitle(): string {
        if (this.api.name) {
            return "Apicurio Studio - Copy API :: " + this.api.name;
        } else {
            return "Apicurio Studio - Copy API";
        }
    }

    /**
     * Called to kick off loading the page's async data.
     * @param params
     */
    public loadAsyncPageData(params: any): void {
        console.info("[CopyPageComponent] Loading async page data");
        let apiId: string = params["apiId"];
        this.apis.getApiDefinition(apiId).then(api => {
            this.api = api;
            if (typeof this.api.spec == "string") {
                this.document = Library.readDocumentFromJSONString(this.api.spec);
            } else {
                this.document = Library.readDocument(this.api.spec);
            }
            this.title = this.generateApiTitle();
            this.dataLoaded["api"] = true;
            this.updatePageTitle();
        }).catch(error => {
            console.error("[CopyPageComponent] Error getting API def");
            this.error(error);
        });
    }

    public isDataLoaded(): boolean {
        return this.isLoaded("api");
    }

    public is2xDocument(): boolean {
        return this.document.getDocumentType() == DocumentType.openapi2;
    }

    public copyApi(): void {
        if (!this.isValid()) {
            return;
        }

        this.copying = true;

        let importApi: ImportApi = new ImportApi();
        importApi.data = this.cloneApi();

        this.apis.importApi(importApi).then(importedApi => {
            let link: string[] = [ "/apis", importedApi.id ];
            console.info("[CopyPageComponent] Navigating to: %o", link);
            this.router.navigate(link);
        }).catch( error => {
            console.error("[CopyPageComponent] Error importing API: %o", error);
            this.copying = false;
            this.error(error);
        });
    }

    public isValid(): boolean {
        return this.document && this.title && this.title.length > 0;
    }

    /**
     * Clones the API and returns a serialized and base64'd copy of the content.
     */
    public cloneApi(): string {
        let sourceDoc: Document = this.document;
        CommandFactory.createChangeTitleCommand(this.title).execute(sourceDoc);
        if (sourceDoc.getDocumentType() == DocumentType.openapi2 && this.convertApi) {
            console.info("[CopyPageComponent] Converting API from 2.0 to 3.0.x!");
            sourceDoc = this.transformDocument(sourceDoc as Oas20Document);
        }
        let sourceJs: any = Library.writeNode(sourceDoc);
        let sourceStr: string = JSON.stringify(sourceJs);
        let sourceB64: string = Base64.encode(sourceStr);
        return sourceB64;
    }

    /**
     * @param from
     */
    public transformDocument(from: Oas20Document): Oas30Document {
        return Library.transformDocument(from);
    }

    public generateApiTitle(): string {
        if (this.document && this.document.info && this.document.info.title) {
            return "Copy of " + this.document.info.title;
        }
        return "";
    }

}
