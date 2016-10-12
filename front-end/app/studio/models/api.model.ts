
import {ApiRepositoryResource} from "./api-repository-resource";

export class Api {

    id: string;
    name: string;
    description: string;
    repositoryResource: ApiRepositoryResource;

    constructor() {
        this.id = "";
        this.name = "";
        this.description = "";
        this.repositoryResource = new ApiRepositoryResource();
    }

}
