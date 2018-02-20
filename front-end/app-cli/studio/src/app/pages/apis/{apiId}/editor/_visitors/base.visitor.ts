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
import {
    IOas20NodeVisitor,
    IOas30NodeVisitor,
    Oas20AdditionalPropertiesSchema,
    Oas20AllOfSchema,
    Oas20Definitions,
    Oas20Example,
    Oas20Headers,
    Oas20Items,
    Oas20ItemsSchema,
    Oas20Parameter,
    Oas20ParameterDefinition,
    Oas20ParametersDefinitions,
    Oas20PropertySchema,
    Oas20Response,
    Oas20ResponseDefinition,
    Oas20ResponsesDefinitions,
    Oas20SchemaDefinition,
    Oas20Scopes,
    Oas20SecurityDefinitions,
    Oas30AdditionalPropertiesSchema,
    Oas30AllOfSchema,
    Oas30AnyOfSchema,
    Oas30AuthorizationCodeOAuthFlow,
    Oas30Callback,
    Oas30CallbackDefinition,
    Oas30CallbackPathItem,
    Oas30ClientCredentialsOAuthFlow,
    Oas30Components,
    Oas30Discriminator,
    Oas30Encoding,
    Oas30Example,
    Oas30ExampleDefinition,
    Oas30HeaderDefinition,
    Oas30ImplicitOAuthFlow,
    Oas30ItemsSchema,
    Oas30Link,
    Oas30LinkDefinition,
    Oas30LinkParameterExpression,
    Oas30LinkRequestBodyExpression,
    Oas30LinkServer,
    Oas30MediaType,
    Oas30NotSchema,
    Oas30OAuthFlows,
    Oas30OneOfSchema,
    Oas30Parameter,
    Oas30ParameterDefinition,
    Oas30PasswordOAuthFlow,
    Oas30PropertySchema,
    Oas30RequestBody,
    Oas30RequestBodyDefinition,
    Oas30Response,
    Oas30ResponseDefinition,
    Oas30SchemaDefinition,
    Oas30Server,
    Oas30ServerVariable,
    OasContact,
    OasDocument,
    OasExtension,
    OasExternalDocumentation,
    OasHeader,
    OasInfo,
    OasLicense, OasNode,
    OasOperation,
    OasPathItem,
    OasPaths,
    OasResponses,
    OasSchema,
    OasSecurityRequirement,
    OasSecurityScheme,
    OasTag,
    OasXML,
} from "oai-ts-core";

/**
 * Base class for visitors that are cabable of visiting both a 2.0 and 3.0 
 * data model.
 *
 * TODO replace with visitors added to oai-ts-core in version 0.2.6
 */
export class AbstractCombinedVisitorAdapter implements IOas20NodeVisitor, IOas30NodeVisitor {

    visitDocument(node: OasDocument): void {
    }

    visitInfo(node: OasInfo): void {
    }

    visitContact(node: OasContact): void {
    }

    visitLicense(node: OasLicense): void {
    }

    visitPaths(node: OasPaths): void {
    }

    visitPathItem(node: OasPathItem): void {
    }

    visitOperation(node: OasOperation): void {
    }

    visitParameter(node: Oas20Parameter | Oas30Parameter): void {
    }

    visitParameterDefinition(node: Oas20ParameterDefinition | Oas30ParameterDefinition): void {
    }

    visitExternalDocumentation(node: OasExternalDocumentation): void {
    }

    visitSecurityRequirement(node: OasSecurityRequirement): void {
    }

    visitResponses(node: OasResponses): void {
    }

    visitResponse(node: Oas20Response | Oas30Response): void {
    }

    visitResponseDefinition(node: Oas20ResponseDefinition | Oas30ResponseDefinition): void {
    }

    visitSchema(node: OasSchema): void {
    }

    visitHeaders(node: Oas20Headers): void {
    }

    visitHeader(node: OasHeader): void {
    }

    visitExample(node: Oas20Example | Oas30Example): void {
    }

    visitItems(node: Oas20Items): void {
    }

    visitTag(node: OasTag): void {
    }

    visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {
    }

    visitSecurityScheme(node: OasSecurityScheme): void {
    }

    visitScopes(node: Oas20Scopes): void {
    }

