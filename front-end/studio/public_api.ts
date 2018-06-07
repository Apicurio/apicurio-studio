import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule, BsModalService, ModalModule } from 'ngx-bootstrap';

import { AceEditorComponent } from './src/app/components/common/ace-editor.component';
import { AddDefinitionDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/add-definition.component';
import { AddExample20DialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/add-example-20.component';
import { AddExampleDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/add-example.component';
import { AddFormDataParamDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/add-formData-param.component';
import { AddMediaTypeDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/add-media-type.component';
import { AddPathDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/add-path.component';
import { AddQueryParamDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/add-query-param.component';
import { AddResponseDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/add-response.component';
import { AddSchemaPropertyDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/add-schema-property.component';
import { AddServerDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/add-server.component';
import { AddTagDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/add-tag.component';
import { ApiEditorComponent } from './src/app/pages/apis/{apiId}/editor/editor.component';
import { CloneDefinitionDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/clone-definition.component';
import { ClonePathDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/clone-path.component';
import { CodeEditorComponent, CodeEditorTheme } from './src/app/components/common/code-editor.component';
import { ContentComponent } from './src/app/pages/apis/{apiId}/editor/_components/forms/operation/content.component';
import { ContextHelpComponent } from './src/app/pages/apis/{apiId}/editor/_components/common/context-help.component';
import { CopyUrlDialogComponent } from './src/app/components/dialogs/copy-url.component';
import { DefinitionFormComponent } from './src/app/pages/apis/{apiId}/editor/_components/forms/definition-form.component';
import { DefinitionItemComponent } from './src/app/pages/apis/{apiId}/editor/_components/forms/definition-item.component';
import { DropDownComponent } from './src/app/components/common/drop-down.component';
import { EditableApiDefinition } from './src/app/models/api.model';
import { EditExample20DialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/edit-example-20.component';
import { EditExampleDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/edit-example.component';
import { EditorMasterComponent } from './src/app/pages/apis/{apiId}/editor/_components/master.component';
import { FormErrorMessageComponent } from './src/app/components/common/form-error-message.component';
import { IconButtonComponent } from './src/app/pages/apis/{apiId}/editor/_components/common/icon-button.component';
import { InlineTextAreaComponent } from './src/app/pages/apis/{apiId}/editor/_components/common/inline-textarea-editor.component';
import { InlineTextEditorComponent } from './src/app/pages/apis/{apiId}/editor/_components/common/inline-text-editor.component';
import { LicenseService } from './src/app/pages/apis/{apiId}/editor/_services/license.service';
import { Main20FormComponent, Main30FormComponent } from './src/app/pages/apis/{apiId}/editor/_components/forms/main-form.component';
import { Operation30FormComponent } from './src/app/pages/apis/{apiId}/editor/_components/forms/operation-30-form.component';
import { OperationFormComponent } from './src/app/pages/apis/{apiId}/editor/_components/forms/operation-form.component';
import { ParamRowComponent } from './src/app/pages/apis/{apiId}/editor/_components/forms/operation/param-row.component';
import { PathFormComponent } from './src/app/pages/apis/{apiId}/editor/_components/forms/path-form.component';
import { PathItemComponent } from './src/app/pages/apis/{apiId}/editor/_components/common/path-item.component';
import { ProblemFormComponent } from './src/app/pages/apis/{apiId}/editor/_components/forms/problem-form.component';
import { PropertyRowComponent } from './src/app/pages/apis/{apiId}/editor/_components/forms/definition/property-row.component';
import { RenameDefinitionDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/rename-definition.component';
import { ResponseItemComponent } from './src/app/pages/apis/{apiId}/editor/_components/common/response-item.component';
import { ResponseRow30Component } from './src/app/pages/apis/{apiId}/editor/_components/forms/operation/response-row-30.component';
import { ResponseRowComponent } from './src/app/pages/apis/{apiId}/editor/_components/forms/operation/response-row.component';
import { SchemaTypeComponent } from './src/app/pages/apis/{apiId}/editor/_components/common/schema-type.component';
import { SearchComponent } from './src/app/pages/apis/{apiId}/editor/_components/common/search.component';
import { SecurityRequirementDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/security-requirement.component';
import { SecurityScheme20DialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/security-scheme-20.component';
import { SecurityScheme30DialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/security-scheme-30.component';
import { SelectionService } from './src/app/pages/apis/{apiId}/editor/_services/selection.service';
import { ServersSectionComponent } from './src/app/pages/apis/{apiId}/editor/_components/forms/shared/servers.component';
import { ServerUrlComponent } from './src/app/pages/apis/{apiId}/editor/_components/common/server-url.component';
import { SetContactDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/set-contact.component';
import { SetLicenseDialogComponent } from './src/app/pages/apis/{apiId}/editor/_components/dialogs/set-license.component';
import { ValidationIconComponent } from './src/app/pages/apis/{apiId}/editor/_components/common/validation-icon.component';

export { ApiEditorComponent, EditableApiDefinition };

@NgModule({
  declarations: [
    AceEditorComponent,
    AddDefinitionDialogComponent,
    AddExample20DialogComponent,
    AddExampleDialogComponent,
    AddFormDataParamDialogComponent,
    AddMediaTypeDialogComponent,
    AddPathDialogComponent,
    AddQueryParamDialogComponent,
    AddResponseDialogComponent,
    AddSchemaPropertyDialogComponent,
    AddServerDialogComponent,
    AddTagDialogComponent,
    ApiEditorComponent,
    CloneDefinitionDialogComponent,
    ClonePathDialogComponent,
    CodeEditorComponent,
    ContentComponent,
    ContextHelpComponent,
    CopyUrlDialogComponent,
    DefinitionFormComponent,
    DefinitionItemComponent,
    DropDownComponent,
    EditExample20DialogComponent,
    EditExampleDialogComponent,
    EditorMasterComponent,
    FormErrorMessageComponent,
    IconButtonComponent,
    InlineTextAreaComponent,
    InlineTextEditorComponent,
    Main20FormComponent,
    Main30FormComponent,
    Operation30FormComponent,
    OperationFormComponent,
    ParamRowComponent,
    PathFormComponent,
    PathItemComponent,
    ProblemFormComponent,
    PropertyRowComponent,
    RenameDefinitionDialogComponent,
    ResponseItemComponent,
    ResponseRow30Component,
    ResponseRowComponent,
    SchemaTypeComponent,
    SearchComponent,
    SecurityRequirementDialogComponent,
    SecurityScheme20DialogComponent,
    SecurityScheme30DialogComponent,
    ServersSectionComponent,
    ServerUrlComponent,
    SetContactDialogComponent,
    SetLicenseDialogComponent,
    ValidationIconComponent,
  ],
  imports: [
    CommonModule, FormsModule, ModalModule, BsDropdownModule
  ],
  exports: [
    ApiEditorComponent
  ],
  providers: [
    LicenseService, BsModalService, SelectionService
  ]
})
export class ApicurioEditorModule {
}
