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
import {DropDownOption, DropDownOptionValue as Value, DIVIDER} from "../../../../../components/common/drop-down.component";
import {GitHubRepository} from "../../../../../models/github-repository.model";


@Component({
    selector: "github-resource",
    templateUrl: "github-resource.component.html"
})
export class GitHubResourceComponent implements OnInit {

    @Input() value: any;
    @Output() onChange = new EventEmitter<any>();
    @Output() onValid = new EventEmitter<boolean>();
    @Output() onError = new EventEmitter<any>();

    public model: any = {
        org: null,
        repo: null,
        branch: "master"
    };
    public _orgOptions: DropDownOption[] = [];
    public _repoOptions: DropDownOption[] = [];
    public _branchOptions: DropDownOption[] = [
        new Value("master", "master")
    ];
    public gettingOrgs: boolean = false;
    public gettingRepos: boolean = false;
    public gettingBranches: boolean = false;

    /**
     * Constructor.
     * @param linkedAccounts
     */
    constructor(private linkedAccounts: LinkedAccountsService) {}

    public ngOnInit(): void {
        console.info("[GitHubResourceComponent] ngOnInit()");
        // Get the list of orgs (async)
        this.gettingOrgs = true;
        this.onValid.emit(false);
        this.linkedAccounts.getAccountOrganizations("GitHub").then( orgs => {
            orgs.sort( (org1, org2) => {
                return org1.id.localeCompare(org2.id);
            });
            this._orgOptions = [];
            orgs.forEach( org => {
                if (org.userOrg) {
                    this._orgOptions.push(new Value(org.id, org.id));
                    this._orgOptions.push(DIVIDER);
                }
            });
            orgs.forEach( org => {
                if (!org.userOrg) {
                    this._orgOptions.push(new Value(org.id, org.id));
                }
            });
            this.gettingOrgs = false;

            if (this.value && this.value.org) {
                this.model.org = this.value.org;
                this.model.repo = this.value.repo;
                this.model.branch = this.value.branch;
                this.updateRepos();
            } else if (orgs.length === 1) {
                this.model.org = orgs[0].id;
                this.onChange.emit(this.model);
                this.updateRepos();
            }
        }).catch( error => {
            this.gettingOrgs = false;
            this.onError.emit(error);
        });
    }

    public orgOptions(): DropDownOption[] {
        return this._orgOptions;
    }

    public changeOrg(value: string): void {
        this.model.org = value;
        this.model.repo = null;
        this.model.branch = "master";

        this.onChange.emit(this.model);
        this.onValid.emit(this.isValid());

        this.updateRepos();
    }

    private updateRepos(): void {
        this.gettingRepos = true;
        this.linkedAccounts.getAccountRepositories("GitHub", this.model.org).then( _repos => {
            let repos: GitHubRepository[] = _repos as GitHubRepository[];
            repos.sort( (repo1, repo2) => {
                return repo1.name.localeCompare(repo2.name);
            });
            this._repoOptions = [];
            repos.forEach( repo => {
                this._repoOptions.push(new Value(repo.name, repo.name));
            });
            this.gettingRepos = false;

            if (this.model.repo) {
                this.updateBranches();
            } else if (repos.length === 1) {
                this.model.repo = repos[0].name;
                this.onChange.emit(this.model);
                this.updateBranches();
            }
        }).catch(error => {
            this.gettingRepos = false;
            this.onError.emit(error);
        });
    }

    public repoOptions(): DropDownOption[] {
        return this._repoOptions;
    }

    public changeRepo(value: string): void {
        this.model.repo = value;
        this.model.branch = "master";

        this.onChange.emit(this.model);
        this.onValid.emit(this.isValid());

        this.updateBranches();
    }

    public updateBranches(): void {
        this.gettingBranches = true;
        this.linkedAccounts.getAccountBranches("GitHub", this.model.org, this.model.repo).then( branches => {
            branches.sort( (branch1, branch2) => {
                return branch1.name.localeCompare(branch2.name);
            });
            this._branchOptions = [];
            branches.forEach( branch => {
                this._branchOptions.push(new Value(branch.name, branch.name));
            });
            this.gettingBranches = false;
            if (this.model && this.model.branch) {
                this.changeBranch(this.model.branch);
            } else {
                this.changeBranch("master");
            }
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

        this.onChange.emit(this.model);
        this.onValid.emit(this.isValid());
    }

    private isValid(): boolean {
        return this.model.org != null &&
            this.model.org != undefined &&
            this.model.org.length > 0 &&
            this.model.repo != null &&
            this.model.repo != undefined &&
            this.model.repo.length > 0 &&
            this.model.branch != null &&
            this.model.branch != undefined &&
            this.model.branch.length > 0;
    }
}
