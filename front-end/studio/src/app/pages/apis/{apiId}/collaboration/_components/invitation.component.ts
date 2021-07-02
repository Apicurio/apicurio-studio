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

import {Component, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap/modal";
import {Invitation} from "../../../../../models/invitation.model";
import {ClipboardService} from "ngx-clipboard";
import {Api} from "../../../../../models/api.model";


@Component({
    selector: "invitation-dialog",
    templateUrl: "invitation.component.html",
    styleUrls: [ "invitation.component.css" ]
})
export class InvitationDialogComponent {

    @ViewChildren("invitationModal") invitationModal: QueryList<ModalDirective>;

    protected api: Api;
    protected invitation: Invitation;
    protected copied: boolean = false;
    protected link: string;

    protected _isOpen: boolean = false;

    constructor(private clipboardService: ClipboardService) {}

    /**
     * Called to open the dialog.
     * @param invitation
     */
    public open(api: Api, invitation: Invitation): void {
        this.api = api;
        this.invitation = invitation;
        this._isOpen = true;
        this.copied = false;

        let baseUrl: string = window.location.toString();
        baseUrl = baseUrl.substring(0, baseUrl.indexOf("/collaboration"));
        this.link = baseUrl + "/collaboration/accept/" + this.invitation.inviteId;

        this.invitationModal.changes.subscribe( () => {
            if (this.invitationModal.first) {
                this.invitationModal.first.show();
            }
        });
    }

    /**
     * Copies the URL to the clipboard.
     */
    public copyToClipboard(): void {
        this.clipboardService.copyFromContent(this.link);
        this.copied = true;
    }

    /**
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.invitationModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

}
