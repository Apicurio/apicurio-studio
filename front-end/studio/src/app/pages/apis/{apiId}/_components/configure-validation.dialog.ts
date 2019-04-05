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

import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";
import {ValidationProfileExt, ValidationService} from "../../../../services/validation.service";


@Component({
    moduleId: module.id,
    selector: "configure-validation-dialog",
    templateUrl: "configure-validation.dialog.html",
    styleUrls: [ "configure-validation.dialog.css" ]
})
export class ConfigureValidationComponent {

    @ViewChildren("configureValidationModal") configureValidationModal: QueryList<ModalDirective>;

    @Input() apiId: string;
    @Output() onChange: EventEmitter<ValidationProfileExt> = new EventEmitter<ValidationProfileExt>();

    protected _isOpen: boolean = false;
    protected _profileId: number;
    protected selectedProfileId: number;

    /**
     * Constructor.
     * @param validationService
     */
    constructor(private validationService: ValidationService) {}

    /**
     * Called to open the wizard.
     */
    public open(): void {
        this._profileId = this.validationService.getProfileForApi(this.apiId).id;
        this.selectedProfileId = this._profileId;
        this._isOpen = true;
        this.configureValidationModal.changes.subscribe( thing => {
            if (this.configureValidationModal.first) {
                this.configureValidationModal.first.show();
            }
        });
    }

    /**
     * Called to close the wizard.
     */
    public close(): void {
        this._isOpen = false;
    }

    /**
     * The user clicked the "OK" button to accept the setting.
     */
    protected ok(): void {
        this.onChange.emit(this.validationService.getProfile(this.selectedProfileId));
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.configureValidationModal.first.hide();
    }

    /**
     * Returns true if the wizard is open.
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Returns all the validation profiles available.
     */
    public allValidationProfiles(): ValidationProfileExt[] {
        return this.validationService.getProfiles();
    }

    /**
     * Returns true if the given validation profile is active for this API.
     * @param profile
     */
    public isProfileSelected(profile: ValidationProfileExt): boolean {
        return this.selectedProfileId === profile.id;
    }

    /**
     * Selects a profile.
     * @param profile
     */
    public selectProfile(profile: ValidationProfileExt): void {
        this.selectedProfileId = profile.id;
    }

    /**
     * Returns true if the user has changed the validation profile setting.
     */
    public isDirty(): boolean {
        return this._profileId !== this.selectedProfileId;
    }

}
