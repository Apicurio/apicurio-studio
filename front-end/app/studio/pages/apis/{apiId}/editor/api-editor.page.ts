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
    Component, Inject, ViewChild, Injectable, ViewChildren, QueryList,
    AfterViewInit, NgZone
} from "@angular/core";
import {ActivatedRoute, Router, CanDeactivate} from "@angular/router";
import {EditableApiDefinition} from "../../../../models/api.model";
import {IApiEditingSession, IApisService} from "../../../../services/apis.service";
import {ApiEditorComponent} from "./editor.component";
import {AbstractPageComponent} from "../../../../components/page-base.component";
import {ICommand} from "oai-ts-commands";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

@Component({
    moduleId: module.id,
    selector: "api-editor-page",
    templateUrl: "api-editor.page.html",
    styleUrls: ["api-editor.page.css"]
})
export class ApiEditorPageComponent extends AbstractPageComponent implements AfterViewInit {

    public apiDefinition: EditableApiDefinition;

    protected isDirty: boolean = false;
    protected isSaving: boolean = false;

    @ViewChild("apiEditor") apiEditor: ApiEditorComponent;
    @ViewChildren("apiEditor") _apiEditor: QueryList<ApiEditorComponent>;

    private editingSession: IApiEditingSession;

    private pendingCommands: ICommand[] = [];
    private _pendingCommandsSubject: BehaviorSubject<ICommand[]> = new BehaviorSubject([]);
    private _pendingCommands: Observable<ICommand[]> = this._pendingCommandsSubject.asObservable();

    /**
     * Constructor.
     * @param {Router} router
     * @param {ActivatedRoute} route
     * @param {NgZone} zone
     * @param {IApisService} apis
     */
    constructor(private router: Router, route: ActivatedRoute, private zone: NgZone,
                @Inject(IApisService) private apis: IApisService) {
        super(route);
        this.apiDefinition = new EditableApiDefinition();
    }

    /**
     * Called to kick off loading the page's async data.
     * @param params
     */
    public loadAsyncPageData(params: any): void {
        let __component: ApiEditorPageComponent = this;

        console.info("[ApiEditorPageComponent] Loading async page data");
        let apiId: string = params["apiId"];
        this.apiDefinition.name = apiId;
        this.apiDefinition.id = apiId;

        this.apis.editApi(apiId).then( def => {
            console.info("[ApiEditorPageComponent] Definition loaded.  Opening editing session.");
            this.apiDefinition = def;
            this.loaded("def");
            this.editingSession = this.apis.openEditingSession(def);
            this.editingSession.commandHandler({
                onCommand: (command) => {
                    this.zone.run(() => {
                        __component.executeCommand(command);
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
                onDisconnected: () => {
                    // TODO what to do when an unexpected disconnect event happens??
                    console.info("[ApiEditorPageComponent] **Notice** editing session disconnected!");
                }
            });
        }).catch(error => {
            console.error("[ApiEditorPageComponent] Error editing API design.");
            this.error(error);
        });
    }

    public ngAfterViewInit(): void {
        this._apiEditor.changes.subscribe( () => {
            if (this._apiEditor.first) {
                console.info("Editor is available!");
                this._pendingCommands.subscribe( commands => {
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
        this.editingSession.close();
    }

    /**
     * Called when the editor fires this event.
     * @param {ICommand} command
     */
    public onCommandExecuted(command: ICommand): void {
        this.editingSession.sendCommand(command);
    }

    /**
     * Executes the given command in the editor.
     * @param {ICommand} command
     */
    protected executeCommand(command: ICommand) {
        this.pendingCommands.push(command);
        this._pendingCommandsSubject.next(this.pendingCommands);
    }
}


/**
 * Guards against the user losing changes to the editor.
 */
@Injectable()
export class ApiEditorPageGuard implements CanDeactivate<ApiEditorPageComponent> {

    /**
     * Called by angular 2 to determine whether the user is allowed to navigate away from the
     * editor.
     * @param component
     */
    public canDeactivate(component: ApiEditorPageComponent): Promise<boolean> | boolean {
        return true;
    }

}
