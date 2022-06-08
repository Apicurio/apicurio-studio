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

import {
    AfterViewInit,
    Component,
    HostListener,
    Injectable,
    NgZone,
    QueryList,
    ViewChild,
    ViewChildren
} from "@angular/core";
import {
    ActivatedRoute,
    CanDeactivate,
    Router
} from "@angular/router";
import {EditableApiDefinition} from "../../../../models/api.model";
import {ApisService, IApiEditingSession} from "../../../../services/apis.service";
import {AbstractPageComponent} from "../../../../components/page-base.component";
import {DefaultSeverityRegistry, IValidationSeverityRegistry, Library, OtCommand} from "@apicurio/data-models";
import {EditorDisconnectedDialogComponent} from "./_components/dialogs/editor-disconnected.component";
import {VersionedAck} from "../../../../models/ack.model";
import {ApiEditorUser} from "../../../../models/editor-user.model";
import {Title} from "@angular/platform-browser";
import {ValidationProfileExt, ValidationService} from "../../../../services/validation.service";
import {ConfigService} from "../../../../services/config.service";
import {ApiEditorComponentFeatures} from "./_models/features.model";
import {DispatchQueue} from "apicurio-ts-core";
import {StorageError} from "../../../../models/storageError.model";
import * as moment from "moment";
import {DeferredAction} from "../../../../models/deferred.model";
import {AbstractApiEditorComponent} from "./editor.base";
import {ComponentType} from "./_models/component-type.model";
import {ImportedComponent} from "./_models/imported-component.model";
import {ImportComponentsWizard} from "../_components/import-components.wizard";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {HttpUtils} from "../../../../util/common";


enum PendingActionType {
    command, undo, redo
}
function pendingActionType(from: string): PendingActionType {
    if (from === "command") { return PendingActionType.command; }
    if (from === "undo") { return PendingActionType.undo; }
    if (from === "redo") { return PendingActionType.redo; }
    return null;
}

enum PendingActionStatus {
    pending, failed, deferred
}


/**
 * Represents a single action the user has taken in the editor that is awaiting server
 * persistence acknowledgement.
 */
class PendingAction {

    public type: PendingActionType;
    public status: PendingActionStatus;
    public id: number;
    public action: any;

}


/**
 * Used to collect actions the user has taken that require persistence on the server.  Actions are
 * added to this collection of actions and then removed when we receive an acknowledgement from
 * the server that persistence was accomplished successfully.  If this collection of actions is
 * not empty, then navigating away from the editor MAY result in lost changes.
 */
class PendingActions {

    private actions: PendingAction[] = [];

    public add(action: PendingAction): void {
        this.actions.push(action);
    }

    public remove(type: PendingActionType, actionId: number): PendingAction {
        let rval: PendingAction = null;
        let idx: number;
        for (idx = 0; idx < this.actions.length; idx++) {
            let action: PendingAction = this.actions[idx];
            if (action.id === actionId) {
                break;
            }
        }
        if (idx < this.actions.length) {
            rval = this.actions[idx];
            this.actions.splice(idx, 1);
        }
        return rval;
    }

    public setStatus(type: PendingActionType, actionId: number, status: PendingActionStatus): void {
        this.actions.forEach(action => {
            if (action.id === actionId) {
                action.status = status;
            }
        });
    }

    public getFailedActions(): PendingAction[] {
        return this.actions.filter( action => {
            return action.status === PendingActionStatus.failed;
        });
    }

    public getDeferredActions(): PendingAction[] {
        return this.actions.filter( action => {
            return action.status === PendingActionStatus.deferred;
        });
    }

    public updateUndoRedo(commandId: number, contentVersion: number) {
        this.actions.forEach(action => {
            if (action.id === commandId && (action.type === PendingActionType.undo || action.type === PendingActionType.redo)) {
                action.id = contentVersion;
            }
        });
    }

    public hasFailedActions(): boolean {
        for (let idx = 0; idx < this.actions.length; idx++) {
            let action: PendingAction = this.actions[idx];
            if (action.status === PendingActionStatus.failed) {
                return true;
            }
        }
        return false;
    }

