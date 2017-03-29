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
import {Component, Input, ViewEncapsulation, Output, EventEmitter, ViewChild} from "@angular/core";
import {Oas20DefinitionSchema, OasLibraryUtils, Oas20Document, Oas20Definitions} from "oai-ts-core";
import {ICommand} from "../../_services/commands.manager";

import "brace/theme/eclipse";
import "brace/mode/json";
import {AceEditorDirective} from "ng2-ace-editor";
import {DeleteDefinitionSchemaCommand} from "../../_commands/delete.command";
import {ReplaceDefinitionSchemaCommand} from "../../_commands/replace.command";
import {ObjectUtils} from "../../_util/object.util";

@Component({
    moduleId: module.id,
    selector: "definition-form",
    templateUrl: "definition-form.component.html",
    encapsulation: ViewEncapsulation.None
})
export class DefinitionFormComponent {

    private _definition: Oas20DefinitionSchema;
    @Output() onCommand: EventEmitter<ICommand> = new EventEmitter<ICommand>();
    @Output() onDeselect: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild("sourceEditor") sourceEditor: AceEditorDirective;

    private library: OasLibraryUtils = new OasLibraryUtils();

    private _definitionJsObj: any = null;

    @Input()
    set definition(definition: Oas20DefinitionSchema) {
        this._definition = definition;
        this._definitionJsObj = null;
    }

    get definition(): Oas20DefinitionSchema {
        return this._definition;
    }

    private _source: any = {
        dirty: false,
        valid: false,
        value: null
    };

    public delete(): void {
        let command: ICommand = new DeleteDefinitionSchemaCommand(this.definition.definitionName());
        this.onCommand.emit(command);
        this.onDeselect.emit(true);
    }

    public definitionJs(): any {
        if (this._definitionJsObj === null) {
            this._definitionJsObj = this.library.writeNode(this.definition);
        }
        return this._definitionJsObj;
    }

    public source(): string {
        return JSON.stringify(this.definitionJs(), null, 4);
    }

    public onSourceChanged(newSource: any): void {
        try {
            let newJsObject: any = JSON.parse(newSource);
            let currentJsObj: any = this.definitionJs();
            this._source.dirty = !ObjectUtils.objectEquals(currentJsObj, newJsObject);
            this._source.value = this.library.readNode(newJsObject,
                (<Oas20Definitions>this.definition.parent()).createDefinitionSchema(this.definition.definitionName()));
            this._source.valid = true;
        } catch (e) {
            this._source.value = null;
            this._source.valid = false;
            this._source.dirty = true;
        }
    }

    public canFormatSource(): boolean {
        return this._source.valid;
    }

    public canRevertSource(): boolean {
        return this._source.dirty;
    }

    public canSaveSource(): boolean {
        return this._source.dirty && this._source.valid;
    }

    public revertSource(): void {
        this.sourceEditor.setText(this.source());
        this._source.dirty = false;
        this._source.value = null;
        this._source.valid = false;
    }

    public saveSource(): void {
        let command: ICommand = new ReplaceDefinitionSchemaCommand(this.definition, this._source.value);
        this.onCommand.emit(command);
        this.definition = this._source.value;
        this._definitionJsObj = null;
        this._source.dirty = false;
        this._source.value = null;
        this._source.valid = true;
    }

    public formatSource(): void {
        let nsrc: any = this.library.writeNode(this._source.value);
        let nsrcStr: string = JSON.stringify(nsrc, null, 4);
        this.sourceEditor.setText(nsrcStr);
    }

}
