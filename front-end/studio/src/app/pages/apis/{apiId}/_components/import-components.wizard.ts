/**
 * @license
 * Copyright 2020 JBoss Inc
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

import {Component, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap/modal";
import {ApisService} from "../../../../services/apis.service";
import {ImportedComponent} from "../editor/_models/imported-component.model";
import {Api, ApiDefinition} from "../../../../models/api.model";
import {ComponentType} from "../editor/_models/component-type.model";
import {DataTableColumn, DataTableRow} from "../../../../components/common/data-table.component";
import * as moment from "moment";
import {
    AaiComponents,
    CombinedVisitorAdapter,
    Components,
    Document,
    DocumentType,
    IDefinition,
    Library,
    NodeCompat,
    TraverserDirection
} from "@apicurio/data-models";


@Component({
    selector: "import-components-wizard",
    templateUrl: "import-components.wizard.html",
    styleUrls: [ "import-components.wizard.css" ]
})
export class ImportComponentsWizard {

    @ViewChildren("importComponentsModal") importComponentsModal: QueryList<ModalDirective>;

    protected _isOpen: boolean = false;

    loading: boolean;
    loadingApis: boolean;
    loadingComponents: boolean;
    currentPage: string;

    type: ComponentType;

    private result: Promise<ImportedComponent[]>;
    private allApis: Api[];
    selectedApis: Api[];
    mustLoadComponents: boolean = false;
    private components: ImportedComponent[];
    selectedComponents: ImportedComponent[];

    apiColumns: DataTableColumn[];
    apiRows: DataTableRow[];
    componentColumns: DataTableColumn[];
    componentRows: DataTableRow[];

    error: any = null;
    errorMessage: string = null;

    private resolve: (value?: ImportedComponent[] | PromiseLike<ImportedComponent[]>) => void;
    private reject: (reason?: any) => void;

    /**
     * Constructor with injection!
     * @param apis
     */
    constructor(private apis: ApisService) {}

    /**
     * Called to open the wizard.
     */
    public open(type: ComponentType): Promise<ImportedComponent[]> {
        this._isOpen = true;

        this.type = type;
        this.allApis = [];
        this.selectedApis = [];
        this.components = [];
        this.selectedComponents = [];

        this.apiColumns = this.resourceTableColumns();
        this.apiRows = [];
        this.componentColumns = this.componentTableColumns();
        this.componentRows = [];

        this.importComponentsModal.changes.subscribe( thing => {
            if (this.importComponentsModal.first) {
                this.importComponentsModal.first.show();
            }
        });
        this.loadingApis = true;
        this.loading = true;
        this.currentPage = "resources";

        this.apis.getApis().then( apis => {
            console.debug("[ImportComponentsWizardComponent] APIs loaded.");
            this.allApis = apis;
            this.apiRows = this.resourceTableRows();
            this.loading = false;
            this.loadingApis = false;
        }).catch(error => {
            console.error("[ImportComponentsWizardComponent] Error getting APIs");
            this.error = error;
            this.errorMessage = "Error getting your APIs.";
            this.loading = false;
            this.loadingApis = false;
        });

        this.result = new Promise<ImportedComponent[]>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        return this.result;
    }

    /**
     * Called to close the wizard.
     */
    public close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.importComponentsModal.first.hide();
    }

    /**
     * Returns true if the wizard is open.
     * 
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    public isBackButtonEnabled(): boolean {
        return !this.loading && !this.isFirstPage();
    }

    public isNextButtonEnabled(): boolean {
        return !this.loading && !this.isLastPage() && this.isCurrentPageValid();
    }

    public isFirstPage(): boolean {
        return this.currentPage === "resources";
    }

    public isLastPage(): boolean {
        return this.currentPage === "summary";
    }

    public isCurrentPageValid(): boolean {
        return this.isPageValid(this.currentPage);
    }

    public isPageValid(page: string): boolean {
        if (page === "resources") {
            return this.selectedApis.length > 0;
        }
        if (page === "components") {
            return this.selectedComponents.length > 0;
        }
        if (page === "summary") {
            return true;
        }

        return true;
    }

    public showBackButton(): boolean {
        return true;
    }

    public showNextButton(): boolean {
        return !this.isLastPage();
    }

    public showFinishButton(): boolean {
        return this.isLastPage();
    }

    public isFinishButtonEnabled(): boolean {
        return this.isLastPage() && this.isCurrentPageValid();
    }

    public showCancelButton(): boolean {
        return !this.error;
    }

    public goBack(): void {
        switch (this.currentPage) {
            case "resources":
                break;
            case "components":
                this.goTo("resources");
                break;
            case "summary":
                this.goTo("components");
                break;
        }
    }

    public goNext(): void {
        switch (this.currentPage) {
            case "resources":
                this.goTo("components");
                break;
            case "components":
                this.goTo("summary");
                break;
            case "summary":
                break;
        }
    }

    public goTo(newPage: string): void {
        switch (newPage) {
            case "resources":
                this.currentPage = newPage;
                break;
            case "components":
                if (this.isPageValid("resources")) {
                    this.currentPage = newPage;
                    if (this.mustLoadComponents) {
                        this.loading = true;
                        this.loadingComponents = true;
                        this.loadComponents();
                        this.mustLoadComponents = false;
                    }
                }
                break;
            case "summary":
                if (this.isPageValid("resources") && this.isPageValid("components")) {
                    this.currentPage = newPage;
                }
                break;
        }
    }

    public finish(): void {
        this.close();
        setTimeout(() => this.resolve(this.selectedComponents), 50);
    }

    public title(): string {
        return "Import " + this.displayType() + "(s)";
    }

    public displayType(): string {
        if (this.type == ComponentType.schema) {
            return "Data Type"
        }
        if (this.type == ComponentType.response) {
            return "Response"
        }
        return "Component";
    }

    private resourceTableColumns(): DataTableColumn[] {
        return [
            {
                displayName: "Name",
                width: "24%"
            },
            {
                displayName: "Description"
            },
            {
                displayName: "Type",
                width: "12%"
            },
            {
                displayName: "Created",
                width: "15%"
            }
        ];
    }

    private resourceTableRows(): DataTableRow[] {
        return this.allApis.map(api => {
            return {
                value: api,
                cells: [
                    { displayName: api.name },
                    { displayName: api.description },
                    { displayName: api.type },
                    { displayName: moment(api.createdOn).fromNow() }
                ]
            };
        });
    }

    private loadComponents(): void {
        this.components = [];
        console.debug("[ImportComponentsWizard] Loading components from %o resources.", this.selectedApis.length);
        let promises: Promise<ApiDefinition>[] = this.selectedApis.map( api => {
            console.debug("[ImportComponentsWizard] Loading api definition for: ", api.name);
            return this.apis.getApiDefinition(api.id).then(apiDef => {
                this.processLoadedApiDef(apiDef);
                return apiDef;
            });
        });
        Promise.all(promises).then(() => {
            console.debug("[ImportComponentsWizard] All resources loaded successfully.");
            this.loading = false;
            this.loadingComponents = false;
            this.componentRows = this.components.map(component => {
                return {
                    value: component,
                    cells: [
                        { displayName: component.name },
                        { displayName: component.from ? component.from.name : "No parent resource" }
                    ]
                };
            });
        }).catch(error => {
            this.error = error;
            this.errorMessage = "Error loading components from selected resources.";
            this.loading = false;
            this.loadingComponents = false;
        });
    }

    private processLoadedApiDef(apiDef: ApiDefinition): void {
        console.debug("[ImportComponentsWizard] Processing an API def: ", apiDef.name);
        let doc: Document = Library.readDocument(apiDef.spec);
        let components: ImportedComponent[] = this.getComponents(apiDef, doc);
        components.forEach(component => {
            this.components.push(component);
        });
    }

    private getComponents(apiDef: ApiDefinition, doc: Document): ImportedComponent[] {
        let finder: ComponentFinder;
        if (doc.getDocumentType() == DocumentType.openapi2) {
            finder = new Oas20ComponentFinder(apiDef, this.type);
        } else {
            finder = new ComponentFinder(apiDef, this.type);
        }
        Library.visitTree(doc, finder, TraverserDirection.down);
        return finder.foundComponents;
    }

    private componentTableColumns(): DataTableColumn[] {
        return [
            {
                displayName: "Name",
                width: "25%"
            },
            {
                displayName: "From Resource"
            }
        ];
    }

    componentsForReview(): ImportedComponent[] {
        return this.selectedComponents;
    }

}

class ComponentFinder extends CombinedVisitorAdapter {

    public foundComponents: ImportedComponent[] = [];

    constructor(protected apiDef: ApiDefinition, protected type: ComponentType) {
        super();
    }

    protected componentFound(definition: IDefinition): void {
        this.foundComponents.push(this.toImportedComponent(definition));
    }

    protected toImportedComponent(definition: IDefinition): ImportedComponent {
        let $ref: string = `apicurio:${ this.apiDef.id }${ this.getFragmentPrefix() + definition.getName() }`;
        let component: ImportedComponent = {
            name: definition.getName(),
            $ref: $ref,
            type: this.type,
            from: {
                name: this.apiDef.name,
                id: this.apiDef.id
            }
        };
        return component;
    }

    protected getFragmentPrefix(): string {
        switch (this.type) {
            case ComponentType.schema:
                return "#/components/schemas/";
            case ComponentType.response:
                return "#/components/responses/";
            case ComponentType.parameter:
                return "#/components/parameters/";
            case ComponentType.header:
                return "#/components/headers/";
            case ComponentType.requestBody:
                return "#/components/requestBodies/";
            case ComponentType.callback:
                return "#/components/callbacks/";
            case ComponentType.example:
                return "#/components/examples/";
            case ComponentType.securityScheme:
                return "#/components/securitySchemes/";
            case ComponentType.link:
                return "#/components/links/";
            case ComponentType.message:
                return "#/components/messages/";
            case ComponentType.messageTrait:
                return "#/components/messageTraits";
        }
    }

    visitSchemaDefinition(node: IDefinition): void {
        if (this.type == ComponentType.schema) {
            this.componentFound(node);
        }
    }

    visitResponseDefinition(node: IDefinition): void {
        if (this.type == ComponentType.response) {
            this.componentFound(node);
        }
    }

    visitComponents(node: Components): void {
        if (this.type == ComponentType.message) {
            let messages: Components = (<AaiComponents>node)?.messages;

            if(NodeCompat.isDefined(messages)){
                Object.keys(messages).forEach((messageName)=>{
                    this.componentFound(messages[messageName])

                })
            }

        }
    }

    visitMessageTraitDefinition(node: IDefinition): void {
        if (this.type == ComponentType.messageTrait) {
            this.componentFound(node);
        }
    }
}
class Oas20ComponentFinder extends ComponentFinder {

    constructor(apiDef: ApiDefinition, type: ComponentType) {
        super(apiDef, type);
    }

    protected getFragmentPrefix(): string {
        switch (this.type) {
            case ComponentType.schema:
                return "#/definitions/";
            case ComponentType.response:
                return "#/responses/";
            case ComponentType.parameter:
                return "#/parameters/";
            case ComponentType.securityScheme:
                return "#/securityDefinitions/";
        }
    }
}
