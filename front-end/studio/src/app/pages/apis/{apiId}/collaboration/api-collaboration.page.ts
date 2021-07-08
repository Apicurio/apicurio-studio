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

import {Component, Inject, QueryList, ViewChildren} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {ApisService} from "../../../../services/apis.service";
import {Api} from "../../../../models/api.model";
import {AbstractPageComponent} from "../../../../components/page-base.component";
import {ApiCollaborator} from "../../../../models/api-collaborator.model";
import {Invitation} from "../../../../models/invitation.model";
import {IAuthenticationService} from "../../../../services/auth.service";
import {User} from "../../../../models/user.model";
import {Title} from "@angular/platform-browser";
import {ClipboardService} from "ngx-clipboard";
import {DropDownOption, DropDownOptionValue as Value} from "../../../../components/common/drop-down.component";
import {UpdateCollaborator} from "../../../../models/update-collaborator.model";
import {InvitationDialogComponent} from "./_components/invitation.component";

@Component({
    selector: "api-collaboration-page",
    templateUrl: "api-collaboration.page.html",
    styleUrls: ["api-collaboration.page.css"]
})
export class ApiCollaborationPageComponent extends AbstractPageComponent {

    public api: Api;
    public collaborators: ApiCollaborator[];
    public invitations: Invitation[];

    private _isOwner: boolean = false;
    public _copyLink: string = "";
    public copied: boolean = false;

    private _roleOptions: DropDownOption[];

    @ViewChildren("invitationDialog") invitationDialog: QueryList<InvitationDialogComponent>;

    /**
     * Constructor.
     * @param router
     * @param route
     * @param apis
     * @param authService
     * @param titleService
     */
    constructor(private router: Router, route: ActivatedRoute, private apis: ApisService,
                @Inject(IAuthenticationService) private authService: IAuthenticationService,
                titleService: Title, private clipboardService: ClipboardService) {
        super(route, titleService);
        this.api = new Api();
    }

    /**
     * The page title.
     * 
     */
    protected pageTitle(): string {
        if (this.api.name) {
            return "Apicurio Studio - API Collaborators :: " + this.api.name;
        } else {
            return "Apicurio Studio - API Collaborators";
        }
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
            this.updatePageTitle();
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
            this.invitations = invitations.filter( invite => {
                return invite.status !== "rejected";
            });
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
        newInvitation.inviteId = "00000";
        this.invitations.unshift(newInvitation);
        this.apis.createInvitation(this.api.id).then( (invitation) => {
            newInvitation.createdBy = invitation.createdBy;
            newInvitation.createdOn = invitation.createdOn;
            newInvitation.status = invitation.status;
            newInvitation.inviteId = invitation.inviteId;
            newInvitation.role = invitation.role;
            // Open the "invitation info" dialog
            this.invitationDialog.first.open(this.api, newInvitation);
        }).catch( error => {
            console.error("[ApiCollaborationPageComponent] Error creating invitation");
            this.error(error);
        });
    }

    /**
     * Returns true if the given collaborator can be removed.
     * @param collaborator
     */
    public canRemoveCollaborator(collaborator: ApiCollaborator): boolean {
        if (!this.isOwner()) {
            return false;
        }

        let user: User = this.authService.getAuthenticatedUserNow();
        if (user.login === collaborator.userId) {
            return true;
        }

        return collaborator.role != 'owner';
    }

    /**
     * Called to remove a collaborator.  The user will no longer have access to the API.
     * @param collaborator
     */
    public removeCollaborator(collaborator: ApiCollaborator): void {
        let idx: number = this.collaborators.indexOf(collaborator);
        if (idx >= 0) {
            this.collaborators.splice(idx, 1);
        }
        this.apis.deleteCollaborator(this.api.id, collaborator.userId).then( () => {
            // Nothing to do on success.
            // FIXME if I just removed MYSELF as a collaborator, then redirect to the Dashboard
        }).catch( error => {
            this.error(error);
        });
    }

    /**
     * Called to cancel a pending invitation.
     * @param invite
     */
    public cancelInvitation(invite: Invitation): void {
        invite.status = "rejecting";
        this.apis.rejectInvitation(this.api.id, invite.inviteId).then( () => {
            invite.status = "rejected";
            invite.modifiedOn = new Date();
            invite.modifiedBy = this.authService.getAuthenticatedUserNow().login;
            setTimeout(() => {
                this.invitations.splice(this.invitations.indexOf(invite), 1);
            }, 3000);
        }).catch( error => {
            this.error(error);
        });
    }

    /**
     * Called to copy the invitation link to the clipboard.
     * @param invite
     */
    public copyInvitationLink(invite: Invitation): void {
        this._copyLink = window.location.toString() + "/accept/" + invite.inviteId;
    }

    /**
     * Returns true if the currently logged-in user is an Owner of the API.
     * 
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

    public roleOptions(): DropDownOption[] {
        if (!this._roleOptions) {
            this._roleOptions = [
                new Value("Owner", "owner"),
                new Value("Collaborator", "collaborator")
            ];
        }
        return this._roleOptions;
    }

    /**
     * Called when the user changes the role of one of the collaborators.
     * @param collaborator
     * @param newRole
     */
    public changeCollaboratorRole(collaborator: ApiCollaborator, newRole: string): void {
        console.info("[ApiCollaborationPageComponent] Changing collaborator role to: ", newRole);

        let update: UpdateCollaborator = new UpdateCollaborator();
        update.newRole = newRole;

        let designId: string = this.api.id;
        let userId: string = collaborator.userId;

        this.apis.updateCollaborator(designId, userId, update).then( () => {
            // Implement a spinner for progress on this change?
            this.collaborators.forEach( collab => {
                if (collab.userId === collaborator.userId) {
                    collab.role = newRole;
                }
            });
        }).catch( error => {
            console.error("[ApiCollaborationPageComponent] Error changing collaborator role");
            this.error(error);
        });
    }

    /**
     * Returns true if there are multiple collaborators.
     */
    public hasCollaborators(): boolean {
        return this.collaborators && this.collaborators.length > 1;
    }

    /**
     * Returns true if there are multiple invitations.
     */
    public hasInvitations(): boolean {
        return this.invitations && this.invitations.length > 0;
    }
}
