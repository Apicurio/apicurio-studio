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

import {Component, Input} from "@angular/core";
import {ApiDesignChange} from "../../models/api-design-change.model";
import {ApiTemplatePublication} from "../../models/api-template-publication.model";
import { MockReference } from "../../models/mock-api.model";
import {ICommand, MarshallCompat} from "@apicurio/data-models";
import {PublishApi} from "../../models/publish-api.model";
import * as moment from "moment";
import {componentTypeToString} from "../../pages/apis/{apiId}/editor/_models/component-type.model";


@Component({
    selector: "activity-item",
    templateUrl: "activity-item.component.html",
    styleUrls: ["activity-item.component.css"]
})
export class ActivityItemComponent {

    @Input() mode: string; // Note: can be "user" or "api"
    @Input() item: ApiDesignChange;
    _command: ICommand = null;
    _publication: PublishApi;
    _mock: MockReference;
    _template: ApiTemplatePublication;

    /**
     * Constructor.
     */
    constructor() {}

    /**
     * Get the command for this change.
     *
     */
    protected command(): ICommand {
        if (this._command == null) {
            this._command = MarshallCompat.unmarshallCommand(JSON.parse(this.item.data));
        }
        return this._command;
    }

    protected publication(): PublishApi {
        if (this._publication == null) {
            this._publication = JSON.parse(this.item.data);
        }
        return this._publication;
    }

    protected mock(): MockReference {
        if (this._mock == null) {
            this._mock = JSON.parse(this.item.data);
        }
        return this._mock;
    }

    protected template(): ApiTemplatePublication {
        if (this._template == null) {
            this._template = JSON.parse(this.item.data);
        }
        return this._template;
    }

    /**
     * Returns an appropriate icon for the activity item, based on its type.
     *
     */
    public icon(): string {
        if (this.item.type == "Command") {
            return this.commandIcon();
        }
        if (this.item.type == "Publish") {
            return this.publicationIcon();
        }
        if (this.item.type == "Mock") {
            return this.mockIcon();
        }
        if (this.item.type == "Template") {
            return this.templateIcon();
        }
        return "document";
    }

