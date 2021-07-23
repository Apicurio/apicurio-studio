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
import {BitbucketRepository} from "../../../../../models/bitbucket-repository.model";


@Component({
    selector: "bitbucket-resource",
    templateUrl: "bitbucket-resource.component.html"
})
export class BitbucketResourceComponent implements OnInit {

    @Input() value: any;
    @Output() onChange = new EventEmitter<any>();
    @Output() onValid = new EventEmitter<boolean>();
    @Output() onError = new EventEmitter<any>();

    public model: any = {
        team: null,
        repo: null,
        branch: "master"
    };
    public _teamOptions: DropDownOption[] = [];
    public _repoOptions: DropDownOption[] = [];
    public _branchOptions: DropDownOption[] = [
        new Value("master", "master")
    ];
    public gettingTeams: boolean = false;
    public gettingRepos: boolean = false;
    public gettingBranches: boolean = false;

    /**
     * Constructor.
     * @param linkedAccounts
     */
    constructor( private linkedAccounts: LinkedAccountsService) {}

    public ngOnInit(): void {
        console.info("[BitbucketResourceComponent] ngOnInit()");
        // Get the list of teams (async)
        this.gettingTeams = true;
        this.onValid.emit(false);
        this.linkedAccounts.getAccountTeams("Bitbucket").then( teams => {
            teams.sort( (team1, team2) => {
                return team1.displayName.localeCompare(team2.displayName);
            });
            this._teamOptions = [];
            teams.forEach( team => {
                if (team.userTeam) {
                    this._teamOptions.push(new Value(team.displayName, team.username));
                    if (teams.length > 1) {
                        this._teamOptions.push(DIVIDER);
                    }
                }
            });
            teams.forEach( team => {
                if (!team.userTeam) {
                    this._teamOptions.push(new Value(team.displayName, team.username));
                }
            });
            this.gettingTeams = false;

            if (this.value && this.value.team) {
                this.model.team = this.value.team;
                this.model.repo = this.value.repo;
                this.model.branch = this.value.branch;
                this.updateRepos();
            } else if (teams.length === 1) {
                this.model.team = teams[0].username;
                this.onChange.emit(this.model);
                this.updateRepos();
            }
        }).catch( error => {
            this.gettingTeams = false;
            this.onError.emit(error);
        });
    }

    public teamOptions(): DropDownOption[] {
        return this._teamOptions;
    }

    public changeTeam(value: string): void {
        this.model.team = value;
        this.model.repo = null;
        this.model.branch = "master";

        this.onChange.emit(this.model);
        this.onValid.emit(this.isValid());

        this.updateRepos();
    }

    public updateRepos(): void {
        this.gettingRepos = true;
        this.linkedAccounts.getAccountRepositories("Bitbucket", this.model.team).then( _repos => {
            let repos: BitbucketRepository[] = _repos as BitbucketRepository[];
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
        this.linkedAccounts.getAccountBranches("Bitbucket", this.model.team, this.model.repo).then( branches => {
            branches.sort( (branch1, branch2) => {
                return branch1.name.localeCompare(branch2.name);
            });
            this._branchOptions = [];
            branches.forEach( branch => {
                this._branchOptions.push(new Value(branch.name, branch.name));
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

        this.onChange.emit(this.model);
        this.onValid.emit(this.isValid());
    }

    private isValid(): boolean {
        return this.model.team != null &&
            this.model.team != undefined &&
            this.model.team.length > 0 &&
            this.model.repo != null &&
            this.model.repo != undefined &&
            this.model.repo.length > 0 &&
            this.model.branch != null &&
            this.model.branch != undefined &&
            this.model.branch.length > 0;
    }
}
