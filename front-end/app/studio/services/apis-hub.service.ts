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
import 'rxjs/Rx';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

import {IApiEditingSession, IApisService, ICommandHandler, IConnectionHandler} from "./apis.service";
import {Api, ApiDefinition, EditableApiDefinition} from "../models/api.model";
import {IAuthenticationService} from "./auth.service";
import {ConfigService} from "./config.service";
import {ApiCollaborator, ApiCollaborators} from "../models/api-collaborators";

import {Headers, Http, RequestOptions} from "@angular/http";
import {NewApi} from "../models/new-api.model";
import {ImportApi} from "../models/import-api.model";
import {AbstractHubService} from "./hub";
import {User} from "../models/user.model";
import {ICommand, MarshallUtils} from "oai-ts-commands";
import {OasLibraryUtils} from "oai-ts-core";


const RECENT_APIS_LOCAL_STORAGE_KEY = "apicurio.studio.services.hub-apis.recent-apis";

/**
 * An implementation of an API editing session.  Uses a Web Socket to communicate with
 * the server.
 */
class ApiEditingSession implements IApiEditingSession {

    private _connectionHandler: IConnectionHandler;
    private _commandHandler: ICommandHandler;
    private _oasLibrary: OasLibraryUtils;

    private _connected: boolean;
    private _pingIntervalId: number;

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
            console.info("                    Content Version: %o", msg.contentVersion);
            console.info("                    Command: %o", msg.command);
            if (msg.type === "command") {
                // Process a 'command' style message
                let command: ICommand = MarshallUtils.unmarshallCommand(msg.command);
                if (this._commandHandler) {
                    this._commandHandler.onCommand(command);
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
     * Called to send a command to the server.
     * @param {ICommand} command
     */
    sendCommand(command: ICommand): void {
        let data: any = {
            type: "command",
            command: MarshallUtils.marshallCommand(command)
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
export class HubApisService extends AbstractHubService implements IApisService {

    private theRecentApis: Api[];
    private _recentApis: BehaviorSubject<Api[]> = new BehaviorSubject([]);
    private recentApis: Observable<Api[]> = this._recentApis.asObservable();

    private cachedApis: Api[] = null;
    private _user: User;

    /**
     * Constructor.
     * @param http
     * @param authService
     */
    constructor(http: Http, authService: IAuthenticationService, config: ConfigService) {
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
     * @see IApisService.getSupportedRepositoryTypes
     */
    public getSupportedRepositoryTypes(): string[] {
        return ["GitHub"];
    }

    /**
     * @see IApisService.getApis
     */
    public getApis(): Promise<Api[]> {
        console.info("[HubApisService] Getting all APIs");

        let listApisUrl: string = this.endpoint("/designs");
        let options: RequestOptions = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Fetching API list: %s", listApisUrl);

        return this.http.get(listApisUrl, options).map( response => {
            let apis: Api[] = response.json() as Api[];
            this.cachedApis = apis;
            if (this.theRecentApis === null) {
                this.theRecentApis = this.getRecentFromAllApis(apis);
                this._recentApis.next(this.theRecentApis);
            }
            this.removeMissingRecentApis(apis);
            return apis;
        }).toPromise();
    }

    /**
     * @see IApisService.getRecentApis
     */
    public getRecentApis(): Observable<Api[]> {
        return this.recentApis;
    }

    /**
     * @see IApisService.createApi
     */
    public createApi(api: NewApi): Promise<Api> {
        console.info("[HubApisService] Creating the API via the hub API");

        let createApiUrl: string = this.endpoint("/designs");
        let options: RequestOptions = this.options({ "Accept": "application/json", "Content-Type": "application/json" });
        let body: any = api;

        console.info("[HubApisService] Creating an API Design: %s", createApiUrl);

        return this.http.post(createApiUrl, body, options).map( response => {
            let api: Api = response.json() as Api;
            return api;
        }).toPromise();
    }

    /**
     * @see IApisService.importApi
     */
    public importApi(api: ImportApi): Promise<Api> {
        console.info("[HubApisService] Importing an API design via the hub API");

        let importApiUrl: string = this.endpoint("/designs");
        let options: RequestOptions = this.options({ "Accept": "application/json", "Content-Type": "application/json" });
        let body: any = api;

        console.info("[HubApisService] Importing an API Design: %s", importApiUrl);

        return this.http.put(importApiUrl, body, options).map( response => {
            let api: Api = response.json() as Api;
            return api;
        }).toPromise();
    }

    /**
     * @see IApisService.deleteApi
     */
    public deleteApi(api: Api): Promise<void> {
        console.info("[HubApisService] Deleting an API design via the hub API");

        let deleteApiUrl: string = this.endpoint("/designs/:designId", {
            designId: api.id
        });
        let options: RequestOptions = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Deleting an API Design: %s", deleteApiUrl);

        return this.http.delete(deleteApiUrl, options).map( () => {
            this.cachedApis = null;
            this.removeFromRecent(api);
            this._recentApis.next(this.theRecentApis);
            return null;
        }).toPromise();
    }

    /**
     * @see IApisService.getApi
     */
    public getApi(apiId: string): Promise<Api> {
        let getApiUrl: string = this.endpoint("/designs/:designId", {
            designId: apiId
        });
        let options: RequestOptions = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Getting an API Design: %s", getApiUrl);

        return this.http.get(getApiUrl, options).map( response => {
            let api: Api = response.json() as Api;
            this.addToRecentApis(api);
            this._recentApis.next(this.theRecentApis);
            return api;
        }).toPromise();
    }

    /**
     * @see IApisService.editApi
     */
    public editApi(apiId: string): Promise<EditableApiDefinition> {
        return this.getApi(apiId).then( api => {
            let editApiUrl: string = this.endpoint("/designs/:designId/session", {
                designId: apiId
            });
            let options: RequestOptions = this.options({ "Accept": "application/json" });

            console.info("[HubApisService] Editing API Design: %s", editApiUrl);

            return this.http.get(editApiUrl, options).map( response => {
                let openApiSpec: any = response.json();
                let rheaders: Headers = response.headers;
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
        }, error => {
            // TODO handle an error here!
        });
    }

    /**
     * @see IApisService.openEditingSession
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
     * @see IApisService.getApiDefinition
     */
    public getApiDefinition(apiId: string): Promise<ApiDefinition> {
        return this.getApi(apiId).then( api => {
            let getContentUrl: string = this.endpoint("/designs/:designId/content", {
                designId: apiId
            });
            let options: RequestOptions = this.options({ "Accept": "application/json" });

            console.info("[HubApisService] Getting API Design content: %s", getContentUrl);

            return this.http.get(getContentUrl, options).map( response => {
                let openApiSpec: any = response.json();
                let apiDef: ApiDefinition = ApiDefinition.fromApi(api);
                apiDef.spec = openApiSpec;
                return apiDef;
            }).toPromise();
        });
    }

    /**
     * @see IApisService.getCollaborators
     */
    public getCollaborators(apiId: string): Promise<ApiCollaborators> {
        let collaboratorsUrl: string = this.endpoint("/designs/:designId/collaborators", {
            designId: apiId
        });
        let options: RequestOptions = this.options({ "Accept": "application/json" });

        console.info("[HubApisService] Getting collaborators: %s", collaboratorsUrl);

        return this.http.get(collaboratorsUrl, options).map( response => {
            let items: any[] = response.json();
            let rval: ApiCollaborators = new ApiCollaborators();
            rval.collaborators = [];
            rval.totalEdits = 0;
            items.forEach( item => {
                let name: string = item["name"];
                let edits: number = item["edits"];
                let collaborator: ApiCollaborator = new ApiCollaborator();
                collaborator.edits = edits;
                collaborator.name = name;
                rval.collaborators.push(collaborator);
                rval.totalEdits += edits;
            });
            return rval;
        }).toPromise();
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
