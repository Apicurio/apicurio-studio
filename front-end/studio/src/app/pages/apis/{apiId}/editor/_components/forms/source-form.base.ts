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

import {OasLibraryUtils, OasNode} from "oai-ts-core";

import {ObjectUtils} from "../../_util/object.util";
import * as YAML from "yamljs";
import {ICommand} from "oai-ts-commands";
import {CodeEditorMode, CodeEditorTheme} from "../../../../../../components/common/code-editor.component";
import {SelectionService} from "../../_services/selection.service";
import {CommandService} from "../../_services/command.service";
import {OnDestroy, OnInit} from "@angular/core";
import {DocumentService} from "../../_services/document.service";
import {Subscription} from "rxjs";


/**
 * Base class for all forms that support a "Source" tab.
 */
export abstract class SourceFormComponent<T extends OasNode> implements OnInit, OnDestroy {

    private static library: OasLibraryUtils = new OasLibraryUtils();

    private _mode: string = "design";
    private _sourceFormat: CodeEditorMode = CodeEditorMode.YAML;
    private _sourceNode: T;
    private _sourceJsObj: any = null;
    set sourceNode(node: T) {
        this._sourceNode = node;
        this._sourceJsObj = null;
        this._sourceText = null;
    }
    get sourceNode(): T {
        return this._sourceNode;
    }

    private _source: any = {
        dirty: false,
        parseable: false,
        valid: false,
        value: null
    };

    public sourceJs(): any {
        if (this._sourceJsObj === null) {
            this._sourceJsObj = SourceFormComponent.library.writeNode(this.sourceNode);
        }
        return this._sourceJsObj;
    }

    private _sourceText: string;
    get source() {
        if (this._sourceText === null || this._sourceText === undefined) {
            if (this._sourceFormat === CodeEditorMode.YAML) {
                this._sourceText = YAML.stringify(this.sourceJs(), 100, 4);
            } else {
                this._sourceText = JSON.stringify(this.sourceJs(), null, 4);
            }
        }
        return this._sourceText;
    }

    set source(newSource: string) {
        this._sourceText = newSource;
        this._source.dirty = true;
        this._source.value = null;
        this._source.parseable = false;
        this._source.valid = false;
        try {
            let newJsObject: any;
            if (this._sourceFormat === CodeEditorMode.YAML) {
                newJsObject = YAML.parse(newSource);
            } else {
                newJsObject = JSON.parse(newSource);
            }
            this._source.parseable = true;
            let currentJsObj: any = this.sourceJs();
            this._source.dirty = !ObjectUtils.objectEquals(currentJsObj, newJsObject);
            this._source.value = SourceFormComponent.library.readNode(newJsObject, this.createEmptyNodeForSource());
            this._source.valid = true;
        } catch (e) {
        }
    }

    private _changeSubscription: Subscription;

    public constructor(protected selectionService: SelectionService, protected commandService: CommandService,
                       protected documentService: DocumentService) {}

    /**
     * Called when the component is initialized.
     */
    public ngOnInit(): void {
        this._changeSubscription = this.documentService.change().skip(1).subscribe( () => {
            if (!this._source.dirty) {
                this._sourceJsObj = null;
                this._sourceText = null;
            }
        });
    }

    /**
     * Called when the component is destroyed.
     */
    public ngOnDestroy(): void {
        this._changeSubscription.unsubscribe();
    }

    protected abstract createEmptyNodeForSource(): T;

    public canFormatSource(): boolean {
        return this._source.parseable;
    }

    public canToggleSourceFormat(): boolean {
        return this._source.parseable;
    }

    public canRevertSource(): boolean {
        return this._source.dirty;
    }

    public canSaveSource(): boolean {
        return this._source.dirty && this._source.valid;
    }

    public revertSource(): void {
        let originalSource: string;
        if (this._sourceFormat === CodeEditorMode.YAML) {
            originalSource = YAML.stringify(this.sourceJs(), 100, 4);
        } else {
            originalSource = JSON.stringify(this.sourceJs(), null, 4);
        }
        this.source = originalSource;
        this._source.dirty = false;
        this._source.value = null;
        this._source.valid = false;
    }

    public saveSource(): void {
        let command: ICommand = this.createReplaceNodeCommand(<T>this._source.value);
        this.commandService.emit(command);
        this.sourceNode = this._source.value;
        this._source.dirty = false;
        this._source.value = null;
        this._source.valid = true;
    }

    public isSourceFormatYaml(): boolean {
        return this._sourceFormat === CodeEditorMode.YAML;
    }

    public isSourceFormatJson(): boolean {
        return this._sourceFormat === CodeEditorMode.JSON;
    }

    public toggleSourceFormat(): void {
        // 1. parse the source in the editor (either yaml or json)
        // 2. stringify the resulting object as the other format
        // 3. this.source = result
        let parsedSource: any;
        if (this.isSourceFormatJson()) {
            parsedSource = JSON.parse(this._sourceText);
            this.setSourceFormat(CodeEditorMode.YAML);
        } else {
            parsedSource = YAML.parse(this._sourceText);
            this.setSourceFormat(CodeEditorMode.JSON);
        }
        if (parsedSource) {
            let newSource: string;
            if (this.isSourceFormatJson()) {
                newSource = JSON.stringify(parsedSource, null, 4);
            } else {
                newSource = YAML.stringify(parsedSource, 100, 4);
            }
            this.source = newSource;
        }
    }

    public setSourceFormat(sourceFormat: CodeEditorMode): void {
        this._sourceFormat = sourceFormat;
    }

    public formatSource(): void {
        // 1. parse the source in the editor (either yaml or json)
        // 2. stringify the resulting object as either yaml or json
        // 3. this.source = result
        let parsedSource: any;
        if (this.isSourceFormatJson()) {
            parsedSource = JSON.parse(this._sourceText);
        } else {
            parsedSource = YAML.parse(this._sourceText);
        }
        if (parsedSource) {
            let newSource: string;
            if (this.isSourceFormatJson()) {
                newSource = JSON.stringify(parsedSource, null, 4);
            } else {
                newSource = YAML.stringify(parsedSource, 100, 4);
            }
            this.source = newSource;
        }
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
        this._sourceText = null;
        this._sourceJsObj = null;
    }

    public enableSourceMode(): void {
        this._mode = "source";
    }

    public oasLibrary(): OasLibraryUtils {
        return SourceFormComponent.library;
    }

    public sourceEditorTheme(): CodeEditorTheme {
        return CodeEditorTheme.Light;
    }

    public sourceEditorMode(): CodeEditorMode {
        return this._sourceFormat;
    }
}
