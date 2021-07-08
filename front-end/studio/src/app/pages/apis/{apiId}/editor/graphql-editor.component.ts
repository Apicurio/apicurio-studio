/**
 * @license
 * Copyright 2019 JBoss Inc
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
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from "@angular/core";
import {ApiDefinition} from "../../../../models/api.model";
import {CodeEditorMode, CodeEditorTheme} from "../../../../components/common/code-editor.component";

/**
 * Base class for text editors like the GraphQL editor.
 */
export class TextEditorComponent {
}


@Component({
    selector: "graphql-editor",
    templateUrl: "graphql-editor.component.html",
    styleUrls: ["graphql-editor.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class GraphQLEditorComponent extends TextEditorComponent implements OnChanges, OnInit, OnDestroy {

    @Input() api: ApiDefinition;
    @Output() public textChanged = new EventEmitter<string>();

    sourceOriginal: string = "";
    sourceValue: string = "";
    sourceIsValid: boolean = true;

    /**
     * Called when the editor is initialized by angular.
     */
    public ngOnInit(): void {
    }

    /**
     * Called when angular destroys the editor component.
     */
    public ngOnDestroy(): void {
    }

    /**
     * Called when the @Input changes.
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes["api"]) {
            this.sourceValue = this.api.spec;
            this.sourceOriginal = this.sourceValue;
        }
    }

    sourceTheme(): CodeEditorTheme {
        return CodeEditorTheme.Light;
    }

    sourceMode(): CodeEditorMode {
        return CodeEditorMode.GRAPHQL;
    }

    isDirty(): boolean {
        return this.sourceOriginal != this.sourceValue;
    }

    /**
     * Called whenever the user presses a key.
     * @param event
     */
    public onGlobalKeyDown(event: KeyboardEvent): void {
    }

    /**
     * Called to get the current value in the editor.
     * @return
     */
    public getValue(): ApiDefinition {
        let apiDef: ApiDefinition = new ApiDefinition();
        apiDef.id = this.api.id;
        apiDef.createdBy = this.api.createdBy;
        apiDef.createdOn = this.api.createdOn;
        apiDef.description = this.api.description;
        apiDef.name = this.api.name;
        apiDef.tags = this.api.tags;
        apiDef.spec = this.sourceValue;
        return apiDef;
    }

    /**
     * Called when the user clicks save.
     */
    public saveSource(): void {
        console.info("[GraphQL Editor] Saving source code changes");
        try {
            this.textChanged.emit(this.sourceValue);
        } catch (e) {
            console.warn("[GraphQL Editor] Error saving source changes: ", e);
        }
    }

    /**
     * Called when the user clicks revert.
     */
    public revertSource(): void {
        console.info("[GraphQL Editor] Reverting source code changes");
        this.sourceValue = this.sourceOriginal;
    }

    /**
     * Validates that the current source text is valid.
     */
    public validate(): void {
        try {
            // TODO validate the GraphQL content
            this.sourceIsValid = true;
        } catch (e) {
            this.sourceIsValid = false;
        }
    }

}
