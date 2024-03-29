import {
    ContentTypes,
    CreateDesign,
    CreateDesignEvent,
    Design,
    DesignContent,
    DesignEvent,
    DesignsSearchCriteria,
    DesignsSearchResults,
    DesignsSort,
    Paging,
    RenameDesign,
} from "@models/designs";
import { createEndpoint, createOptions, httpDelete, httpGet, httpPostWithReturn, httpPut } from "@utils/rest.utils";
import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { ApicurioStudioConfig, useConfigService } from "@services/useConfigService.ts";

async function createDesign(appConfig: ApicurioStudioConfig, auth: AuthService, cd: CreateDesign, cde?: CreateDesignEvent): Promise<Design> {
    console.debug("[DesignsService] Creating a new design: ", cd);
    const token: string | undefined = await auth.getToken();

    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs");
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };

    return httpPostWithReturn<any, Design>(endpoint, cd, createOptions(headers)).then(response => {
        const cevent: CreateDesignEvent = cde || {
            type: "CREATE",
            data: {
                create: {
                    template: ""
                }
            }
        };
        createEvent(appConfig, auth, response.designId, cevent);
        return response;
    });
}

async function searchDesigns(appConfig: ApicurioStudioConfig, auth: AuthService, criteria: DesignsSearchCriteria, paging: Paging, sort: DesignsSort): Promise<DesignsSearchResults> {
    console.debug("[DesignsService] Searching for designs: ", criteria, paging, sort);
    const token: string | undefined = await auth.getToken();

    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs", {}, {
        page: paging.page,
        pageSize: paging.pageSize,
        order: sort.direction,
        orderby: sort.by
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpGet<DesignsSearchResults>(endpoint, createOptions(headers));
}


async function getDesign(appConfig: ApicurioStudioConfig, auth: AuthService, designId: string): Promise<Design> {
    const token: string | undefined = await auth.getToken();

    console.info("[DesignsService] Getting design with ID: ", designId);
    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs/:designId", {
        designId
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpGet<Design>(endpoint, createOptions(headers));
}

async function deleteDesign(appConfig: ApicurioStudioConfig, auth: AuthService, designId: string): Promise<void> {
    const token: string | undefined = await auth.getToken();

    console.info("[DesignsService] Deleting design with ID: ", designId);
    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs/:designId", {
        designId
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpDelete(endpoint, createOptions(headers));
}

async function renameDesign(appConfig: ApicurioStudioConfig, auth: AuthService, id: string, newName: string, newDescription?: string): Promise<void> {
    console.debug("[DesignsService] Renaming design with ID: ", id, newName);
    const token: string | undefined = await auth.getToken();

    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs/:designId", {
        designId: id
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpPut<RenameDesign>(endpoint, {
        name: newName,
        description: newDescription || ""
    }, createOptions(headers));

}

async function getDesignContent(appConfig: ApicurioStudioConfig, auth: AuthService, designId: string): Promise<DesignContent> {
    const token: string | undefined = await auth.getToken();

    console.info("[DesignsService] Getting design *content* with ID: ", designId);
    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs/:designId/content", {
        designId
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };

    const options: any = createOptions(headers);
    options.maxContentLength = "5242880"; // TODO 5MB hard-coded, make this configurable?
    options.responseType = "text";
    options.transformResponse = (data: any) => data;

    return httpGet<DesignContent>(endpoint, options, (data, response) => {
        return {
            designId,
            contentType: response.headers["Content-Type"] || ContentTypes.APPLICATION_JSON,
            data
        };
    });
}

async function updateDesignContent(appConfig: ApicurioStudioConfig, auth: AuthService, content: DesignContent): Promise<void> {
    console.debug("[DesignsService] Updating the content of a design: ", content.designId);
    const token: string | undefined = await auth.getToken();

    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs/:designId/content", {
        designId: content.designId
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": content.contentType,
    };
    return httpPut<any>(endpoint, content.data, createOptions(headers)).then(response => {
        const cevent: CreateDesignEvent = {
            type: "UPDATE",
            data: {
                update: {
                    notes: ""
                }
            }
        };
        createEvent(appConfig, auth, content.designId, cevent);
        return response;
    });
}

async function getEvents(appConfig: ApicurioStudioConfig, auth: AuthService, designId: string): Promise<DesignEvent[]> {
    const token: string | undefined = await auth.getToken();

    console.info("[DesignsService] Getting events for design with ID: ", designId);
    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs/:designId/events", {
        designId
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpGet<DesignEvent[]>(endpoint, createOptions(headers));
}

async function getFirstEvent(appConfig: ApicurioStudioConfig, auth: AuthService, designId: string): Promise<DesignEvent> {
    const token: string | undefined = await auth.getToken();

    console.info("[DesignsService] Getting first event for design with ID: ", designId);
    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs/:designId/events/first", {
        designId
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpGet<DesignEvent>(endpoint, createOptions(headers));
}

async function createEvent(appConfig: ApicurioStudioConfig, auth: AuthService, designId: string, cevent: CreateDesignEvent): Promise<DesignEvent> {
    console.debug("[DesignsService] Creating an event for design with ID: ", designId);
    const token: string | undefined = await auth.getToken();

    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs/:designId/events", {
        designId
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpPostWithReturn<CreateDesignEvent, DesignEvent>(endpoint, cevent, createOptions(headers));
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
    getEvents(designId: string): Promise<DesignEvent[]>;
    getFirstEvent(designId: string): Promise<DesignEvent>;
    createEvent(designId: string, event: CreateDesignEvent): Promise<DesignEvent>;
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
        getEvents: (designId: string) => getEvents(appConfig, auth, designId),
        getFirstEvent: (designId: string) => getFirstEvent(appConfig, auth, designId),
        createEvent: (designId: string, cevent: CreateDesignEvent) => createEvent(appConfig, auth, designId, cevent)
    };
};