    visitXML(node: OasXML): void {
    }

    visitSchemaDefinition(node: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
    }

    visitPropertySchema(node: Oas20PropertySchema | Oas30PropertySchema): void {
    }

    visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema | Oas30AdditionalPropertiesSchema): void {
    }

    visitAllOfSchema(node: Oas20AllOfSchema | Oas30AllOfSchema): void {
    }

    visitItemsSchema(node: Oas20ItemsSchema | Oas30ItemsSchema): void {
    }

    visitDefinitions(node: Oas20Definitions): void {
    }

    visitParametersDefinitions(node: Oas20ParametersDefinitions): void {
    }

    visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void {
    }

    visitExtension(node: OasExtension): void {
    }

    visitMediaType(node: Oas30MediaType): void {
    }

    visitEncoding(node: Oas30Encoding): void {
    }

    visitLink(node: Oas30Link): void {
    }

    visitLinkParameterExpression(node: Oas30LinkParameterExpression): void {
    }

    visitLinkRequestBodyExpression(node: Oas30LinkRequestBodyExpression): void {
    }

    visitLinkServer(node: Oas30LinkServer): void {
    }

    visitRequestBody(node: Oas30RequestBody): void {
    }

    visitCallback(node: Oas30Callback): void {
    }

    visitCallbackPathItem(node: Oas30CallbackPathItem): void {
    }

    visitServer(node: Oas30Server): void {
    }

    visitServerVariable(node: Oas30ServerVariable): void {
    }

    visitAnyOfSchema(node: Oas30AnyOfSchema): void {
    }

    visitOneOfSchema(node: Oas30OneOfSchema): void {
    }

    visitNotSchema(node: Oas30NotSchema): void {
    }

    visitComponents(node: Oas30Components): void {
    }

    visitExampleDefinition(node: Oas30ExampleDefinition): void {
    }

    visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void {
    }

    visitHeaderDefinition(node: Oas30HeaderDefinition): void {
    }

    visitOAuthFlows(node: Oas30OAuthFlows): void {
    }

    visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void {
    }

    visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void {
    }

    visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void {
    }

    visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void {
    }

    visitLinkDefinition(node: Oas30LinkDefinition): void {
    }

    visitCallbackDefinition(node: Oas30CallbackDefinition): void {
    }

    visitDiscriminator(node: Oas30Discriminator): void {
    }
    
}


/**
 * Base class for visitors that simply want to get called for *every* node
 * in the model.
 */
export abstract class AllNodeVisitor extends AbstractCombinedVisitorAdapter {

    protected abstract doVisitNode(node: OasNode): void;

    visitDocument(node: OasDocument): void {
        this.doVisitNode(node);
    }

    visitInfo(node: OasInfo): void {
        this.doVisitNode(node);
    }

    visitContact(node: OasContact): void {
        this.doVisitNode(node);
    }

    visitLicense(node: OasLicense): void {
        this.doVisitNode(node);
    }

    visitPaths(node: OasPaths): void {
        this.doVisitNode(node);
    }

    visitPathItem(node: OasPathItem): void {
        this.doVisitNode(node);
    }

    visitOperation(node: OasOperation): void {
        this.doVisitNode(node);
    }

    visitParameter(node: Oas20Parameter | Oas30Parameter): void {
        this.doVisitNode(node);
    }

    visitParameterDefinition(node: Oas20ParameterDefinition | Oas30ParameterDefinition): void {
        this.doVisitNode(node);
    }

    visitExternalDocumentation(node: OasExternalDocumentation): void {
        this.doVisitNode(node);
    }

    visitSecurityRequirement(node: OasSecurityRequirement): void {
        this.doVisitNode(node);
    }

    visitResponses(node: OasResponses): void {
        this.doVisitNode(node);
    }

    visitResponse(node: Oas20Response | Oas30Response): void {
        this.doVisitNode(node);
    }

    visitResponseDefinition(node: Oas20ResponseDefinition | Oas30ResponseDefinition): void {
        this.doVisitNode(node);
    }

    visitSchema(node: OasSchema): void {
        this.doVisitNode(node);
    }

    visitHeaders(node: Oas20Headers): void {
        this.doVisitNode(node);
    }

