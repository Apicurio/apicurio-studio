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

import {Observable} from "rxjs/Observable";

import {Api, ApiDefinition, EditableApiDefinition} from "../models/api.model";
import {ApiContributors} from "../models/api-contributors.model";
import {NewApi} from "../models/new-api.model";
import {ImportApi} from "../models/import-api.model";
import {OtCommand} from "oai-ts-commands";
import {ApiDesignCommandAck} from "../models/ack.model";
import {ApiCollaborator} from "../models/api-collaborator.model";
import {Invitation} from "../models/invitation.model";
import {ApiEditorUser} from "../models/editor-user.model";
import {ApiDesignChange} from "../models/api-design-change.model";
import {AbstractHubService} from "./hub";


export interface IConnectionHandler {
    // Called when the connection is established.
    onConnected(): void;
    // Called when the connection is closed properly.
    onClosed(): void;
    // Called when the connection drops unexpectedly.
    onDisconnected(closeCode: number): void;
}

export interface ICommandHandler {
    onCommand(command: OtCommand): void;
    onAck(ack: ApiDesignCommandAck): void;
}

export interface IActivityHandler {
    onJoin(user: ApiEditorUser): void;
    onLeave(user: ApiEditorUser): void;
    onSelection(user: ApiEditorUser, selection: string): void;
}


/**
 * An interface representing an API editing session.  Whenever an API Design is opened
 * in the designer, an editing session will be created.  This is basically a connection
 * to the back-end, allowing commands created locally to be sent in real-time to the
 * server for sequencing and distribution to peers.
 */
export interface IApiEditingSession {

    connect(handler: IConnectionHandler): void;

    commandHandler(handler: ICommandHandler): void;

    activityHandler(handler: IActivityHandler): void;

    sendCommand(command: OtCommand): void;

    sendSelection(selection: string): void;

    close(): void;

}


/**
 * Service used to manage, list, get, create, edit APIs.  This is the meat and potatoes
 * of the Apicurio UI.
 */
export abstract class IApisService extends AbstractHubService {

    /**
     * Gets an array of the repository types supported by this apis service.
     *
     * @return string[]
     */
    abstract getSupportedRepositoryTypes(): string[];

    /**
     * Gets a promise over all of the APIs.  The list of APIs is not guaranteed
     * to be in any particular order.  The resulting observer can be used to watch for
     * changes to the list of APIs.  It is assumed that calling this will fetch
     * the list of APIs from the server.
     */
    abstract getApis(): Promise<Api[]>;

    /**
     * Gets an observable over the recent APIs.  Callers can then subscribe to this
     * observable to be notified when the value changes.
     *
     * @return Observable<Api[]>
     */
    abstract getRecentApis(): Observable<Api[]>;

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
    abstract createApi(api: NewApi): Promise<Api>;

    /**
     * Imports an existing API to the Studio.  The assumption with this call is that the
     * API's OpenAPI document already exists in the source repository (or URL).
     * @param api
     */
    abstract importApi(api: ImportApi): Promise<Api>;

    /**
     * Called to delete an API.  This is done asynchronously and thus returns a promise.
     * @param api
     */
    abstract deleteApi(api: Api): Promise<void>;

    /**
     * Gets a single Api by its ID.
     * @param apiId the ID of the api
     */
    abstract getApi(apiId: string): Promise<Api>;

    /**
     * Starts a new (or connects to an existing) editing session for the given API Design (by ID).
     * @param {string} apiId
     * @return {Promise<EditableApiDefinition>}
     */
    abstract editApi(apiId: string): Promise<EditableApiDefinition>;

    /**
     * Opens an API editing session for the given Api.
     * @param {EditableApiDefinition} api
     * @return {ApiEditingSession}
     */
    abstract openEditingSession(api: EditableApiDefinition): IApiEditingSession;

    /**
     * Gets a single API definition by its ID.
     * @param apiId
     */
    abstract getApiDefinition(apiId: string): Promise<ApiDefinition>;

    /**
     * Gets the list of contributors for the API with the given id.
     * @param apiId
     */
    abstract getContributors(apiId: string): Promise<ApiContributors>;

    /**
     * Gets the list of collaborators for the API with the given id.
     * @param {string} apiId
     * @return {Promise<ApiCollaborator[]>}
     */
    abstract getCollaborators(apiId: string): Promise<ApiCollaborator[]>;

    /**
     * Deletes a collaborator of an API, removing access for that user.
     * @param {string} apiId
     * @param {string} userId
     * @return {Promise<void>}
     */
    abstract deleteCollaborator(apiId: string, userId: string): Promise<void>;

    /**
     * Gets the list of collaborator invitations for the API with the given id.
     * @param {string} apiId
     * @return {Promise<Invitation[]>}
     */
    abstract getInvitations(apiId: string): Promise<Invitation[]>;

    /**
     * Gets a single invitation by its ID (for a given API design).
     * @param {string} apiId
     * @param {string} inviteId
     * @return {Promise<Invitation>}
     */
    abstract getInvitation(apiId:string, inviteId: string): Promise<Invitation>;

    /**
     * Creates a new invite-to-collaborate for the given API design.
     * @param {string} apiId
     * @return {Promise<Invitation>}
     */
    abstract createInvitation(apiId: string): Promise<Invitation>;

    /**
     * Rejects an invitation to collaborate.
     * @param {string} apiId
     * @param {string} inviteId
     * @return {Promise<void>}
     */
    abstract rejectInvitation(apiId: string, inviteId: string): Promise<void>;

    /**
     * Accepts an invitation to collaborate.
     * @param {string} apiId
     * @param {string} inviteId
     * @return {Promise<void>}
     */
    abstract acceptInvitation(apiId: string, inviteId: string): Promise<void>;

    /**
     * Gets the list of activity items for a given API design.
     * @param {string} apiId
     * @return {Promise<ApiDesignChange[]>}
     */
    abstract getActivity(apiId: string, start: number, end: number): Promise<ApiDesignChange[]>;

}