    public hasDeferredActions(): boolean {
        for (let idx = 0; idx < this.actions.length; idx++) {
            let action: PendingAction = this.actions[idx];
            if (action.status === PendingActionStatus.deferred) {
                return true;
            }
        }
        return false;
    }

    public size(): number {
        return this.actions.length;
    }

    public isEmpty(): boolean {
        return this.size() === 0;
    }

}


@Component({
    selector: "api-editor-page",
    templateUrl: "api-editor.page.html",
    styleUrls: ["api-editor.page.css"]
})
export class ApiEditorPageComponent extends AbstractPageComponent implements AfterViewInit {

    public apiDefinition: EditableApiDefinition;
    public editorFeatures: ApiEditorComponentFeatures;

    protected isDirty: boolean = false;
    protected isSaving: boolean = false;

    @ViewChildren("apiEditor") _apiEditor: QueryList<AbstractApiEditorComponent>;
    @ViewChild("editorDisconnectedModal", { static: true }) editorDisconnectedModal: EditorDisconnectedDialogComponent;
    @ViewChild("importComponentsWizard", { static: true }) importComponentsWizard: ImportComponentsWizard;
    private editorAvailable: boolean;

    private editingSession: IApiEditingSession;
    public activeCollaborators: ApiEditorUser[] = [];
    private _activeCollaboratorColors: string[] = [
        "DC3E3E", "DC823E", "DC3EBD", "3EDC6D", "3E4EDC", "3ECCDC", "DCD23E"
    ];
    private _activeCollaboratorColorsIdx: number = 0;

    private pendingCommandQueue: DispatchQueue<OtCommand> = new DispatchQueue<OtCommand>();

    pendingActions: PendingActions = new PendingActions();
    hasFailedActions: boolean = false;
    showOfflineModeMessage: boolean = false;
    retryTimerId: number;
    retryTimerDate: Date;
    reconnecting: boolean = false;
    isOffline: boolean;
    httpFetchEnabled: boolean = true; // TODO should be configurable - true in PROD mode and false in DEV mode (see usage below)
    uiUrl: string = "";

    private currentEditorSelection: string;

    protected validationRegistry: IValidationSeverityRegistry = new DefaultSeverityRegistry();
    private validationProfile: ValidationProfileExt;

    private previewWindow: Window = null;

    /**
     * Constructor.
     * @param router
     * @param route
     * @param zone
     * @param http
     * @param apis
     * @param titleService
     * @param validationService
     * @param config
     */
    constructor(private router: Router, route: ActivatedRoute, private zone: NgZone, protected http: HttpClient,
                private apis: ApisService, titleService: Title, private validationService: ValidationService,
                private config: ConfigService) {
        super(route, titleService);
        this.apiDefinition = new EditableApiDefinition();
        this.editorFeatures = new ApiEditorComponentFeatures();
        this.editorFeatures.validationSettings = true;
        this.editorFeatures.componentImports = true;
        if (this.config.uiUrl()) {
            this.uiUrl = this.config.uiUrl();
        }
    }

    public isOpenApi20(): boolean {
        return this.apiDefinition.type === "OpenAPI20";
    }

    public isOpenApi30(): boolean {
        return this.apiDefinition.type === "OpenAPI30";
    }

    public isAsyncApi20(): boolean {
        return this.apiDefinition.type === "AsyncAPI20";
    }

    public isGraphQL(): boolean {
        return this.apiDefinition.type === "GraphQL";
    }

    /**
     * The page title.
     * 
     */
    protected pageTitle(): string {
        if (this.apiDefinition.name) {
            return "Apicurio Studio - API Editor :: " + this.apiDefinition.name;
        } else {
            return "Apicurio Studio - API Editor";
        }
    }

    /**
     * Called to kick off loading the page's async data.
     * @param params
     */
    public loadAsyncPageData(params: any): void {
        this.editorAvailable = false;

        console.info("[ApiEditorPageComponent] Loading async page data");
        let apiId: string = params["apiId"];
        this.apiDefinition.name = apiId;
        this.apiDefinition.id = apiId;

        this.openEditingSession(apiId, false);
    }

