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
import {ApiContributor, ApiContributors} from "../models/api-contributors.model";
import {NewApi} from "../models/new-api.model";
import {ImportApi} from "../models/import-api.model";
import {ICommand, MarshallUtils, OtCommand} from "oai-ts-commands";
import {ApiDesignCommandAck} from "../models/ack.model";
import {ApiCollaborator} from "../models/api-collaborator.model";
import {Invitation} from "../models/invitation.model";
import {ApiEditorUser} from "../models/editor-user.model";
import {ApiDesignChange} from "../models/api-design-change.model";
import {AbstractHubService} from "./hub";
import {PublishApi} from "../models/publish-api.model";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {User} from "../models/user.model";
import {ConfigService} from "./config.service";
import {OasLibraryUtils} from "oai-ts-core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {IAuthenticationService} from "./auth.service";


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

const RECENT_APIS_LOCAL_STORAGE_KEY = "apicurio.studio.services.hub-apis.recent-apis";


/**
 * An implementation of an API editing session.  Uses a Web Socket to communicate with
 * the server.
 */
export class ApiEditingSession implements IApiEditingSession {

    private _connectionHandler: IConnectionHandler;
    private _commandHandler: ICommandHandler;
    private _activityHandler: IActivityHandler;
    private _oasLibrary: OasLibraryUtils;

    private _connected: boolean;
    private _pingIntervalId: number;

    private _users: any = {};

    /**
     * Constructor.
     * @param {EditableApiDefinition} api
     * @param {WebSocket} socket
     */
    constructor(private api: EditableApiDefinition, private socket: WebSocket) {
        this._oasLibrary = new OasLibraryUtils();
        this._connected = false;
    }

    /**
     * Connects the websocket to the server.
     * @param {IConnectionHandler} handler
     */
    connect(handler: IConnectionHandler): void {
        let me: ApiEditingSession = this;
        this._connectionHandler = handler;
        this.socket.onopen = () => {
            console.info("[ApiEditingSession] WS connection to server OPEN.");
            this._connected = true;
            this._connectionHandler.onConnected();
            // Start the 45s ping.
            me.ping();
        };
        this.socket.onmessage = (msgEvent) => {
            console.info("[ApiEditingSession] Message received from server.");
            let msg: any = JSON.parse(msgEvent.data);
            console.info("                    Message type: %s", msg.type);
            if (msg.type === "command") {
                // Process a 'command' style message
                console.info("                    Content Version: %o", msg.contentVersion);
                console.info("                    Command: %o", msg.command);
                if (this._commandHandler) {
                    let command: ICommand = MarshallUtils.unmarshallCommand(msg.command);
                    let otCmd: OtCommand = new OtCommand();
                    otCmd.contentVersion = msg.contentVersion;
                    otCmd.command = command;
                    this._commandHandler.onCommand(otCmd);
                }
            } else if (msg.type === "ack") {
                // Process an 'ack' style message
                console.info("                    Command Id: %o", msg.commandId);
                if (this._commandHandler) {
                    let ack: ApiDesignCommandAck = new ApiDesignCommandAck();
                    ack.commandId = msg.commandId;
                    ack.contentVersion = msg.contentVersion;
                    this._commandHandler.onAck(ack);
                }
            } else if (msg.type === "join") {
                // Process a 'join' style message (user joined the session)
                console.info("                    User: %s", msg.user);
                console.info("                    ID: %s", msg.id);
                let user: ApiEditorUser = new ApiEditorUser();
                user.userId = msg.id;
                user.userName = msg.user;
                this._users[msg.id] = user;
                if (this._activityHandler) {
                    this._activityHandler.onJoin(user);
                }
            } else if (msg.type === "leave") {
                // Process a 'leave' style message (user left the session)
                console.info("                    User: %s", msg.user);
                console.info("                    ID: %s", msg.id);
                let user: ApiEditorUser = this._users[msg.id];
                if (user) {
                    delete this._users[msg.id];
                    if (this._activityHandler) {
                        this._activityHandler.onLeave(user);
                    }
                }
            } else if (msg.type === "selection") {
                // Process a 'leave' style message (user left the session)
                console.info("                    User: %s", msg.user);
                console.info("                    ID: %s", msg.id);
                console.info("                    Selection: %s", msg.selection);
                let user: ApiEditorUser = this._users[msg.id];
                if (user) {
                    this._activityHandler.onSelection(user, msg.selection);
                }
            } else {
                console.error("[ApiEditingSession] *** Invalid message type: %s", msg.type);
            }
        };
        this.socket.onclose = (event) => {
            console.info("[ApiEditingSession] WS connection to server CLOSED: %o", event);
            if (event.code === 1000) {
                this._connectionHandler.onClosed();
            } else {
                this._connectionHandler.onDisconnected(event.code);
            }
            this._connected = false;
            window.clearInterval(this._pingIntervalId);
        };
    }

