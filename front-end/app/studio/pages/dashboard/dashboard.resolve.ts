import {Injectable, Inject} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Api} from "../../models/api.model";
import {IApisService} from "../../services/apis.service";


@Injectable()
export class RecentApisResolve implements Resolve<Api[]> {
    constructor(@Inject(IApisService) private apis: IApisService) {
    }

    resolve(route: ActivatedRouteSnapshot): Promise<Api[]> {
        console.log("!!! Resolving recent APIs.");
        return this.apis.getRecentApis();
    }
}
