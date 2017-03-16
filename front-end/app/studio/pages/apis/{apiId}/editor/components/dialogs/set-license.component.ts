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

import {Component, Output, EventEmitter, ViewChildren, QueryList} from "@angular/core";
import {ModalDirective} from "ng2-bootstrap";
import {LicenseService, ILicense} from "../../services/license.service";


@Component({
    moduleId: module.id,
    selector: "set-license-dialog",
    templateUrl: "set-license.component.html"
})
export class SetLicenseDialogComponent {

    private static licenseService: LicenseService = new LicenseService();

    @Output() onLicenseChosen: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("setLicenseModal") setLicenseModal: QueryList<ModalDirective>;

    protected _isOpen: boolean = false;

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
    }

    /**
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "add".
     */
    protected setLicense(): void {
        this.onLicenseChosen.emit({});
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.setLicenseModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return {boolean}
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Returns a list of possible licenses.
     */
    public licenses(): ILicense[] {
        return SetLicenseDialogComponent.licenseService.getLicenses();
    }

    /**
     * Returns the license service.
     */
    public licenseService(): LicenseService {
        return SetLicenseDialogComponent.licenseService;
    }

    /**
     * Called when the user picks a license.
     * @param license
     */
    public chooseLicense(license: ILicense): void {
        this.onLicenseChosen.emit({
            name: license.name,
            url: license.url
        });
        this.cancel();
    }

}
