import { ConfigService, useConfigService } from "@services/useConfigService.ts";
import { getRegistryClient } from "@utils/rest.utils.ts";
import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { Paging } from "@models/Paging.ts";
import {
    GroupSearchResults,
    GroupSortBy,
    SortOrder
} from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";

export enum FilterBy {
    name = "name", description = "description", labels = "labels", groupId = "groupId"
}

export interface SearchFilter {
    by: FilterBy;
    value: string;
}

const searchGroups = async (config: ConfigService, auth: AuthService, filters: SearchFilter[], sortBy: GroupSortBy, sortOrder: SortOrder, paging: Paging): Promise<GroupSearchResults> => {
    console.debug("[SearchService] Searching groups: ", filters, paging);
    const start: number = (paging.page - 1) * paging.pageSize;
    const end: number = start + paging.pageSize;
    const queryParams: any = {
        limit: end,
        offset: start,
        order: sortOrder,
        orderby: sortBy
    };
    filters.forEach(filter => {
        queryParams[filter.by] = filter.value;
    });

    return getRegistryClient(config.getApicurioStudioConfig(), auth).search.groups.get({
        queryParameters: queryParams
    }).then(v => v!);
};


export interface SearchService {
    searchGroups(filters: SearchFilter[], sortBy: GroupSortBy, sortOrder: SortOrder, paging: Paging): Promise<GroupSearchResults>;
}


export const useSearchService: () => SearchService = (): SearchService => {
    const config: ConfigService = useConfigService();
    const auth = useAuth();

    return {
        searchGroups(filters: SearchFilter[], sortBy: GroupSortBy, sortOrder: SortOrder, paging: Paging): Promise<GroupSearchResults> {
            return searchGroups(config, auth, filters, sortBy, sortOrder, paging);
        }
    };
};
