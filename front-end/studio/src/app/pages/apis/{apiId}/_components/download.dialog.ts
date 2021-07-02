/**
 * @license
 * Copyright 2020 JBoss Inc
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

import {Component, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap/modal";
import {ApisService} from "../../../../services/apis.service";
import {ClipboardService} from "ngx-clipboard";
import {ConfigService} from "../../../../services/config.service";
import {Api} from "../../../../models/api.model";
import {DropDownOption, DropDownOptionValue} from "../../../../components/common/drop-down.component";


@Component({
    selector: "download-dialog",
    templateUrl: "download.dialog.html",
    styleUrls: [ "download.dialog.css" ]
})
export class DownloadDialogComponent {

    @ViewChildren("downloadModal") downloadModal: QueryList<ModalDirective>;

    protected _isOpen: boolean = false;
    api: Api;
    uiUrl: string = "";
    format: string = "json";
    formats: DropDownOption[];
    dereference: string;
    refOptions: DropDownOption[] = [
        new DropDownOptionValue("Download API Spec As-Is", "false"),
        new DropDownOptionValue("Dereference All External $refs", "true")
    ];

    constructor(private apis: ApisService, private clipboardService: ClipboardService, private config: ConfigService) {
        if (this.config.uiUrl()) {
            this.uiUrl = this.config.uiUrl();
        }
    }

    /**
     * Called to open the dialog.
     */
    public open(api: Api): void {
        console.log("[DownloadDialogComponent] Opening the download dialog.");
        this.api = api;
        this._isOpen = true;
        this.downloadModal.changes.subscribe( thing => {
            if (this.downloadModal.first) {
                this.downloadModal.first.show();
            }
        });
        this.formats = this.getFormats();
        this.dereference = "false";
    }

    private getFormats(): DropDownOption[] {
        let formats: DropDownOption[] = [];
        if (this.isAsyncApi20() || this.isOpenApi20() || this.isOpenApi30()) {
            formats.push(new DropDownOptionValue("JSON", "json"));
            formats.push(new DropDownOptionValue("YAML", "yaml"));
            this.format = "json";
        }
        if (this.isGraphQL()) {
            formats.push(new DropDownOptionValue("SDL", "sdl"));
            this.format = "sdl";
        }
        return formats;
    }

    /**
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
    }

    /**
     * Returns true if the dialog is open.
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Copies the URL to the clipboard.
     */
    public downloadLink(): string {
        return `${ this.uiUrl }download?type=api&format=${ this.format }&id=${ this.api.id }&dereference=${ this.dereference }`;
    }

    public downloadName(): string {
        return `${ this.api.name }.${ this.format }`;
    }

    public isOpenApi20(): boolean {
        return this.api.type === "OpenAPI20";
    }

    public isOpenApi30(): boolean {
        return this.api.type === "OpenAPI30";
    }

    public isAsyncApi20(): boolean {
        return this.api.type === "AsyncAPI20";
    }

    public isGraphQL(): boolean {
        return this.api.type === "GraphQL";
    }

}
