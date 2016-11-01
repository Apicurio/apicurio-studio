import {Injectable, Inject} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Api} from "../../../models/api.model";
import {IApisService} from "../../../services/apis.service";

/**
 * Resolves an API by its id.
 */
@Injectable()
export class ApiResolve implements Resolve<Api> {
    constructor(@Inject(IApisService) private apis: IApisService) {
    }

    resolve(route: ActivatedRouteSnapshot): Promise<Api> {
        let apiId: string = route.params["apiId"];
        console.info("[ApiResolve] Resolving API with id: " + apiId);
        return this.apis.getApi(apiId);
    }
}
