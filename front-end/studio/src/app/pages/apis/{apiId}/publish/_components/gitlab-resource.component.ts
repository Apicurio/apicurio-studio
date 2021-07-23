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

import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {LinkedAccountsService} from "../../../../../services/accounts.service";
import {DropDownOption, DropDownOptionValue as Value, DIVIDER} from "../../../../../components/common/drop-down.component";
import {GitLabGroup} from "../../../../../models/gitlab-group.model";
import {GitLabProject} from "../../../../../models/gitlab-project.model";


export interface GitLabEventData {
    group: GitLabGroup;
    project: GitLabProject;
    branch: string;
}

@Component({
    selector: "gitlab-resource",
    templateUrl: "gitlab-resource.component.html"
})
export class GitLabResourceComponent implements OnInit {

    @Input() value: any;
    @Output() onChange = new EventEmitter<any>();
    @Output() onValid = new EventEmitter<boolean>();
    @Output() onError = new EventEmitter<any>();

    public model: GitLabEventData = {
        group: null,
        project: null,
        branch: "master"
    };
    public _groupOptions: DropDownOption[] = [];
    public _projectOptions: DropDownOption[] = [];
    public _branchOptions: DropDownOption[] = [
        new Value("master", "master")
    ];
    public gettingGroups: boolean = false;
    public gettingProjects: boolean = false;
    public gettingBranches: boolean = false;

    public preloadValue: any = {};

    /**
     * Constructor.
     * @param linkedAccounts
     */
    constructor( private linkedAccounts: LinkedAccountsService) {}

    public ngOnInit(): void {
        // Get the list of groups (async)
        this.gettingGroups = true;
        this.onValid.emit(false);
        if (this.value) {
            this.preloadValue.group = this.value.group;
            this.preloadValue.project = this.value.project;
            this.preloadValue.branch = this.value.branch;
        }
        this.linkedAccounts.getAccountGroups("GitLab").then( groups => {
            groups.sort( (group1, group2) => {
                return group1.name.localeCompare(group2.name);
            });
            this._groupOptions = [];
            groups.forEach( group => {
                if (group.userGroup) {
                    this._groupOptions.push(new Value(group.name, group));
                    if (groups.length > 1) {
                        this._groupOptions.push(DIVIDER);
                    }
                }
                if (this.preloadValue.group && this.preloadValue.group === group.path) {
                    this.model.group = group;
                    this.preloadValue.group = null;
                }
            });
            groups.forEach( group => {
                if (!group.userGroup) {
                    this._groupOptions.push(new Value(group.name, group));
                }
            });
            this.gettingGroups = false;

            if (this.model.group) {
                this.updateProjects();
            } else if (groups.length === 1) {
                this.model.group = groups[0]
                this.onChange.emit(this.model);
                this.updateProjects();
            }
        }).catch( error => {
            this.gettingGroups = false;
            this.onError.emit(error);
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
        this.linkedAccounts.getAccountProjects("GitLab", this.model.group.id).then( projects => {
            projects.sort( (project1, project2) => {
                return project1.name.localeCompare(project2.name);
            });
            this._projectOptions = [];
            projects.forEach( project => {
                this._projectOptions.push(new Value(project.name, project));
                if (this.preloadValue.project && this.preloadValue.project == project.name) {
                    this.model.project = project;
                    this.preloadValue.project = null;
                }
            });
            this.gettingProjects = false;

            if (this.model.project) {
                this.updateBranches();
            } else if (projects.length === 1) {
                this.model.project = projects[0];
                this.onChange.emit(this.model);
                this.updateBranches();
            }
        }).catch(error => {
            this.gettingProjects = false;
            this.onError.emit(error);
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
        this.linkedAccounts.getAccountBranches("GitLab", this.model.group.full_path, this.model.project.id).then( branches => {
            branches.sort( (branch1, branch2) => {
                return branch1.name.localeCompare(branch2.name);
            });
            this._branchOptions = [];
            branches.forEach( branch => {
                this._branchOptions.push(new Value(branch.name, branch.name));
                if (this.preloadValue.branch && this.preloadValue.branch === branch.name) {
                    this.model.branch = branch.name;
                    this.preloadValue.branch = null;
                }
            });
            this.gettingBranches = false;
            if (!this.model.branch) {
                this.model.branch = "master";
            }
            this.changeBranch(this.model.branch);
        }).catch(error => {
            this.gettingBranches = false;
            this.onError.emit(error);
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
