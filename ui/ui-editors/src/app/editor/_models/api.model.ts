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


export class Api {

    id: string;
    name: string;
    description: string;
    createdOn: Date;
    createdBy: string;
    tags: string[];
    type: string;

    constructor() {
        this.id = "";
        this.name = "";
        this.description = "";
        this.createdOn = new Date();
        this.createdBy = "";
        this.tags = null;
        this.type = "";
    }

}


export class ApiDefinition extends Api {

    spec: any;

    constructor() {
        super();
        this.spec = {};
    }

    public static fromApi(api: Api): ApiDefinition {
        let apiDef: ApiDefinition = new ApiDefinition();
        apiDef.id = api.id;
        apiDef.name = api.name;
        apiDef.description = api.description;
        apiDef.createdOn = api.createdOn;
        apiDef.createdBy = api.createdBy;

        return apiDef;
    }

}


export class EditableApiDefinition extends ApiDefinition {

    editingSessionUuid: string;
    contentVersion: number;

    constructor() {
        super();
        this.editingSessionUuid = null;
        this.contentVersion = 0;
    }

    public static fromApi(api: Api): EditableApiDefinition {
        let apiDef: EditableApiDefinition = new EditableApiDefinition();
        apiDef.id = api.id;
        apiDef.name = api.name;
        apiDef.description = api.description;
        apiDef.createdOn = api.createdOn;
        apiDef.createdBy = api.createdBy;
        apiDef.type = api.type;

        return apiDef;
    }

}