    /**
     * Called to import one or more components of the given type.
     * @param componentType
     */
    public importComponents = (componentType: ComponentType) : Promise<ImportedComponent[]> => {
        return this.importComponentsWizard.open(componentType);
    }

    /**
     * Fetches external content on behalf of the editor.  This implementation should handle both
     * external http(s) content as well as internal Apicurio Studio content.
     * @param externalRef
     */
    public fetchExternalContent = (externalRef: string): Promise<any> => {
        console.info("[ApiEditorPageComponent] Fetching content from: ", externalRef);
        if (externalRef.startsWith("apicurio:")) {
            let designId: string = externalRef.substring(externalRef.indexOf(":") + 1);
            return this.apis.getApiDefinition(designId).then( apiDef => {
                return apiDef.spec;
            });
        } else if (externalRef.toLowerCase().startsWith("http") && this.httpFetchEnabled) {
            try {
                let fetchUrl: string = `${ this.uiUrl }fetch?url=${ encodeURI(externalRef) }`;
                console.debug("[ApiEditorPageComponent] Fetch URL: ", fetchUrl);
                let options: any = {
                    observe: "response"
                };
                return HttpUtils.mappedPromise<any>(
                    this.http.get<HttpResponse<any>>(fetchUrl, options).toPromise(),
                    (response) => {
                        return response.body; }
                );
            } catch (e) {
                console.error("[ApiCatalogService] Error fetching external http(s) API/content.");
                console.error(e);
            }
        }
        return Promise.resolve(null);
    }

    /**
     * Called to open an editing session by creating a web socket connection to the server.  First,
     * a REST call is made (for auth purposes) and then the
     * @param apiId
     * @param isReconnect
     */
    protected openEditingSession(apiId: string, isReconnect: boolean): void {
        let __component: ApiEditorPageComponent = this;

        this.apis.editApi(apiId).then( def => {
            console.info("[ApiEditorPageComponent] Definition loaded.  Opening editing session.");
            if (!isReconnect) {
                this.apiDefinition = def;
                this.loaded("def");
                this.updatePageTitle();
                this.updateValidationProfile();
            }
            this.editingSession = this.apis.openEditingSession(def);
            this.editingSession.commandHandler({
                onCommand: (command) => {
                    this.zone.run(() => {
                        __component.executeCommand(command);
                    });
                },
                onAck: (ack) => {
                    this.zone.run(() => {
                        if (ack.ackType === "command") {
                            __component.finalizeCommand(ack);
                        } else if (ack.ackType === "undo") {
                            __component.finalizeUndo(ack);
                        } else if (ack.ackType === "redo") {
                            __component.finalizeRedo(ack);
                        }
                    });
                },
                onDeferredAction: (deferred) => {
                    this.zone.run(() => {
                        __component.deferAction(deferred);
                    });
                },
                onStorageError: (error) => {
                    this.zone.run(() => {
                        __component.handleStorageError(error);
                    });
                },
                onUndo: (contentVersion) => {
                    this.zone.run(() => {
                        __component.undoCommand(contentVersion);
                    });
                },
                onRedo: (contentVersion) => {
                    this.zone.run(() => {
                        __component.redoCommand(contentVersion);
                    });
                }
            });
            this.editingSession.activityHandler( {
                onJoin: (user) => {
                    this.zone.run(() => {
                        user.attributes["color"] = __component.nextCollaboratorColor();
                        this.activeCollaborators.push(user);
                        // this.activeCollaborators.sort((c1, c2) => {
                        //     return c1.userName.localeCompare(c2.userName);
                        // });
                        __component.editingSession.sendSelection(__component.currentEditorSelection);
                    });
                },
                onLeave: (user) => {
                    this.zone.run(() => {
                        console.info("[ApiEditorPageComponent] User left the session, clearing their selection.");
                        __component.updateSelection(user, null);
                        for (let idx = this.activeCollaborators.length - 1; idx >= 0; idx--) {
                            if (this.activeCollaborators[idx].userId === user.userId) {
                                this.activeCollaborators.splice(idx, 1);
                                return;
                            }
                        }
                    });
                },
                onSelection: (user, selection) => {
                    this.zone.run(() => {
                        user.attributes["selection"] = selection;
                        __component.updateSelection(user, selection);
                    });
                }
            });
            this.editingSession.connect({
                onConnected: () => {
                    console.info("[ApiEditorPageComponent] Editing session connected.  Marking 'session' as loaded.");
                    this.zone.run(() => {
                        this.loaded("session");
                        this.isOffline = false;
                        if (isReconnect) {
                            this.reconnecting = false;
                            this.reconnect();
                        }
                    });
                },
                onClosed: () => {
                    console.info("[ApiEditorPageComponent] **Notice** editing session disconnected normally.");
                },
                onDisconnected: (code) => {
                    console.info("[ApiEditorPageComponent] **Notice** editing session DROPPED!  Reason code: %o", code);
                    this.zone.run(() => {
                        this.isOffline = true;
                        this.reconnecting = false;
                        this.editorDisconnectedModal.open();
                    });
                }
            });
        }).catch(error => {
            console.error("[ApiEditorPageComponent] Error editing API design.");
            if (!isReconnect) {
                this.error(error);
            } else {
                this.reconnecting = false;
            }
        });
    }

