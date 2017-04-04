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

import {Component, HostListener, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef} from "@angular/core";
import {DomUtils} from "../../_util/object.util";


export class DropDownOption {
    name?: string;
    value?: string;
    divider?: boolean;
}


@Component({
    moduleId: module.id,
    selector: "drop-down",
    templateUrl: "drop-down.component.html"
})
export class DropDownComponent {

    private _open: boolean = false;

    @Input() value: string;
    @Input() options: DropDownOption[];
    @Input() noSelectionLabel: string = "No Selection";

    @Output() onValueChange: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("ddButton") ddButton: QueryList<ElementRef>;
    @ViewChildren("ddMenu") ddMenu: QueryList<ElementRef>;

    @HostListener("document:click", ["$event"])
    public onDocumentClick(event: MouseEvent): void {
        if (this.ddButton && this.ddButton.first && this.ddButton.first.nativeElement) {
            if (this.ddButton.first.nativeElement.contains(event.target)) {
                return;
            }
        }
        if (this.ddMenu && this.ddMenu.first && this.ddMenu.first.nativeElement) {
            if (DomUtils.elementBounds(this.ddMenu.first, event.clientX, event.clientY)) {
                return;
            }
        }
        this.close();
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

    public setValue(value: string, event: MouseEvent): void {
        this.value = value;
        this.close();
        this.onValueChange.emit(this.value);
    }

    /**
     * Called whenever the user presses a key.
     * @param event
     */
    public onGlobalKeyDown(event: KeyboardEvent): void {
        if (event.key === "Escape"  && !event.metaKey && !event.altKey && !event.ctrlKey) {
            this.close();
        }
    }

}