    /**
     * Called to set the command handler.
     * @param {ICommandHandler} handler
     */
    commandHandler(handler: ICommandHandler): void {
        this._commandHandler = handler;
    }

    /**
     * Called to set the activity handler.
     * @param {IActivityHandler} handler
     */
    activityHandler(handler: IActivityHandler): void {
        this._activityHandler = handler;
    }

    /**
     * Called to send a command to the server.
     * @param {ICommand} command
     */
    sendCommand(command: OtCommand): void {
        let data: any = {
            type: "command",
            commandId: command.contentVersion,
            command: MarshallUtils.marshallCommand(command.command)
        };
        let dataStr: string = JSON.stringify(data);
        this.socket.send(dataStr);
    }

    /**
     * Called to send a selection event.  This is done whenever the local user
     * changes her selection (e.g. in the master view).
     * @param {string} selection
     */
    sendSelection(selection: string): void {
        let data: any = {
            type: "selection",
            selection: selection
        };
        let dataStr: string = JSON.stringify(data);
        this.socket.send(dataStr);
    }

    /**
     * Called to send a ping message to the server.
     */
    sendPing(): void {
        console.info("[ApiEditingSession] Sending PING.");
        let data: any = {
            type: "ping"
        };
        let dataStr: string = JSON.stringify(data);
        this.socket.send(dataStr);
    }

    /**
     * Called to close the connection with the server.  Should only be called
     * when the user leaves the editor.
     */
    close(): void {
        this.socket.close();
    }

    private ping(): void {
        console.info("[ApiEditingSession] Starting the ping interval.");
        this._pingIntervalId = window.setInterval(() => {
            this.sendPing();
        }, 45000);
    }
}


/**
 * An implementation of the APIs service that uses the Apicurio Studio back-end (Hub API) service
 * to store and retrieve relevant information for the user.
 */
export class ApisService extends AbstractHubService {

    private theRecentApis: Api[];
    private _recentApis: BehaviorSubject<Api[]> = new BehaviorSubject([]);
    private recentApis: Observable<Api[]> = this._recentApis.asObservable();

    private cachedApis: Api[] = null;
    private _user: User;

    /**
     * Constructor.
     * @param {HttpClient} http
     * @param {IAuthenticationService} authService
     * @param {ConfigService} config
     */
    constructor(http: HttpClient, authService: IAuthenticationService, config: ConfigService) {
        super(http, authService, config);
        this.theRecentApis = this.loadRecentApis();
        if (this.theRecentApis === null) {
            this._recentApis.next([]);
        } else {
            this._recentApis.next(this.theRecentApis);
        }
        authService.getAuthenticatedUser().subscribe( user => {
            this._user = user;
        });
    }

    /**
     * @see ApisService.getSupportedRepositoryTypes
     */
    public getSupportedRepositoryTypes(): string[] {
        return ["GitHub"];
    }

    /**
     * @see ApisService.getApis
     */
    public getApis(): Promise<Api[]> {
        console.info("[HubApisService] Getting all APIs");

        let listApisUrl: string = this.endpoint("/designs");
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Fetching API list: %s", listApisUrl);
        return this.httpGet<Api[]>(listApisUrl, options, (apis) => {
            this.cachedApis = apis;
            if (this.theRecentApis === null) {
                this.theRecentApis = this.getRecentFromAllApis(apis);
                this._recentApis.next(this.theRecentApis);
            }
            this.removeMissingRecentApis(apis);
            return apis;
        });
    }

    /**
     * @see ApisService.getRecentApis
     */
    public getRecentApis(): Observable<Api[]> {
        return this.recentApis;
    }

    /**
     * @see ApisService.createApi
     */
    public createApi(api: NewApi): Promise<Api> {
        console.info("[HubApisService] Creating the API via the hub API");

        let createApiUrl: string = this.endpoint("/designs");
        let options: any = this.options({ "Accept": "application/json", "Content-Type": "application/json" });

        console.info("[HubApisService] Creating an API Design: %s", createApiUrl);
        return this.httpPostWithReturn<NewApi, Api>(createApiUrl, api, options);
    }

