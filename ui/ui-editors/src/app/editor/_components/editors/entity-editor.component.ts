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

import {
    Oas20SchemaDefinition,
    Oas30SchemaDefinition,
    Aai20SchemaDefinition,
    OasDocument,
    AaiDocument,
    Node,
    OasOperation,
    OasPathItem, IDefinition, OasSchema, AaiSchema, Oas20Schema, Oas30Schema, AaiServer
} from "@apicurio/data-models";
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation} from "@angular/core";
import {KeypressUtils} from "../../_util/keypress.util";

export interface EntityEditorEvent<T extends Node> {
    entity: T;
}

export interface IEntityEditorHandler<T extends Node, E extends EntityEditorEvent<T>> {
    onSave(event: E): void;
    onCancel(event: E): void;
}


/**
 * Base class for all entity editors.  T represents the type of entity being edited.  E represents
 * the event data structure.
 */
export abstract class EntityEditor<T extends Node, E extends EntityEditorEvent<T>> {

    public _isOpen: boolean = false;
    public _mode: string = "create";

    public handler: IEntityEditorHandler<T, E>;
    public context: OasDocument | OasPathItem | OasOperation | Oas30SchemaDefinition | Oas20SchemaDefinition | AaiDocument | Aai20SchemaDefinition | Oas20Schema | Oas30Schema | AaiServer;
    public entity: T;

    /**
     * Called to open the editor.
     * @param handler
     * @param context
     * @param entity
     */
    public open(handler: IEntityEditorHandler<T, E>,
                context: OasDocument | OasPathItem | OasOperation | Oas30SchemaDefinition | Oas20SchemaDefinition | AaiDocument | Aai20SchemaDefinition | Oas20Schema | Oas30Schema | AaiServer,
                entity?: T): void {
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
        this._isOpen = true;
        this.doAfterOpen();
    }

    /**
     * Called at the end of the open() method.  Subclasses can override this to perform specific work.
     */
    public doAfterOpen(): void {
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
    public save(): void {
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
    public cancel(): void {
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
     * @param event
     */
    public onKeypress(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    /**
     * Returns true if the context is the document (global).
     */
    public isGlobalContext(): boolean {
        return this.context.ownerDocument() === this.context;
    }

}


@Component({
    selector: "entity-editor",
    templateUrl: "entity-editor.component.html",
    styleUrls: ["entity-editor.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class EntityEditorComponent implements OnChanges {

    @Input() entityType: string = "unknown";
    @Input() heading: string = "Configure the Entity";
    @Input() context: OasDocument | OasPathItem | OasOperation | AaiDocument;
    @Input() showRequiredFieldsMessage: boolean = false;
    @Input() valid: boolean = true;
    @Input() dirty: boolean = false;

    @Output() onSave: EventEmitter<void> = new EventEmitter<void>();
    @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

    public contextIs: string = "document";
    protected _expandedContext: any = {
        document: null,
        pathItem: null,
        operation: null,
        dataType: null
    };

    /**
     * Called when the @Input changes.
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes["context"]) {
            this.expandContext(this.context);
        }
    }

    /**
     * Figures out what the context is based on what is passed to it.
     * @param context
     */
    public expandContext(context: OasDocument | OasPathItem | OasOperation | Oas20SchemaDefinition | Oas30SchemaDefinition | AaiDocument | Aai20SchemaDefinition | Oas20Schema | Oas30Schema): void {
        if (context instanceof OasOperation) {
            this.contextIs = "operation";
            this._expandedContext.operation = context as OasOperation;
            this._expandedContext.pathItem = context.parent() as OasPathItem;
            this._expandedContext.document = context.ownerDocument();
        } else if (context instanceof OasPathItem) {
            this.contextIs = "pathItem";
            this._expandedContext.pathItem = context as OasPathItem;
            this._expandedContext.document = context.ownerDocument();
        } else if (context.ownerDocument() === context) {
            this.contextIs = "document";
            this._expandedContext.document = context as OasDocument | AaiDocument;
        } else if (context instanceof OasSchema) {
            this.contextIs = "dataType";
            this._expandedContext.dataType = context as Oas20SchemaDefinition | Oas30SchemaDefinition;
        } else if (context instanceof AaiSchema) {
            this.contextIs = "dataType";
            this._expandedContext.dataType = context as Aai20SchemaDefinition;
        } else {
            console.warn("[EntityEditorComponent] Unknown/unexpected context: ", context);
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
     * Gets the data type (if any).
     */
    public dataType(): Oas20SchemaDefinition | Oas30SchemaDefinition | Aai20SchemaDefinition {
        return this._expandedContext.dataType;
    }

    /**
     * Gets the data type name.
     */
    public dataTypeName(): string {
        if (this._expandedContext.dataType) {
            return (<IDefinition> this._expandedContext.dataType).getName();
        }
        return null;
    }

    /**
     * @param event
     */
    public onGlobalKeyDown(event: KeyboardEvent): void {
        if (KeypressUtils.isEscapeKey(event)) {
            this.onClose.emit();
        }
    }

}
