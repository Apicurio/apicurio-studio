import { ConfigService, useConfigService } from "@services/useConfigService.ts";
import { getRegistryClient } from "@utils/rest.utils.ts";
import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { Paging } from "@models/Paging.ts";
import {
    ArtifactMetaData,
    ArtifactSearchResults,
    GroupMetaData,
    VersionMetaData,
    VersionSearchResults
} from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { SortOrder } from "@models/SortOrder.ts";
import { ArtifactsSortBy } from "@models/artifacts";
import { VersionsSortBy } from "@models/versions";


export interface ClientGeneration {
    clientClassName: string;
    namespaceName: string;
    includePatterns: string,
    excludePatterns: string,
    language: string;
    content: string;
}

const getGroupMetaData = async (config: ConfigService, auth: AuthService, groupId: string): Promise<GroupMetaData> => {
    groupId = normalizeGroupId(groupId);
    return getRegistryClient(config.getApicurioStudioConfig(), auth).groups.byGroupId(groupId).get().then(v => v!);
};

const getGroupArtifacts = async (config: ConfigService, auth: AuthService, groupId: string, sortBy: ArtifactsSortBy, sortOrder: SortOrder, paging: Paging): Promise<ArtifactSearchResults> => {
    groupId = normalizeGroupId(groupId);
    const start: number = (paging.page - 1) * paging.pageSize;
    const end: number = start + paging.pageSize;
    const queryParams: any = {
        limit: end,
        offset: start,
        order: sortOrder,
        orderby: sortBy
    };

    return getRegistryClient(config.getApicurioStudioConfig(), auth).groups.byGroupId(groupId).artifacts.get({
        queryParameters: queryParams
    }).then(v => v!);
};

const getArtifactMetaData = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string): Promise<ArtifactMetaData> => {
    groupId = normalizeGroupId(groupId);
    return getRegistryClient(config.getApicurioStudioConfig(), auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).get().then(v => v!);
};

const getArtifactVersionMetaData = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, version: string): Promise<VersionMetaData> => {
    groupId = normalizeGroupId(groupId);
    const versionExpression: string = (version == "latest") ? "branch=latest" : version;
    return getRegistryClient(config.getApicurioStudioConfig(), auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).versions
        .byVersionExpression(versionExpression).get().then(v => v!);
};

const getArtifactVersions = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, sortBy: VersionsSortBy, sortOrder: SortOrder, paging: Paging): Promise<VersionSearchResults> => {
    groupId = normalizeGroupId(groupId);
    const start: number = (paging.page - 1) * paging.pageSize;
    const end: number = start + paging.pageSize;
    const queryParams: any = {
        limit: end,
        offset: start,
        order: sortOrder,
        orderby: sortBy
    };

    console.info("[GroupsService] Getting the list of versions for artifact: ", groupId, artifactId);
    return getRegistryClient(config.getApicurioStudioConfig(), auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).versions.get({
        queryParameters: queryParams
    }).then(v => v!);
};


const normalizeGroupId = (groupId: string|null): string => {
    return groupId || "default";
};

export interface GroupsService {
    getGroupMetaData(groupId: string): Promise<GroupMetaData>;
    getGroupArtifacts(groupId: string, sortBy: ArtifactsSortBy, sortOrder: SortOrder, paging: Paging): Promise<ArtifactSearchResults>;

    getArtifactMetaData(groupId: string|null, artifactId: string): Promise<ArtifactMetaData>;

    getArtifactVersions(groupId: string|null, artifactId: string, sortBy: VersionsSortBy, sortOrder: SortOrder, paging: Paging): Promise<VersionSearchResults>;
    getArtifactVersionMetaData(groupId: string|null, artifactId: string, version: string): Promise<VersionMetaData>;
}


export const useGroupsService: () => GroupsService = (): GroupsService => {
    const config: ConfigService = useConfigService();
    const auth = useAuth();

    return {
        getGroupMetaData(groupId: string): Promise<GroupMetaData> {
            return getGroupMetaData(config, auth, groupId);
        },
        getGroupArtifacts(groupId: string, sortBy: ArtifactsSortBy, sortOrder: SortOrder, paging: Paging): Promise<ArtifactSearchResults> {
            return getGroupArtifacts(config, auth, groupId, sortBy, sortOrder, paging);
        },
        getArtifactMetaData(groupId: string|null, artifactId: string): Promise<ArtifactMetaData> {
            return getArtifactMetaData(config, auth, groupId, artifactId);
        },
        getArtifactVersions(groupId: string|null, artifactId: string, sortBy: VersionsSortBy, sortOrder: SortOrder, paging: Paging): Promise<VersionSearchResults> {
            return getArtifactVersions(config, auth, groupId, artifactId, sortBy, sortOrder, paging);
        },
        getArtifactVersionMetaData(groupId: string|null, artifactId: string, version: string): Promise<VersionMetaData> {
            return getArtifactVersionMetaData(config, auth, groupId, artifactId, version);
        },
    };
};
