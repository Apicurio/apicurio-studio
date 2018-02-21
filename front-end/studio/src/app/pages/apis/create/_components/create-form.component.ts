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
import {IApisService} from "../../../../services/apis.service";
import {User} from "../../../../models/user.model";
import {IAuthenticationService} from "../../../../services/auth.service";
import {NewApi} from "../../../../models/new-api.model";
import {ILinkedAccountsService} from "../../../../services/accounts.service";
import {DropDownOption} from '../../../../components/common/drop-down.component';


@Component({
    moduleId: module.id,
    selector: "createapi-form",
    templateUrl: "create-form.component.html",
    styleUrls: ["create-form.component.css"]
})
export class CreateApiFormComponent {

    @Output() onCreateApi = new EventEmitter<NewApi>();

    model: any = {
        type: "3.0.1",
        name: null,
        description: null
    };
    creatingApi: boolean = false;
    error: string;

    private _user: User;

    public ngOnInit(): void {
    }

    /**
     * Constructor.
     * @param {IApisService} apisService
     * @param {IAuthenticationService} authService
     * @param {ILinkedAccountsService} accountsService
     */
    constructor(@Inject(IApisService) private apisService: IApisService,
            @Inject(IAuthenticationService) private authService: IAuthenticationService,
            @Inject(ILinkedAccountsService) private accountsService: ILinkedAccountsService)
    {
        this.creatingApi = false;

        authService.getAuthenticatedUser().subscribe( user => {
            this._user = user;
        });
    }

    public typeOptions(): DropDownOption[] {
        return [
            { name: "Open API 2.0 (Swagger)", value: "2.0"},
            { name: "Open API 3.0.1", value: "3.0.1"}
        ];
    }

    public changeType(value: string): void {
        this.model.type = value;
    }


    /**
     * Called when the user clicks the "Create API" submit button on the form.
     */
    public createApi(): void {
        let api: NewApi = new NewApi();
        api.specVersion = this.model.type;
        api.name = this.model.name;
        api.description = this.model.description;

        console.info("[CreateApiFormComponent] Firing 'create-api' event: %o", api);

        this.creatingApi = true;
        this.onCreateApi.emit(api);
    }
}
