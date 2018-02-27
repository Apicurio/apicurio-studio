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

import {InitiatedLinkedAccount} from "../models/initiated-linked-account.model";
import {LinkedAccount} from "../models/linked-account.model";
import {GitHubOrganization} from "../models/github-organization.model";
import {GitHubRepository} from "../models/github-repository.model";
import {GitLabGroup} from "../models/gitlab-group.model";
import {GitLabProject} from "../models/gitlab-project.model";
import {BitbucketRepository} from "../models/bitbucket-repository.model";
import {BitbucketTeam} from "../models/bitbucket-team.model";
import {AbstractHubService} from "./hub";
import {SourceCodeBranch} from "../models/source-code-branch.model";


/**
 * Used to access and manipulate the user's Linked Accounts.
 */
export abstract class ILinkedAccountsService extends AbstractHubService {

    /**
     * Gets a promise over all of the Linked Accounts for the current user.
     * @return {Promise<Api[]>}
     */
    abstract getLinkedAccounts(): Promise<LinkedAccount[]>;

    /**
     * Initiates the process of creating a new linked account.  This begins the OIDC/OAuth
     * process, which will ultimately result in a new linked account.
     * @param {string} accountType
     * @param {string} redirectUrl
     * @return {Promise<InitiatedLinkedAccount>}
     */
    abstract createLinkedAccount(accountType: string, redirectUrl: string): Promise<InitiatedLinkedAccount>;

    /**
     * Called to delete or cancel a Linked Account.
     * @param {string} type
     * @return {Promise<void>}
     */
    abstract deleteLinkedAccount(type: string): Promise<void>;

    /**
     * Gets a single Api by its ID.
     * @param {string} type
     * @return {Promise<LinkedAccount>}
     */
    abstract getLinkedAccount(type: string): Promise<LinkedAccount>;

    /**
     * Finalizes/completes the account linking process for a particular account type.  This
     * should get called once the account linking flow has been completed.
     * @param {string} accountType
     * @param {string} nonce
     * @return {Promise<void>}
     */
    abstract completeLinkedAccount(accountType: string, nonce: string): Promise<void>;

    /**
     * Gets a list of all organizations the user belongs to.
     * @param {string} accountType
     * @return {Promise<string[]>}
     */
    abstract getAccountOrganizations(accountType: string): Promise<GitHubOrganization[]>;

    /**
     * Gets all of the repositories found in a given organization.
     * @param {string} accountType
     * @param {string} organizationOrTeam
     * @return {Promise<string[]>}
     */
    abstract getAccountRepositories(accountType: string, organizationOrTeam: string): Promise<(GitHubRepository[]|BitbucketRepository[])>;

    /**
     * Gets a list of all groups the user belongs to.
     * @param {string} accountType
     * @return {Promise<any[]>}
     */
    abstract getAccountGroups(accountType: string): Promise<GitLabGroup[]>;

    /**
     * Gets all of the projects found in a given group.
     * @param {string} accountType
     * @param {string} group
     * @return {Promise<GitLabProject[]>}
     */
    abstract getAccountProjects(accountType: string, group: string): Promise<GitLabProject[]>;

    /**
     * Gets a list of all teams the user belongs to.
     * @param {string} accountType
     * @return {Promise<any[]>}
     */
    abstract getAccountTeams(accountType: string): Promise<BitbucketTeam[]>;

    /**
     * Gets a list of all branches for a org/repo or team/project.
     * @param {string} accountType
     * @return {Promise<any[]>}
     */
    abstract getAccountBranches(accountType: string, orgOrTeam: string, projectOrRepo: string): Promise<SourceCodeBranch[]>;

}
