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

import {Component, EventEmitter, Inject, OnInit, Output} from "@angular/core";
import {LinkedAccountsService} from "../../../../../services/accounts.service";
import {DropDownOption} from "../../../../../components/common/drop-down.component";
import {BitbucketRepository} from "../../../../../models/bitbucket-repository.model";


@Component({
    moduleId: module.id,
    selector: "bitbucket-resource",
    templateUrl: "bitbucket-resource.component.html"
})
export class BitbucketResourceComponent implements OnInit {

    @Output() onChange = new EventEmitter<any>();
    @Output() onValid = new EventEmitter<boolean>();

    public model: any = {
        team: null,
        repo: null,
        branch: "master",
        resource: null
    };
    public _teamOptions: DropDownOption[] = [];
    public _repoOptions: DropDownOption[] = [];
    public _branchOptions: DropDownOption[] = [
        {
            name: "master",
            value: "master"
        }
    ];
    public gettingTeams: boolean = false;
    public gettingRepos: boolean = false;
    public gettingBranches: boolean = false;

    /**
     * Constructor.
     * @param {LinkedAccountsService} linkedAcounts
     */
    constructor( private linkedAcounts: LinkedAccountsService) {}

    public ngOnInit(): void {
        console.info("[BitbucketResourceComponent] ngOnInit()");
        // Get the list of teams (async)
        this.gettingTeams = true;
        this.onValid.emit(false);
        this.linkedAcounts.getAccountTeams("Bitbucket").then( teams => {
            teams.sort( (team1, team2) => {
                return team1.displayName.localeCompare(team2.displayName);
            });
            this._teamOptions = [];
            teams.forEach( team => {
                this._teamOptions.push({
                    name: team.displayName,
                    value: team.username
                });
            });
            this.gettingTeams = false;
        }).catch( error => {
            // TODO handle an error in some way!
            this.gettingTeams = false;
            console.error(error);
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

        this.gettingRepos = true;
        this.linkedAcounts.getAccountRepositories("Bitbucket", this.model.team).then( _repos => {
            let repos: BitbucketRepository[] = _repos as BitbucketRepository[];
            repos.sort( (repo1, repo2) => {
                return repo1.name.localeCompare(repo2.name);
            });
            this._repoOptions = [];
            repos.forEach( repo => {
                this._repoOptions.push({
                    name: repo.name,
                    value: repo.name
                });
            })
            this.gettingRepos = false;
        }).catch(error => {
            // TODO handle an error!
            this.gettingRepos = false;
            console.error(error);
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

        this.gettingBranches = true;
        this.linkedAcounts.getAccountBranches("Bitbucket", this.model.team, this.model.repo).then( branches => {
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

        this.onChange.emit(this.model);
        this.onValid.emit(this.isValid());
    }

    public resourceChanged(): void {
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
            this.model.branch.length > 0 &&
            this.model.resource != null &&
            this.model.resource != undefined &&
            this.model.resource.length > 0;
    }
}
