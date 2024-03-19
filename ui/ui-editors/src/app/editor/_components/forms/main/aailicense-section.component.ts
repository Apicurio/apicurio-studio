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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation} from "@angular/core";
import {ChangeLicenseCommand, CommandFactory, ICommand, Library, AaiDocument, AaiLicense} from "@apicurio/data-models";
import {CommandService} from "../../../_services/command.service";
import {ILicense, LicenseService} from "../../../_services/license.service";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {SelectionService} from "../../../_services/selection.service";


@Component({
    selector: "aailicense-section",
    templateUrl: "aailicense-section.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsyncApiLicenseSectionComponent extends AbstractBaseComponent {

    @Input() document: AaiDocument;

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
    public licenseModel(): AaiLicense {
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
        let command: ICommand = CommandFactory.createChangeLicenseCommand(licenseInfo.name, licenseInfo.url);
        this.commandService.emit(command);
        let path = Library.createNodePath(this.document);
        path.appendSegment("info", false);
        path.appendSegment("license", false);
        this.selectionService.select(path.toString());
    }

    /**
     * Called when the user chooses to remove the license.
     */
    public deleteLicense(): void {
        let command: ICommand = CommandFactory.createDeleteLicenseCommand(this.document.info);
        this.commandService.emit(command);
    }

}
