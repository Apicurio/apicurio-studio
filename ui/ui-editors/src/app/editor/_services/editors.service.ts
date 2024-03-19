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


import {Injectable} from "@angular/core";
import {ServerEditorComponent} from "../_components/editors/server-editor.component";
import {SecuritySchemeEditorComponent} from "../_components/editors/security-scheme-editor.component";
import {SecurityRequirementEditorComponent} from "../_components/editors/security-requirement-editor.component";
import {DataTypeEditorComponent} from "../_components/editors/data-type-editor.component";
import {ParameterEditorComponent} from "../_components/editors/parameter-editor.component";
import {PropertyEditorComponent} from "../_components/editors/property-editor.component";
import {ResponseEditorComponent} from "../_components/editors/response-editor.component";
import {OperationTraitEditorComponent} from "../_components/editors/operationtrait-editor.component";
import {MessageTraitEditorComponent} from "../_components/editors/messagetrait-editor.component";
import {AaiServerEditorComponent} from "../_components/editors/aaiserver-editor.component";
import {MessageEditorComponent} from "../_components/editors/message-editor.component";
import {OneOfInMessageEditorComponent} from "../_components/editors/oneof-in-message-editor.component";

export interface IEditorsProvider {

    getServerEditor(): ServerEditorComponent;
    getAaiServerEditor(): AaiServerEditorComponent;
    getSecuritySchemeEditor(): SecuritySchemeEditorComponent;
    getSecurityRequirementEditor(): SecurityRequirementEditorComponent;
    getDataTypeEditor(): DataTypeEditorComponent;
    getResponseEditor(): ResponseEditorComponent;
    getParameterEditor(): ParameterEditorComponent;
    getPropertyEditor(): PropertyEditorComponent;
    getOperationTraitEditor(): OperationTraitEditorComponent;
    getMessageTraitEditor(): MessageTraitEditorComponent;
    getMessageEditor(): MessageEditorComponent;
    getOneOfInMessageEditor(): OneOfInMessageEditorComponent;
}


/**
 * A simple service that provides access to global entity editors.  These are the full page
 * modal editors used to perform advanced editing of specific model entities.  Examples include
 * the Server Editor, Response Editor, and Parameter Editor.
 */
@Injectable()
export class EditorsService implements IEditorsProvider {

    private provider: IEditorsProvider;

    constructor() {}

    public setProvider(provider: IEditorsProvider): void {
        console.info("[EditorsService] Setting provider to: ", provider);
        this.provider = provider;
    }

    public getServerEditor(): ServerEditorComponent {
        return this.provider.getServerEditor();
    }

    public getAaiServerEditor(): AaiServerEditorComponent {
        return this.provider.getAaiServerEditor();
    }

    public getSecuritySchemeEditor(): SecuritySchemeEditorComponent {
        return this.provider.getSecuritySchemeEditor();
    }

    public getSecurityRequirementEditor(): SecurityRequirementEditorComponent {
        return this.provider.getSecurityRequirementEditor();
    }

    public getDataTypeEditor(): DataTypeEditorComponent {
        return this.provider.getDataTypeEditor();
    }

    public getResponseEditor(): ResponseEditorComponent {
        return this.provider.getResponseEditor();
    }

    public getParameterEditor(): ParameterEditorComponent {
        return this.provider.getParameterEditor();
    }

    public getPropertyEditor(): PropertyEditorComponent {
        return this.provider.getPropertyEditor();
    }

    public getOperationTraitEditor(): OperationTraitEditorComponent {
        return this.provider.getOperationTraitEditor();
    }

    public getMessageTraitEditor(): MessageTraitEditorComponent {
        return this.provider.getMessageTraitEditor();
    }

    public getMessageEditor(): MessageEditorComponent {
        return this.provider.getMessageEditor();
    }

    public getOneOfInMessageEditor(): OneOfInMessageEditorComponent {
        return this.provider.getOneOfInMessageEditor();
    }

}
