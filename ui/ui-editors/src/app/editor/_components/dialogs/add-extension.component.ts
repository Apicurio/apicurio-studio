/**
 * @license
 * Copyright 2021 Red Hat
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

import {Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap/modal";
import {ExtensibleNode} from "@apicurio/data-models";
import {CodeEditorMode} from "../common/code-editor.component";
import {LoggerService} from "../../../services/logger.service";
import {DIVIDER, DropDownOption, DropDownOptionValue} from "../common/drop-down.component";
import {FeaturesService} from "../../_services/features.service";
import {VendorExtension} from "../../_models/features.model";
import {ComponentType} from "../../_models/component-type.model";


@Component({
    selector: "add-extension-dialog",
    templateUrl: "add-extension.component.html",
    styleUrls: ["add-extension.component.css"]
})
export class AddExtensionDialogComponent {

    @Input() forComponent: ComponentType;
    @Output() onAdd: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren("addExtensionModal") addExtensionModal: QueryList<ModalDirective>;
    @ViewChildren("addExtensionInput") addExtensionInput: QueryList<ElementRef>;

    private _isOpen: boolean = false;
    private _parent: ExtensibleNode;

    name: string = "";
    _value: string = "";
    set value(value: string) {
        this._value = value;
        this.validateValue();
    }
    get value(): string {
        return this._value;
    }

    _extensionNameOptions: DropDownOption[];
    extensionName: string = "custom";
    extensionModel: any;
    extensionSchema: any;
    vendorExtensionMap: any;

    extensionExists: boolean = false;
    nameValid: boolean = false;
    valueValid: boolean = false;

    constructor(private logger: LoggerService, private features: FeaturesService) {
    }

    /**
     * Called to open the dialog.
     */
    public open(parent: ExtensibleNode): void {
        this._parent = parent;
        this.name = "x-";
        this.nameValid = true;
        this.extensionExists = false;
        this.value = "";
        this.valueValid = false;
        this._isOpen = true;
        this.addExtensionModal.changes.subscribe( () => {
            if (this.addExtensionModal.first) {
                this.addExtensionModal.first.show();
            }
        });
        this.extensionExists = false;
        this.configureVendorExtensions();
    }

    configureVendorExtensions(): void {
        const vendorExtensions: VendorExtension[] = this.features.getFeatures().vendorExtensions || [];
        this.vendorExtensionMap = {};
        vendorExtensions.filter(vext => {
            return !vext.components || vext.components.length === 0 || vext.components.indexOf(this.forComponent) !== -1;
        }).forEach(vext => {
            this.vendorExtensionMap[vext.name] = {
                schema: vext.schema,
                model: vext.model
            };
        });
        this._extensionNameOptions = [
            new DropDownOptionValue("Custom property", "custom"),
            DIVIDER
        ];
        Object.getOwnPropertyNames(this.vendorExtensionMap).forEach(name => {
            this._extensionNameOptions.push(new DropDownOptionValue(name, name));
        });
    }

    /**
     * Called to close the dialog.
     */
    close(): void {
        this._isOpen = false;
        this.name = "";
        this.value = "";
        this.extensionName = "custom";
    }

    /**
     * Called when the user clicks "add".
     */
    add(): void {
        const extensionInfo: any = {
            name: this.name,
            value: JSON.parse(this._value)
        };
        this.onAdd.emit(extensionInfo);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void {
        this.addExtensionModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     */
    isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Called to initialize the selection/focus to the addExtensionInput field.
     */
    doSelect(): void {
        this.addExtensionInput.first?.nativeElement.focus();
    }

    validateName(name: string): void {
        this.extensionExists = this._parent.getExtension(name) != null;
        this.nameValid = name && name.startsWith("x-");
    }

    valueEditorMode(): CodeEditorMode {
        return CodeEditorMode.JSON;
    }

    validateValue(): void {
        try {
            this.logger.debug("[AddExtensionDialogComponent] Validating: ", this._value);
            JSON.parse(this._value);
            this.valueValid = true;
        } catch (e) {
            this.valueValid = false;
        }
        this.logger.debug("[AddExtensionDialogComponent] valueValid is now: ", this.valueValid);
    }

    selectExtension(name: string): void {
        this.extensionName = name;
        if (this.extensionName === "custom") {
            this.name = "x-";
            this.value = "";
            this.valueValid = false;
        } else {
            this.name = name;
            this.extensionModel = this.cloneModel(this.vendorExtensionMap[name].model);
            this.extensionSchema = this.vendorExtensionMap[name].schema;
        }
    }

    onDynamicFormModelChange(change: any): void {
        this._value = JSON.stringify(change, null, 4);
    }

    onDynamicFormValid(valid: boolean): void {
        this.valueValid = valid;
    }

    cloneModel(model: any): any {
        return JSON.parse(JSON.stringify(model));
    }

    hasVendorExtensions(): boolean {
        return Object.getOwnPropertyNames(this.vendorExtensionMap).length > 0;
    }
}
