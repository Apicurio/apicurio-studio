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

import {EventEmitter, Output, ViewChild} from "@angular/core";
import {OasLibraryUtils, OasNode} from "oai-ts-core";

import "brace/theme/eclipse";
import "brace/mode/json";
import "brace/mode/yaml";
import {AceEditorDirective} from "ng2-ace-editor";
import {ObjectUtils} from "../../_util/object.util";
import * as YAML from "yamljs";
import {NodeSelectionEvent} from "../../_events/node-selection.event";
import {ICommand} from "oai-ts-commands";


/**
 * Base class for all forms that support a "Source" tab.
 */
export abstract class SourceFormComponent<T extends OasNode> {

    private static library: OasLibraryUtils = new OasLibraryUtils();

    @Output() onCommand: EventEmitter<ICommand> = new EventEmitter<ICommand>();
    @Output() onNodeSelected: EventEmitter<NodeSelectionEvent> = new EventEmitter<NodeSelectionEvent>();

    private _mode: string = "design";
    private _sourceFormat: string = "yaml";
    private _sourceNode: T;
    private _sourceJsObj: any = null;
    set sourceNode(node: T) {
        this._sourceNode = node;
        this._sourceJsObj = null;
    }
    get sourceNode(): T {
        return this._sourceNode;
    }

    @ViewChild("sourceEditor") sourceEditor: AceEditorDirective;

    private _source: any = {
        dirty: false,
        valid: false,
        value: null
    };

    public sourceJs(): any {
        if (this._sourceJsObj === null) {
            this._sourceJsObj = SourceFormComponent.library.writeNode(this.sourceNode);
        }
        return this._sourceJsObj;
    }

    public source(): string {
        if (this._sourceFormat === "yaml") {
            return YAML.stringify(this.sourceJs(), 100, 4);
        } else {
            return JSON.stringify(this.sourceJs(), null, 4);
        }
    }

    public updateSource(newSource: any): void {
        try {
            let newJsObject: any;
            if (this.sourceFormat() === "yaml") {
                newJsObject = YAML.parse(newSource);
            } else {
                newJsObject = JSON.parse(newSource);
            }
            let currentJsObj: any = this.sourceJs();
            this._source.dirty = !ObjectUtils.objectEquals(currentJsObj, newJsObject);
            this._source.value = SourceFormComponent.library.readNode(newJsObject, this.createEmptyNodeForSource());
            this._source.valid = true;
        } catch (e) {
            this._source.value = null;
            this._source.valid = false;
            this._source.dirty = true;
        }
    }

    protected abstract createEmptyNodeForSource(): T;

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
        let command: ICommand = this.createReplaceNodeCommand(<T>this._source.value);
        this.onCommand.emit(command);
        this.onNodeSelected.emit(new NodeSelectionEvent(<T>this._source.value, this.formType()));
        this.sourceNode = this._source.value;
        this._source.dirty = false;
        this._source.value = null;
        this._source.valid = true;
    }

    public abstract formType(): string;

    public sourceFormat(): string {
        return this._sourceFormat;
    }

    public toggleSourceFormat(): void {
        if (this._sourceFormat === "yaml") {
            this.setSourceFormat("json");
        } else {
            this.setSourceFormat("yaml");
        }
    }

    public setSourceFormat(sourceFormat: string): void {
        this._sourceFormat = sourceFormat;
    }

    public formatSource(): void {
        let nsrc: any = SourceFormComponent.library.writeNode(this._source.value);
        let nsrcStr: string;
        if (this._sourceFormat === "yaml") {
            nsrcStr = YAML.stringify(this.sourceJs(), 100, 4);
        } else {
            nsrcStr = JSON.stringify(this.sourceJs(), null, 4);
        }
        this.sourceEditor.setText(nsrcStr);
    }

    protected abstract createReplaceNodeCommand(node: T): ICommand;

    public isDesignMode(): boolean {
        return this._mode === "design";
    }

    public isSourceMode(): boolean {
        return this._mode === "source";
    }

    public enableDesignMode(): void {
        // Cannot change tabs if the source editor is dirty.
        if (this._source.dirty) {
            return;
        }
        this._mode = "design";
    }

    public enableSourceMode(): void {
        this._mode = "source";
    }

    public oasLibrary(): OasLibraryUtils {
        return SourceFormComponent.library;
    }
}
