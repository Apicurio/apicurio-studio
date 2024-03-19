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

import {Component, ViewEncapsulation} from "@angular/core";
import {TextInputEditorComponent} from "./inline-editor.base";
import {SelectionService} from "../../_services/selection.service";
import {KeypressUtils} from "../../_util/keypress.util";

@Component({
    selector: "pf-inline-text-editor",
    templateUrl: "pf-inline-text-editor.component.html",
    styleUrls: [ "pf-inline-text-editor.component.css" ],
    encapsulation: ViewEncapsulation.None
})
export class PfInlineTextEditorComponent extends TextInputEditorComponent {

    constructor(selectionService: SelectionService) {
        super(selectionService);
    }

    public onInputKeypress(event: KeyboardEvent): void {
        super.onInputKeypress(event);

        if (KeypressUtils.isEnterKey(event)) {
            this.onSave();
        }
    }

    public clearValue(): void {
        this.evalue = '';
        this.input.first.nativeElement.focus();
    }

}