    /**
     * @see ApisService.importApi
     */
    public importApi(api: ImportApi): Promise<Api> {
        console.info("[HubApisService] Importing an API design via the hub API");

        let importApiUrl: string = this.endpoint("/designs");
        let options: any = this.options({ "Accept": "application/json", "Content-Type": "application/json" });

        console.info("[HubApisService] Importing an API Design: %s", importApiUrl);
        return this.httpPutWithReturn<ImportApi, Api>(importApiUrl, api, options);
    }

    /**
     * @see ApisService.publishApi
     */
    public publishApi(apiId: string, info: PublishApi): Promise<void> {
        console.info("[HubApisService] Importing an API design via the hub API");

        let publishApiUrl: string = this.endpoint("/designs/:designId/publications", {
            designId: apiId
        });
        let options: any = this.options({ "Content-Type": "application/json" });

        console.info("[HubApisService] Publishing an API Design: %s", publishApiUrl);
        return this.httpPost<PublishApi>(publishApiUrl, info, options);
    }

    /**
     * @see ApisService.deleteApi
     */
    public deleteApi(api: Api): Promise<void> {
        console.info("[HubApisService] Deleting an API design via the hub API");

        let deleteApiUrl: string = this.endpoint("/designs/:designId", {
            designId: api.id
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Deleting an API Design: %s", deleteApiUrl);
        return this.httpDelete(deleteApiUrl, options, () => {
            this.cachedApis = null;
            this.removeFromRecent(api);
            this._recentApis.next(this.theRecentApis);
            console.info("[HubApisService] Successfully deleted API %s", api.id);
        });
    }

    /**
     * @see ApisService.getApi
     */
    public getApi(apiId: string): Promise<Api> {
        let getApiUrl: string = this.endpoint("/designs/:designId", {
            designId: apiId
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Getting an API Design: %s", getApiUrl);
        return this.httpGet<Api>(getApiUrl, options, (api) => {
            this.addToRecentApis(api);
            this._recentApis.next(this.theRecentApis);
            return api;
        });
    }

    /**
     * @see ApisService.editApi
     */
    public editApi(apiId: string): Promise<EditableApiDefinition> {
        return this.getApi(apiId).then( api => {
            let editApiUrl: string = this.endpoint("/designs/:designId/session", {
                designId: apiId
            });
            let options: any = this.options({ "Accept": "application/json" });

            console.info("[HubApisService] Editing API Design: %s", editApiUrl);
            options["observe"] = "response";
            return this.http.get(editApiUrl, options).map( event => {
                let response: HttpResponse<any> = <any>event as HttpResponse<any>;
                let openApiSpec: any = response.body;
                let rheaders: HttpHeaders = response.headers;
                let editingSessionUuid: string = rheaders.get("X-Apicurio-EditingSessionUuid");
                let contentVersion: string = rheaders.get("X-Apicurio-ContentVersion");

                console.info("[HubApisService] Editing Session UUID: %s", editingSessionUuid);
                console.info("[HubApisService] Content Version: %s", contentVersion);

                let def: EditableApiDefinition = EditableApiDefinition.fromApi(api);
                def.spec = openApiSpec;
                def.editingSessionUuid = editingSessionUuid;
                def.contentVersion = parseInt(contentVersion);

                return def;
            }).toPromise();
        }, () => {
            // TODO handle an error here!
            return null;
        });
    }

    /**
     * @see ApisService.openEditingSession
     */
    public openEditingSession(api: EditableApiDefinition): IApiEditingSession {
        let designId: string = api.id;
        let uuid: string = api.editingSessionUuid;
        let user: string = this._user.login;
        let secret: string = this.authService.getAuthenticationSecret().substr(0, 64);
        let url = this.editingEndpoint("/designs/:designId?uuid=:uuid&user=:user&secret=:secret", {
            designId: designId,
            uuid: uuid,
            user: user,
            secret: secret
        });

        console.info("[HubApisService] Opening editing session on URL: %s", url);

        let websocket: WebSocket = new WebSocket(url);

        let session: ApiEditingSession = new ApiEditingSession(api, websocket);
        return session;
    }

    /**
     * @see ApisService.getApiDefinition
     */
    public getApiDefinition(apiId: string): Promise<ApiDefinition> {
        return this.getApi(apiId).then( api => {
            let getContentUrl: string = this.endpoint("/designs/:designId/content", {
                designId: apiId
            });
            let options: any = this.options({ "Accept": "application/json" });
            console.info("[HubApisService] Getting API Design content: %s", getContentUrl);
            options["observe"] = "response";
            return this.http.get<any>(getContentUrl, options).map( event => {
                let response: HttpResponse<any> = <any>event as HttpResponse<any>;
                let openApiSpec: any = response.body;
                let apiDef: ApiDefinition = ApiDefinition.fromApi(api);
                apiDef.spec = openApiSpec;
                return apiDef;
            }).toPromise();
        });
    }

    /**
     * @see ApisService.getContributors
     */
    public getContributors(apiId: string): Promise<ApiContributors> {
        let contributorsUrl: string = this.endpoint("/designs/:designId/contributors", {
            designId: apiId
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Getting contributors: %s", contributorsUrl);
        options["observe"] = "response";
        return this.http.get<any[]>(contributorsUrl, options).map( event => {
            let response: HttpResponse<any[]> = <any>event as HttpResponse<any[]>;
            let items: any[] = response.body;
            let rval: ApiContributors = new ApiContributors();
            rval.contributors = [];
            rval.totalEdits = 0;
            items.forEach( item => {
                let name: string = item["name"];
                let edits: number = item["edits"];
                let contributor: ApiContributor = new ApiContributor();
                contributor.edits = edits;
                contributor.name = name;
                rval.contributors.push(contributor);
                rval.totalEdits += edits;
            });
            return rval;
        }).toPromise();
    }

    /**
     * @see ApisService.getCollaborators
     */
    public getCollaborators(apiId: string): Promise<ApiCollaborator[]> {
        console.info("[HubApisService] Getting collaborators for API Design %s", apiId);

        let getCollaboratorsUrl: string = this.endpoint("/designs/:designId/collaborators", {
            designId: apiId
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Fetching collaborator list: %s", getCollaboratorsUrl);
        return this.httpGet<ApiCollaborator[]>(getCollaboratorsUrl, options);
    }

    /**
     * @see ApisService.deleteCollaborator
     */
    public deleteCollaborator(apiId: string, userId: string): Promise<void> {
        console.info("[HubApisService] Deleting an API collaborator for API %s", apiId);

        let deleteCollaboratorUrl: string = this.endpoint("/designs/:designId/collaborators/:userId", {
            designId: apiId,
            userId: userId
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Deleting an API collaborator: %s", deleteCollaboratorUrl);
        return this.httpDelete(deleteCollaboratorUrl, options);
    }

    /**
     * @see ApisService.getInvitations
     */
    public getInvitations(apiId: string): Promise<Invitation[]> {
        console.info("[HubApisService] Getting all invitations for API %s", apiId);

        let getInvitationsUrl: string = this.endpoint("/designs/:designId/invitations", {
            designId: apiId
        });

        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Fetching collaboration invitations: %s", getInvitationsUrl);
        return this.httpGet<Invitation[]>(getInvitationsUrl, options);
    }

    /**
     * @see ApisService.getInvitation
     */
    public getInvitation(apiId: string, inviteId: string): Promise<Invitation> {
        let getInviteUrl: string = this.endpoint("/designs/:designId/invitations/:inviteId", {
            designId: apiId,
            inviteId: inviteId
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Getting an Invitation: %s", getInviteUrl);
        return this.httpGet<Invitation>(getInviteUrl, options);
    }

    /**
     * @see ApisService.createInvitation
     */
    public createInvitation(apiId: string): Promise<Invitation> {
        console.info("[HubApisService] Creating a collaboration invitation for API %s", apiId);

        let createInviteUrl: string = this.endpoint("/designs/:designId/invitations", {
            designId: apiId
        });
        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Creating an API Design collaboration invite: %s", createInviteUrl);
        return this.httpPostWithReturn<void, Invitation>(createInviteUrl, null, options);
    }

    /**
     * @see ApisService.rejectInvitation
     */
    public rejectInvitation(apiId: string, inviteId: string): Promise<void> {
        console.info("[HubApisService] Rejecting an API invitation to collaborate for API %s", apiId);

        let deleteInviteUrl: string = this.endpoint("/designs/:designId/invitations/:inviteId", {
            designId: apiId,
            inviteId: inviteId
        });
        let options: any = this.options({});

        console.info("[HubApisService] Rejecting an API invitation: %s", deleteInviteUrl);
        return this.httpDelete(deleteInviteUrl, options);
    }

    /**
     * @see ApisService.acceptInvitation
     */
    public acceptInvitation(apiId: string, inviteId: string): Promise<void> {
        console.info("[HubApisService] Accepting an API invitation to collaborate for API %s", apiId);

        let acceptInviteUrl: string = this.endpoint("/designs/:designId/invitations/:inviteId", {
            designId: apiId,
            inviteId: inviteId
        });
        let options: any = this.options({});

        console.info("[HubApisService] Accepting an API invitation: %s", acceptInviteUrl);
        return this.httpPut(acceptInviteUrl, null, options);
    }

    /**
     * @see ApisService.getActivity
     */
    public getActivity(apiId: string, start: number, end: number): Promise<ApiDesignChange[]> {
        console.info("[HubApisService] Getting all activity for API %s", apiId);

        let activityUrl: string = this.endpoint("/designs/:designId/activity", {
            designId: apiId
        }, {
            start: start,
            end: end
        });

        let options: any = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Fetching API design activity: %s", activityUrl);
        return this.httpGet<ApiDesignChange[]>(activityUrl, options);
    }


    /**
     * Loads the recent APIs from browser local storage.
     * @return {Api[]}
     */
    private loadRecentApis(): Api[] {
        let storedApis: string = localStorage.getItem(RECENT_APIS_LOCAL_STORAGE_KEY);
        if (storedApis) {
            let apis: any[] = JSON.parse(storedApis);
            return apis;
        } else {
            return null;
        }
    }

    /**
     * Returns the most recent 3 APIs from the full list of APIs provided.  Uses the
     * API's "last modified" time to determine the most recent 3 APIs.
     * @param {Api[]} apis
     * @return {Api[]}
     */
    private getRecentFromAllApis(apis: Api[]): Api[] {
        return apis.slice().sort( (api1, api2) => {
            return -1;
        }).slice(0, 3);
    }

    /**
     * Adds the given API to the list of "recent APIs".  This may also remove an API
     * from the list in addition to re-ordering the recent APIs list.
     * @param {Api} api
     * @return {Api[]}
     */
    private addToRecentApis(api: Api): Api[] {
        let recent: Api[] = [];
        if (this.theRecentApis !== null) {
            recent = this.theRecentApis.slice();
        }

        // Check if the api is already in the list
        let oldApi: Api = null;
        recent.forEach( a => {
            if (api.id === a.id) {
                oldApi = a;
            }
        });
        // If so, remove it.
        if (oldApi !== null) {
            recent.splice(recent.indexOf(oldApi), 1);
        }

        // Now push the API onto the list (should be first)
        recent.unshift(api);

        // Limit the # of APIs to 3
        if (recent.length > 3) {
            recent = recent.slice(0, 3);
        }

        // Finally save the recent APIs in local storage
        setTimeout(() => {
            let serializedApis: string = JSON.stringify(recent);
            localStorage.setItem(RECENT_APIS_LOCAL_STORAGE_KEY, serializedApis);
        }, 50);

        this.theRecentApis = recent;
        return recent;
    }

    /**
     * Removes an API from the list of recent APIs.
     * @param {Api} api
     * @return {Api[]}
     */
    private removeFromRecent(api: Api) {
        let recent: Api[] = [];
        if (this.theRecentApis !== null) {
            recent = this.theRecentApis.slice();
        }

        // Check if the api is in the list
        let oldApi: Api = null;
        recent.forEach( a => {
            if (api.id === a.id) {
                oldApi = a;
            }
        });
        // If so, remove it.
        if (oldApi !== null) {
            recent.splice(recent.indexOf(oldApi), 1);
        }

        // Save the recent APIs in local storage
        setTimeout(() => {
            let serializedApis: string = JSON.stringify(recent);
            localStorage.setItem(RECENT_APIS_LOCAL_STORAGE_KEY, serializedApis);
        }, 50);

        this.theRecentApis = recent;
        return recent;
    }

    /**
     * Removes any API from the "recent APIs" list that is not in the
     * given list of "all" Apis.
     * @param {Api[]} apis
     */
    private removeMissingRecentApis(apis: Api[]) {
        this.theRecentApis.filter( recentApi => {
            let found: boolean = false;
            apis.forEach( api => {
                if (api.id === recentApi.id) {
                    found = true;
                }
            });
            return !found;
        }).forEach( diffApi => {
            console.info("[HubApisService] Removing '%s' from the recent APIs list.", diffApi.name);
            this.theRecentApis.splice(this.theRecentApis.indexOf(diffApi), 1);
        });
    }
}