    @HostListener('window:beforeunload', ['$event'])
    public handleBeforeUnload(event: any){
        if (!this.pendingActions.isEmpty()) {
            let msg: string = `You have ${ this.pendingActions.size() } unsaved changes.  Are you sure to close the page?`;
            event.returnValue = msg;
            return msg;
        }
    }

    /**
      * When the API is loaded, we need to load the validation profile for this API from the
      * validation service.
      */
    protected updateValidationProfile(): void {
        const profile = this.validationService.getProfileForApi(this.apiDefinition.id);

        if (profile) {
            this.validationRegistry = profile.registry;
        } else {
            this.validationRegistry = null;
        }
    }

    public ngAfterViewInit(): void {
        this._apiEditor.changes.subscribe(() => {
            if (this._apiEditor.first && !this.editorAvailable) {
                this.editorAvailable = true;
                this.pendingCommandQueue.subscribe(command => {
                    this._apiEditor.first.executeCommand(command);
                });
            }
        });
        
        this.validationService.getValidationProfiles().then(() => {
            this.validationProfile = this.validationService.getProfileForApi(this.apiDefinition.id);
        })
    } 

    public loadingState(): string {
        if (this.isLoaded("session")) {
            if (this.isOpenApi20() || this.isOpenApi30()) {
                return "loaded-oai";
            } else if (this.isAsyncApi20()) {
                return "loaded-aai";
            } else {
                return "loaded-graphql";
            }
        }
        if (this.isLoaded("def")) {
            return "loading-session";
        }
        return "loading-def";
    }

    /**
     * Called when the page is destroyed.
     */
    public ngOnDestroy(): void {
        if (this.editingSession) {
            this.editingSession.close();
        }
        if (this.previewWindow && !this.previewWindow.closed) {
            this.previewWindow.close();
        }
    }

    /**
     * Called when the editor fires this event (the local user changed the document).
     * @param command
     */
    public onCommandExecuted(command: OtCommand): void {
        let pendingAction: PendingAction = new PendingAction();
        pendingAction.type = PendingActionType.command;
        pendingAction.id = command.contentVersion;
        pendingAction.status = PendingActionStatus.pending;
        pendingAction.action = command;
        this.pendingActions.add(pendingAction);

        // If we're in offline mode, immediately set the action status to deferred (and don't submit to the server).
        if (this.isOffline) {
            pendingAction.status = PendingActionStatus.deferred;
        } else {
            this.editingSession.sendCommand(command);
            this.reloadLivePreview();
        }
    }

    /**
     * Called when the user's selection changes.
     * @param selection
     */
    public onSelectionChanged(selection: string): void {
        this.currentEditorSelection = selection;
        this.editingSession.sendSelection(selection);
    }