    protected commandIcon(): string {
        let rval: string = "user";
        switch (this.command()["type"]()) {
            case "AddPathItemCommand":
            case "AddPathItemCommand_20":
            case "AddPathItemCommand_30":
            case "AddSchemaDefinitionCommand":
            case "AddSchemaDefinitionCommand_20":
            case "AddSchemaDefinitionCommand_30":
            case "AddSecurityRequirementCommand":
            case "AddExampleCommand_30":
            case "AddParameterExampleCommand_30":
            case "AddChannelItemCommand":
            case "AddChildSchemaCommand":
            case "AddMessageExampleCommand_Aai20":
            case "AddOneOfInMessageCommand":
            case "AddResponseDefinitionCommand":
            case "AddResponseDefinitionCommand_20":
            case "AddResponseDefinitionCommand_30":
            case "AddSchemaDefinitionCommand_Aai20":
                rval = "plus";
                break;
            case "ChangeContactCommand":
            case "ChangeContactCommand_20":
            case "ChangeContactCommand_30":
                rval = "id-card-o";
                break;
            case "ChangeDescriptionCommand":
            case "ChangeDescriptionCommand_20":
            case "ChangeDescriptionCommand_30":
                rval = "pencil-square-o";
                break;
            case "ChangeLicenseCommand":
            case "ChangeLicenseCommand_20":
            case "ChangeLicenseCommand_30":
                rval = "copyright";
                break;
            case "ChangeMediaTypeTypeCommand":
            case "ChangeParameterDefinitionTypeCommand":
            case "ChangeParameterDefinitionTypeCommand_20":
            case "ChangeParameterDefinitionTypeCommand_30":
            case "ChangeParameterTypeCommand":
            case "ChangeParameterTypeCommand_20":
            case "ChangeParameterTypeCommand_30":
            case "ChangePropertyTypeCommand":
            case "ChangePropertyTypeCommand_20":
            case "ChangePropertyTypeCommand_30":
            case "ChangeResponseTypeCommand":
            case "ChangeResponseTypeCommand_20":
            case "ChangeSchemaTypeCommand":
            case "ChangeResponseDefinitionTypeCommand":
            case "ChangeResponseDefinitionTypeCommand_20":
            case "ChangePayloadRefCommand_Aai20":
                rval = "info";
                break;
            case "ChangePropertyCommand":
            case "ChangePropertyCommand_20":
            case "ChangePropertyCommand_30":
            case "ChangeSecuritySchemeCommand":
            case "ChangeSecuritySchemeCommand_20":
            case "ChangeSecuritySchemeCommand_30":
            case "ChangeSecuritySchemeCommand_Aai20":
            case "ChangeServerCommand":
            case "ChangeServerCommand_Aai20":
            case "ChangeTitleCommand":
            case "ChangeTitleCommand_20":
            case "ChangeTitleCommand_30":
            case "ChangeVersionCommand_20":
            case "ChangeVersionCommand":
            case "ChangeVersionCommand_30":
            case "SetExampleCommand":
            case "SetExampleCommand_20":
            case "SetExampleCommand_30":
            case "SetParameterExampleCommand_30":
            case "SetExtensionCommand":
            case "SetPropertyCommand":
            case "ReplaceSecurityRequirementCommand":
                rval = "pencil";
                break;
            case "DeleteAllOperationsCommand":
            case "DeleteAllParametersCommand":
            case "DeleteAllParametersCommand_20":
            case "DeleteAllParametersCommand_30":
            case "DeleteAllPropertiesCommand":
            case "DeleteAllPropertiesCommand_20":
            case "DeleteAllPropertiesCommand_30":
            case "DeleteAllTagsCommand":
            case "DeleteAllServersCommand":
            case "DeleteAllSecurityRequirementsCommand":
            case "DeleteAllSecuritySchemesCommand":
            case "DeleteAllChildSchemasCommand":
            case "DeleteAllExamplesCommand":
            case "DeleteAllMessageExamplesCommand_Aai20":
            case "DeleteAllOperationsCommand_Aai20":
            case "DeleteAllParameterExamplesCommand":
            case "DeleteAllServersCommand_Aai20":
            case "DeleteOneOfMessageCommand":
            case "DeleteMediaTypeCommand":
            case "DeleteOperationCommand":
            case "DeleteOperationCommand_20":
            case "DeleteOperationCommand_30":
            case "DeleteParameterCommand":
            case "DeleteParameterCommand_20":
            case "DeleteParameterCommand_30":
            case "DeletePathCommand":
            case "DeletePathCommand_20":
            case "DeletePathCommand_30":
            case "DeletePropertyCommand":
            case "DeletePropertyCommand_20":
            case "DeletePropertyCommand_30":
            case "DeleteResponseCommand":
            case "DeleteResponseCommand_20":
            case "DeleteResponseCommand_30":
            case "DeleteSchemaDefinitionCommand":
            case "DeleteSchemaDefinitionCommand_20":
            case "DeleteSchemaDefinitionCommand_30":
            case "DeleteSecuritySchemeCommand":
            case "DeleteSecuritySchemeCommand_20":
            case "DeleteSecuritySchemeCommand_30":
            case "DeleteSecurityRequirementCommand":
            case "DeleteServerCommand":
            case "DeleteTagCommand":
            case "DeleteTagCommand_20":
            case "DeleteTagCommand_30":
            case "DeleteRequestBodyCommand_30":
            case "DeleteAllResponsesCommand":
            case "DeleteAllResponsesCommand_20":
            case "DeleteAllResponsesCommand_30":
            case "DeleteContactCommand":
            case "DeleteContactCommand_20":
            case "DeleteContactCommand_30":
            case "DeleteLicenseCommand":
            case "DeleteLicenseCommand_20":
            case "DeleteLicenseCommand_30":
            case "DeleteExampleCommand":
            case "DeleteExampleCommand_20":
            case "DeleteExampleCommand_30":
            case "DeleteParameterExampleCommand_30":
            case "DeleteExtensionCommand":
            case "DeleteChannelCommand":
            case "DeleteChildSchemaCommand":
            case "DeleteMessageDefinitionCommand":
            case "DeleteMessageExampleCommand_Aai20":
            case "DeleteMessageTraitDefinitionCommand":
            case "DeleteOperationCommand_Aai20":
            case "DeleteOperationTraitDefinitionCommand":
            case "DeleteResponseDefinitionCommand":
            case "DeleteResponseDefinitionCommand_20":
            case "DeleteResponseDefinitionCommand_30":
            case "DeleteSecuritySchemeCommand_Aai20":
            case "DeleteServerCommand_Aai20":
                rval = "trash-o";
                break;
            case "NewMediaTypeCommand":
            case "NewOperationCommand":
            case "NewOperationCommand_20":
            case "NewOperationCommand_30":
            case "NewParamCommand":
            case "NewParamCommand_20":
            case "NewParamCommand_30":
            case "NewPathCommand":
            case "NewPathCommand_20":
            case "NewPathCommand_30":
            case "NewRequestBodyCommand":
            case "NewRequestBodyCommand_20":
            case "NewRequestBodyCommand_30":
            case "NewResponseCommand":
            case "NewResponseCommand_20":
            case "NewResponseCommand_30":
            case "NewResponseDefinitionCommand":
            case "NewResponseDefinitionCommand_20":
            case "NewResponseDefinitionCommand_30":
            case "NewSchemaDefinitionCommand":
            case "NewSchemaDefinitionCommand_20":
            case "NewSchemaDefinitionCommand_30":
            case "NewSchemaPropertyCommand":
            case "NewSchemaPropertyCommand_20":
            case "NewSchemaPropertyCommand_30":
            case "NewSecuritySchemeCommand":
            case "NewSecuritySchemeCommand_20":
            case "NewSecuritySchemeCommand_30":
            case "NewChannelCommand":
            case "NewMessageDefinitionCommand":
            case "NewMessageTraitDefinitionCommand":
            case "NewOperationCommand_Aai20":
            case "NewOperationTraitDefinitionCommand":
            case "NewSchemaDefinitionCommand_Aai20":
            case "NewSchemaPropertyCommand_Aai20":
            case "NewSecuritySchemeCommand_Aai20":
                rval = "plus";
                break;
            case "NewServerCommand":
            case "NewServerCommand_Aai20":
                rval = "server";
                break;
            case "NewTagCommand":
            case "NewTagCommand_20":
            case "NewTagCommand_30":
                rval = "tag";
                break;
            case "ReplaceOperationCommand":
            case "ReplaceOperationCommand_20":
            case "ReplaceOperationCommand_30":
            case "ReplacePathItemCommand":
            case "ReplacePathItemCommand_20":
            case "ReplacePathItemCommand_30":
            case "ReplaceSchemaDefinitionCommand":
            case "ReplaceSchemaDefinitionCommand_20":
            case "ReplaceSchemaDefinitionCommand_30":
            case "ReplaceResponseDefinitionCommand":
            case "ReplaceResponseDefinitionCommand_20":
            case "ReplaceResponseDefinitionCommand_30":
            case "ReplaceDocumentCommand":
                rval = "code";
                break;
            case "RenamePathItemCommand":
            case "RenameChannelItemCommand":
            case "RenameParameterCommand":
            case "RenameSchemaDefinitionCommand":
            case "RenameSchemaDefinitionCommand_20":
            case "RenameSchemaDefinitionCommand_30":
            case "RenameResponseDefinitionCommand_20":
            case "RenameResponseDefinitionCommand_30":
            case "RenameMessageDefinitionCommand":
            case "RenameMessageTraitDefinitionCommand":
            case "RenameOperationTraitDefinitionCommand":
            case "RenamePropertyCommand":
            case "RenameSecuritySchemeCommand":
            case "RenameServerCommand_Aai20":
            case "RenameTagDefinitionCommand":
                rval = "exchange";
                break;

            case "AggregateCommand":
                rval = this.aggregateCommandIcon();
                break;
            default:
                rval = "question";
        }
        return rval;
    }

