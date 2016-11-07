
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