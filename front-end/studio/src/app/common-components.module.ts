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

import {NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ModalModule} from 'ngx-bootstrap/modal';
import {CommonModule} from "@angular/common";

import {DropDownComponent} from './components/common/drop-down.component';
import {FormErrorMessageComponent} from "./components/common/form-error-message.component";
import {CodeEditorComponent} from "./components/common/code-editor.component";
import {AceEditorComponent} from "./components/common/ace-editor.component";
import {DivAutoHeight, TextAreaAutosize, TextBoxAutosize} from "./directives/autosize.directive";
import {MarkdownComponent} from "./components/common/markdown.component";
import {MarkdownSummaryComponent} from "./components/common/markdown-summary.component";
import {MarkdownEditorComponent} from './components/common/markdown-editor.component';

@NgModule({
    imports: [
        CommonModule, FormsModule, ModalModule, BsDropdownModule
    ],
    declarations: [
        DropDownComponent, FormErrorMessageComponent, CodeEditorComponent, AceEditorComponent,
        TextAreaAutosize, DivAutoHeight, TextBoxAutosize, MarkdownComponent, MarkdownSummaryComponent,
        MarkdownEditorComponent
    ],
    providers: [
    ],
    exports: [
        DropDownComponent, FormErrorMessageComponent, CodeEditorComponent, MarkdownEditorComponent,
        TextAreaAutosize, DivAutoHeight, TextBoxAutosize, MarkdownComponent, MarkdownSummaryComponent
    ]
})
export class ApicurioCommonComponentsModule {
}
