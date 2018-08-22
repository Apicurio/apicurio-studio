import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    QueryList,
    ViewChildren,
    ViewEncapsulation
} from "@angular/core";

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

@Component({
    moduleId: module.id,
    selector: "inline-array-editor",
    templateUrl: "inline-array-editor.component.html",
    styleUrls: ["inline-array-editor.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class InlineArrayEditorComponent implements AfterViewInit {

    @Input() value: string[];
    @Input() noValueMessage: string;
    @Output() onChange: EventEmitter<string[]> = new EventEmitter<string[]>();
    @ViewChildren("newvalue") input: QueryList<ElementRef>;

    public editing: boolean = false;
    public evalue: string;

    ngAfterViewInit(): void {
        this.input.changes.subscribe(changes => {
            if (changes.last) {
                changes.last.nativeElement.focus();
                changes.last.nativeElement.select();
            }
        });
    }

    public onInputKeypress(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            this.onCancel();
        }
        if (event.key === "Enter") {
            this.onSave();
        }
    }

    protected isEmpty(): boolean {
        return this.value === undefined || this.value === null || this.value.length === 0;
    }

    public onStartEditing(): void {
        this.editing = true;
        if (this.isEmpty()) {
            this.evalue = "";
        } else {
            this.evalue = this.value.join(", ");
        }
    }

    public onSave(): void {
        console.info("evalue: ", this.evalue);
        let newValue: string[] = [];
        if (this.evalue && this.evalue.length > 0) {
            newValue = this.evalue.split(/[ ,]+/);
        }
        console.info("newValue: ", newValue);
        this.onChange.emit(newValue);
        this.editing = false;
    }

    public onCancel(): void {
        this.editing = false;
    }

}
