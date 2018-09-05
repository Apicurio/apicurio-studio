/**
 * @license
 * Copyright 2018 JBoss Inc
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

import {OasDocument, OasLibraryUtils, OasNode, OasOperation, OasPathItem} from "oai-ts-core";

export interface EntityEditorEvent<T extends OasNode> {
    entity: T;
}

export interface IEntityEditorHandler<T extends OasNode, E extends EntityEditorEvent<T>> {
    onSave(event: E): void;
    onCancel(event: E): void;
}


/**
 * Base class for all entity editors.  T represents the type of entity being edited.  E represents
 * the event data structure.
 */
export abstract class EntityEditor<T extends OasNode, E extends EntityEditorEvent<T>> {

    public _library: OasLibraryUtils = new OasLibraryUtils();
    public _isOpen: boolean = false;
    public _mode: string = "create";
    protected handler: IEntityEditorHandler<T, E>;
    protected context: OasDocument | OasPathItem | OasOperation;
    public contextIs: string = "document";
    protected _expandedContext: any = {
        document: null,
        pathItem: null,
        operation: null
    };
    protected entity: T;

    /**
     * Called to open the editor.
     * @param handler
     * @param context
     * @param entity
     */
    public open(handler: IEntityEditorHandler<T, E>, context: OasDocument | OasPathItem | OasOperation, entity?: T): void {
        this.context = context;
        this.handler = handler;
        this.entity = entity;
        if (entity) {
            this._mode = "edit";
            this.initializeModelFromEntity(entity);
        } else {
            this._mode = "create";
            this.initializeModel();
        }
        if (context) {
            this.expandContext(context);
        }
        this._isOpen = true;
    }

    /**
     * Initializes the editor's data model from a provided entity (initialize the editor data model from an entity).
     * @param entity
     */
    public abstract initializeModelFromEntity(entity: T): void;

    /**
     * Initializes the editor's data model to an empty state.
     */
    public abstract initializeModel(): void;

    /**
     * Returns true if the data model is valid.
     */
    public abstract isValid(): boolean;

    /**
     * Creates an entity event specific to this entity editor.
     */
    public abstract entityEvent(): E;

    /**
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "save".
     */
    protected save(): void {
        if (!this.isValid()) {
            return;
        }
        let event: E = this.entityEvent();
        this.close();
        this.handler.onSave(event);
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        let event: E = this.entityEvent();
        this.close();
        this.handler.onCancel(event);
    }

    /**
     * Returns true if the dialog is open.
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Figures out what the context is based on what is passed to it.
     * @param context
     */
    public expandContext(context: OasDocument | OasPathItem | OasOperation): void {
        if (context['_method']) {
            this.contextIs = "operation";
            this._expandedContext.operation = context as OasOperation;
            this._expandedContext.pathItem = context.parent() as OasPathItem;
            this._expandedContext.document = context.ownerDocument();
        } else if (context['_path']) {
            this.contextIs = "pathItem";
            this._expandedContext.pathItem = context as OasPathItem;
            this._expandedContext.document = context.ownerDocument();
        } else {
            this.contextIs = "document";
            this._expandedContext.document = context as OasDocument;
        }
    }

    /**
     * Gets the context path item (if any).
     */
    public pathItem(): OasPathItem {
        return this._expandedContext.pathItem;
    }

    /**
     * Gets the context operation (if any).
     */
    public operation(): OasOperation {
        return this._expandedContext.operation;
    }

    /**
     * @param event
     */
    public onKeypress(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    /**
     * @param event
     */
    public onGlobalKeyDown(event: KeyboardEvent): void {
        if (event.key === "Escape"  && !event.metaKey && !event.altKey && !event.ctrlKey) {
            this.cancel();
        }
    }

}