    /**
     * Called when the user "undoes" a command in the editor/UI.
     */
    public onEditorUndo(event: OtCommand): void {
        let pendingAction: PendingAction = new PendingAction();
        pendingAction.type = PendingActionType.undo;
        pendingAction.id = event.contentVersion;
        pendingAction.status = PendingActionStatus.pending;
        pendingAction.action = event;
        this.pendingActions.add(pendingAction);

        console.info("[ApiEditorPageComponent] Added undo pending action with id: %o", pendingAction.id);

        // If we're in offline mode, immediately set the action status to deferred (and don't submit to the server).
        if (this.isOffline) {
            pendingAction.status = PendingActionStatus.deferred;
        } else {
            this.editingSession.sendUndo(event);
            this.reloadLivePreview();
        }
    }

    /**
     * Called when the user "redoes" a command in the editor/UI.
     */
    public onEditorRedo(event: OtCommand): void {
        let pendingAction: PendingAction = new PendingAction();
        pendingAction.type = PendingActionType.redo;
        pendingAction.id = event.contentVersion;
        pendingAction.status = PendingActionStatus.pending;
        pendingAction.action = event;
        this.pendingActions.add(pendingAction);

        // If we're in offline mode, immediately set the action status to deferred (and don't submit to the server).
        if (this.isOffline) {
            pendingAction.status = PendingActionStatus.deferred;
        } else {
            this.editingSession.sendRedo(event);
            this.reloadLivePreview();
        }
    }

    /**
     * Executes the given command in the editor.
     * @param command
     */
    protected executeCommand(command: OtCommand): void {
        this.pendingCommandQueue.enqueue(command);
    }

    /**
     * Performs a 'undo' on the given command content version.
     * @param contentVersion
     */
    protected undoCommand(contentVersion: number): void {
        if (this.editorAvailable) {
            this._apiEditor.first.undoCommand(contentVersion);
        } else {
            // TODO queue these if the editor is not available yet or use an observable
        }
    }

    /**
     * Performs a 'redo' on the given command content version.
     * @param contentVersion
     */
    protected redoCommand(contentVersion: number): void {
        if (this.editorAvailable) {
            this._apiEditor.first.redoCommand(contentVersion);
        } else {
            // TODO queue these if the editor is not available yet or use an observable
        }
    }

    /**
     * Finalizes a given command after receiving an ack from the server.
     * @param ack
     */
    protected finalizeCommand(ack: VersionedAck): void {
        console.info("[ApiEditorPageComponent] Finalizing command with local id: %o", ack.commandId);
        this.pendingActions.remove(PendingActionType.command, ack.commandId);
        this.pendingActions.updateUndoRedo(ack.commandId, ack.contentVersion);
        this._apiEditor.first.finalizeCommand(ack);
        this.checkPendingActions();
    }

    /**
     * Finalizes a given undo action taken by the user.  This lets us know that the undo was
     * properly persisted on the server.
     * @param ack
     */
    protected finalizeUndo(ack: VersionedAck): void {
        console.info("[ApiEditorPageComponent] Finalizing undo action for: %o", ack.contentVersion);
        this.pendingActions.remove(PendingActionType.undo, ack.contentVersion);
        this.checkPendingActions();
    }

    /**
     * Finalizes a given redo action taken by the user.  This lets us know that the redo was
     * properly persisted on the server.
     * @param ack
     */
    protected finalizeRedo(ack: VersionedAck): void {
        console.info("[ApiEditorPageComponent] Finalizing redo action for: %o", ack.contentVersion);
        this.pendingActions.remove(PendingActionType.redo, ack.contentVersion);
        this.checkPendingActions();
    }

    /**
     * Called when we get a "deferred action" message from the server.  This usually means that
     * something was attempted (such as an undo or redo) but didn't work and should be retried.
     * No error occurred and we have reason to expect that retrying again in the future may
     * work.
     *
     * For example, this can happen when the user "undoes" a pending command.  The client will
     * send an "undo" message to the server but the server will fail to undo the command (because
     * the server can only undo persisted commands).  The assumption is that persisting the command
     * simply hasn't happened yet, but is pending.  So if we just wait a bit and try again, then
     * the undo should work.
     *
     * @param deferred
     */
    protected deferAction(deferred: DeferredAction): void {
        console.info("[] Deferring an %o action with id: %o", deferred.actionType, deferred.id)
        this.pendingActions.setStatus(pendingActionType(deferred.actionType), deferred.id, PendingActionStatus.deferred);
        this.startRetryTimer();
    }

