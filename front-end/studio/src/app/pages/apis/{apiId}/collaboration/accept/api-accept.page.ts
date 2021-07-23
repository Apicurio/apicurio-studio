/**
 * @license
 * Copyright 2018 JBoss Inc
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

import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {ApisService} from "../../../../../services/apis.service";
import {AbstractPageComponent} from "../../../../../components/page-base.component";
import {Invitation} from "../../../../../models/invitation.model";
import {Title} from "@angular/platform-browser";

@Component({
    selector: "api-accept-page",
    templateUrl: "api-accept.page.html",
    styleUrls: ["api-accept.page.css"]
})
export class ApiAcceptPageComponent extends AbstractPageComponent {

    public invitation: Invitation;
    public _accepting: boolean = false;

    /**
     * Constructor.
     * @param router
     * @param route
     * @param apis
     * @param titleService
     */
    constructor(private router: Router, route: ActivatedRoute,
                private apis: ApisService, titleService: Title) {
        super(route, titleService);
    }

    /**
     * The page title.
     * 
     */
    protected pageTitle(): string {
        return "Apicurio Studio - Accept Collaboration Invite";
    }

    /**
     * Called to kick off loading the page's async data.
     * @param params
     */
    public loadAsyncPageData(params: any): void {
        console.info("[ApiAcceptPageComponent] Loading async page data");
        let apiId: string = params["apiId"];
        let inviteId: string = params["inviteId"];

        this.apis.getInvitation(apiId, inviteId).then(invitation => {
            this.invitation = invitation;
            if (this.invitation.status != "pending") {
                // If the invitation is valid but its status is not "pending", throw a 404 error
                this.error({
                    status: 404,
                    statusText: "Invitation Not Found",
                    json: function() {
                        return {};
                    }
                });
            } else {
                this.dataLoaded["invitation"] = true;
            }
        }).catch(error => {
            console.error("[ApiAcceptPageComponent] Error getting API");
            this.error(error);
        });
    }

    /**
     * Called to accept the invite.
     */
    public acceptInvitation(): void {
        this._accepting = true;
        this.apis.acceptInvitation(this.invitation.designId, this.invitation.inviteId).then( () => {
            let link: string[] = [ "/apis", this.invitation.designId ];
            console.info("[ApiAcceptPageComponent] Navigating to: %o", link);
            this.router.navigate(link);
        }).catch( error => {
            this.error(error);
        });
    }

    /**
     * Called to reject the invite.
     */
    public rejectInvitation(): void {
        // this.apis.rejectInvitation(this.invitation.designId, this.invitation.inviteId);
        let link: string[] = [ "/" ];
        this.router.navigate(link);
    }

}
