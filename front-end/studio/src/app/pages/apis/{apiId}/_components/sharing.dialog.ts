/**
 * @license
 * Copyright 2019 JBoss Inc
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
import {SharingConfiguration} from "../../../../models/sharing-config.model";
import {ClipboardService} from "ngx-clipboard";
import {ConfigService} from "../../../../services/config.service";


@Component({
    selector: "sharing-dialog",
    templateUrl: "sharing.dialog.html",
    styleUrls: [ "sharing.dialog.css" ]
})
export class SharingDialogComponent {

    @ViewChildren("sharingModal") sharingModal: QueryList<ModalDirective>;

    protected _isOpen: boolean = false;
    loading: boolean = false;
    copied: boolean = false;
    sharing: boolean = false;
    apiId: string;
    config: SharingConfiguration;
    error: any;

    constructor(private apis: ApisService, private clipboardService: ClipboardService, private configService: ConfigService) {}

    /**
     * Called to open the dialog.
     */
    public open(apiId: string): void {
        this.apiId = apiId;
        this.loading = true;
        this.copied = false;
        this._isOpen = true;
        this.error = null;
        this.sharing = false;
        this.sharingModal.changes.subscribe( thing => {
            if (this.sharingModal.first) {
                this.sharingModal.first.show();
            }
        });
        this.apis.getSharingConfiguration(apiId).then( config => {
            this.config = config;
            this.loading = false;
        }).catch( error => {
            console.error("[SharingDialogComponent] Error getting sharing config list: ", error);
            // TODO handle errors in some way
        });
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
    public copyToClipboard(): void {
        this.clipboardService.copyFromContent(this.sharingLink());
        this.copied = true;
        setTimeout(() => {
            this.copied = false;
        }, 5000);
    }

    public sharingLink(): string {
        // Convert the editing link from "ws" or "wss" to "http" or "https"
        let url: string = this.configService.editingUrl();
        url = "http" + url.substring(2);
        if (!url.endsWith("/")) {
            url += "/";
        }
        url += "sharing/";
        url += this.config.uuid;
        return url;
    }

    /**
     * Enable sharing for the API's generated documentation.
     */
    public enableSharing(): void {
        this.sharing = true;
        this.apis.configureSharing(this.apiId, "DOCUMENTATION").then( config => {
            this.config = config;
            this.sharing = false;
            this.error = null;
            this.copyToClipboard();
        }).catch( error => {
            console.error("[SharingDialogComponent] Error configuring sharing: ", error);
            // TODO handle errors!
            this.sharing = false;
            this.error = error.error;
        });
    }

    /**
     * Disable sharing for the API's generated documentation.
     */
    public disableSharing(): void {
        this.sharing = true;
        this.apis.configureSharing(this.apiId, "NONE").then( config => {
            this.config = config;
            this.sharing = false;
            this.error = null;
        }).catch( error => {
            console.error("[SharingDialogComponent] Error configuring sharing: ", error);
            // TODO handle errors!
            this.sharing = false;
            this.error = error.error;
        });
    }

}