    visitHeader(node: OasHeader): void {
        this.doVisitNode(node);
    }

    visitExample(node: Oas20Example | Oas30Example): void {
        this.doVisitNode(node);
    }

    visitItems(node: Oas20Items): void {
        this.doVisitNode(node);
    }

    visitTag(node: OasTag): void {
        this.doVisitNode(node);
    }

    visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {
        this.doVisitNode(node);
    }

    visitSecurityScheme(node: OasSecurityScheme): void {
        this.doVisitNode(node);
    }

    visitScopes(node: Oas20Scopes): void {
        this.doVisitNode(node);
    }

    visitXML(node: OasXML): void {
        this.doVisitNode(node);
    }

    visitSchemaDefinition(node: Oas20SchemaDefinition | Oas30SchemaDefinition): void {
        this.doVisitNode(node);
    }

    visitPropertySchema(node: Oas20PropertySchema | Oas30PropertySchema): void {
        this.doVisitNode(node);
    }

    visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema | Oas30AdditionalPropertiesSchema): void {
        this.doVisitNode(node);
    }

    visitAllOfSchema(node: Oas20AllOfSchema | Oas30AllOfSchema): void {
        this.doVisitNode(node);
    }

    visitItemsSchema(node: Oas20ItemsSchema | Oas30ItemsSchema): void {
        this.doVisitNode(node);
    }

    visitDefinitions(node: Oas20Definitions): void {
        this.doVisitNode(node);
    }

    visitParametersDefinitions(node: Oas20ParametersDefinitions): void {
        this.doVisitNode(node);
    }

    visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void {
        this.doVisitNode(node);
    }

    visitExtension(node: OasExtension): void {
        this.doVisitNode(node);
    }

    visitMediaType(node: Oas30MediaType): void {
        this.doVisitNode(node);
    }

    visitEncoding(node: Oas30Encoding): void {
        this.doVisitNode(node);
    }

    visitLink(node: Oas30Link): void {
        this.doVisitNode(node);
    }

    visitLinkParameterExpression(node: Oas30LinkParameterExpression): void {
        this.doVisitNode(node);
    }

    visitLinkRequestBodyExpression(node: Oas30LinkRequestBodyExpression): void {
        this.doVisitNode(node);
    }

    visitLinkServer(node: Oas30LinkServer): void {
        this.doVisitNode(node);
    }

    visitRequestBody(node: Oas30RequestBody): void {
        this.doVisitNode(node);
    }

    visitCallback(node: Oas30Callback): void {
        this.doVisitNode(node);
    }

    visitCallbackPathItem(node: Oas30CallbackPathItem): void {
        this.doVisitNode(node);
    }

    visitServer(node: Oas30Server): void {
        this.doVisitNode(node);
    }

    visitServerVariable(node: Oas30ServerVariable): void {
        this.doVisitNode(node);
    }

    visitAnyOfSchema(node: Oas30AnyOfSchema): void {
        this.doVisitNode(node);
    }

    visitOneOfSchema(node: Oas30OneOfSchema): void {
        this.doVisitNode(node);
    }

    visitNotSchema(node: Oas30NotSchema): void {
        this.doVisitNode(node);
    }

    visitComponents(node: Oas30Components): void {
        this.doVisitNode(node);
    }

    visitExampleDefinition(node: Oas30ExampleDefinition): void {
        this.doVisitNode(node);
    }

    visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void {
        this.doVisitNode(node);
    }

    visitHeaderDefinition(node: Oas30HeaderDefinition): void {
        this.doVisitNode(node);
    }

    visitOAuthFlows(node: Oas30OAuthFlows): void {
        this.doVisitNode(node);
    }

    visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void {
        this.doVisitNode(node);
    }

    visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void {
        this.doVisitNode(node);
    }

    visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void {
        this.doVisitNode(node);
    }

    visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void {
        this.doVisitNode(node);
    }

    visitLinkDefinition(node: Oas30LinkDefinition): void {
        this.doVisitNode(node);
    }

    visitCallbackDefinition(node: Oas30CallbackDefinition): void {
        this.doVisitNode(node);
    }

    visitDiscriminator(node: Oas30Discriminator): void {
        this.doVisitNode(node);
    }

}
