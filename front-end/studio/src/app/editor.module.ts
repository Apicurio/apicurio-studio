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

import {NgModule} from "@angular/core";

import {ValidationIconComponent} from "./pages/apis/{apiId}/editor/_components/title-bar/validation-icon.component";
import {ServerUrlComponent} from "./pages/apis/{apiId}/editor/_components/common/server-url.component";
import {SearchComponent} from "./pages/apis/{apiId}/editor/_components/common/search.component";
import {SchemaTypeComponent} from "./pages/apis/{apiId}/editor/_components/common/schema-type.component";
import {ResponseItemComponent} from "./pages/apis/{apiId}/editor/_components/common/response-item.component";
import {PathItemComponent} from "./pages/apis/{apiId}/editor/_components/common/path-item.component";
import {ContextHelpComponent} from "./pages/apis/{apiId}/editor/_components/common/context-help.component";
import {SetLicenseDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/set-license.component";
import {SetContactDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/set-contact.component";
import {AddTagDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-tag.component";
import {AddSchemaPropertyDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-schema-property.component";
import {CloneDefinitionDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/clone-definition.component";
import {ClonePathDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/clone-path.component";
import {ResponseRow30Component} from "./pages/apis/{apiId}/editor/_components/forms/operation/response-row-30.component";
import {ResponseRowComponent} from "./pages/apis/{apiId}/editor/_components/forms/operation/response-row.component";
import {OperationFormComponent} from "./pages/apis/{apiId}/editor/_components/forms/operation-form.component";
import {ContentComponent} from "./pages/apis/{apiId}/editor/_components/forms/operation/content.component";
import {Operation30FormComponent} from "./pages/apis/{apiId}/editor/_components/forms/operation-30-form.component";
import {PropertyRowComponent} from "./pages/apis/{apiId}/editor/_components/forms/definition/property-row.component";
import {ServersSectionComponent} from "./pages/apis/{apiId}/editor/_components/forms/shared/servers-section.component";
import {DefinitionItemComponent} from "./pages/apis/{apiId}/editor/_components/forms/definition-item.component";
import {DefinitionFormComponent} from "./pages/apis/{apiId}/editor/_components/forms/definition-form.component";
import {PathFormComponent} from "./pages/apis/{apiId}/editor/_components/forms/path-form.component";
import {EditorMasterComponent} from "./pages/apis/{apiId}/editor/_components/master.component";
import {ApiEditorComponent} from "./pages/apis/{apiId}/editor/editor.component";
import {AddQueryParamDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-query-param.component";
import {AddPathDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-path.component";
import {AddResponseDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-response.component";
import {AddFormDataParamDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-formData-param.component";
import {AddDefinitionDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-definition.component";
import {MainFormComponent} from "./pages/apis/{apiId}/editor/_components/forms/main-form.component";
import {AddMediaTypeDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-media-type.component";
import {RenameDefinitionDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/rename-definition.component";
import {AddExampleDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-example.component";
import {EditExampleDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/edit-example.component";
import {AddExample20DialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/add-example-20.component";
import {EditExample20DialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/edit-example-20.component";
import {ProblemsService} from "./pages/apis/{apiId}/editor/_services/problems.service";
import {SelectionService} from "./pages/apis/{apiId}/editor/_services/selection.service";
import {LicenseService} from "./pages/apis/{apiId}/editor/_services/license.service";
import {IconButtonComponent} from "./pages/apis/{apiId}/editor/_components/common/icon-button.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BsDropdownModule, ModalModule} from "ngx-bootstrap";
import {ApicurioCommonComponentsModule} from "./common-components.module";
import {SignpostComponent} from "./pages/apis/{apiId}/editor/_components/common/signpost.component";
import {EditorTitleBarComponent} from "./pages/apis/{apiId}/editor/_components/title-bar.component";
import {EditorProblemDrawerComponent} from "./pages/apis/{apiId}/editor/_components/problem-drawer.component";
import {InfoSectionComponent} from "./pages/apis/{apiId}/editor/_components/forms/main/info-section.component";
import {CommandService} from "./pages/apis/{apiId}/editor/_services/command.service";
import {ValidationProblemComponent} from "./pages/apis/{apiId}/editor/_components/common/validation-problem.component";
import {ValidationAggregateComponent} from "./pages/apis/{apiId}/editor/_components/common/validation-aggregate.component";
import {ContactSectionComponent} from "./pages/apis/{apiId}/editor/_components/forms/main/contact-section.component";
import {LicenseSectionComponent} from "./pages/apis/{apiId}/editor/_components/forms/main/license-section.component";
import {TagsSectionComponent} from "./pages/apis/{apiId}/editor/_components/forms/main/tags-section.component";
import {SecurityRequirementsSectionComponent} from "./pages/apis/{apiId}/editor/_components/forms/shared/security-requirements-section.component";
import {SecuritySchemesSectionComponent} from "./pages/apis/{apiId}/editor/_components/forms/main/security-schemes-section.component";
import {PathParamsSectionComponent} from "./pages/apis/{apiId}/editor/_components/forms/shared/path-params-section.component";
import {QueryParamsSectionComponent} from "./pages/apis/{apiId}/editor/_components/forms/shared/query-params-section.component";
import {DocumentService} from "./pages/apis/{apiId}/editor/_services/document.service";
import {PfInlineTextEditorComponent} from "./pages/apis/{apiId}/editor/_components/common/pf-inline-text-editor.component";
import {TagRowComponent} from "./pages/apis/{apiId}/editor/_components/forms/main/tag-row.component";
import {ServerEditorComponent} from "./pages/apis/{apiId}/editor/_components/editors/server-editor.component";
import {EditorsService} from "./pages/apis/{apiId}/editor/_services/editors.service";
import {ServerRowComponent} from "./pages/apis/{apiId}/editor/_components/forms/shared/server-row.component";
import {UndoIconComponent} from "./pages/apis/{apiId}/editor/_components/title-bar/undo-icon.component";
import {RedoIconComponent} from "./pages/apis/{apiId}/editor/_components/title-bar/redo-icon.component";
import {InlineArrayEditorComponent} from "./pages/apis/{apiId}/editor/_components/common/inline-array-editor.component";
import {SecuritySchemeRowComponent} from "./pages/apis/{apiId}/editor/_components/forms/main/security-scheme-row.component";
import {SecuritySchemeEditorComponent} from "./pages/apis/{apiId}/editor/_components/editors/security-scheme-editor.component";
import {SecurityRequirementEditorComponent} from "./pages/apis/{apiId}/editor/_components/editors/security-requirement-editor.component";
import {EntityEditorComponent} from "./pages/apis/{apiId}/editor/_components/editors/entity-editor.component";
import {QueryParamRowComponent} from "./pages/apis/{apiId}/editor/_components/forms/shared/query-param-row.component";
import {PathParamRowComponent} from "./pages/apis/{apiId}/editor/_components/forms/shared/path-param-row.component";
import {FormDataParamRowComponent} from "./pages/apis/{apiId}/editor/_components/forms/operation/formData-param-row.component";
import {InlineMarkdownEditorComponent} from "./pages/apis/{apiId}/editor/_components/common/inline-markdown-editor.component";
import {DataTypeEditorComponent} from "./pages/apis/{apiId}/editor/_components/editors/data-type-editor.component";
import {DefinitionInfoSectionComponent} from "./pages/apis/{apiId}/editor/_components/forms/definition/info-section.component";
import {RestResourceService} from "./pages/apis/{apiId}/editor/_services/rest-resource.service";
import {OperationInfoSectionComponent} from "./pages/apis/{apiId}/editor/_components/forms/operation/info-section.component";
import {RenamePathDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/rename-path.component";
import {CounterComponent} from "./pages/apis/{apiId}/editor/_components/common/counter.component";
import {InlineExampleEditorComponent} from "./pages/apis/{apiId}/editor/_components/common/inline-example-editor.component";
import {DefinitionExampleSectionComponent} from "./pages/apis/{apiId}/editor/_components/forms/definition/example-section.component";
import {PathInfoSectionComponent} from "./pages/apis/{apiId}/editor/_components/forms/path/info-section.component";
import {Operation3scaleSectionComponent} from "./pages/apis/{apiId}/editor/_components/forms/operation/3scale-section.component";
import {MetricDialogComponent} from "./pages/apis/{apiId}/editor/_components/dialogs/metric-dialog.component";
import {ThreeScaleMetricRowComponent} from "./pages/apis/{apiId}/editor/_components/forms/operation/3scale-metric-row.component";

@NgModule({
    imports: [
        CommonModule, FormsModule, ModalModule, BsDropdownModule, ApicurioCommonComponentsModule
    ],
    declarations: [
        ValidationIconComponent, ServerUrlComponent, SearchComponent, SchemaTypeComponent, ResponseItemComponent,
        PathItemComponent, ContextHelpComponent,FormDataParamRowComponent, InlineMarkdownEditorComponent,
        SetLicenseDialogComponent, SetContactDialogComponent, ClonePathDialogComponent, CloneDefinitionDialogComponent,
        AddTagDialogComponent, AddSchemaPropertyDialogComponent, ResponseRow30Component, UndoIconComponent,
        ResponseRowComponent, ContentComponent, PropertyRowComponent, PathFormComponent, QueryParamRowComponent,
        OperationFormComponent, Operation30FormComponent, DefinitionItemComponent, DefinitionFormComponent,
        EditorMasterComponent, ApiEditorComponent, AddQueryParamDialogComponent, AddPathDialogComponent,
        AddResponseDialogComponent, AddFormDataParamDialogComponent, AddDefinitionDialogComponent, RedoIconComponent,
        AddMediaTypeDialogComponent, MainFormComponent, RenameDefinitionDialogComponent, AddExampleDialogComponent,
        EditExampleDialogComponent, AddExample20DialogComponent, EditorTitleBarComponent, EditExample20DialogComponent,
        IconButtonComponent, SignpostComponent, EditorProblemDrawerComponent, SecurityRequirementEditorComponent,
        InfoSectionComponent, ValidationProblemComponent, ValidationAggregateComponent, ContactSectionComponent,
        LicenseSectionComponent, TagsSectionComponent, ServersSectionComponent, SecurityRequirementsSectionComponent,
        SecuritySchemesSectionComponent, PathParamsSectionComponent, QueryParamsSectionComponent, PathParamRowComponent,
        PfInlineTextEditorComponent, TagRowComponent, ServerEditorComponent, ServerRowComponent, EntityEditorComponent,
        InlineArrayEditorComponent, SecuritySchemeRowComponent, SecuritySchemeEditorComponent, DataTypeEditorComponent,
        DefinitionInfoSectionComponent, OperationInfoSectionComponent, RenamePathDialogComponent, CounterComponent,
        InlineExampleEditorComponent, DefinitionExampleSectionComponent, PathInfoSectionComponent,
        Operation3scaleSectionComponent, MetricDialogComponent, ThreeScaleMetricRowComponent
    ],
    providers: [
        ProblemsService, SelectionService, LicenseService, CommandService, DocumentService, EditorsService,
        RestResourceService
    ],
    exports: [
        ApiEditorComponent
    ]
})
export class ApicurioEditorModule {
}