    protected aggregateCommandIcon(): string {
        let name: string = this.command()["name"];
        let rval: string = "question";
        switch (name) {
            case "CreateRESTResource":
                rval = "align-left";
                break;
            case "NewResponseWithRef":
                rval = "reply-all";
                break;
            case "ImportedComponents":
                rval = "plus";
                break;
            default:
                console.warn("[ActivityItemComponent] Unhandled AggregateCommand change item (ICON): %s", name);
        }
        return rval;
    }

    protected publicationIcon(): string {
        return this.publication().type.toLowerCase();
    }

    protected mockIcon(): string {
        return "cloud-upload";
    }

    protected templateIcon(): string {
        return "puzzle-piece";
    }

    /**
     * Returns an appropriate description for the activity item, based on its type.
     *
     */
    public description(): string {
        if (this.item.type == "Command") {
            return this.commandDescription();
        }
        if (this.item.type == "Publish") {
            return this.publicationDescription();
        }
        if (this.item.type == "Mock") {
            return this.mockDescription();
        }
        if (this.item.type == "Template") {
            return this.templateDescription();
        }
        return null;
    }

    protected commandDescription(): string {
        let rval: string;
        let ppath: string
        switch (this.command()["type"]()) {
            case "AddChannelItemCommand":
                rval = "added a Channel Item named " + this.command()["_newChannelItemName"] + ".";
                break;
            case "AddPathItemCommand":
            case "AddPathItemCommand_20":
            case "AddPathItemCommand_30":
                rval = "added a Path Item named " + this.command()["_newPathItemName"] + ".";
                break;
            case "AddSchemaDefinitionCommand":
            case "AddSchemaDefinitionCommand_20":
            case "AddSchemaDefinitionCommand_30":
            case "AddSchemaDefinitionCommand_Aai20":
                rval = "added a Data Type named " + this.command()["_newDefinitionName"] + ".";
                break;
            case "AddResponseDefinitionCommand":
            case "AddResponseDefinitionCommand_20":
            case "AddResponseDefinitionCommand_30":
                rval = "added a Response Definition named " + this.command()["_newDefinitionName"] + ".";
                break;
            case "AddOneOfInMessageCommand":
                rval = "added a Message in a(n) component/operation (OneOf section) " + JSON.stringify(this.command()["_newOneOf"]) + ".";
                break;
            case "AddSecurityRequirementCommand":
                rval = `added a Security Requirement at location ${this.command()["_parentPath"]}.`;
                break;
            case "ChangeContactCommand":
            case "ChangeContactCommand_20":
            case "ChangeContactCommand_30":
                rval = "altered the API's Contact information.";
                break;
            case "ChangeDescriptionCommand":
            case "ChangeDescriptionCommand_20":
            case "ChangeDescriptionCommand_30":
                rval = "altered the API's description.";
                break;
            case "ChangeLicenseCommand":
            case "ChangeLicenseCommand_20":
            case "ChangeLicenseCommand_30":
                rval = "changed the API's license to " + this.command()["_newLicenseUrl"] + ".";
                break;
            case "ChangeMediaTypeTypeCommand":
                rval = "modified a Media Type (for node " + this.command()["_mediaTypePath"] + ").";
                break;
            case "ChangeParameterDefinitionTypeCommand":
            case "ChangeParameterDefinitionTypeCommand_20":
            case "ChangeParameterDefinitionTypeCommand_30":
            case "ChangeParameterTypeCommand":
            case "ChangeParameterTypeCommand_20":
            case "ChangeParameterTypeCommand_30":
                rval = "changed the type of a Parameter at location " + this.command()["_paramPath"] + ".";
                break;
            case "ChangePropertyTypeCommand":
            case "ChangePropertyTypeCommand_20":
            case "ChangePropertyTypeCommand_30":
                rval = "changed the type of the Schema Property named '" + this.command()["_propName"] + "' at location " + this.command()["_propPath"] + ".";
                break;
            case "ChangeSchemaTypeCommand":
                rval = "changed the type of the Schema at location " + this.command()["_schemaPath"] + ".";
                break;
            case "ChangeResponseTypeCommand":
            case "ChangeResponseTypeCommand_20":
            case "ChangeResponseDefinitionTypeCommand":
            case "ChangeResponseDefinitionTypeCommand_20":
                rval = "changed the type of an operation Response at location " + this.command()["_responsePath"] + ".";
                break;
            case "ChangePayloadRefCommand_Aai20":
                rval = "changed the payload of a message " + this.command()["_oldPayloadRef"] + ".";
                break;
            case "ChangePropertyCommand":
            case "ChangePropertyCommand_20":
            case "ChangePropertyCommand_30":
                rval = "changed the value of property '" + this.command()["_property"] + "' at location " + this.command()["_nodePath"] + ".";
                break;
            case "ChangeSecuritySchemeCommand":
            case "ChangeSecuritySchemeCommand_20":
            case "ChangeSecuritySchemeCommand_30":
            case "ChangeSecuritySchemeCommand_Aai20":
                rval = "modified the details of Security Scheme named '" + this.command()["_schemeName"] + "'.";
                break;
            case "ChangeServerCommand":
                rval = "modified the details of Server '" + this.command()["_serverUrl"] + "' at location " + this.command()["_parentPath"] + ".";
                break;
            case "ChangeServerCommand_Aai20":
                rval = "modified the details of Server '" + this.command()["_serverName"] + "'.";
                break;
            case "ChangeTitleCommand":
            case "ChangeTitleCommand_20":
            case "ChangeTitleCommand_30":
                rval = "altered the API's title to '" + this.command()["_newTitle"] + "'";
                break;
            case "ChangeVersionCommand":
            case "ChangeVersionCommand_20":
            case "ChangeVersionCommand_30":
                rval = "altered the API's version to '" + this.command()["_newVersion"] + "'";
                break;
            case "DeleteAllOperationsCommand":
                rval = "deleted all of the operations from path " + this.command()["_parentPath"] + ".";
                break;
            case "DeleteAllOperationsCommand_Aai20":
                rval = "deleted all of the operations from channel " + this.command()["_parentPath"] + ".";
                break;
            case "DeleteAllTagsCommand":
                rval = "deleted all of the tags from the API.";
                break;
            case "DeleteAllServersCommand":
                ppath = this.command()["_parentPath"];
                if (ppath == "/") {
                    rval = "deleted all of the servers from the API.";
                } else {
                    rval = `deleted all of the servers from the operation at path ${ ppath }.`;
                }
                break;
            case "DeleteAllServersCommand_Aai20":
                rval = "deleted all of the servers from the API.";
                break;
            case "DeleteAllSecurityRequirementsCommand":
                ppath = this.command()["_parentPath"];
                if (ppath == "/") {
                    rval = "deleted all of the security requirements from the API.";
                } else {
                    rval = `deleted all of the security requirements from the operation at path ${ ppath }.`;
                }
                break;
            case "DeleteAllSecuritySchemesCommand":
                rval = "deleted all of the security schemes from the API.";
                break;
            case "DeleteAllParametersCommand":
            case "DeleteAllParametersCommand_20":
            case "DeleteAllParametersCommand_30":
                rval = "deleted all of the " + this.command()["_paramType"] + " style parameters at location " + this.command()["_parentPath"] + ".";
                break;
            case "DeleteAllPropertiesCommand":
            case "DeleteAllPropertiesCommand_20":
            case "DeleteAllPropertiesCommand_30":
                rval = "deleted all of the Schema properties at location " + this.command()["_schemaPath"] + ".";
                break;
            case "DeleteChannelCommand":
                rval = "deleted a Channel Item named '" + this.command()["_channel"] + "'.";
                break;
            case "DeleteMediaTypeCommand":
                rval = "deleted Media Type '" + this.command()["_mediaTypeName"] + "' at location " + this.command()["_mediaTypePath"] + ".";
                break;
            case "DeleteOneOfMessageCommand":
                rval = "deleted Message from component/operation'" + JSON.stringify(this.command()["_oldMessage"]) + ".";
                break;
            case "DeleteOperationCommand":
            case "DeleteOperationCommand_20":
            case "DeleteOperationCommand_30":
            case "DeleteOperationCommand_Aai20":
                rval = "deleted the '" + this.command()["_property"] + "' Operation at location " + this.command()["_parentPath"] + ".";
                break;
            case "DeleteParameterCommand":
            case "DeleteParameterCommand_20":
            case "DeleteParameterCommand_30":
                rval = "deleted a parameter at location " + this.command()["_parameterPath"] + ".";
                break;
            case "DeletePathCommand":
            case "DeletePathCommand_20":
            case "DeletePathCommand_30":
                rval = "deleted a Path Item named '" + this.command()["_path"] + "'.";
                break;
            case "DeletePropertyCommand":
            case "DeletePropertyCommand_20":
            case "DeletePropertyCommand_30":
                rval = "deleted a Property named '" + this.command()["_propertyName"] + "' at location " + this.command()["_propertyPath"] + ".";
                break;
            case "DeleteResponseCommand":
            case "DeleteResponseCommand_20":
            case "DeleteResponseCommand_30":
                rval = "deleted a Response with code '" + this.command()["_responseCode"] + "' at location " + this.command()["_responsePath"] + ".";
                break;
            case "DeleteSchemaDefinitionCommand":
            case "DeleteSchemaDefinitionCommand_20":
            case "DeleteSchemaDefinitionCommand_30":
                rval = "deleted the Data Type named '" + this.command()["_definitionName"] + "'.";
                break;
            case "DeleteResponseDefinitionCommand":
            case "DeleteResponseDefinitionCommand_20":
            case "DeleteResponseDefinitionCommand_30":
                rval = "deleted the Response Definition named '" + this.command()["_definitionName"] + "'.";
                break;
            case "DeleteSecuritySchemeCommand":
            case "DeleteSecuritySchemeCommand_20":
            case "DeleteSecuritySchemeCommand_30":
            case "DeleteSecuritySchemeCommand_Aai20":
                rval = "deleted the Security Scheme named '" + this.command()["_schemeName"] + "'.";
                break;
            case "DeleteServerCommand":
                rval = "deleted a Server with url '" + this.command()["_serverUrl"] + "' at location " + this.command()["_parentPath"] + ".";
                break;
            case "DeleteServerCommand_Aai20":
                rval = "deleted a Server with name '" + this.command()["_serverName"] + ".";
                break;
            case "DeleteTagCommand":
            case "DeleteTagCommand_20":
            case "DeleteTagCommand_30":
                rval = "deleted the global Tag definition with name '" + this.command()["_tagName"] + "'.";
                break;
            case "DeleteRequestBodyCommand_30":
                rval = "deleted the global Tag definition with name '" + this.command()["_tagName"] + "'.";
                break;
            case "DeleteAllResponsesCommand":
            case "DeleteAllResponsesCommand_20":
            case "DeleteAllResponsesCommand_30":
                rval = "deleted all of the Responses at location " + this.command()["_parentPath"] + ".";
                break;
            case "DeleteContactCommand":
            case "DeleteContactCommand_20":
            case "DeleteContactCommand_30":
                rval = "deleted the API's Contact information.";
                break;
            case "DeleteLicenseCommand":
            case "DeleteLicenseCommand_20":
            case "DeleteLicenseCommand_30":
                rval = "deleted the API's License information.";
                break;
            case "DeleteSecurityRequirementCommand":
                rval = `deleted a Security Requirement at location ${this.command()["_parentPath"]}.`;
                break;
            case "NewMediaTypeCommand":
                rval = "added a new Media Type named '" + this.command()["_newMediaType"] + "' at location " + this.command()["_nodePath"] + ".";
                break;
            case "NewOperationCommand":
            case "NewOperationCommand_20":
            case "NewOperationCommand_30":
                rval = "added a new Operation named '" + this.command()["_method"] + "' at location " + this.command()["_path"] + ".";
                break;
            case "NewOperationCommand_Aai20":
                rval = "added a new Operation named '" + this.command()["_opType"] + "' at location " + this.command()["_channel"] + ".";
                break;
            case "NewParamCommand":
            case "NewParamCommand_20":
            case "NewParamCommand_30":
                rval = `added a new ${ this.command()["_paramType"] } parameter named '${ this.command()["_paramName"] }' at location ${ this.command()["_parentPath"] }.`;
                break;
            case "NewPathCommand":
            case "NewPathCommand_20":
            case "NewPathCommand_30":
                rval = "added a new Path named '" + this.command()["_newPath"] + "'.";
                break;
            case "NewChannelCommand":
                rval = "added a new Channel named '" + this.command()["_newChannel"] + "'.";
                break;
            case "NewRequestBodyCommand":
            case "NewRequestBodyCommand_20":
            case "NewRequestBodyCommand_30":
                rval = "added a Request Body for Operation at location  " + this.command()["_operationPath"] + ".";
                break;
            case "NewResponseCommand":
            case "NewResponseCommand_20":
            case "NewResponseCommand_30":
                rval = "added a new Response for response code '" + this.command()["_statusCode"] + "' for Operation at location " + this.command()["_operationPath"] + ".";
                break;
            case "NewResponseDefinitionCommand":
            case "NewResponseDefinitionCommand_20":
            case "NewResponseDefinitionCommand_30":
                rval = `added a new Response Definition named '${ this.command()["_newDefinitionName"]}'.`;
                break;
            case "NewSchemaDefinitionCommand":
            case "NewSchemaDefinitionCommand_20":
            case "NewSchemaDefinitionCommand_30":
            case "NewSchemaDefinitionCommand_Aai20":
                rval = `added a new Data Type named '${ this.command()["_newDefinitionName"]}'.`;
                break;
            case "NewSchemaPropertyCommand":
            case "NewSchemaPropertyCommand_20":
            case "NewSchemaPropertyCommand_30":
            case "NewSchemaPropertyCommand_Aai20":
                rval = "added a new Schema Property named '" + this.command()["_propertyName"] + "' at location " + this.command()["_schemaPath"] + ".";
                break;
            case "NewSecuritySchemeCommand":
            case "NewSecuritySchemeCommand_20":
            case "NewSecuritySchemeCommand_30":
            case "NewSecuritySchemeCommand_Aai20":
                rval = "added a new Security Scheme named '" + this.command()["_schemeName"] + "'.";
                break;
            case "NewServerCommand":
                rval = "added a new Server with url '" + this.command()["_server"].url + "' at location " + this.command()["_parentPath"] + ".";
                break;
            case "NewServerCommand_Aai20":
                rval = "added a new Server with name '" + this.command()["_serverName"] + "'.";
                break;
            case "NewTagCommand":
            case "NewTagCommand_20":
            case "NewTagCommand_30":
                rval = "added a new Tag named '" + this.command()["_tagName"] + "'.";
                break;
            case "ReplaceOperationCommand":
            case "ReplaceOperationCommand_20":
            case "ReplaceOperationCommand_30":
                rval = "fully replaced the source for Operation '" + this.command()["_method"] + "' at location " + this.command()["_path"] + ".";
                break;
            case "ReplacePathItemCommand":
            case "ReplacePathItemCommand_20":
            case "ReplacePathItemCommand_30":
                rval = "fully replaced the source for Path '" + this.command()["_pathName"] + "'.";
                break;
            case "ReplaceDocumentCommand":
                rval = `fully replaced the source for the entire API!`;
                break;
            case "ReplaceSchemaDefinitionCommand":
            case "ReplaceSchemaDefinitionCommand_20":
            case "ReplaceSchemaDefinitionCommand_30":
                rval = "fully replaced the source for Data Type '" + this.command()["_defName"] + "'.";
                break;
            case "ReplaceResponseDefinitionCommand":
            case "ReplaceResponseDefinitionCommand_20":
            case "ReplaceResponseDefinitionCommand_30":
                rval = "fully replaced the source for Data Type '" + this.command()["_defName"] + "'.";
                break;
            case "ReplaceSecurityRequirementCommand":
                rval = `modified the details of a Security Requirement at location ${this.command()["_parentPath"]}.`;
                break;
            case "RenamePathItemCommand":
                rval = `renamed a path from '${this.command()['_oldPath']}' to '${this.command()['_newPath']}'.`;
                break;
            case "RenameChannelItemCommand":
                rval = `renamed a channel from '${this.command()['_oldChannelName']}' to '${this.command()['_newChannelName']}'.`;
                break;
            case "RenameParameterCommand":
                rval = `renamed a ${this.command()['_paramIn']} parameter from '${this.command()['_oldParamName']}' to '${this.command()['_newParamName']}'.`;
                break;
            case "RenameSchemaDefinitionCommand":
            case "RenameSchemaDefinitionCommand_20":
            case "RenameSchemaDefinitionCommand_30":
                rval = "renamed a schema definition from '" + this.command()["_oldName"] + "' to '" + this.command()["_newName"] + "'.";
                break;
            case "RenameResponseDefinitionCommand":
            case "RenameResponseDefinitionCommand_20":
            case "RenameResponseDefinitionCommand_30":
                rval = "renamed a response definition from '" + this.command()["_oldName"] + "' to '" + this.command()["_newName"] + "'.";
                break;
            case "RenameSecuritySchemeCommand":
                rval = "renamed a security scheme from '" + this.command()["_oldSchemeName"] + "' to '" + this.command()["_newSchemeName"] + "'.";
                break;
            case "RenameServerCommand_Aai20":
                rval = "renamed a server from '" + this.command()["_oldServerName"] + "' to '" + this.command()["_newServerName"] + "'.";
                break;
            case "DeleteExampleCommand":
            case "DeleteExampleCommand_20":
                rval = "deleted an example for content-type '" + this.command()["_exampleContentType"] + "' from the Response at location " + this.command()["_responsePath"] + ".";
                break;
            case "DeleteExampleCommand_30":
                rval = "deleted an example named '" + this.command()["_exampleName"] + "' from the MediaType at location " + this.command()["_mediaTypePath"] + ".";
                break;
            case "DeleteExtensionCommand":
                rval = `removed the extension named '${ this.command()["_name"] }'.`;
                break;
            case "AddExampleCommand_30":
                rval = "added an example named '" + this.command()["_newExampleName"] + "' to the MediaType at location " + this.command()["_parentPath"] + ".";
                break;
            case "AddParameterExampleCommand_30":
                rval = "added an example named '" + this.command()["_newExampleName"] + "' to the Parameter at location " + this.command()["_parentPath"] + ".";
                break;
            case "SetExampleCommand_20":
                rval = "changed the value of the example for content-type '" + this.command()["_newContentType"] + "' for the Response at location " + this.command()["_parentPath"] + ".";
                break;
            case "SetExampleCommand_30":
                rval = "changed the value of the example named '" + this.command()["_newExampleName"] + "' for the MediaType at location " + this.command()["_parentPath"] + ".";
                break;
            case "SetParameterExampleCommand_30":
                rval = "changed the value of the example named '" + this.command()["_newExampleName"] + "' for the Parameter at location " + this.command()["_parentPath"] + ".";
                break;
            case "SetExtensionCommand":
                rval = `changed the value of the extension named '${ this.command()["_name"] }'.`;
                break;
            case "SetPropertyCommand":
                rval = `changed the value of the property named '${ this.command()["_name"] }' at location ${this.command()["_nodePath"]}.`;
                break;

            case "AggregateCommand":
                rval = this.aggregateCommandDescription();
                break;
            default:
                console.info("[ActivityItemComponent] WARNING - unhandled change item type: %s", this.command()["type"]());
                rval = "performed some unknown action...";
        }
        return rval;
    }

