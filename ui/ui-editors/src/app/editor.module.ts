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

import {NgModule} from "@angular/core";

import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ModalModule} from 'ngx-bootstrap/modal';

import {ValidationIconComponent} from "./editor/_components/title-bar/validation-icon.component";
import {ServerUrlComponent} from "./editor/_components/common/server-url.component";
import {SearchComponent} from "./editor/_components/common/search.component";
import {SchemaTypeComponent} from "./editor/_components/common/schema-type.component";
import {PathItemComponent} from "./editor/_components/common/path-item.component";
import {ContextHelpComponent} from "./editor/_components/common/context-help.component";
import {SetLicenseDialogComponent} from "./editor/_components/dialogs/set-license.component";
import {AddTagDialogComponent} from "./editor/_components/dialogs/add-tag.component";
import {CloneDefinitionDialogComponent} from "./editor/_components/dialogs/clone-definition.component";
import {ClonePathDialogComponent} from "./editor/_components/dialogs/clone-path.component";
import {PropertyRowComponent} from "./editor/_components/forms/definition/property-row.component";
import {OneOfRowComponent} from "./editor/_components/forms/definition/oneof-row.component";
import {ServersSectionComponent} from "./editor/_components/forms/shared/servers-section.component";
import {DefinitionItemComponent} from "./editor/_components/forms/definition-item.component";
import {DefinitionFormComponent} from "./editor/_components/forms/definition-form.component";
import {PathFormComponent} from "./editor/_components/forms/path-form.component";
import {ChannelFormComponent} from "./editor/_components/forms/channel-form.component";
import {MessageTraitFormComponent} from "./editor/_components/forms/messagetrait-form.component";
import {MessageFormComponent} from "./editor/_components/forms/message-form.component";
import {MessageItemComponent} from "./editor/_components/forms/message-item.component";
import {MessageTraitItemComponent} from "./editor/_components/forms/messagetrait-item.component";
import {OperationTraitFormComponent} from "./editor/_components/forms/operationtrait-form.component";
import {OperationTraitItemComponent} from "./editor/_components/forms/operationtrait-item.component";
import {EditorMasterComponent} from "./editor/_components/master.component";
import {AsyncApiEditorMasterComponent} from "./editor/_components/aaimaster.component";
import {OaiEditorComponent} from "./editor/oaieditor.component";
import {AddPathDialogComponent} from "./editor/_components/dialogs/add-path.component";
import {AddChannelDialogComponent} from "./editor/_components/dialogs/add-channel.component";
import {AddResponseDialogComponent} from "./editor/_components/dialogs/add-response.component";
import {CloneResponseDialogComponent} from "./editor/_components/dialogs/clone-response.component";
import {MainFormComponent} from "./editor/_components/forms/main-form.component";
import {AsyncApiMainFormComponent} from "./editor/_components/forms/aaimain-form.component";
import {AddMediaTypeDialogComponent} from "./editor/_components/dialogs/add-media-type.component";
import {AddExampleDialogComponent} from "./editor/_components/dialogs/add-example.component";
import {EditExampleDialogComponent} from "./editor/_components/dialogs/edit-example.component";
import {AddExample20DialogComponent} from "./editor/_components/dialogs/add-example-20.component";
import {EditExample20DialogComponent} from "./editor/_components/dialogs/edit-example-20.component";
import {AddAsyncApiExampleDialogComponent} from "./editor/_components/dialogs/add-aai-example.component";
import {EditAsyncApiExampleDialogComponent} from "./editor/_components/dialogs/edit-aai-example.component";
import {ProblemsService} from "./editor/_services/problems.service";
import {SelectionService} from "./editor/_services/selection.service";
import {LicenseService} from "./editor/_services/license.service";
import {IconButtonComponent} from "./editor/_components/common/icon-button.component";
import {SignpostComponent} from "./editor/_components/common/signpost.component";
import {EditorTitleBarComponent} from "./editor/_components/title-bar.component";
import {EditorProblemDrawerComponent} from "./editor/_components/problem-drawer.component";
import {InfoSectionComponent} from "./editor/_components/forms/main/info-section.component";
import {AsyncApiInfoSectionComponent} from "./editor/_components/forms/main/aaiinfo-section.component";
import {CommandService} from "./editor/_services/command.service";
import {ValidationProblemComponent} from "./editor/_components/common/validation-problem.component";
import {ValidationAggregateComponent} from "./editor/_components/common/validation-aggregate.component";
import {ContactSectionComponent} from "./editor/_components/forms/main/contact-section.component";
import {AsyncApiContactSectionComponent} from "./editor/_components/forms/main/aaicontact-section.component";
import {LicenseSectionComponent} from "./editor/_components/forms/main/license-section.component";
import {AsyncApiLicenseSectionComponent} from "./editor/_components/forms/main/aailicense-section.component";
import {TagsSectionComponent} from "./editor/_components/forms/main/tags-section.component";
import {SecurityRequirementsSectionComponent} from "./editor/_components/forms/shared/security-requirements-section.component";
import {SecuritySchemesSectionComponent} from "./editor/_components/forms/main/security-schemes-section.component";
import {PathParamsSectionComponent} from "./editor/_components/forms/shared/path-params-section.component";
import {QueryParamsSectionComponent} from "./editor/_components/forms/shared/query-params-section.component";
import {HeaderParamsSectionComponent} from "./editor/_components/forms/shared/header-params-section.component";
import {DocumentService} from "./editor/_services/document.service";
import {PfInlineTextEditorComponent} from "./editor/_components/common/pf-inline-text-editor.component";
import {TagRowComponent} from "./editor/_components/forms/main/tag-row.component";
import {ServerEditorComponent} from "./editor/_components/editors/server-editor.component";
import {EditorsService} from "./editor/_services/editors.service";
import {ServerRowComponent} from "./editor/_components/forms/shared/server-row.component";
import {UndoIconComponent} from "./editor/_components/title-bar/undo-icon.component";
import {RedoIconComponent} from "./editor/_components/title-bar/redo-icon.component";
import {InlineArrayEditorComponent} from "./editor/_components/common/inline-array-editor.component";
import {SecuritySchemeRowComponent} from "./editor/_components/forms/main/security-scheme-row.component";
import {SecuritySchemeEditorComponent} from "./editor/_components/editors/security-scheme-editor.component";
import {SecurityRequirementEditorComponent} from "./editor/_components/editors/security-requirement-editor.component";
import {EntityEditorComponent} from "./editor/_components/editors/entity-editor.component";
import {QueryParamRowComponent} from "./editor/_components/forms/shared/query-param-row.component";
import {PathParamRowComponent} from "./editor/_components/forms/shared/path-param-row.component";
import {HeaderParamRowComponent} from "./editor/_components/forms/shared/header-param-row.component";
import {InlineMarkdownEditorComponent} from "./editor/_components/common/inline-markdown-editor.component";
import {DataTypeEditorComponent} from "./editor/_components/editors/data-type-editor.component";
import {DefinitionInfoSectionComponent} from "./editor/_components/forms/definition/info-section.component";
import {RestResourceService} from "./editor/_services/rest-resource.service";
import {RenamePathDialogComponent} from "./editor/_components/dialogs/rename-path.component";
import {CounterComponent} from "./editor/_components/common/counter.component";
import {InlineExampleEditorComponent} from "./editor/_components/common/inline-example-editor.component";
import {DefinitionExampleSectionComponent} from "./editor/_components/forms/definition/example-section.component";
import {PathInfoSectionComponent} from "./editor/_components/forms/path/info-section.component";
import {ChannelInfoSectionComponent} from "./editor/_components/forms/channel/info-section.component";
import {ParameterEditorComponent} from "./editor/_components/editors/parameter-editor.component";
import {PropertyEditorComponent} from "./editor/_components/editors/property-editor.component";
import {SchemaTypeEditorComponent} from "./editor/_components/forms/shared/schema-type-editor.component";
import {OperationsSectionComponent} from "./editor/_components/forms/path/operations-section.component";
import {ChannelOperationsSectionComponent} from "./editor/_components/forms/channel/operations-section.component";
import {OperationInfoSectionComponent} from "./editor/_components/forms/path/operation/info-section.component";
import {ChannelOperationInfoSectionComponent} from "./editor/_components/forms/channel/operation/info-section.component";
import {MessageSectionComponent} from "./editor/_components/forms/channel/operation/message-section.component";
import {PayloadTabComponent} from "./editor/_components/forms/channel/operation/payload-tab.component";
import {HeadersTabComponent} from "./editor/_components/forms/channel/operation/headers-tab.component";
import {NoOperationComponent} from "./editor/_components/forms/path/operation/no-operation.component";
import {SectionComponent} from "./editor/_components/forms/shared/section.component";
import {RequestBodySectionComponent} from "./editor/_components/forms/path/operation/requestBody-section.component";
import {FormDataParamRowComponent} from "./editor/_components/forms/path/operation/formData-param-row.component";
import {ContentComponent} from "./editor/_components/forms/path/operation/content.component";
import {ResponsesSectionComponent} from "./editor/_components/forms/path/operation/responses-section.component";
import {ScopesInputComponent} from "./editor/_components/common/scopes-input.component";
import {ResponseTabComponent} from "./editor/_components/forms/path/operation/response-tab.component";
import {ResponseTab30Component} from "./editor/_components/forms/path/operation/response-tab-30.component";
import {MediaTypeRowComponent} from "./editor/_components/forms/shared/media-type-row.component";
import {FeaturesService} from "./editor/_services/features.service";
import {CollaboratorAggregateComponent} from "./editor/_components/common/collaborator-aggregate.component";
import {CollaboratorService} from "./editor/_services/collaborator.service";
import {CollaboratorOverlayComponent} from "./editor/_components/common/collaborator-overlay.component";
import {RenameEntityDialogComponent} from "./editor/_components/dialogs/rename-entity.component";
import {CookieParamsSectionComponent} from "./editor/_components/forms/shared/cookie-params-section.component";
import {CookieParamRowComponent} from "./editor/_components/forms/shared/cookie-param-row.component";
import {ResponseEditorComponent} from "./editor/_components/editors/response-editor.component";
import {OperationTraitEditorComponent} from "./editor/_components/editors/operationtrait-editor.component";
import {MessageTraitEditorComponent} from "./editor/_components/editors/messagetrait-editor.component";
import {ResponseItemComponent} from "./editor/_components/forms/response-item.component";
import {ResponseFormComponent} from "./editor/_components/forms/response-form.component";
import {CloneResponseDefinitionDialogComponent} from "./editor/_components/dialogs/clone-response-definition.component";
import {AaiEditorComponent} from "./editor/aaieditor.component";
import {PropertiesSectionComponent} from "./editor/_components/forms/definition/properties-section.component";
import {InheritanceSchemasSectionComponent} from "./editor/_components/forms/definition/schemas-section.component";
import {SchemaRowComponent} from "./editor/_components/forms/definition/schema-row.component";
import {AddSchemaDialogComponent} from "./editor/_components/dialogs/add-schema.component";
import {ApiCatalogService} from "./editor/_services/api-catalog.service";
import {CheckBoxInputComponent} from "./editor/_components/common/checkbox-input.component";
import {AaiServersSectionComponent} from "./editor/_components/forms/shared/aaiservers-section.component";
import {AaiServerEditorComponent} from "./editor/_components/editors/aaiserver-editor.component";
import {AaiServerRowComponent} from "./editor/_components/forms/shared/aaiserver-row.component";
import {AaiSecuritySchemesSectionComponent} from "./editor/_components/forms/main/aaisecurity-schemes-section.component";
import {AaiSecurityRequirementRowComponent} from "./editor/_components/forms/shared/aaisecurity-requirement-row.component";
import {HttpHeadersComponent} from "./editor/_components/forms/path/operation/http-headers.component";
import {HeaderRowComponent} from "./editor/_components/forms/shared/header-row.component";
import {AddHeaderDialogComponent} from "./editor/_components/dialogs/add-header.component";
import {CloneChannelDialogComponent} from "./editor/_components/dialogs/clone-channel.component";
import {MessageEditorComponent} from "./editor/_components/editors/message-editor.component";
import {OneOfInMessageEditorComponent} from "./editor/_components/editors/oneof-in-message-editor.component";
import {AddOneOfInMessageDialogComponent} from "./editor/_components/dialogs/add-message-reference.component";
import {ExtensionsSectionComponent} from "./editor/_components/forms/shared/extensions-section.component";
import {ExtensionRowComponent} from "./editor/_components/forms/shared/extension-row.component";
import {JsonSummaryComponent} from "./editor/_components/common/json-summary.component";
import {InlineJsonEditorComponent} from "./editor/_components/common/inline-json-editor.component";
import {AddExtensionDialogComponent} from "./editor/_components/dialogs/add-extension.component";
import {DropDownComponent} from './editor/_components/common/drop-down.component';
import {FormErrorMessageComponent} from "./editor/_components/common/form-error-message.component";
import {CodeEditorComponent} from "./editor/_components/common/code-editor.component";
import {AceEditorComponent} from "./editor/_components/common/ace-editor.component";
import {DivAutoHeight, TextAreaAutosize, TextBoxAutosize} from "./editor/_directives/autosize.directive";
import {MarkdownComponent} from "./editor/_components/common/markdown.component";
import {MarkdownSummaryComponent} from "./editor/_components/common/markdown-summary.component";
import {MarkdownEditorComponent} from './editor/_components/common/markdown-editor.component';

