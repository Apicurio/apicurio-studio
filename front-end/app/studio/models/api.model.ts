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


export class Api {

    id: string;
    name: string;
    description: string;
    repositoryUrl: string;
    createdOn: Date;
    createdBy: string;
    modifiedOn: Date;
    modifiedBy: string;

    constructor() {
        this.id = "";
        this.name = "";
        this.description = "";
        this.repositoryUrl = "";
        this.createdOn = new Date();
        this.createdBy = "";
        this.modifiedOn = new Date();
        this.modifiedBy = "";
    }

}


export class ApiDefinition extends Api {

    version: any;
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
        apiDef.repositoryUrl = api.repositoryUrl;
        apiDef.createdOn = api.createdOn;
        apiDef.createdBy = api.createdBy;
        apiDef.modifiedOn = api.modifiedOn;
        apiDef.modifiedBy = api.modifiedBy;

        return apiDef;
    }

}