    /**
     * Called when storage of a command fails.  When this happens, the command has not been persisted
     * in the server's database, which means that if the user navigates away from the editor page they
     * will lose data.
     * @param error
     */
    protected handleStorageError(error: StorageError) {
        if (!this.hasFailedActions) {
            this.showOfflineModeMessage = true;
            this.hasFailedActions = true;
            this.startRetryTimer();
        }
        this.pendingActions.setStatus(pendingActionType(error.failedType), error.id, PendingActionStatus.failed);
    }

    /**
     * Updates the selection state for the given user.
     * @param user
     * @param selection
     */
    protected updateSelection(user: ApiEditorUser, selection: string) {
        // TODO convert this to a pubsub model like pending commands - I think selection update events may arrive before the editor is initialized.
        if (this._apiEditor.first) {
            this._apiEditor.first.updateCollaboratorSelection(user, selection);
        }
    }

    /**
     * Called when the user changes validation profiles for the API.
     * @param profile
     */
    public changeValidationProfile(profile: ValidationProfileExt): void {
        this.validationProfile = profile;
        this.validationRegistry = profile.registry;
        this.validationService.setProfileForApi(this.apiDefinition.id, profile);
    }

    /**
     * Opens the "live preview" window to display the ReDoc documentation to the user.  The documentation
     * will be reloaded whenever a change is made.
     */
    public openLivePreview(): void {
        let previewUrl = this.config.uiUrl() + "preview?aid=" + this.apiDefinition.id;
        this.previewWindow = window.open(previewUrl, "_apicurio_preview_" + this.apiDefinition.id);
    }

    /**
     * Reloads the live preview window (typically called when the user makes a change/edit).
     */
    private reloadLivePreview(): void {
        if (this.previewWindow && !this.previewWindow.closed) {
            console.info("[ApiEditorPageComponent] Reloading live preview.");
            this.previewWindow.location.reload();
        }
    }

    /**
     * Gets the next collaborator color from the list.
     */
    public nextCollaboratorColor(): string {
        this._activeCollaboratorColorsIdx = (this._activeCollaboratorColorsIdx + 1) % this._activeCollaboratorColors.length;
        return this._activeCollaboratorColors[this._activeCollaboratorColorsIdx];
    }

    /**
     * Returns the first initial of the name of the given collaborator.
     */
    public collaboratorInitial(user: ApiEditorUser): string {
        return user.userName[0];
    }

    /**
     * The user clicked on the collaborator's icon, which means we should navigate the user to the
     * content currently selected by that collaborator.
     * @param user
     */
    public goToCollaboratorSelection(user: ApiEditorUser): void {
        if (this.editorAvailable) {
            let collaboratorPath: string = user.attributes["selection"];
            if (collaboratorPath) {
                this._apiEditor.first.select(collaboratorPath, true);
            }
        }
    }

    /**
     * Called when the user clicks the "Reconnect Now" button (when in offline mode).
     */
    public reconnectNow(): void {
        this.reconnecting = true;
        this.reconnect();
        // If we're reconnecting due to failure, then we aren't really going to make a new socket
        // connection.  So instead we need to set "reconnecting" to false after some amount of time.
        // Because in this we're really just re-trying the commands, not actually re-connecting.
        if (!this.isOffline) {
            setTimeout(() => {
                this.reconnecting = false;
            }, 3000);
        }
    }

