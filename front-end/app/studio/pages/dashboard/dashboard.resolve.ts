import {Injectable, Inject} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Api} from "../../models/api.model";
import {IApisService} from "../../services/apis.service";
import {Subscription} from "rxjs";

/**
 * Resolves the recent APIs prior to loading the dashboard screen.
 */
@Injectable()
export class RecentApisResolve implements Resolve<Api[]> {
    constructor(@Inject(IApisService) private apis: IApisService) {
    }

    resolve(route: ActivatedRouteSnapshot): Promise<Api[]> {
        let promise: Promise<Api[]> = new Promise((resolve) => {
            let subscription: Subscription = this.apis.getRecentApis().subscribe(data => {
                resolve(data);
                subscription.unsubscribe();
            });
        });
        return promise;
    }
}
