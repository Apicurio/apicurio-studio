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

import {Component, EventEmitter, Inject, Output} from "@angular/core";
import {IAuthenticationService} from "../../../../services/auth.service";
import {DropDownOption, DropDownOptionValue as Value} from '../../../../components/common/drop-down.component';
import {ApisService} from "../../../../services/apis.service";
import {LinkedAccountsService} from "../../../../services/accounts.service";
import {TemplateService} from "../../../../services/template.service";
import {ApiDesignTemplate} from "../../../../models/api-design-template.model";

export interface CreateApiFormData {
    type: string;
    name: string;
    description: string;
    template?: ApiDesignTemplate
}

@Component({
    moduleId: module.id,
    selector: "createapi-form",
    templateUrl: "create-form.component.html",
    styleUrls: ["create-form.component.css"]
})
export class CreateApiFormComponent {

    @Output() onCreateApi = new EventEmitter<CreateApiFormData>();

    model: CreateApiFormData = {
        type: "3.0.2",
        name: null,
        description: null,
        template: null
    };
    creatingApi: boolean = false;
    error: string;

    /**
     * Constructor.
     * @param apisService
     * @param authService
     * @param accountsService
     * @param templateService
     */
    constructor(private apisService: ApisService,
                @Inject(IAuthenticationService) private authService: IAuthenticationService,
                private accountsService: LinkedAccountsService, private templateService: TemplateService)
    {
        this.creatingApi = false;
    }

    public ngOnInit(): void {
    }

    public typeOptions(): DropDownOption[] {
        return [
            new Value("Open API 2.0 (Swagger)", "2.0"),
            new Value("Open API 3.0.2", "3.0.2")
        ];
    }

    public changeType(value: string): void {
        this.model.type = value;
        this.model.template = null;
    }

    public templates(): ApiDesignTemplate[] {
        return this.templateService.getTemplates(this.model.type);
    }

    /**
     * Called when the user clicks the "Create API" submit button on the form.
     */
    public createApi(): void {
        this.creatingApi = true;
        this.onCreateApi.emit(this.model);
    }
}
