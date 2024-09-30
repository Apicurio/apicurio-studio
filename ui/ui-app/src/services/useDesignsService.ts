import {
    CreateDesign,
    CreateDesignEvent,
    Design,
    DesignContent,
    DesignsSearchCriteria,
    DesignsSearchResults,
    DesignsSort,
    Paging,
} from "@models/designs";
import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { ApicurioStudioConfig, useConfigService } from "@services/useConfigService.ts";
import { getRegistryClient } from "@utils/rest.utils.ts";
import { ApicurioRegistryClient } from "@apicurio/apicurio-registry-sdk";

async function createDesign(appConfig: ApicurioStudioConfig, auth: AuthService, cd: CreateDesign, cde?: CreateDesignEvent): Promise<Design> {
    console.debug("[DesignsService] Creating a new design: ", cd);
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    throw Error("Not yet implemented.");
}

async function searchDesigns(appConfig: ApicurioStudioConfig, auth: AuthService, criteria: DesignsSearchCriteria, paging: Paging, sort: DesignsSort): Promise<DesignsSearchResults> {
    console.debug("[DesignsService] Searching for designs: ", criteria, paging, sort);
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    throw Error("Not yet implemented.");
}


async function getDesign(appConfig: ApicurioStudioConfig, auth: AuthService, designId: string): Promise<Design> {
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    throw Error("Not yet implemented.");
}

async function deleteDesign(appConfig: ApicurioStudioConfig, auth: AuthService, designId: string): Promise<void> {
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    throw Error("Not yet implemented.");
}

async function renameDesign(appConfig: ApicurioStudioConfig, auth: AuthService, id: string, newName: string, newDescription?: string): Promise<void> {
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    throw Error("Not yet implemented.");
}

async function getDesignContent(appConfig: ApicurioStudioConfig, auth: AuthService, designId: string): Promise<DesignContent> {
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    throw Error("Not yet implemented.");
}

async function updateDesignContent(appConfig: ApicurioStudioConfig, auth: AuthService, content: DesignContent): Promise<void> {
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    throw Error("Not yet implemented.");
}


/**
 * The Designs Service interface.
 */
export interface DesignsService {
    createDesign(cd: CreateDesign, cde?: CreateDesignEvent): Promise<Design>;
    getDesign(designId: string): Promise<Design>;
    searchDesigns(criteria: DesignsSearchCriteria, paging: Paging, sort: DesignsSort): Promise<DesignsSearchResults>;
    deleteDesign(designId: string): Promise<void>;
    renameDesign(designId: string, newName: string, newDescription?: string): Promise<void>;
    getDesignContent(designId: string): Promise<DesignContent>;
    updateDesignContent(content: DesignContent): Promise<void>;
}


/**
 * React hook to get the Designs service.
 */
export const useDesignsService: () => DesignsService = (): DesignsService => {
    const appConfig: ApicurioStudioConfig = useConfigService().getApicurioStudioConfig();
    const auth: AuthService = useAuth();

    return {
        createDesign: (cd: CreateDesign, cde: CreateDesignEvent) => createDesign(appConfig, auth, cd, cde),
        searchDesigns: (criteria: DesignsSearchCriteria, paging: Paging, sort: DesignsSort) => searchDesigns(appConfig, auth, criteria, paging, sort),
        getDesign: (designId: string) => getDesign(appConfig, auth, designId),
        deleteDesign: (designId: string) => deleteDesign(appConfig, auth, designId),
        renameDesign: (designId: string, newName: string, newDescription?: string) => renameDesign(appConfig, auth, designId, newName, newDescription),
        getDesignContent: (designId: string) => getDesignContent(appConfig, auth, designId),
        updateDesignContent: (content: DesignContent) => updateDesignContent(appConfig, auth, content),
    };
};
