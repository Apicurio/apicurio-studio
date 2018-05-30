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

import {Component, ElementRef, Input, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";
import {DropDownOption} from "../../../../components/common/drop-down.component";
import {NgForm} from "@angular/forms";
import {LinkedAccount} from "../../../../models/linked-account.model";
import {LinkedAccountsService} from "../../../../services/accounts.service";
import {CodeEditorMode} from "../../../../components/common/code-editor.component";


export interface GenerateProjectWizardModel {
    generationType: string;
    projectType: string;
    projectData?: any;
    location: string;
    sourceControlData?: any;
}

var PROJECT_TYPES: DropDownOption[] = [
    { name: "Simple JAX-RS", value: "jaxrs", disabled: true },
    { name: "Thorntail JAX-RS", value: "thorntail" },
    { name: "Vert.x", value: "vertx", disabled: true },
    { name: "Spring Boot", value: "springboot", disabled: true },
    { name: "Node.js", value: "nodejs", disabled: true }
];


@Component({
    moduleId: module.id,
    selector: "generate-project-wizard",
    templateUrl: "generate-project.wizard.html",
    styleUrls: [ "generate-project.wizard.css" ]
})
export class GenerateProjectWizardComponent {

    @ViewChildren("generateProjectModal") generateProjectModal: QueryList<ModalDirective>;
    @ViewChildren("projectTypeForm") _projectTypeForm: QueryList<NgForm>;
    @ViewChildren("downloadLink") downloadLink: QueryList<ElementRef>;

    @Input() apiId: string;

    protected _isOpen: boolean = false;

    public model: GenerateProjectWizardModel;
    public sourceControlDataValid: boolean;

    public accounts: LinkedAccount[];

    public loading: boolean;
    public currentPage: string;
    public generating: boolean;
    public generated: boolean;

    /**
     * Constructor with injection!
     * @param {LinkedAccountsService} linkedAcounts
     */
    constructor(private linkedAcounts: LinkedAccountsService) {
        console.info("LINKED ACCOUNTS: " + linkedAcounts);
    }

    /**
     * Called to open the wizard.
     */
    public open(): void {
        this.model = {
            generationType: "bootstrap",
            projectType: "thorntail",
            projectData: {},
            location: "download",
            sourceControlData: {}
        };
        this._isOpen = true;
        this.generateProjectModal.changes.subscribe( thing => {
            if (this.generateProjectModal.first) {
                this.generateProjectModal.first.show();
            }
        });
        this.loading = true;
        this.generating = false;
        this.generated = false;
        this.currentPage = "generationType";
        this.sourceControlDataValid = false;

        // TODO lookup relevant information from the server (load most recent Project Generation info)
        console.info("(open) LINKED ACCOUNTS: " + this.linkedAcounts);
        this.linkedAcounts.getLinkedAccounts().then( accounts => {
            this.accounts = accounts;
            this.loading = false;
        }).catch(error => {
            console.error("[GenerateProjectWizardComponent] Error getting Linked Accounts");
            // TODO What to do here?
        });


        setTimeout(() => {
            this.loading = false;
        }, 1000);
    }

    /**
     * Called to close the wizard.
     */
    public close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.generateProjectModal.first.hide();
    }

    /**
     * Returns true if the wizard is open.
     * @return {boolean}
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    public projectTypeOptions(): DropDownOption[] {
        return PROJECT_TYPES;
    }

    public isBackButtonEnabled(): boolean {
        return !this.loading && this.currentPage !== "generationType";
    }

    public isNextButtonEnabled(): boolean {
        return !this.loading && !this.isLastPage() && this.isCurrentPageValid();
    }

    public isLastPage(): boolean {
        if (this.currentPage === "sourceCountrol") {
            return true;
        }
        if (this.currentPage === "location") {
            return this.model.location === "download";
        }
        return false;
    }

    public isCurrentPageValid(): boolean {
        return this.isPageValid(this.currentPage);
    }

    public isPageValid(page: string): boolean {
        if (page === "projectType") {
            if (this._projectTypeForm && this._projectTypeForm.first) {
                return this._projectTypeForm.first.valid;
            } else {
                return false;
            }
        }
        if (page === "sourceControl") {
            return this.sourceControlDataValid &&
                this.model.sourceControlData.location &&
                this.model.sourceControlData.location.length > 0 &&
                this.model.sourceControlData.commitMessage &&
                this.model.sourceControlData.commitMessage.length > 0;
        }

        return true;
    }

    public showBackButton(): boolean {
        return !this.generating && !this.generated;
    }

    public showNextButton(): boolean {
        return !this.showGenerateButton() && !this.generating && !this.generated;
    }

    public showGenerateButton(): boolean {
        if (this.currentPage === "location" && this.model.location === "download") {
            return true;
        }
        if (this.currentPage === "sourceControl") {
            return true;
        }
        return false;
    }

    public isGenerateButtonEnabled(): boolean {
        if (this.currentPage === "location" && this.model.location === "download") {
            return true;
        }
        if (this.currentPage === "sourceControl" && this.isCurrentPageValid()) {
            return true;
        }
        return false;
    }

    public showCloseButton(): boolean {
        return this.generating || this.generated;
    }

    public isCloseButtonEnabled(): boolean {
        return this.generated;
    }

    public showCancelButton(): boolean {
        return !this.generated;
    }

    public goBack(): void {
        switch (this.currentPage) {
            case "projectType":
                this.currentPage = "generationType";
                break;
            case "location":
                this.currentPage = "projectType";
                break;
            case "sourceControl":
                this.currentPage = "location";
                break;
        }
    }

    public goNext(): void {
        switch (this.currentPage) {
            case "generationType":
                this.currentPage = "projectType";
                break;
            case "projectType":
                this.currentPage = "location";
                break;
            case "location":
                this.currentPage = "sourceControl";
                break;
        }
    }

    public setLocation(event): void {
        console.info(event);
    }

    public goTo(newPage: string): void {
        switch (newPage) {
            case "generationType":
                this.currentPage = newPage;
                break;
            case "projectType":
                if (this.isPageValid("generationType")) {
                    this.currentPage = newPage;
                }
                break;
            case "location":
                if (this.isPageValid("generationType") && this.isPageValid("projectType")) {
                    this.currentPage = newPage;
                }
                break;
            case "sourceControl":
                if (this.isPageValid("generationType") && this.isPageValid("projectType") && this.isPageValid("location")) {
                    this.currentPage = newPage;
                }
                break;
        }
    }

    public hasAtLeastOneAccount(): boolean {
        return this.accounts.length > 0;
    }

    public hasAccount(type: string): boolean {
        for (let account of this.accounts) {
            if (account.type === type) {
                return true;
            }
        }
        return false;
    }

    public isSelected(type: string): boolean {
        return this.model.sourceControlData.type === type;
    }

    public setPublishTo(target: string): void {
        if (!this.hasAccount(target)) {
            return;
        }
        this.model.sourceControlData.type = target;
    }

    public commitMessageMode(): CodeEditorMode {
        return CodeEditorMode.Markdown;
    }

    public generate(): void {
        this.generating = true;
        this.currentPage = null;

        // Handle the "download" style of project generation
        if (this.model.location === "download") {
            setTimeout( () => {
                this.generating = false;
                this.generated = true;
                setTimeout( () => {
                    this.downloadLink.first.nativeElement.click();
                }, 500);
            }, 750);
        }

        // Handle the "publish" style of project generation
        // TODO handle publishing the project to e.g. GitHub
    }

}
