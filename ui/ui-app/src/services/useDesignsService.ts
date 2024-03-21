import {
    ContentTypes,
    CreateDesign,
    CreateDesignContent, CreateDesignEvent,
    Design,
    DesignContent,
    DesignEvent,
    DesignsSearchCriteria,
    DesignsSearchResults,
    DesignsSort,
    Paging, RenameDesign,
} from "@models/designs";
import { createEndpoint, createOptions, httpDelete, httpGet, httpPostWithReturn, httpPut } from "@utils/rest.utils";
import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { ApicurioStudioConfig, useConfigService } from "@services/useConfigService.ts";

function limit(value: string | undefined, size: number): string {
    if (value != undefined && value.length > size) {
        return value.substring(0, size);
    }
    return value || "";
}

async function createDesign(appConfig: ApicurioStudioConfig, auth: AuthService, cd: CreateDesign, cdc: CreateDesignContent, cde?: CreateDesignEvent): Promise<Design> {
    console.debug("[DesignsService] Creating a new design: ", cd);
    const token: string | undefined = await auth.getToken();

    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs");
    const headers: any = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": cdc.contentType,
        "X-Studio-Name": `==${btoa(limit(cd.name, 256))}`,
        "X-Studio-Description": `==${btoa(limit(cd.description || "", 1024))}`,
        "X-Studio-Origin": cd.origin || "create",
        "X-Studio-Type": cd.type,
    };

    return httpPostWithReturn<any, Design>(endpoint, cdc.data, createOptions(headers)).then(response => {
        const cevent: CreateDesignEvent = cde || {
            type: "CREATE",
            data: {
                create: {
                    template: ""
                }
            }
        };
        createEvent(appConfig, auth, response.id, cevent);
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


async function getDesign(appConfig: ApicurioStudioConfig, auth: AuthService, id: string): Promise<Design> {
    const token: string | undefined = await auth.getToken();

    console.info("[DesignsService] Getting design with ID: ", id);
    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs/:designId/meta", {
        designId: id
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpGet<Design>(endpoint, createOptions(headers));
}

async function deleteDesign(appConfig: ApicurioStudioConfig, auth: AuthService, id: string): Promise<void> {
    const token: string | undefined = await auth.getToken();

    console.info("[DesignsService] Deleting design with ID: ", id);
    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs/:designId", {
        designId: id
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpDelete(endpoint, createOptions(headers));
}

async function renameDesign(appConfig: ApicurioStudioConfig, auth: AuthService, id: string, newName: string, newDescription?: string): Promise<void> {
    console.debug("[DesignsService] Renaming design with ID: ", id, newName);
    const token: string | undefined = await auth.getToken();

    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs/:designId/meta", {
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

async function getDesignContent(appConfig: ApicurioStudioConfig, auth: AuthService, id: string): Promise<DesignContent> {
    const token: string | undefined = await auth.getToken();

    console.info("[DesignsService] Getting design *content* with ID: ", id);
    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs/:designId", {
        designId: id
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
            id,
            contentType: response.headers["Content-Type"] || ContentTypes.APPLICATION_JSON,
            data
        };
    });
}

async function updateDesignContent(appConfig: ApicurioStudioConfig, auth: AuthService, content: DesignContent): Promise<void> {
    console.debug("[DesignsService] Updating the content of a design: ", content.id);
    const token: string | undefined = await auth.getToken();

    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs/:designId", {
        designId: content.id
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
        createEvent(appConfig, auth, content.id, cevent);
        return response;
    });
}

async function getEvents(appConfig: ApicurioStudioConfig, auth: AuthService, id: string): Promise<DesignEvent[]> {
    const token: string | undefined = await auth.getToken();

    console.info("[DesignsService] Getting events for design with ID: ", id);
    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs/:designId/events", {
        designId: id
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpGet<DesignEvent[]>(endpoint, createOptions(headers));
}

async function getFirstEvent(appConfig: ApicurioStudioConfig, auth: AuthService, id: string): Promise<DesignEvent> {
    const token: string | undefined = await auth.getToken();

    console.info("[DesignsService] Getting first event for design with ID: ", id);
    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs/:designId/events/first", {
        designId: id
    });
    const headers: any = {
        "Authorization": `Bearer ${token}`
    };
    return httpGet<DesignEvent>(endpoint, createOptions(headers));
}

async function createEvent(appConfig: ApicurioStudioConfig, auth: AuthService, id: string, cevent: CreateDesignEvent): Promise<DesignEvent> {
    console.debug("[DesignsService] Creating an event for design with ID: ", id);
    const token: string | undefined = await auth.getToken();

    const endpoint: string = createEndpoint(appConfig.apis.studio, "/designs/:designId/events", {
        designId: id
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
    createDesign(cd: CreateDesign, cdc: CreateDesignContent, cde?: CreateDesignEvent): Promise<Design>;
    getDesign(id: string): Promise<Design>;
    searchDesigns(criteria: DesignsSearchCriteria, paging: Paging, sort: DesignsSort): Promise<DesignsSearchResults>;
    deleteDesign(id: string): Promise<void>;
    renameDesign(id: string, newName: string, newDescription?: string): Promise<void>;
    getDesignContent(id: string): Promise<DesignContent>;
    updateDesignContent(content: DesignContent): Promise<void>;
    getEvents(id: string): Promise<DesignEvent[]>;
    getFirstEvent(id: string): Promise<DesignEvent>;
    createEvent(id: string, event: CreateDesignEvent): Promise<DesignEvent>;
}


/**
 * React hook to get the Designs service.
 */
export const useDesignsService: () => DesignsService = (): DesignsService => {
    const appConfig: ApicurioStudioConfig = useConfigService().getApicurioStudioConfig();
    const auth: AuthService = useAuth();

    return {
        createDesign: (cd: CreateDesign, cdc: CreateDesignContent, cde: CreateDesignEvent) => createDesign(appConfig, auth, cd, cdc, cde),
        searchDesigns: (criteria: DesignsSearchCriteria, paging: Paging, sort: DesignsSort) => searchDesigns(appConfig, auth, criteria, paging, sort),
        getDesign: (id: string) => getDesign(appConfig, auth, id),
        deleteDesign: (id: string) => deleteDesign(appConfig, auth, id),
        renameDesign: (id: string, newName: string, newDescription?: string) => renameDesign(appConfig, auth, id, newName, newDescription),
        getDesignContent: (id: string) => getDesignContent(appConfig, auth, id),
        updateDesignContent: (content: DesignContent) => updateDesignContent(appConfig, auth, content),
        getEvents: (id: string) => getEvents(appConfig, auth, id),
        getFirstEvent: (id: string) => getFirstEvent(appConfig, auth, id),
        createEvent: (id: string, cevent: CreateDesignEvent) => createEvent(appConfig, auth, id, cevent)
    };
};
