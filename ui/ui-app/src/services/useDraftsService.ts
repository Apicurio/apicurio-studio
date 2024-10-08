import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { ApicurioStudioConfig, useConfigService } from "@services/useConfigService.ts";
import { getRegistryClient } from "@utils/rest.utils.ts";
import { ApicurioRegistryClient } from "@apicurio/apicurio-registry-sdk";
import { Draft, DraftsSearchFilter, DraftsSearchResults, DraftsSortBy } from "@models/drafts";
import { SortOrder } from "@models/SortOrder.ts";
import { Paging } from "@models/Paging.ts";


async function searchDrafts(appConfig: ApicurioStudioConfig, auth: AuthService, filters: DraftsSearchFilter[],
                            sortBy: DraftsSortBy, sortOrder: SortOrder, paging: Paging): Promise<DraftsSearchResults> {
    console.debug("[DraftsService] Searching for drafts: ", filters, paging, sortBy, sortOrder);
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    const start: number = (paging.page - 1) * paging.pageSize;
    const end: number = start + paging.pageSize;
    const queryParams: any = {
        limit: end,
        offset: start,
        order: sortOrder,
        orderby: sortBy,
        state: "DRAFT" // TODO update this to VersionStateObject.DRAFT once the SDK is updated
    };

    // TODO apply filters!

    return client.search.versions.get({
        queryParameters: queryParams
    }).then(results => {
        const rval: DraftsSearchResults = {
            count: results?.count as number,
            drafts: results?.versions?.map(version => {
                const draft: Draft = {
                    groupId: version.groupId || "default",
                    artifactId: version.artifactId!,
                    version: version.version!,
                    type: version.artifactType!,
                    name: version.name!,
                    description: version.description!,
                    createdBy: version.owner!,
                    createdOn: version.createdOn as Date,

                    // TODO populate the next three - needs SDK update
                    labels: {},
                    modifiedBy: "user",
                    modifiedOn: new Date()
                    // modifiedBy: version.modifiedBy as string,
                    // modifiedOn: version.modifiedOn as Date,
                };
                return draft;
            }) as Draft[]
        };
        return rval;
    });
}


/**
 * The Drafts Service interface.
 */
export interface DraftsService {
    searchDrafts(filters: DraftsSearchFilter[], sortBy: DraftsSortBy, sortOrder: SortOrder, paging: Paging): Promise<DraftsSearchResults>;
}


/**
 * React hook to get the Drafts service.
 */
export const useDraftsService: () => DraftsService = (): DraftsService => {
    const appConfig: ApicurioStudioConfig = useConfigService().getApicurioStudioConfig();
    const auth: AuthService = useAuth();

    return {
        searchDrafts: (filters: DraftsSearchFilter[], sortBy: DraftsSortBy, sortOrder: SortOrder, paging: Paging) => searchDrafts(appConfig, auth, filters, sortBy, sortOrder, paging),
    };
};
