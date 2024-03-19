/**
 * @license
 * Copyright 2022 Red Hat
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

import {ICommand, Library, Node} from "@apicurio/data-models";

import * as YAML from 'js-yaml';
import {SelectionService} from "../../_services/selection.service";
import {CommandService} from "../../_services/command.service";
import {DocumentService} from "../../_services/document.service";
import {AbstractBaseComponent} from "../common/base-component";
import { ChangeDetectorRef, Directive } from "@angular/core";
import {SectionComponent} from "./shared/section.component";
import {ObjectUtils} from "apicurio-ts-core";
import {CodeEditorMode, CodeEditorTheme} from "../common/code-editor.component";


/**
 * Base class for all forms that support a "Source" tab.
 */
@Directive()
export abstract class SourceFormComponent<T extends Node> extends AbstractBaseComponent {

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
            this._sourceJsObj = Library.writeNode(this.sourceNode);
        }
        return this._sourceJsObj;
    }

    private _sourceText: string;
    get source() {
        if (this._sourceText === null || this._sourceText === undefined) {
            if (this._sourceFormat === CodeEditorMode.YAML) {
                this._sourceText = YAML.safeDump(this.sourceJs(), {
                    indent: 4,
                    lineWidth: 110,
                    noRefs: true
                });
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
                newJsObject = YAML.safeLoad(newSource);
            } else {
                newJsObject = JSON.parse(newSource);
            }
            this._source.parseable = true;
            let currentJsObj: any = this.sourceJs();
            this._source.dirty = !ObjectUtils.objectEquals(currentJsObj, newJsObject);
            let node: Node = this.createEmptyNodeForSource();
            Library.readNode(newJsObject, node);
            this._source.value = node;
            this._source.valid = true;
        } catch (e) {
            // OK to suppress this - it's likely the case that the text isn't valid/parseable.
        }
    }

    protected constructor(protected changeDetectorRef: ChangeDetectorRef,
                       protected selectionService: SelectionService,
                       protected commandService: CommandService,
                       protected documentService: DocumentService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    protected onDocumentChange(): void {
        if (!this._source.dirty) {
            this._sourceJsObj = null;
            this._sourceText = null;
        }
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
            originalSource = YAML.safeDump(this.sourceJs(), {
                indent: 4,
                lineWidth: 110,
                noRefs: true
            });
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
            parsedSource = YAML.safeLoad(this._sourceText);
            this.setSourceFormat(CodeEditorMode.JSON);
        }
        if (parsedSource) {
            let newSource: string;
            if (this.isSourceFormatJson()) {
                newSource = JSON.stringify(parsedSource, null, 4);
            } else {
                newSource = YAML.safeDump(this.sourceJs(), {
                    indent: 4,
                    lineWidth: 110,
                    noRefs: true
                });
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
            parsedSource = YAML.safeLoad(this._sourceText);
        }
        if (parsedSource) {
            let newSource: string;
            if (this.isSourceFormatJson()) {
                newSource = JSON.stringify(parsedSource, null, 4);
            } else {
                newSource = YAML.safeDump(this.sourceJs(), {
                    indent: 4,
                    lineWidth: 110,
                    noRefs: true
                });
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

    public sourceEditorTheme(): CodeEditorTheme {
        return CodeEditorTheme.Light;
    }

    public sourceEditorMode(): CodeEditorMode {
        return this._sourceFormat;
    }

    public collapseAllSections(): void {
        SectionComponent.allVisibleSections.forEach( section => {
            section.collapse();
        });
    }

    public expandAllSections(): void {
        SectionComponent.allVisibleSections.forEach( section => {
            section.expand();
        });
    }

}
