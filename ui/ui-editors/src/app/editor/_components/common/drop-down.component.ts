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

import {Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from "@angular/core";

export abstract class DropDownOption {

    public abstract isDivider(): boolean;
    public abstract getName(): any;
    public abstract getValue(): any;
    public abstract isDisabled(): boolean;

}

export class DropDownOptionValue extends DropDownOption {

    public name: string;
    public value: any;
    public disabled: boolean = false;

    public constructor(name: string, value: any, disabled: boolean = false) {
        super();
        this.name = name;
        this.value = value;
        this.disabled = disabled;
    }

    public isDivider(): boolean {
        return false;
    }
    public getName() {
        return this.name;
    }
    public getValue() {
        return this.value;
    }
    public isDisabled(): boolean {
        throw this.disabled;
    }
}

export class DropDownOptionDivider extends DropDownOption {

    public divider: true; // For backwards-compatible instantiation via the object literal

    public isDivider(): boolean {
        return true;
    }

    public getName() {
        throw new Error("DropDownOptionDivider does not contain a name. "
            + "Use DropDownOption#isDivider() to prevent this error.");
    }

    public getValue() {
        throw new Error("DropDownOptionDivider does not contain a value. "
            + "Use DropDownOption#isDivider() to prevent this error.");
    }

    public isDisabled(): boolean {
        throw new Error("DropDownOptionDivider cannot be disabled. "
            + "Use DropDownOption#isDivider() to prevent this error.");
    }
}

/**
  * Static instance for reusability
  */
export let DIVIDER: DropDownOption = new DropDownOptionDivider();

@Component({
    selector: "drop-down",
    templateUrl: "drop-down.component.html",
    styleUrls: [ "drop-down.component.css" ]
})
export class DropDownComponent {

    public _open: boolean = false;

    @Input() id: string;
    @Input() classes: string;
    @Input() value: any;
    _options: DropDownOption[];
    @Input() noSelectionLabel: string = "No Selection";
    @Input() noOptionsLabel: string = "No matching options";
    @Input() filterItemCountThreshold: number = 20;
    @Input() loading: boolean = false;
    @Input() loadingLabel: string = "Loading...";

    @Output() onValueChange: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    get options(): DropDownOption[] {
        return this._options;
    }
    set options(value: DropDownOption[]) {
        if (this._options === null || JSON.stringify(value) !== JSON.stringify(this._options)) {
            this._options = value;
            this.filteredOptions = value;
        }
    }

    @ViewChild("filter") filter: ElementRef;
    criteria: string;
    filteredOptions: DropDownOption[];

    public toggle(): void {
        this.setOpen(!this._open);
    }

    public open(): void {
        this.setOpen(true);
    }

    public setOpen(state: boolean): void {
        this._open = state;
        if (this._open) {
            this.criteria = null;
            this.filterOptions();
            // This is annoying, but the options panel (the "ul" element) is only added to
            // the DOM the first time the user clicks the dropdown button.  After that, the "ul"
            // sticks around.
            setTimeout(() => {
                if (this.filter) {
                    setTimeout(() => {
                        this.filter.nativeElement.focus();
                    }, 10);
                }
            }, 10);
        }
    }

    public close(): void {
        this.setOpen(false);
    }

    public isOpen(): boolean {
        return this._open;
    }

    public hasValue(): boolean {
        for (let option of this.options) {
            if (!option.isDivider() && option.getValue() === this.value) {
                return true;
            }
        }
        return false;
    }

    public displayValue(): string {
        for (let option of this.options) {
            if (!option.isDivider() && option.getValue() === this.value) {
                return option.getName();
            }
        }
        return null;
    }

    public setValue(value: any): void {
        this.value = value;
        this.onValueChange.emit(this.value);
    }

    public filterOptions(): void {
        if (this.criteria === null || this.criteria === undefined || this.criteria.trim().length === 0) {
            this.filteredOptions = this._options;
        } else {
            this.filteredOptions = [];
            this._options.forEach(option => {
                if (!option.isDivider() && option.getName().toLocaleLowerCase().includes(this.criteria.toLocaleLowerCase())) {
                    this.filteredOptions.push(option);
                }
            });
        }
    }

    public hasOptions(): boolean {
        return this.filteredOptions && this.filteredOptions.length > 0;
    }

    public inputKeypress(event: KeyboardEvent): void {
        if (event.key === "Escape"  && !event.metaKey && !event.altKey && !event.ctrlKey) {
            this.criteria = null;
            this.filterOptions();
        }
    }

    public shouldShowFilter(): boolean {
        return this._options && this._options.length > this.filterItemCountThreshold;
    }

}
