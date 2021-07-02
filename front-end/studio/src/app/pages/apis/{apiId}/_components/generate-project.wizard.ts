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
import {ModalDirective} from "ngx-bootstrap/modal";
import {DropDownOption, DropDownOptionValue as Value} from "../../../../components/common/drop-down.component";
import {NgForm} from "@angular/forms";
import {LinkedAccount} from "../../../../models/linked-account.model";
import {LinkedAccountsService} from "../../../../services/accounts.service";
import {CodeEditorMode} from "../../../../components/common/code-editor.component";
import {ApisService} from "../../../../services/apis.service";
import {NewCodegenProject} from "../../../../models/new-codegen-project.model";
import {CodegenProject} from "../../../../models/codegen-project.model";
import {UpdateCodegenProject} from "../../../../models/update-codegen-project.model";


export interface GenerateProjectWizardModel {
    generationType: string;
    projectType: string;
    projectData?: any;
    location: string;
    sourceControlData?: any;
}

var PROJECT_TYPES: DropDownOption[] = [
    new Value("Simple JAX-RS", "jaxrs"),
    new Value("Quarkus JAX-RS", "quarkus"),
    new Value("Thorntail JAX-RS", "thorntail"),
    new Value("Vert.x", "vertx", true),
    new Value("Spring Boot", "springboot", true),
    new Value("Node.js", "nodejs", true)
];


