/*
 * Copyright 2019 JBoss Inc
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

package io.apicurio.hub.api.content;

import io.apicurio.datamodels.asyncapi.models.AaiChannelBindings;
import io.apicurio.datamodels.asyncapi.models.AaiChannelBindingsDefinition;
import io.apicurio.datamodels.asyncapi.models.AaiChannelItem;
import io.apicurio.datamodels.asyncapi.models.AaiCorrelationId;
import io.apicurio.datamodels.asyncapi.models.AaiHeaderItem;
import io.apicurio.datamodels.asyncapi.models.AaiMessage;
import io.apicurio.datamodels.asyncapi.models.AaiMessageBindings;
import io.apicurio.datamodels.asyncapi.models.AaiMessageBindingsDefinition;
import io.apicurio.datamodels.asyncapi.models.AaiMessageTrait;
import io.apicurio.datamodels.asyncapi.models.AaiMessageTraitDefinition;
import io.apicurio.datamodels.asyncapi.models.AaiOperationBindings;
import io.apicurio.datamodels.asyncapi.models.AaiOperationBindingsDefinition;
import io.apicurio.datamodels.asyncapi.models.AaiOperationTrait;
import io.apicurio.datamodels.asyncapi.models.AaiOperationTraitDefinition;
import io.apicurio.datamodels.asyncapi.models.AaiParameter;
import io.apicurio.datamodels.asyncapi.models.AaiServer;
import io.apicurio.datamodels.asyncapi.models.AaiServerBindings;
import io.apicurio.datamodels.asyncapi.models.AaiServerBindingsDefinition;
import io.apicurio.datamodels.asyncapi.v2.models.Aai20NodeFactory;
import io.apicurio.datamodels.asyncapi.v2.visitors.IAai20Visitor;
import io.apicurio.datamodels.core.models.Node;
import io.apicurio.datamodels.core.models.common.AuthorizationCodeOAuthFlow;
import io.apicurio.datamodels.core.models.common.ClientCredentialsOAuthFlow;
import io.apicurio.datamodels.core.models.common.Components;
import io.apicurio.datamodels.core.models.common.IDefinition;
import io.apicurio.datamodels.core.models.common.ImplicitOAuthFlow;
import io.apicurio.datamodels.core.models.common.OAuthFlows;
import io.apicurio.datamodels.core.models.common.Operation;
import io.apicurio.datamodels.core.models.common.Parameter;
import io.apicurio.datamodels.core.models.common.PasswordOAuthFlow;
import io.apicurio.datamodels.core.models.common.Schema;
import io.apicurio.datamodels.core.models.common.SecurityRequirement;
import io.apicurio.datamodels.core.models.common.SecurityScheme;
import io.apicurio.datamodels.core.models.common.Server;
import io.apicurio.datamodels.core.models.common.ServerVariable;

/**
 * @author eric.wittmann@gmail.com
 */
public class Aai20ModelClonerVisitor extends ModelClonerVisitor implements IAai20Visitor {
    
    private static final Aai20NodeFactory factory = new Aai20NodeFactory();
    
    /**
     * @see io.apicurio.datamodels.core.visitors.IVisitor#visitOperation(io.apicurio.datamodels.core.models.common.Operation)
     */
    @Override
    public void visitOperation(Operation node) {
        this.clone = factory.createOperation(node.parent(), node.getType());
    }

    /**
     * @see io.apicurio.datamodels.core.visitors.IVisitor#visitParameterDefinition(io.apicurio.datamodels.core.models.common.IDefinition)
     */
    @Override
    public void visitParameterDefinition(IDefinition node) {
        this.clone = factory.createParameter(((Node) node).parent(), node.getName());
    }

    /**
     * @see io.apicurio.datamodels.core.visitors.IVisitor#visitParameter(io.apicurio.datamodels.core.models.common.Parameter)
     */
    @Override
    public void visitParameter(Parameter node) {
        this.clone = factory.createParameter(node.parent(), node.getName());
    }

