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

import {AfterViewInit, Component, Injectable, NgZone, QueryList, ViewChild, ViewChildren} from "@angular/core";
import {ActivatedRoute, CanDeactivate, Router} from "@angular/router";
import {EditableApiDefinition} from "../../../../models/api.model";
import {ApisService, IApiEditingSession} from "../../../../services/apis.service";
import {ApiEditorComponent} from "./editor.component";
import {AbstractPageComponent} from "../../../../components/page-base.component";
import {OtCommand} from "oai-ts-commands";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {EditorDisconnectedDialogComponent} from "./_components/dialogs/editor-disconnected.component";
import {ApiDesignCommandAck} from "../../../../models/ack.model";
import {ApiEditorUser} from "../../../../models/editor-user.model";
import {Title} from "@angular/platform-browser";
import {Subscription} from "rxjs/Subscription";
import {DefaultValidationSeverityRegistry, IOasValidationSeverityRegistry} from "oai-ts-core";
import {ValidationProfile, ValidationService} from "../../../../services/validation.service";
import {ConfigService} from "../../../../services/config.service";
import {ApiEditorComponentFeatures} from "./_models/features.model";

@Component({
    moduleId: module.id,
    selector: "api-editor-page",
    templateUrl: "api-editor.page.html",
    styleUrls: ["api-editor.page.css"]
})
export class ApiEditorPageComponent extends AbstractPageComponent implements AfterViewInit {

    public apiDefinition: EditableApiDefinition;
    public editorFeatures: ApiEditorComponentFeatures;

    protected isDirty: boolean = false;
    protected isSaving: boolean = false;

    @ViewChildren("apiEditor") _apiEditor: QueryList<ApiEditorComponent>;
    @ViewChild("editorDisconnectedModal") editorDisconnectedModal: EditorDisconnectedDialogComponent;
    private editorAvailable: boolean;

    private editingSession: IApiEditingSession;
    public activeCollaborators: ApiEditorUser[] = [];
    private _activeCollaboratorColors: string[] = [
        "DC3E3E", "DC823E", "DC3EBD", "3EDC6D", "3E4EDC", "3ECCDC", "DCD23E"
    ];
    private _activeCollaboratorColorsIdx: number = 0;

    private pendingCommands: OtCommand[] = [];
    private _pendingCommandsSubject: BehaviorSubject<OtCommand[]> = new BehaviorSubject([]);
    private _pendingCommandsSubscription: Subscription;
    private _pendingCommands: Observable<OtCommand[]> = this._pendingCommandsSubject.asObservable();

    private currentEditorSelection: string;

    protected validationRegistry: IOasValidationSeverityRegistry = new DefaultValidationSeverityRegistry();

    private previewWindow: Window = null;

    /**
     * Constructor.
     * @param router
     * @param route
     * @param zone
     * @param apis
     * @param titleService
     * @param validationService
     * @param config
     */
    constructor(private router: Router, route: ActivatedRoute, private zone: NgZone,
                private apis: ApisService, titleService: Title, private validationService: ValidationService,
                private config: ConfigService) {
        super(route, titleService);
        this.apiDefinition = new EditableApiDefinition();
        this.editorFeatures = new ApiEditorComponentFeatures();
        this.editorFeatures.validationSettings = true;
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
        let __component: ApiEditorPageComponent = this;
        this.editorAvailable = false;

        console.info("[ApiEditorPageComponent] Loading async page data");
        let apiId: string = params["apiId"];
        this.apiDefinition.name = apiId;
        this.apiDefinition.id = apiId;

        this.apis.editApi(apiId).then( def => {
            console.info("[ApiEditorPageComponent] Definition loaded.  Opening editing session.");
            this.apiDefinition = def;
            this.loaded("def");
            this.updatePageTitle();
            this.updateValidationProfile();
            this.editingSession = this.apis.openEditingSession(def);
            this.editingSession.commandHandler({
                onCommand: (command) => {
                    this.zone.run(() => {
                        __component.executeCommand(command);
                    });
                },
                onAck: (ack) => {
                    this.zone.run(() => {
                        __component.finalizeCommand(ack);
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
                        this.activeCollaborators.sort((c1, c2) => {
                            return c1.userName.localeCompare(c2.userName);
                        });
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
                        __component.updateSelection(user, selection);
                    });
                }
            });
            this.editingSession.connect({
                onConnected: () => {
                    console.info("[ApiEditorPageComponent] Editing session connected.  Marking 'session' as loaded.");
                    this.zone.run(() => {
                        this.loaded("session");
                    });
                },
                onClosed: () => {
                    console.info("[ApiEditorPageComponent] **Notice** editing session disconnected normally.");
                },
                onDisconnected: (code) => {
                    // TODO what to do when an unexpected disconnect event happens??
                    console.info("[ApiEditorPageComponent] **Notice** editing session DROPPED!  Reason code: %o", code);
                    this.zone.run(() => {
                        this.editorDisconnectedModal.open();
                    });
                }
            });
        }).catch(error => {
            console.error("[ApiEditorPageComponent] Error editing API design.");
            this.error(error);
        });
    }

    /**
     * When the API is loaded, we need to load the validation profile for this API from the
     * validation service.
     */
    protected updateValidationProfile(): void {
        let profile: ValidationProfile = this.validationService.getProfileForApi(this.apiDefinition.id);
        if (profile) {
            this.validationRegistry = profile.registry;
        } else {
            this.validationRegistry = null;
        }
    }

    public ngAfterViewInit(): void {
        this._apiEditor.changes.subscribe( () => {
            if (this._apiEditor.first && !this._pendingCommandsSubscription) {
                this.editorAvailable = true;
                this._pendingCommandsSubscription = this._pendingCommands.subscribe( commands => {
                    this.pendingCommands = [];
                    commands.forEach( command => {
                        this._apiEditor.first.executeCommand(command);
                    });
                });
            }
        });
    }

    public loadingState(): string {
        if (this.isLoaded("session")) {
            return "loaded";
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
     * Called when the editor fires this event.
     * @param command
     */
    public onCommandExecuted(command: OtCommand): void {
        this.editingSession.sendCommand(command);
        this.reloadLivePreview();
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
        this.editingSession.sendUndo(event);
    }

    /**
     * Called when the user "redoes" a command in the editor/UI.
     */
    public onEditorRedo(event: OtCommand): void {
        this.editingSession.sendRedo(event);
    }

    /**
     * Executes the given command in the editor.
     * @param command
     */
    protected executeCommand(command: OtCommand): void {
        this.pendingCommands.push(command);
        this._pendingCommandsSubject.next(this.pendingCommands);
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
    protected finalizeCommand(ack: ApiDesignCommandAck): void {
        this._apiEditor.first.finalizeCommand(ack);
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
    public changeValidationProfile(profile: ValidationProfile): void {
        this.validationService.setProfileForApi(this.apiDefinition.id, profile);
        this.validationRegistry = profile.registry;
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
        console.info("++++++++++reloadLivePreview()");
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
    public canDeactivate(component: ApiEditorPageComponent): Promise<boolean> | boolean {
        return true;
    }

}
