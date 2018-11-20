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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation} from "@angular/core";
import {OasDocument, OasLicense} from "oai-ts-core";
import {CommandService} from "../../../_services/command.service";
import {createChangeLicenseCommand, createDeleteLicenseCommand, ICommand} from "oai-ts-commands";
import {ILicense, LicenseService} from "../../../_services/license.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";


@Component({
    moduleId: module.id,
    selector: "license-section",
    templateUrl: "license-section.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LicenseSectionComponent extends AbstractBaseComponent {

    @Input() document: OasDocument;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
                private commandService: CommandService, public licenseService: LicenseService,
                private selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    /**
     * Returns true if a license has been configured for this API.
     */
    public hasLicense(): boolean {
        if (this.document.info && this.document.info.license) {
            return true;
        }
        return false;
    }

    /**
     * Returns the resolved license or null if not found.
     */
    public license(): ILicense {
        return this.licenseService.findLicense(this.licenseUrl());
    }

    /**
     * Returns the license model.
     */
    public licenseModel(): OasLicense {
        if (this.document.info && this.document.info.license) {
            return this.document.info.license;
        } else {
            return null;
        }
    }

    /**
     * returns the license name.
     */
    public licenseName(): string {
        if (this.document.info && this.document.info.license) {
            return this.document.info.license.name;
        } else {
            return "";
        }
    }

    /**
     * returns the license url.
     */
    public licenseUrl(): string {
        if (this.document.info && this.document.info.license) {
            return this.document.info.license.url;
        } else {
            return "";
        }
    }

    /**
     * Called when the user chooses a new license in the Choose License dialog.
     * @param licenseInfo
     */
    public setLicense(licenseInfo: any): void {
        let command: ICommand = createChangeLicenseCommand(this.document, licenseInfo.name, licenseInfo.url);
        this.commandService.emit(command);
    }

    /**
     * Called when the user chooses to remove the license.
     */
    public deleteLicense(): void {
        let command: ICommand = createDeleteLicenseCommand(this.document);
        this.commandService.emit(command);
    }

}