    /**
     * @see io.apicurio.datamodels.core.visitors.IVisitor#visitSchemaDefinition(io.apicurio.datamodels.core.models.common.IDefinition)
     */
    @Override
    public void visitSchemaDefinition(IDefinition node) {
        // Note: should never happen because AsyncAPI doesn't have schema definitions
    }

    /**
     * @see io.apicurio.datamodels.core.visitors.IVisitor#visitSchema(io.apicurio.datamodels.core.models.common.Schema)
     */
    @Override
    public void visitSchema(Schema node) {
        // Note: should never happen because AsyncAPI doesn't have schema definitions
    }

    /**
     * @see io.apicurio.datamodels.core.visitors.IVisitor#visitSecurityRequirement(io.apicurio.datamodels.core.models.common.SecurityRequirement)
     */
    @Override
    public void visitSecurityRequirement(SecurityRequirement node) {
        this.clone = factory.createSecurityRequirement(node.parent());
    }

    /**
     * @see io.apicurio.datamodels.core.visitors.IVisitor#visitSecurityScheme(io.apicurio.datamodels.core.models.common.SecurityScheme)
     */
    @Override
    public void visitSecurityScheme(SecurityScheme node) {
        this.clone = factory.createSecurityScheme(node.parent(), node.getName());
    }

    /**
     * @see io.apicurio.datamodels.openapi.v3.visitors.IOas30Visitor#visitComponents(io.apicurio.datamodels.core.models.common.Components)
     */
    @Override
    public void visitComponents(Components node) {
        this.clone = factory.createComponents(node.parent());
    }

    /**
     * @see io.apicurio.datamodels.openapi.v3.visitors.IOas30Visitor#visitServer(io.apicurio.datamodels.core.models.common.Server)
     */
    @Override
    public void visitServer(Server node) {
        this.clone = factory.createServer(node.parent(), ((AaiServer) node).getName());
    }

