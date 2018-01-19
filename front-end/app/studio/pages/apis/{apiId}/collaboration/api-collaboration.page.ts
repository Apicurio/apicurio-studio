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

import {Component, Inject} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {IApisService} from "../../../../services/apis.service";
import {Api} from "../../../../models/api.model";
import {AbstractPageComponent} from "../../../../components/page-base.component";
import {ApiCollaborator} from "../../../../models/api-collaborator";
import {Invitation} from "../../../../models/invitation";
import {IAuthenticationService} from "../../../../services/auth.service";
import {User} from "../../../../models/user.model";

@Component({
    moduleId: module.id,
    selector: "api-collaboration-page",
    templateUrl: "api-collaboration.page.html",
    styleUrls: ["api-collaboration.page.css"]
})
export class ApiCollaborationPageComponent extends AbstractPageComponent {

    public api: Api;
    public collaborators: ApiCollaborator[];
    public invitations: Invitation[];

    private _isOwner: boolean = false;
    private _copyLink: string = "";


    /**
     * Constructor.
     * @param {Router} router
     * @param {ActivatedRoute} route
     * @param {IApisService} apis
     * @param {IAuthenticationService} authService
     */
    constructor(private router: Router, route: ActivatedRoute,
                @Inject(IApisService) private apis: IApisService,
                @Inject(IAuthenticationService) private authService: IAuthenticationService) {
        super(route);
        this.api = new Api();
    }

    /**
     * Called to kick off loading the page's async data.
     * @param params
     */
    public loadAsyncPageData(params: any): void {
        console.info("[ApiCollaborationPageComponent] Loading async page data");
        let apiId: string = params["apiId"];
        this.apis.getApi(apiId).then(api => {
            this.api = api;
            this.dataLoaded["api"] = true;
        }).catch(error => {
            console.error("[ApiCollaborationPageComponent] Error getting API");
            this.error(error);
        });
        this.apis.getCollaborators(apiId).then(collaborators => {
            console.info("[ApiCollaborationPageComponent] Collaborators data loaded: %o", collaborators);
            this.collaborators = collaborators;
            this.collaborators.sort( (c1, c2) => {
                if (c1.role === "owner" && c2.role != "owner") {
                    return -1;
                }
                if (c1.role != "owner" && c2.role === "owner") {
                    return 1;
                }
                return c1.userName.toLowerCase().localeCompare(c1.userName.toLowerCase());
            });
            this.setIsOwner();
            this.dataLoaded["collaborators"] = true;
        }).catch(error => {
            console.error("[ApiCollaborationPageComponent] Error getting API collaborators");
            this.error(error);
        });
        this.apis.getInvitations(apiId).then(invitations => {
            console.info("[ApiCollaborationPageComponent] Invitations data loaded: %o", invitations);
            this.invitations = invitations;
            this.invitations.sort( (i1, i2) => {
                if (i1.createdOn > i2.createdOn) {
                    return -1;
                }
                if (i1.createdOn < i2.createdOn) {
                    return 1;
                }
                return i1.inviteId.localeCompare(i2.inviteId);
            });
            this.dataLoaded["invitations"] = true;
        }).catch(error => {
            console.error("[ApiCollaborationPageComponent] Error getting API invitations");
            this.error(error);
        });
    }

    /**
     * Called when the user clicks the "Create Invitation" button.
     */
    public createInvitation(): void {
        let newInvitation: Invitation = new Invitation();
        newInvitation.createdBy = this.authService.getAuthenticatedUserNow().login;
        newInvitation.createdOn = new Date();
        newInvitation.designId = this.api.id;
        newInvitation.status = "creating";
        newInvitation.inviteId = "12345";
        this.invitations.unshift(newInvitation);
        this.apis.createInvitation(this.api.id).then( (invitation) => {
            newInvitation.createdBy = invitation.createdBy;
            newInvitation.createdOn = invitation.createdOn;
            newInvitation.status = invitation.status;
            newInvitation.inviteId = invitation.inviteId;
            newInvitation.role = invitation.role;
        }).catch( error => {
            console.error("[ApiCollaborationPageComponent] Error creating invitation");
            this.error(error);
        });
    }

    /**
     * Called to remove a collaborator.  The user will no longer have access to the API.
     * @param {ApiCollaborator} collaborator
     */
    public removeCollaborator(collaborator: ApiCollaborator): void {
    }

    /**
     * Called to cancel a pending invitation.
     */
    public cancelInvitation(invite: Invitation): void {
        invite.status = "rejecting";
        this.apis.rejectInvitation(this.api.id, invite.inviteId).then( () => {
            invite.status = "rejected";
            invite.modifiedOn = new Date();
            invite.modifiedBy = this.authService.getAuthenticatedUserNow().login;
        }).catch( error => {
            this.error(error);
        });
    }

    /**
     * Called to copy the invitation link to the clipboard.
     * @param {Invitation} invite
     */
    public copyInvitationLink(invite: Invitation): void {
        this._copyLink = window.location.toString() + "/accept/" + invite.inviteId;
    }

    /**
     * Returns true if the currently logged-in user is an Owner of the API.
     * @return {boolean}
     */
    public isOwner(): boolean {
        return this._isOwner;
    }

    /**
     * Set the isOwner property.
     */
    private setIsOwner(): void {
        this._isOwner = false;

        let user: User = this.authService.getAuthenticatedUserNow();
        if (user != null) {
            for (let collaborator of this.collaborators) {
                if (collaborator.userId == user.login) {
                    this._isOwner = collaborator.role === "owner";
                    return;
                }
            }
        }
    }

}
