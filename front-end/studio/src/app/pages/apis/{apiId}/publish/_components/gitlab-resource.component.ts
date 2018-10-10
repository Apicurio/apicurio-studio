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

import {Component, EventEmitter, Inject, Input, OnInit, Output} from "@angular/core";
import {LinkedAccountsService} from "../../../../../services/accounts.service";
import {DropDownOption} from "../../../../../components/common/drop-down.component";
import {GitLabGroup} from "../../../../../models/gitlab-group.model";
import {GitLabProject} from "../../../../../models/gitlab-project.model";


export interface GitLabEventData {
    group: GitLabGroup;
    project: GitLabProject;
    branch: string;
}

@Component({
    moduleId: module.id,
    selector: "gitlab-resource",
    templateUrl: "gitlab-resource.component.html"
})
export class GitLabResourceComponent implements OnInit {

    @Input() value: any;
    @Output() onChange = new EventEmitter<any>();
    @Output() onValid = new EventEmitter<boolean>();

    public model: GitLabEventData = {
        group: null,
        project: null,
        branch: "master"
    };
    public _groupOptions: DropDownOption[] = [];
    public _projectOptions: DropDownOption[] = [];
    public _branchOptions: DropDownOption[] = [
        {
            name: "master",
            value: "master"
        }
    ];
    public gettingGroups: boolean = false;
    public gettingProjects: boolean = false;
    public gettingBranches: boolean = false;

    /**
     * Constructor.
     * @param linkedAccounts
     */
    constructor( private linkedAccounts: LinkedAccountsService) {}

    public ngOnInit(): void {
        console.info("[GitLabResourceComponent] ngOnInit()");
        // Get the list of groups (async)
        this.gettingGroups = true;
        this.onValid.emit(false);
        this.linkedAccounts.getAccountGroups("GitLab").then( groups => {
            groups.sort( (group1, group2) => {
                return group1.name.localeCompare(group2.name);
            });
            this._groupOptions = [];
            groups.forEach( group => {
                if (group.userGroup) {
                    this._groupOptions.push({
                        name: group.name,
                        value: group
                    });
                    this._groupOptions.push({
                        divider: true
                    });
                }
            });
            groups.forEach( group => {
                if (!group.userGroup) {
                    this._groupOptions.push({
                        name: group.name,
                        value: group
                    });
                }
            });
            this.gettingGroups = false;

            if (this.value && this.value.group) {
                this.model.group = this.value.group;
                this.model.project = this.value.project;
                this.model.branch = this.value.branch;
                this.updateProjects();
            }
        }).catch( error => {
            // TODO handle an error in some way!
            this.gettingGroups = false;
            console.error(error);
        });
    }

    public groupOptions(): DropDownOption[] {
        return this._groupOptions;
    }

    public changeGroup(value: GitLabGroup): void {
        this.model.group = value;
        this.model.project = null;
        this.model.branch = "master";

        this.fireOnChange();
        this.onValid.emit(this.isValid());

        this.updateProjects();
    }

    public updateProjects(): void {
        this.gettingProjects = true;
        this.linkedAccounts.getAccountProjects("GitLab", this.model.group.full_path).then( projects => {
            projects.sort( (project1, project2) => {
                return project1.name.localeCompare(project2.name);
            });
            this._projectOptions = [];
            projects.forEach( project => {
                this._projectOptions.push({
                    name: project.name,
                    value: project
                });
            });
            this.gettingProjects = false;

            // if (this.model.branch) {
            //     this.updateBranches();
            // }
        }).catch(error => {
            // TODO handle an error!
            this.gettingProjects = false;
            console.error(error);
        });
    }

    public projectOptions(): DropDownOption[] {
        return this._projectOptions;
    }

    public changeProject(value: GitLabProject): void {
        this.model.project = value;
        this.model.branch = "master";

        this.fireOnChange();
        this.onValid.emit(this.isValid());

        this.updateBranches();
    }

    public updateBranches(): void {
        this.gettingBranches = true;
        this.linkedAccounts.getAccountBranches("GitLab", this.model.group.full_path, this.model.project.path).then( branches => {
            branches.sort( (branch1, branch2) => {
                return branch1.name.localeCompare(branch2.name);
            });
            this._branchOptions = [];
            branches.forEach( branch => {
                this._branchOptions.push({
                    name: branch.name,
                    value: branch.name
                });
            })
            this.gettingBranches = false;
            if (this.isValid()) {
                this.onValid.emit(true);
            }
        }).catch(error => {
            // TODO handle an error!
            this.gettingBranches = false;
            console.error(error);
        });

    }

    public branchOptions(): DropDownOption[] {
        return this._branchOptions;
    }

    public changeBranch(value: string): void {
        this.model.branch = value;

        this.fireOnChange();
        this.onValid.emit(this.isValid());
    }

    private isValid(): boolean {
        return this.model.group != null &&
            this.model.group != undefined &&
            this.model.project != null &&
            this.model.project != undefined &&
            this.model.branch != null &&
            this.model.branch != undefined &&
            this.model.branch.length > 0;
    }

    private fireOnChange(): void {
        let model: any = {
            group: this.model.group ? this.model.group.full_path : null,
            project: this.model.project ? this.model.project.path : null,
            branch: this.model.branch
        }
        this.onChange.emit(model);
    }
}
