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

import {Component, EventEmitter, Input, Output} from "@angular/core";


export class DropDownOption {
    name?: string;
    value?: string;
    divider?: boolean;
    disabled?: boolean;
}


@Component({
    moduleId: module.id,
    selector: "drop-down",
    templateUrl: "drop-down.component.html"
})
export class DropDownComponent {

    public _open: boolean = false;

    @Input() id: string;
    @Input() value: string;
    _options: DropDownOption[];
    @Input() noSelectionLabel: string = "No Selection";
    @Input() loading: boolean = false;
    @Input() loadingLabel: string = "Loading...";

    @Output() onValueChange: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    get options(): DropDownOption[] {
        return this._options;
    }
    set options(value: DropDownOption[]) {
        if (this._options === null || JSON.stringify(value) !== JSON.stringify(this._options)) {
            this._options = value;
        }
    }

    public toggle(): void {
        this._open = !this._open;
    }

    public open(): void {
        this._open = true;
    }

    public close(): void {
        this._open = false;
    }

    public isOpen(): boolean {
        return this._open;
    }

    public hasValue(): boolean {
        for (let option of this.options) {
            if (!option.divider && option.value === this.value) {
                return true;
            }
        }
        return false;
    }

    public displayValue(): string {
        for (let option of this.options) {
            if (!option.divider && option.value === this.value) {
                return option.name;
            }
        }
        return null;
    }

    public setValue(value: string): void {
        this.value = value;
        //this.close();
        this.onValueChange.emit(this.value);
    }

}
