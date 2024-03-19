/**
 * @license
 * Copyright 2022 Red Hat
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

import {Component, Output, EventEmitter, ViewChildren, QueryList} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap/modal";
import {LicenseService, ILicense} from "../../_services/license.service";
import {SelectionService} from "../../_services/selection.service";


@Component({
    selector: "set-license-dialog",
    templateUrl: "set-license.component.html"
})
export class SetLicenseDialogComponent {

    @Output() onLicenseChosen: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("setLicenseModal") setLicenseModal: QueryList<ModalDirective>;

    private _isOpen: boolean = false;

    constructor(public licenseService: LicenseService, protected selectionService: SelectionService) {}

    /**
     * Called to open the dialog.
     */
    public open(): void {
        this._isOpen = true;
        this.setLicenseModal.changes.subscribe( thing => {
            if (this.setLicenseModal.first) {
                this.setLicenseModal.first.show();
            }
        });
        this.selectionService.simpleSelect("/info/license");
    }

    /**
     * Called to close the dialog.
     */
    close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void {
        this.setLicenseModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Returns a list of possible licenses.
     */
    licenses(): ILicense[] {
        return this.licenseService.getLicenses();
    }

    /**
     * Called when the user picks a license.
     * @param license
     */
    chooseLicense(license: ILicense): void {
        this.onLicenseChosen.emit({
            name: license.name,
            url: license.url
        });
        this.cancel();
    }

}
