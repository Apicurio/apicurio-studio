import { ConfigService, useConfigService } from "@services/useConfigService.ts";
import { getRegistryClient } from "@utils/rest.utils.ts";
import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { Paging } from "@models/paging.model.ts";
import {
    ArtifactSearchResults,
    ArtifactSortBy,
    GroupSearchResults,
    GroupSortBy,
    SortOrder
} from "@sdk/lib/generated-client/models";

export enum FilterBy {
    name = "name", description = "description", labels = "labels", groupId = "groupId", artifactId = "artifactId",
    globalId = "globalId", contentId = "contentId"
}

export interface SearchFilter {
    by: FilterBy;
    value: string;
}

const searchArtifacts = async (config: ConfigService, auth: AuthService, filters: SearchFilter[], sortBy: ArtifactSortBy, sortOrder: SortOrder, paging: Paging): Promise<ArtifactSearchResults> => {
    console.debug("[SearchService] Searching artifacts: ", filters, sortBy, sortOrder, paging);
    const start: number = (paging.page - 1) * paging.pageSize;
    const end: number = start + paging.pageSize;
    const queryParams: any = {
        limit: end,
        offset: start,
        order: sortOrder,
        orderby: sortBy
    };
    filters?.forEach(filter => {
        queryParams[filter.by] = filter.value;
    });

    return getRegistryClient(config, auth).search.artifacts.get({
        queryParameters: queryParams
    }).then(v => v!);
};

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

    return getRegistryClient(config, auth).search.groups.get({
        queryParameters: queryParams
    }).then(v => v!);
};


export interface SearchService {
    searchArtifacts(filters: SearchFilter[], sortBy: ArtifactSortBy, sortOrder: SortOrder, paging: Paging): Promise<ArtifactSearchResults>;
    searchGroups(filters: SearchFilter[], sortBy: GroupSortBy, sortOrder: SortOrder, paging: Paging): Promise<GroupSearchResults>;
}


export const useSearchService: () => SearchService = (): SearchService => {
    const config: ConfigService = useConfigService();
    const auth = useAuth();

    return {
        searchArtifacts(filters: SearchFilter[], sortBy: ArtifactSortBy, sortOrder: SortOrder, paging: Paging): Promise<ArtifactSearchResults> {
            return searchArtifacts(config, auth, filters, sortBy, sortOrder, paging);
        },
        searchGroups(filters: SearchFilter[], sortBy: GroupSortBy, sortOrder: SortOrder, paging: Paging): Promise<GroupSearchResults> {
            return searchGroups(config, auth, filters, sortBy, sortOrder, paging);
        },
    };
};
