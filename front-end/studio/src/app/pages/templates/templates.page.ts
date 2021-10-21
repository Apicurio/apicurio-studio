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

import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

import {AbstractPageComponent} from "../../components/page-base.component";
import {Title} from "@angular/platform-browser";
import {TemplateService} from "../../services/template.service";
import {StoredApiDesignTemplate} from "../../models/stored-api-design-template.model";
import {TemplateEditorComponent} from "./_components/template-editor.component";
import {ConfigService} from "../../services/config.service";
import {ConfirmDeleteDialogComponent} from "../../components/dialogs/confirm-delete.component";
import {IAuthenticationService} from "../../services/auth.service";
import {User} from "../../models/user.model";
import {ApicurioRole} from "../../models/apicurio-role.enum";

/**
 * The Templates Page component
 */
@Component({
    selector: "templates-page",
    templateUrl: "templates.page.html",
    styleUrls: ["templates.page.css"]
})
export class TemplatesPageComponent extends AbstractPageComponent {
    
    private templates: StoredApiDesignTemplate[];
    
    @ViewChild("templateEditor", { static: true }) templateEditor: TemplateEditorComponent;
    @ViewChild("confirmDeleteModal", { static: true }) confirmDeleteModal: ConfirmDeleteDialogComponent;

    /**
     * C'tor.
     * @param templateService
     * @param route
     * @param titleService
     * @param configService
     */
    constructor(private templateService: TemplateService, route: ActivatedRoute,
                protected titleService: Title, private configService: ConfigService,
                private authService: IAuthenticationService) {
        super(route, titleService);
    }

    /**
     * The page title.
     */
    protected pageTitle(): string {
        return "Apicurio Studio - Templates";
    }

    /**
     * @see AbstractPageComponent.loadAsyncPageData
     */
    public loadAsyncPageData(): void {
        console.log("[TemplatesPageComponent] loadAsyncPageData");
        if (this.isPageAccessAllowed()) {
            this.templateService.getStoredTemplates().then(templates => {
                this.templates = templates;
                this.loaded("templates");
            }).catch(error => {
                console.error("[TemplatesPageComponent] Error fetching templates.");
                this.error(error);
            });
        } else {
            console.error("[TemplatesPageComponent] You are not allowed to perform this action.");
            this.loaded("templates");
        }
    }

    public isDataLoaded(): boolean {
        return this.isLoaded("templates");
    }

    public editTemplate(template: StoredApiDesignTemplate) {
        this.templateEditor.open(template);
    }

    public deleteTemplate(templateId: string) {
        this.confirmDeleteModal.onDelete.subscribe(_ =>
            this.templateService.deleteStoredTemplate(templateId).then(_ => {
                this.loadAsyncPageData();
            }).catch(error => {
                console.error("[TemplatesPageComponent] Error deleting template with id %s.", templateId);
                this.error(error);
            })
        );
        this.confirmDeleteModal.open();
    }

    public createTemplate() {
        this.templateEditor.open();
    }

    public getTemplateCount(): number {
        return this.templates
            ? this.templates.length
            : 0;
    }

    private isPageAccessAllowed() {
        let user: User = this.authService.getAuthenticatedUserNow();
        return user && user.roles.includes(ApicurioRole.APICURIO_ADMIN);
    }
}
