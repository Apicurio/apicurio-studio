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

import {AfterContentChecked, AfterViewChecked, Directive, ElementRef, HostListener, Input} from "@angular/core";

@Directive({
    selector: "textarea[autosize]"
})
export class TextAreaAutosize implements AfterContentChecked {

    @HostListener("input", ["$event.target"])
    onInput(textArea: HTMLTextAreaElement): void {
        this.adjust();
    }

    constructor(public element: ElementRef) {}

    ngAfterContentChecked(): void {
        this.adjust();
    }

    adjust(): void {
        this.element.nativeElement.style.overflow = "hidden";
        this.element.nativeElement.style.height = "auto";
        this.element.nativeElement.style.height = this.element.nativeElement.scrollHeight + "px";
    }
}


@Directive({
    selector: "div[autoheight]"
})
export class DivAutoHeight implements AfterViewChecked {

    lastHeight: number = -1;

    @Input() maxHeight: number;

    constructor(public element: ElementRef) {
    }

    ngAfterViewChecked(): void {
        this.adjust();
    }

    adjust(): void {
        let height: number = this.element.nativeElement.scrollHeight;
        if (this.maxHeight && height > this.maxHeight) {
            height = this.maxHeight;
        }
        if (Math.abs(height - this.lastHeight) > 5) {
            this.element.nativeElement.style.height = height + "px";
            this.lastHeight = height;
            if (height == this.maxHeight) {
                this.element.nativeElement.style.overflowY = "auto";
            } else {
                this.element.nativeElement.style.overflowY = "visible";
            }
        }
    }
}


@Directive({
    selector: "input[autosize]"
})
export class TextBoxAutosize implements AfterContentChecked {

    @HostListener("input", ["$event.target"])
    onInput(textInput: HTMLInputElement): void {
        this.adjust();
    }

    constructor(public element: ElementRef) {
    }

    ngAfterContentChecked(): void {
        this.adjust();
    }

    adjust(): void {
        this.element.nativeElement.style.width = "auto";
        this.element.nativeElement.style.width = this.element.nativeElement.scrollWidth + "px";
        console.info("New Width: ", this.element.nativeElement.style.width);
    }
}
