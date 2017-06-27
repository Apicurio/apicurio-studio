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

import {InjectionToken} from "@angular/core";
import {Observable} from "rxjs/Observable";

import {Api, ApiDefinition} from "../models/api.model";
import {ApiCollaborators} from "../models/api-collaborators";


export interface IApisService {

    /**
     * Called to discover the details about an API.  This will typically parse the URL, and then query
     * the appropriate back-end to divine additional API details (such as its name and description).
     * @param apiUrl
     */
    discoverApi(apiUrl: string): Promise<Api>;

    /**
     * Gets an array of the repository types supported by this apis service.
     *
     * @return string[]
     */
    getSupportedRepositoryTypes(): string[];

    /**
     * Gets an observable over all of the APIs.  The list of APIs is not guaranteed
     * to be in any particular order.  The resulting observer can be used to watch for
     * changes to the list of APIs.
     */
    getAllApis(): Observable<Api[]>;

    /**
     * Gets an observable over the recent APIs.  Callers can then subscribe to this
     * observable to be notified when the value changes.
     *
     * @return Observable<Api[]>
     */
    getRecentApis(): Observable<Api[]>;

    /**
     * Creates a new API with the given information.  The assumption is that no OpenAPI
     * document yet exists at the indicated repository location, and thus the API Service
     * must create it.
     *
     * This will store the API in whatever storage is used by this service impl.  It will
     * return a Promise that the caller can use to be notified when the API has been successfully
     * stored.
     * @param api
     * @return Promise<Api>
     */
    createApi(api: Api): Promise<Api>;

    /**
     * Adds an existing API to the Studio.  The assumption with this call is that the
     * API's OpenAPI document already exists in the source repository.  All we're doing
     * here is verifying that and then tracking it in the studio.
     *
     * This will store the API in whatever storage is used by this service impl.  It will
     * return a Promise that the caller can use to be notified when the API has been successfully
     * stored.
     * @param api
     */
    addApi(api: Api): Promise<Api>;

    /**
     * Called to delete an API.  This is done asynchronously and thus returns a promise.
     * @param api
     */
    deleteApi(api: Api): Promise<void>;

    /**
     * Gets a single Api by its ID.
     * @param apiId the ID of the api
     */
    getApi(apiId: string): Promise<Api>;

    /**
     * Gets a single API definition by its ID.
     * @param apiId
     */
    getApiDefinition(apiId: string): Promise<ApiDefinition>;

    /**
     * Updates an api definition by saving a new version back to the source repository.
     * @param definition
     * @param saveMessage
     * @param saveComment
     */
    updateApiDefinition(definition: ApiDefinition, saveMessage: string, saveComment: string): Promise<ApiDefinition>;

    /**
     * Gets the list of collaborators for the API with the given id.
     * @param api
     */
    getCollaborators(api: Api): Promise<ApiCollaborators>;

    /**
     * Gets a list of all organizations the logged in user belongs to.
     */
    getOrganizations(): Observable<string[]>;

    /**
     * Gets all of the repositories found in a given organization.
     * @param organization
     * @param isUser
     */
    getRepositories(organization: string, isUser?: boolean): Observable<string[]>;
}

export const IApisService = new InjectionToken("IApisService");
