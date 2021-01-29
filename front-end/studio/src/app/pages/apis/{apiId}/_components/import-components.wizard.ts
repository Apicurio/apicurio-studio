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
import {ModalDirective} from "ngx-bootstrap";
import {ApisService} from "../../../../services/apis.service";
import {ArtifactsService} from "../../../../services/artifacts.service";
import {ImportedComponent} from "../editor/_models/imported-component.model";
import {Api, ApiDefinition} from "../../../../models/api.model";
import {Artifact, ArtifactDefinition} from "../../../../models/artifact.model";
import {ComponentType} from "../editor/_models/component-type.model";
import {DataTableColumn, DataTableRow} from "../../../../components/common/data-table.component";
import * as moment from "moment";
import {
    CombinedVisitorAdapter,
    Document,
    DocumentType,
    IDefinition,
    Library,
    TraverserDirection
} from "apicurio-data-models";


@Component({
    moduleId: module.id,
    selector: "import-components-wizard",
    templateUrl: "import-components.wizard.html",
    styleUrls: [ "import-components.wizard.css" ]
})
export class ImportComponentsWizard {

    @ViewChildren("importComponentsModal") importComponentsModal: QueryList<ModalDirective>;

    protected _isOpen: boolean = false;

    loading: boolean;
    loadingResources: boolean;
    loadingComponents: boolean;
    currentPage: string;

    type: ComponentType;

    private result: Promise<ImportedComponent[]>;
    private allResources: (Api | Artifact)[];
    selectedResources: (Api | Artifact)[];
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
     * @param artifacts
     * @param config
     */
    constructor(private apis: ApisService,
                private artifacts: ArtifactsService) {}

    /**
     * Called to open the wizard.
     */
    public open(type: ComponentType): Promise<ImportedComponent[]> {
        this._isOpen = true;

        this.type = type;
        this.allResources = [];
        this.selectedResources = [];
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
        this.loadingResources = true;
        this.loading = true;
        this.currentPage = "resources";


        let promises: Promise<(Api|Artifact)[]>[] = [
            this.apis.getApis(),
            this.artifacts.getArtifacts()
        ];

        this.allResources = [];
        Promise.all(promises).then(allResources => {
            console.debug("[ImportComponentsWizardComponent] Resources loaded.");
            allResources.forEach(resourcePartition => this.allResources.push(...resourcePartition))
            this.apiRows = this.resourceTableRows();
            this.loading = false;
            this.loadingResources = false;
        }).catch(error => {
            console.error("[ImportComponentsWizardComponent] Error getting resources");
            this.error = error;
            this.errorMessage = "Error getting your resources.";
            this.loading = false;
            this.loadingResources = false;
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
            return this.selectedResources.length > 0;
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
        return this.allResources.map(apiOrArtifact => {
            return {
                value: apiOrArtifact,
                cells: [
                    { displayName: apiOrArtifact.name },
                    { displayName: apiOrArtifact.description },
                    { displayName: apiOrArtifact.type },
                    { displayName: moment(apiOrArtifact.createdOn).fromNow() }
                ]
            };
        });
    }

    private loadComponents(): void {
        this.components = [];
        console.debug("[ImportComponentsWizard] Loading components from %o resources.", this.selectedResources.length);
        let promises: Promise<ApiDefinition | ArtifactDefinition>[] = this.selectedResources.map(apiOrArtifact => {
            if ("ARTIFACT" === apiOrArtifact.__resourceType) {
                console.debug("[ImportComponentsWizard] Loading artifact definition for: ", apiOrArtifact.name);
                return this.artifacts.getArtifactDefinition(apiOrArtifact.id).then(artifactDef => {
                    this.processLoadedArtifactDef(artifactDef);
                    return artifactDef;
                });
            } else if ("API" === apiOrArtifact.__resourceType) {
                console.debug("[ImportComponentsWizard] Loading api definition for: ", apiOrArtifact.name);
                return this.apis.getApiDefinition(apiOrArtifact.id).then(apiDef => {
                    this.processLoadedApiDef(apiDef);
                    return apiDef;
                });
            } else {
                console.warn("[ImportComponentsWizard] Missing __resourceType field for resource named", apiOrArtifact.name);
            }
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

    private processLoadedArtifactDef(artifactDefinition: ArtifactDefinition): void {
        console.debug("[ImportComponentsWizard] Processing an Artifact def: ", artifactDefinition.name);
        // TODO handle the other registry types as well
        if (this.type === ComponentType.schema && artifactDefinition.type === "JSON") {
            let $ref: string = `apicurio-registry:${ artifactDefinition.id }/${ artifactDefinition.version }#`;
            this.components.push({
                name: artifactDefinition.name,
                $ref: $ref,
                type: ComponentType.schema
            });
        } else if (artifactDefinition.type === "ASYNCAPI" || artifactDefinition.type === "OPENAPI") {
            let doc: Document = Library.readDocument(artifactDefinition.spec);
            let components: ImportedComponent[] = this.getArtifactComponents(artifactDefinition, doc);
            components.forEach(component => {
                this.components.push(component);
            });
        }
        console.debug("[ImportComponentsWizard] Done processing Artifact def:", artifactDefinition.name);
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

    private getArtifactComponents(artifactDefinition: ArtifactDefinition, doc: Document): ImportedComponent[] {
        let finder: ArtifactComponentFinder;
        if (doc.getDocumentType() == DocumentType.openapi2) {
            finder = new Oas20ArtifactComponentFinder(artifactDefinition, this.type);
        } else {
            finder = new ArtifactComponentFinder(artifactDefinition, this.type);
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

class ArtifactComponentFinder extends CombinedVisitorAdapter {

    public foundComponents: ImportedComponent[] = [];

    constructor(protected artifactDefinition: ArtifactDefinition, protected type: ComponentType) {
        super();
    }

    protected componentFound(definition: IDefinition): void {
        this.foundComponents.push(this.toImportedComponent(definition));
    }

    protected toImportedComponent(definition: IDefinition): ImportedComponent {
        let $ref: string = `apicurio-registry:${ this.artifactDefinition.id }/${ this.artifactDefinition.version }${ this.getFragmentPrefix() + definition.getName() }`;
        let component: ImportedComponent = {
            name: definition.getName(),
            $ref: $ref,
            type: this.type,
            from: {
                name: this.artifactDefinition.name,
                id: this.artifactDefinition.id
            }
        };
        return component;
    }

    protected getFragmentPrefix(): string {
        if (this.artifactDefinition.type === "JSON") {
            return "#/";
        }
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

    visitMessageTraitDefinition(node: IDefinition): void {
        if (this.type == ComponentType.messageTrait) {
            this.componentFound(node);
        }
    }
}
class Oas20ArtifactComponentFinder extends ArtifactComponentFinder {

    constructor(artifactDefinition: ArtifactDefinition, type: ComponentType) {
        super(artifactDefinition, type);
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
