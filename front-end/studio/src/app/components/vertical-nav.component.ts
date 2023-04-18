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

import {Component, OnInit} from "@angular/core";
import {Router, NavigationStart} from "@angular/router";
import {ApisService} from "../services/apis.service";
import {ConfigService} from "../services/config.service";
import {IAuthenticationService} from "../services/auth.service";
import {User} from "../models/user.model";
import {ApicurioRole} from "../models/apicurio-role.enum";

/**
 * Models the sub-menus off the main left-hand vertical nav.
 */
export enum VerticalNavSubMenuType {
    None, Dashboard, APIs, Settings, Templates
}


@Component({
    selector: "vertical-nav",
    templateUrl: "vertical-nav.component.html",
    styleUrls: ["vertical-nav.component.css"]
})
export class VerticalNavComponent implements OnInit {

    public subMenuTypes: any = VerticalNavSubMenuType;
    public currentSubMenu: VerticalNavSubMenuType = VerticalNavSubMenuType.None;
    public subMenuOut: boolean = false;

    /**
     * C'tor.
     * @param router
     * @param configService
     */
    constructor(private router: Router, private configService: ConfigService, private authService: IAuthenticationService) {}

    ngOnInit(): void {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.onShadeClick();
            }
        });
    }

    /**
     * Navigates the user to the Dashboard.
     */
    public goToDashboard(): void {
        this.router.navigate(["/dashboard"]);
    }

    /**
     * Navigates the user to the Templates.
     */
    public goToTemplates(): void {
        if (this.isTemplatesEnabled()) {
            this.router.navigate(["/templates"]);
        }
    }

    /**
     * Returns true if the given route is the active route.
     * @param route
     * @param exact
     * 
     */
    public isRouteActive(route: string, exact: boolean = false): boolean {
        return this.router.isActive(route, exact);
    }

    /**
     * Returns true if the currently active route is the dashboard.
     * @returns {boolean}
     */
    isDashboardRoute(): boolean {
        return this.isRouteActive("/dashboard", true);
    }

    /**
     * Returns true if the currently active route is the templates.
     * @returns {boolean}
     */
    isTemplatesRoute(): boolean {
        return this.isRouteActive("/templates", true);
    }

    /**
     * Returns true if the currently active route is /apis/*
     * @returns {boolean}
     */
    isAPIsRoute(): boolean {
        return this.isRouteActive("/apis");
    }

    /**
     * Returns true if the currently active route is /settings/*
     * @returns {boolean}
     */
    isSettingsRoute(): boolean {
        return this.isRouteActive("/settings");
    }
    
    /**
     * Returns true if the templates route should be accessible.
     * @returns {boolean}
     */
    isTemplatesEnabled(): boolean {
        let user: User = this.authService.getAuthenticatedUserNow();
        return user && user.roles.includes(ApicurioRole.APICURIO_ADMIN)
    }

    /**
     * Called when the user clicks the vertical menu shade (the grey shaded area behind the submenu div that
     * is displayed when a sub-menu is selected).  Clicking the shade makes the sub-menu div go away.
     */
    onShadeClick(): void {
        this.subMenuOut = false;
        this.currentSubMenu = VerticalNavSubMenuType.None;
    }

    /**
     * Toggles a sub-menu off the main vertical left-hand menu bar.  If the sub-menu is
     * already selected, it de-selects it.
     * @param subMenu the sub-menu to toggle
     */
    toggleSubMenu(subMenu: VerticalNavSubMenuType): void {
        if (this.subMenuOut && this.currentSubMenu === subMenu) {
            this.onShadeClick();
        } else {
            this.currentSubMenu = subMenu;
            this.subMenuOut = true;
        }
    }
}
