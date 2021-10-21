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

import {Component, EventEmitter, Output} from "@angular/core";
import {StoredApiDesignTemplate} from "../../../models/stored-api-design-template.model";
import {TemplateService} from "../../../services/template.service";
import {
    DropDownOption,
    DropDownOptionValue as Value,
} from "../../../components/common/drop-down.component";
import {ConfigService} from "../../../services/config.service";
import {CodeEditorMode, CodeEditorTheme} from "../../../components/common/code-editor.component";

export interface TemplateModel {
    type: string;
    name: string;
    description: string;
    document: string;
}

/**
 * The template edit form component
 */
@Component({
    selector: "template-editor",
    templateUrl: "template-editor.component.html",
    styleUrls: ["template-editor.component.css"]
})
export class TemplateEditorComponent {

    public _isOpen: boolean = false;
    public _mode: string = "create";
    textMode: CodeEditorMode = CodeEditorMode.YAML;
    textTheme: CodeEditorTheme = CodeEditorTheme.Light;
    
    sending: boolean =  false;
    templateId: string;

    @Output() onSubmit: EventEmitter<void> = new EventEmitter<void>();

    public model: TemplateModel = {
        type: "",
        name: "",
        description: "",
        document: ""
    };
    private toptions: DropDownOption[];

    constructor(private templateService: TemplateService, private config: ConfigService) {
        
    }
    
    public ngOnInit(): void {
        this.toptions = [
            new Value("Open API 2.0 (Swagger)", "OpenAPI20"),
            new Value("Open API 3.0.2", "OpenAPI30")
        ];
        if (this.config.isAsyncAPIEnabled()) {
            this.toptions.push(new Value("Async API 2.0.0", "AsyncAPI20"));
        }
        if (this.config.isGraphQLEnabled()) {
            this.toptions.push(new Value("GraphQL", "GraphQL"));
        }
    }

    public typeOptions(): DropDownOption[] {
        return this.toptions;
    }
    
    public open(entity?: StoredApiDesignTemplate) {
        if (entity) {
            console.debug(`[TemplateEditorComponent] Editing template ${entity.name}`)
            this.initializeModelFromEntity(entity);
        } else {
            this.initializeModel();
        }
        this._isOpen = true;
    }

    /**
     * Initializes the editor's data model from a provided entity (initialize the editor data model from an entity).
     * @param entity
     */
    public initializeModelFromEntity(entity: StoredApiDesignTemplate): void {
        this.model = {
            type: entity.type,
            name: entity.name,
            description: entity.description,
            document: entity.content
        };
        this.templateId = entity.templateId;
        this._mode = "edit";
    }

    /**
     * Initializes the editor's data model to an empty state.
     */
    public initializeModel(): void {
        this.model = {
            type: "",
            name: "",
            description: "",
            document: ""
        };
        this.templateId = null;
        this._mode = "create";
    }
    
    public isValid(): boolean {
        return !!this.model.type?.trim() && !!this.model.name?.trim() && !!this.model.document?.trim();
    }

    public submit() {
        let action: Promise<any>;
        if (this._mode == "create") {
            action = this.templateService.createStoredTemplate({
                name: this.model.name,
                description: this.model.description,
                type: this.model.type,
                document: this.model.document,
            });
        } else {
            action = this.templateService.updateStoredTemplate(this.templateId, {
                name: this.model.name,
                description: this.model.description,
                document: this.model.document,
            });
        }
        action.then(_ => {
            this.onSubmit.emit();
            this.cancel();
        }).catch(error => {
            console.error(error);
            this.cancel();
        })
    }
    
    public isOpen(): boolean {
        return this._isOpen;
    }

    public cancel() {
        this._isOpen = false;
    }

    public submitText(): string {
        return this._mode == "create"
            ? "Create"
            : "Save";
    }

    public changeType($event: any) {
        this.model.type = $event;
    }

    public pageHeader(): string {
        return this._mode == "create"
            ? "Create a template"
            : "Edit the template";
    }
}