    /**
     * Attempt to reconnect to the server, retrying any failed actions.
     */
    public reconnect(): void {
        console.info("[ApiEditorPageComponent] Attempting to reconnect to the server.");

        // Try to reconnect if we're currently offline.
        if (this.isOffline) {
            this.openEditingSession(this.apiDefinition.id, true);
            return;
        }

        // Retry failed actions (if we have any)
        if (this.pendingActions.hasFailedActions()) {
            console.debug("[ApiEditorPageComponent] Re-trying failed actions.");
            let actions: PendingAction[] = this.pendingActions.getFailedActions();
            let items: any[] = [];
            actions.forEach(action => {
                if (action.type === PendingActionType.command) {
                    items.push(this.editingSession.createBatchItem("command", <OtCommand>action.action));
                } else if (action.type === PendingActionType.undo) {
                    items.push(this.editingSession.createBatchItem("undo", <OtCommand>action.action));
                } else if (action.type === PendingActionType.redo) {
                    items.push(this.editingSession.createBatchItem("redo", <OtCommand>action.action));
                }
            });
            this.editingSession.sendBatch(items);
        }

        // Retry deferred actions (if we have any)
        if (this.pendingActions.hasDeferredActions()) {
            console.debug("[ApiEditorPageComponent] Re-trying deferred actions.");
            let actions: PendingAction[] = this.pendingActions.getDeferredActions();
            let items: any[] = [];
            actions.forEach(action => {
                if (action.type === PendingActionType.command) {
                    items.push(this.editingSession.createBatchItem("command", <OtCommand>action.action));
                } else if (action.type === PendingActionType.undo) {
                    items.push(this.editingSession.createBatchItem("undo", <OtCommand>action.action));
                } else if (action.type === PendingActionType.redo) {
                    items.push(this.editingSession.createBatchItem("redo", <OtCommand>action.action));
                }
            });
            this.editingSession.sendBatch(items);
        }
    }

    /**
     * Check to see if there are any failed pending actions.  If there are none, then we may need to
     * hide all of the "offline mode" UI elements and cancel the retry timer/interval.
     */
    protected checkPendingActions(): void {
        if (this.hasFailedActions && this.pendingActions.getFailedActions().length === 0) {
            this.hasFailedActions = false;
            this.showOfflineModeMessage = false;
        }
        console.debug("[ApiEditorPageComponent] Pending Action count: " + this.pendingActions.size());
        if (!this.pendingActions.hasFailedActions() && !this.pendingActions.hasDeferredActions()) {
            this.cancelRetryTimer();
        }
    }

    /**
     * Called to cancel the retry timer/interval (if one exists).
     */
    protected cancelRetryTimer(): void {
        console.info("[ApiEditorPageComponent] Cancelling the auto-retry timer.");
        if (this.retryTimerId) {
            clearTimeout(this.retryTimerId);
            this.retryTimerId = undefined;
            this.retryTimerDate = undefined;
        }
    }

    /**
     * Called when we want to start the retry timer.  The retry timer will actually be an ever-increasing
     * interval, starting with 30s and doubling each time it runs (max of 30 minutes).  It will stop when
     * there are 0 failed pending actions remaining.
     */
    private startRetryTimer(): void {
        // Do nothing if a timer is already running.
        if (this.retryTimerId) {
            return;
        }

        console.info("[ApiEditorPageComponent] Starting the auto-retry timer.");

        // Start up a timer - set the value to 10s.  This will double each time, max of 30 mins
        this.createRetryTimer(10 * 1000);
    }
    private createRetryTimer(interval: number) {
        let now: Date = new Date();
        this.retryTimerDate = new Date(now.getTime() + interval);
        this.retryTimerId = setTimeout(() => {
            this.reconnect();
            this.createRetryTimer(Math.min(interval * 2, 30 * 60000));
        }, interval);
    }

    public retryTimerOn(): string {
        if (this.retryTimerDate) {
            return moment(this.retryTimerDate).fromNow();
        }
        return "N/A";
    }

    public goOffline(): void {
        this.isOffline = true;
        this.editorDisconnectedModal.close();
        this.startRetryTimer();
    }

    public actionEnabled(action: string): boolean {
        if (action == "preview-docs") {
            return this.isOpenApi20() || this.isOpenApi30();
        }

        return true;
    }

}


/**
 * Guards against the user losing changes to the editor.
 */
@Injectable()
export class ApiEditorPageGuard implements CanDeactivate<ApiEditorPageComponent> {

    /**
     * Called by angular to determine whether the user is allowed to navigate away from the
     * editor.
     * @param component
     */
    public canDeactivate(component: ApiEditorPageComponent): boolean {
        if (component && component.pendingActions && !component.pendingActions.isEmpty()) {
            if (!confirm(`You have ${ component.pendingActions.size() } unsaved changes.  Are you sure to close the page?`)) {
                return false;
            }
        }
        return true;
    }

}