@Component({
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

    public accounts: LinkedAccount[];
    public projects: CodegenProject[];
    public _loadCount: number;
    public _expectedLoadCount: number = 2;

    public _updateProjectOptions: DropDownOption[];

    public model: GenerateProjectWizardModel;
    public sourceControlDataValid: boolean;

    public loading: boolean;
    public currentPage: string;
    public generating: boolean;
    public generated: boolean;

    public updateProject: CodegenProject;
    public generatedProject: CodegenProject;

    public error: any = null;
    public errorMessage: string = null;

    /**
     * Constructor with injection!
     * @param linkedAcounts
     */
    constructor(private linkedAcounts: LinkedAccountsService, private apis: ApisService) {
    }

    /**
     * Called to open the wizard.
     */
    public open(): void {
        this.error = null;
        this.errorMessage = null;

        this.model = {
            generationType: "bootstrap",
            projectType: "quarkus",
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

        this._loadCount = 0;

        this.linkedAcounts.getLinkedAccounts().then( accounts => {
            this._loadCount++;
            this.accounts = accounts;
            this.loading = this._loadCount < this._expectedLoadCount;
            console.debug("[GenerateProjectWizardComponent] Linked accounts loaded.");
        }).catch(error => {
            console.error("[GenerateProjectWizardComponent] Error getting Linked Accounts");
            this.error = error;
            this.errorMessage = "Error getting Wizard information.";
        });
        this.apis.getCodegenProjects(this.apiId).then( projects => {
            this._loadCount++;
            this.projects = projects;
            if (projects.length > 0) {
                this.updateProject = projects[0];
                this.model.generationType = "update";
                this.updateModelWithProjectInfo(this.updateProject);
            }
            this.loading = this._loadCount < this._expectedLoadCount;
            this._updateProjectOptions = null;
            console.debug("[GenerateProjectWizardComponent] Codegen projects loaded.  still loading: ", this.loading);
        }).catch( error => {
            console.error("[GenerateProjectWizardComponent] Error getting Codegen Projects");
            this.error = error;
            this.errorMessage = "Error getting Wizard information.";
        });
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
     * 
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    public updateProjectOptions(): DropDownOption[] {
        if (this._updateProjectOptions === null) {
            this._updateProjectOptions = [];
            for (let project of this.projects) {
                this._updateProjectOptions.push(new Value(project.type + " (" + project.createdOn + ")", project));
            }
        }
        return this._updateProjectOptions;
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
        return this.generating || this.generated || this.error;
    }

    public isCloseButtonEnabled(): boolean {
        return this.generated || this.error;
    }

    public showCancelButton(): boolean {
        return !this.generated && !this.generating && !this.error;
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

    public isUpdate(): boolean {
        return this.model.generationType === "update";
    }

    public downloadFilename(): string {
        if (this.model.projectType === "thorntail") {
            return this.model.projectData.artifactId + ".zip";
        }
        // TODO handle the other project types (jax-rs, node.js, etc)
        return "download.zip";
    }

    public commitMessageMode(): CodeEditorMode {
        return CodeEditorMode.Markdown;
    }

    public generate(): void {
        this.generating = true;
        this.generated = false;
        this.currentPage = null;

        let newProj: NewCodegenProject = new NewCodegenProject();
        newProj.projectType = this.model.projectType;
        newProj.projectConfig = this.model.projectData;
        newProj.location = this.model.location;
        newProj.publishInfo = this.getPublishInfo();

        if (this.model.generationType === "update") {
            this.apis.updateCodegenProject(this.apiId, this.updateProject.id, newProj as UpdateCodegenProject).then( project => {
                this.generatedProject = project;
                this.generating = false;
                this.generated = true;
                this.onProjectGenerated();
            }).catch( error => {
                this.error = error;
                this.errorMessage = "Error updating the Code Generation Project.";
            });
        } else {
            this.apis.createCodegenProject(this.apiId, newProj).then( project => {
                this.generatedProject = project;
                this.generating = false;
                this.generated = true;
                this.onProjectGenerated();
            }).catch( error => {
                this.error = error;
                this.errorMessage = "Error creating a new Code Generation Project.";
            });
        }
    }

    public getPublishInfo(): any {
        let info: any = {};
        if (this.model.location === "sourceControl") {
            info = {
                type: this.model.sourceControlData.type,
                org: this.model.sourceControlData.model.org,
                repo: this.model.sourceControlData.model.repo,
                team: this.model.sourceControlData.model.team,
                group: this.model.sourceControlData.model.group,
                project: this.model.sourceControlData.model.project,
                branch: this.model.sourceControlData.model.branch,
                location: this.model.sourceControlData.location,
                commitMessage: this.model.sourceControlData.commitMessage
            };
        }
        return info;
    }

    public onProjectGenerated(): void {
        if (this.model.location === "download") {
            setTimeout( () => {
                this.downloadLink.first.nativeElement.click();
            }, 100);
        }
    }

    public setUpdateProject(project: CodegenProject): void {
        this.updateProject = project;
        this.updateModelWithProjectInfo(project);
    }

    /**
     * Called to update the model attributes based on the info in the project.
     * @param project
     */
    public updateModelWithProjectInfo(project: CodegenProject): void {
        this.model.projectType = project.type;
        this.model.location = project.attributes.location;
        this.model.projectData.artifactId = project.attributes.artifactId;
        this.model.projectData.groupId = project.attributes.groupId;
        this.model.projectData.javaPackage = project.attributes.javaPackage;
        this.model.projectData.reactive = project.attributes.reactive;
        this.model.sourceControlData.type = project.attributes['publish-type'];
        this.model.sourceControlData.model = {};
        this.model.sourceControlData.model.branch = project.attributes['publish-branch'];
        this.model.sourceControlData.model.group = project.attributes['publish-group'];
        this.model.sourceControlData.model.org = project.attributes['publish-org'];
        this.model.sourceControlData.model.project = project.attributes['publish-project'];
        this.model.sourceControlData.model.repo = project.attributes['publish-repo'];
        this.model.sourceControlData.model.team = project.attributes['publish-team'];
        this.model.sourceControlData.location = project.attributes['publish-location'];
        this.model.sourceControlData.commitMessage = project.attributes['publish-commitMessage'];
    }

    public resetModel(): void {
        this.model = {
            generationType: "bootstrap",
            projectType: "quarkus",
            projectData: {},
            location: "download",
            sourceControlData: {}
        };
    }

    public viewProjectLink(): string {
        if (this.generatedProject && this.generatedProject.attributes) {
            return this.generatedProject.attributes['pullRequest-url'];
        }
        return "about:blank";
    }

}