    /**
     * @see io.apicurio.datamodels.openapi.v3.visitors.IOas30Visitor#visitServerVariable(io.apicurio.datamodels.core.models.common.ServerVariable)
     */
    @Override
    public void visitServerVariable(ServerVariable node) {
        this.clone = factory.createServerVariable(node.parent(), node.getName());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitAuthorizationCodeOAuthFlow(io.apicurio.datamodels.core.models.common.AuthorizationCodeOAuthFlow)
     */
    @Override
    public void visitAuthorizationCodeOAuthFlow(AuthorizationCodeOAuthFlow node) {
        this.clone = factory.createOAuthFlows(node.parent()).createAuthorizationCodeOAuthFlow();
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitChannelItem(io.apicurio.datamodels.asyncapi.models.AaiChannelItem)
     */
    @Override
    public void visitChannelItem(AaiChannelItem node) {
        this.clone = factory.createChannelItem(node.parent(), node.getName());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitClientCredentialsOAuthFlow(io.apicurio.datamodels.core.models.common.ClientCredentialsOAuthFlow)
     */
    @Override
    public void visitClientCredentialsOAuthFlow(ClientCredentialsOAuthFlow node) {
        this.clone = factory.createOAuthFlows(node.parent()).createClientCredentialsOAuthFlow();
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitCorrelationId(io.apicurio.datamodels.asyncapi.models.AaiCorrelationId)
     */
    @Override
    public void visitCorrelationId(AaiCorrelationId node) {
        this.clone = factory.createCorrelationId(node.parent(), node.getName());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitHeaderItem(io.apicurio.datamodels.asyncapi.models.AaiHeaderItem)
     */
    @Override
    public void visitHeaderItem(AaiHeaderItem node) {
        this.clone = factory.createHeaderItem(node.parent());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitImplicitOAuthFlow(io.apicurio.datamodels.core.models.common.ImplicitOAuthFlow)
     */
    @Override
    public void visitImplicitOAuthFlow(ImplicitOAuthFlow node) {
        this.clone = factory.createOAuthFlows(node.parent()).createImplicitOAuthFlow();
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitMessage(io.apicurio.datamodels.asyncapi.models.AaiMessage)
     */
    @Override
    public void visitMessage(AaiMessage node) {
        this.clone = factory.createMessage(node.parent(), node.getName());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitMessageTrait(io.apicurio.datamodels.asyncapi.models.AaiMessageTrait)
     */
    @Override
    public void visitMessageTrait(AaiMessageTrait node) {
        this.clone = factory.createMessageTrait(node.parent(), node.getName());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitMessageTraitDefinition(io.apicurio.datamodels.asyncapi.models.AaiMessageTraitDefinition)
     */
    @Override
    public void visitMessageTraitDefinition(AaiMessageTraitDefinition node) {
        this.clone = factory.createMessageTraitDefinition(node.parent(), node.getName());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitOAuthFlows(io.apicurio.datamodels.core.models.common.OAuthFlows)
     */
    @Override
    public void visitOAuthFlows(OAuthFlows node) {
        this.clone = factory.createOAuthFlows(node.parent());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitOperationTrait(io.apicurio.datamodels.asyncapi.models.AaiOperationTrait)
     */
    @Override
    public void visitOperationTrait(AaiOperationTrait node) {
        this.clone = factory.createOperationTrait(node.parent(), node.getType());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitOperationTraitDefinition(io.apicurio.datamodels.asyncapi.models.AaiOperationTraitDefinition)
     */
    @Override
    public void visitOperationTraitDefinition(AaiOperationTraitDefinition node) {
        this.clone = factory.createOperationTraitDefinition(node.parent(), node.getName());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitPasswordOAuthFlow(io.apicurio.datamodels.core.models.common.PasswordOAuthFlow)
     */
    @Override
    public void visitPasswordOAuthFlow(PasswordOAuthFlow node) {
        this.clone = factory.createOAuthFlows(node.parent()).createPasswordOAuthFlow();
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitAaiParameter(io.apicurio.datamodels.asyncapi.models.AaiParameter)
     */
    @Override
    public void visitAaiParameter(AaiParameter node) {
        this.clone = factory.createParameter(node.parent(), node.getName());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitServerBindings(io.apicurio.datamodels.asyncapi.models.AaiServerBindings)
     */
    @Override
    public void visitServerBindings(AaiServerBindings node) {
        this.clone = factory.createServerBindings(node.parent());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitServerBindingsDefinition(io.apicurio.datamodels.asyncapi.models.AaiServerBindingsDefinition)
     */
    @Override
    public void visitServerBindingsDefinition(AaiServerBindingsDefinition node) {
        this.clone = factory.createServerBindingsDefinition(node.parent(), node.getName());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitOperationBindings(io.apicurio.datamodels.asyncapi.models.AaiOperationBindings)
     */
    @Override
    public void visitOperationBindings(AaiOperationBindings node) {
        this.clone = factory.createOperationBindings(node.parent());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitOperationBindingsDefinition(io.apicurio.datamodels.asyncapi.models.AaiOperationBindingsDefinition)
     */
    @Override
    public void visitOperationBindingsDefinition(AaiOperationBindingsDefinition node) {
        this.clone = factory.createOperationBindingsDefinition(node.parent(), node.getName());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitMessageBindings(io.apicurio.datamodels.asyncapi.models.AaiMessageBindings)
     */
    @Override
    public void visitMessageBindings(AaiMessageBindings node) {
        this.clone = factory.createMessageBindings(node.parent());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitMessageBindingsDefinition(io.apicurio.datamodels.asyncapi.models.AaiMessageBindingsDefinition)
     */
    @Override
    public void visitMessageBindingsDefinition(AaiMessageBindingsDefinition node) {
        this.clone = factory.createMessageBindingsDefinition(node.parent(), node.getName());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitChannelBindings(io.apicurio.datamodels.asyncapi.models.AaiChannelBindings)
     */
    @Override
    public void visitChannelBindings(AaiChannelBindings node) {
        this.clone = factory.createChannelBindings(node.parent());
    }

    /**
     * @see io.apicurio.datamodels.asyncapi.visitors.IAaiVisitor#visitChannelBindingsDefinition(io.apicurio.datamodels.asyncapi.models.AaiChannelBindingsDefinition)
     */
    @Override
    public void visitChannelBindingsDefinition(AaiChannelBindingsDefinition node) {
        this.clone = factory.createChannelBindingsDefinition(node.parent(), node.getName());
    }

}
