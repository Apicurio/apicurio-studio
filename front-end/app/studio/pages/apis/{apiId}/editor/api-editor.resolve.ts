import {Injectable, Inject} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {IApisService} from "../../../../services/apis.service";
import {ApiDefinition} from "../../../../models/api.model";

/**
 * Resolves an API definition by its id.
 */
@Injectable()
export class ApiDefinitionResolve implements Resolve<ApiDefinition> {
    constructor(@Inject(IApisService) private apis: IApisService) {
    }

    resolve(route: ActivatedRouteSnapshot): Promise<ApiDefinition> {
        let apiId: string = route.params["apiId"];
        console.info("[ApiResolve] Resolving API Definition with id: " + apiId);
        return this.apis.getApiDefinition(apiId);
    }
}