    protected aggregateCommandDescription(): string {
        let name: string = this.command()["name"];
        let rval: string;
        switch (name) {
            case "CreateRESTResource":
                rval = `created a Data Type and associated REST resource named '${ this.command()["info"].dataType }'.`;
                break;
            case "NewResponseWithRef":
                rval = `created a Response that references the Response Definition at '${ this.command()["info"].$ref }'.`;
                break;
            case "ImportedComponents":
                rval = `imported ${ this.command()["info"].numComponents } external components of type '${ componentTypeToString(this.command()["info"].type) }'.`;
                break;
            default:
                console.warn("[ActivityItemComponent] Unhandled AggregateCommand change item: %s", name);
                rval = "performed some unknown action...";
        }
        return rval;
    }

    protected publicationDescription(): string {
        return "published the API to " + this.publication().type + ".";
    }

    protected mockDescription(): string {
        return "mocked the API to " + this.mock().serviceRef
            + " at " + this.mock().mockURL + ".";
    }

    protected templateDescription(): string {
        return "promoted the API as a template named '" + this.template().name + "'.";
    }

    public apiName(): string {
        if (this.item.apiName && this.item.apiName.length > 50) {
            return this.item.apiName.substring(0, 50) + "...";
        }
        return this.item.apiName;
    }

    public on(): string {
        return moment(this.item.on).fromNow();
    }

}