@NgModule({
    imports: [
        CommonModule, FormsModule, ModalModule, BsDropdownModule
    ],
    declarations: [
        ValidationIconComponent, ServerUrlComponent, SearchComponent, SchemaTypeComponent, ResponseItemComponent,
        PathItemComponent, ContextHelpComponent, InlineMarkdownEditorComponent, OperationInfoSectionComponent,
        ChannelOperationInfoSectionComponent, MessageSectionComponent, PayloadTabComponent, HeadersTabComponent,
        SetLicenseDialogComponent, ClonePathDialogComponent, DropDownComponent, FormErrorMessageComponent,
        CodeEditorComponent, AceEditorComponent, TextAreaAutosize, DivAutoHeight, TextBoxAutosize, MarkdownComponent,
        MarkdownSummaryComponent, MarkdownEditorComponent, CloneDefinitionDialogComponent, ScopesInputComponent,
        AddTagDialogComponent, UndoIconComponent, SchemaTypeEditorComponent, NoOperationComponent, ContentComponent,
        HttpHeadersComponent, PropertyRowComponent, OneOfRowComponent, PathFormComponent, ChannelFormComponent,
        MessageTraitFormComponent, MessageFormComponent, MessageTraitItemComponent, MessageItemComponent,
        OperationTraitFormComponent, OperationTraitItemComponent, QueryParamRowComponent, SectionComponent,
        RequestBodySectionComponent, DefinitionItemComponent, DefinitionFormComponent, FormDataParamRowComponent,
        ResponseTab30Component, EditorMasterComponent, AsyncApiEditorMasterComponent, AaiEditorComponent,
        AddPathDialogComponent, AddChannelDialogComponent, AddOneOfInMessageDialogComponent, ParameterEditorComponent,
        AddResponseDialogComponent, CloneResponseDialogComponent, RedoIconComponent, PathInfoSectionComponent,
        OperationTraitEditorComponent, ChannelInfoSectionComponent, ResponseTabComponent, AddMediaTypeDialogComponent,
        AddHeaderDialogComponent, MainFormComponent, AsyncApiMainFormComponent, RenameEntityDialogComponent,
        AddExampleDialogComponent, EditExampleDialogComponent, AddExample20DialogComponent,
        AddAsyncApiExampleDialogComponent, EditAsyncApiExampleDialogComponent, EditorTitleBarComponent,
        EditExample20DialogComponent, IconButtonComponent, SignpostComponent, EditorProblemDrawerComponent,
        CheckBoxInputComponent, SecurityRequirementEditorComponent, InfoSectionComponent, AsyncApiInfoSectionComponent,
        ValidationProblemComponent, ValidationAggregateComponent, ContactSectionComponent,
        AsyncApiContactSectionComponent, LicenseSectionComponent, AsyncApiLicenseSectionComponent,
        TagsSectionComponent, AaiServersSectionComponent, ServersSectionComponent, AaiSecurityRequirementRowComponent,
        SecurityRequirementsSectionComponent, SecuritySchemesSectionComponent, AaiSecuritySchemesSectionComponent,
        PathParamsSectionComponent, QueryParamsSectionComponent, PathParamRowComponent, PfInlineTextEditorComponent,
        TagRowComponent, AaiServerEditorComponent, ServerEditorComponent, AaiServerRowComponent, ServerRowComponent,
        EntityEditorComponent, InlineArrayEditorComponent, SecuritySchemeRowComponent, SecuritySchemeEditorComponent,
        DataTypeEditorComponent, DefinitionInfoSectionComponent, RenamePathDialogComponent, CounterComponent,
        ResponsesSectionComponent, InlineExampleEditorComponent, DefinitionExampleSectionComponent,
        PropertyEditorComponent, HeaderParamRowComponent, HeaderParamsSectionComponent, OperationsSectionComponent,
        ChannelOperationsSectionComponent, MediaTypeRowComponent, HeaderRowComponent, CollaboratorAggregateComponent,
        CollaboratorOverlayComponent, CookieParamsSectionComponent, CookieParamRowComponent, ResponseEditorComponent,
        MessageTraitEditorComponent, MessageEditorComponent, OneOfInMessageEditorComponent, ResponseFormComponent,
        CloneResponseDefinitionDialogComponent, PropertiesSectionComponent, InheritanceSchemasSectionComponent,
        SchemaRowComponent, AddSchemaDialogComponent, CloneChannelDialogComponent, ExtensionsSectionComponent,
        ExtensionRowComponent, JsonSummaryComponent, InlineJsonEditorComponent, AddExtensionDialogComponent,
        OaiEditorComponent
    ],
    providers: [
        ProblemsService, SelectionService, LicenseService, CommandService, DocumentService, EditorsService,
        RestResourceService, FeaturesService, CollaboratorService, ApiCatalogService
    ],
    exports: [
        OaiEditorComponent, AaiEditorComponent
    ]
})
export class ApicurioEditorModule {
}
