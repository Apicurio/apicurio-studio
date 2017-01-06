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


import {ApiRepositoryResource} from "./api-repository-resource";

export class Api {

    id: string;
    name: string;
    description: string;
    repositoryResource: ApiRepositoryResource;
    createdOn: Date;
    createdBy: string;
    modifiedOn: Date;
    modifiedBy: string;

    constructor() {
        this.id = "";
        this.name = "";
        this.description = "";
        this.repositoryResource = new ApiRepositoryResource();
        this.createdOn = new Date();
        this.createdBy = "";
        this.modifiedOn = new Date();
        this.modifiedBy = "";
    }

}


export class ApiDefinition extends Api {

    spec: any;

    constructor() {
        super();
        this.spec = {};
    }

}