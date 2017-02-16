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

import {Component, OnInit, Inject} from "@angular/core";
import {Router, NavigationStart} from "@angular/router";
import {IApisService} from "../services/apis.service";

/**
 * Models the sub-menus off the main left-hand vertical nav.
 */
enum VerticalNavSubMenuType {
    None, Dashboard, APIs
}


@Component({
    moduleId: module.id,
    selector: "vertical-nav",
    templateUrl: "vertical-nav.component.html",
    styleUrls: ["vertical-nav.component.css"]
})
export class VerticalNavComponent implements OnInit {

    public subMenuTypes: any = VerticalNavSubMenuType;
    public currentSubMenu: VerticalNavSubMenuType = VerticalNavSubMenuType.None;

    constructor(private router: Router, @Inject(IApisService) private apis: IApisService) {
    }

    ngOnInit(): void {
        console.log("Subscribing to router events.");
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.currentSubMenu = VerticalNavSubMenuType.None;
            }
        });
    }

    /**
     * Returns true if the currently active route is the dashboard.
     * @returns {boolean}
     */
    isDashboardRoute(): boolean {
        return this.router.isActive("/", true);
    }

    /**
     * Returns true if the currently active route is /apis/*
     * @returns {boolean}
     */
    isAPIsRoute(): boolean {
        return this.router.isActive("/apis", false);
    }

    /**
     * Called when the user clicks the vertical menu shade (the grey shaded area behind the submenu div that
     * is displayed when a sub-menu is selected).  Clicking the shade makes the sub-menu div go away.
     */
    onShadeClick(): void {
        this.currentSubMenu = VerticalNavSubMenuType.None;
    }

    /**
     * Toggles a sub-menu off the main vertical left-hand menu bar.  If the sub-menu is
     * already selected, it de-selects it.
     * @param subMenu the sub-menu to toggle
     */
    toggleSubMenu(subMenu: VerticalNavSubMenuType): void {
        if (this.currentSubMenu === subMenu) {
            this.currentSubMenu = VerticalNavSubMenuType.None;
        } else {
            this.currentSubMenu = subMenu;
        }
    }

}
