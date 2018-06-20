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

import { NgModule } from '@angular/core';

import {ValidationIconComponent} from './pages/apis/{apiId}/editor/_components/common/validation-icon.component';
import {ServerUrlComponent} from './pages/apis/{apiId}/editor/_components/common/server-url.component';
import {SearchComponent} from './pages/apis/{apiId}/editor/_components/common/search.component';
import {InlineTextEditorComponent} from './pages/apis/{apiId}/editor/_components/common/inline-text-editor.component';
import {SchemaTypeComponent} from './pages/apis/{apiId}/editor/_components/common/schema-type.component';
import {ResponseItemComponent} from './pages/apis/{apiId}/editor/_components/common/response-item.component';
import {PathItemComponent} from './pages/apis/{apiId}/editor/_components/common/path-item.component';
import {InlineTextAreaComponent} from './pages/apis/{apiId}/editor/_components/common/inline-textarea-editor.component';
import {ContextHelpComponent} from './pages/apis/{apiId}/editor/_components/common/context-help.component';
import {SecurityScheme30DialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/security-scheme-30.component';
import {SetLicenseDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/set-license.component';
import {SetContactDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/set-contact.component';
import {SecurityScheme20DialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/security-scheme-20.component';
import {AddTagDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-tag.component';
import {AddSchemaPropertyDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-schema-property.component';
import {AddServerDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-server.component';
import {CloneDefinitionDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/clone-definition.component';
import {ClonePathDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/clone-path.component';
import {ResponseRow30Component} from './pages/apis/{apiId}/editor/_components/forms/operation/response-row-30.component';
import {ResponseRowComponent} from './pages/apis/{apiId}/editor/_components/forms/operation/response-row.component';
import {ParamRowComponent} from './pages/apis/{apiId}/editor/_components/forms/operation/param-row.component';
import {OperationFormComponent} from './pages/apis/{apiId}/editor/_components/forms/operation-form.component';
import {ContentComponent} from './pages/apis/{apiId}/editor/_components/forms/operation/content.component';
import {Operation30FormComponent} from './pages/apis/{apiId}/editor/_components/forms/operation-30-form.component';
import {PropertyRowComponent} from './pages/apis/{apiId}/editor/_components/forms/definition/property-row.component';
import {ServersSectionComponent} from './pages/apis/{apiId}/editor/_components/forms/shared/servers.component';
import {DefinitionItemComponent} from './pages/apis/{apiId}/editor/_components/forms/definition-item.component';
import {DefinitionFormComponent} from './pages/apis/{apiId}/editor/_components/forms/definition-form.component';
import {ProblemFormComponent} from './pages/apis/{apiId}/editor/_components/forms/problem-form.component';
import {PathFormComponent} from './pages/apis/{apiId}/editor/_components/forms/path-form.component';
import {EditorMasterComponent} from './pages/apis/{apiId}/editor/_components/master.component';
import {ApiEditorComponent} from './pages/apis/{apiId}/editor/editor.component';
import {AddQueryParamDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-query-param.component';
import {AddPathDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-path.component';
import {AddResponseDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-response.component';
import {AddFormDataParamDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-formData-param.component';
import {AddDefinitionDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-definition.component';
import {
    Main20FormComponent,
    Main30FormComponent
} from './pages/apis/{apiId}/editor/_components/forms/main-form.component';
import {AddMediaTypeDialogComponent} from './pages/apis/{apiId}/editor/_components/dialogs/add-media-type.component';
import {RenameDefinitionDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/rename-definition.component";
import {AddExampleDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-example.component";
import {EditExampleDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/edit-example.component";
import {AddExample20DialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-example-20.component";
import {EditExample20DialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/edit-example-20.component";
import {ProblemsService} from "./pages/apis/{apiId}/editor/_services/problems.service";
import {SelectionService} from "./pages/apis/{apiId}/editor/_services/selection.service";
import {LicenseService} from "./pages/apis/{apiId}/editor/_services/license.service";
import {SecurityRequirementDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/security-requirement.component";
import {IconButtonComponent} from "./pages/apis/{apiId}/editor/_components/common/icon-button.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BsDropdownModule, ModalModule} from "ngx-bootstrap";
import {ApicurioCommonComponentsModule} from "./common-components.module";
import {SignpostComponent} from "./pages/apis/{apiId}/editor/_components/common/signpost.component";

@NgModule({
    imports: [
        CommonModule, FormsModule, ModalModule, BsDropdownModule, ApicurioCommonComponentsModule
    ],
    declarations: [
        ValidationIconComponent, ServerUrlComponent, SearchComponent,
        SchemaTypeComponent, ResponseItemComponent, PathItemComponent, InlineTextAreaComponent,
        InlineTextEditorComponent, ContextHelpComponent, SetLicenseDialogComponent, SetContactDialogComponent,
        SecurityScheme30DialogComponent, SecurityScheme20DialogComponent, ClonePathDialogComponent,
        CloneDefinitionDialogComponent, AddTagDialogComponent, AddServerDialogComponent,
        AddSchemaPropertyDialogComponent, ResponseRow30Component, ResponseRowComponent, ParamRowComponent,
        ContentComponent, PropertyRowComponent, ServersSectionComponent, ProblemFormComponent, PathFormComponent,
        OperationFormComponent, Operation30FormComponent, DefinitionItemComponent, DefinitionFormComponent,
        EditorMasterComponent, ApiEditorComponent, AddQueryParamDialogComponent, AddPathDialogComponent,
        AddResponseDialogComponent, AddFormDataParamDialogComponent, AddDefinitionDialogComponent,
        AddMediaTypeDialogComponent, Main20FormComponent, Main30FormComponent, RenameDefinitionDialogComponent,
        AddExampleDialogComponent, EditExampleDialogComponent, AddExample20DialogComponent,
        EditExample20DialogComponent, SecurityRequirementDialogComponent, IconButtonComponent, SignpostComponent
    ],
    providers: [
        ProblemsService, SelectionService, LicenseService
    ],
    exports: [
        ApiEditorComponent
    ]
})
export class ApicurioEditorModule {
}
