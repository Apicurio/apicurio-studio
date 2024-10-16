import { ConfigService, useConfigService } from "@services/useConfigService.ts";
import { getRegistryClient } from "@utils/rest.utils.ts";
import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { Paging } from "@models/Paging.ts";
import {
    ArtifactMetaData, ArtifactReference, ArtifactSearchResults, BranchMetaData, BranchSearchResults,
    GroupMetaData, ReferenceType,
    Rule, VersionMetaData, VersionSearchResults, VersionSortBy
} from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import {SortOrder} from "@models/SortOrder.ts";
import {ArtifactsSortBy} from "@models/artifacts";

const arrayDecoder: TextDecoder = new TextDecoder("utf-8");


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

const getGroupRules = async (config: ConfigService, auth: AuthService, groupId: string|null): Promise<Rule[]> => {
    groupId = normalizeGroupId(groupId);

    console.info("[GroupsService] Getting the list of rules for group: ", groupId);
    return getRegistryClient(config.getApicurioStudioConfig(), auth).groups.byGroupId(groupId).rules.get().then(ruleTypes => {
        return Promise.all(ruleTypes!.map(rt => getGroupRule(config, auth, groupId, rt)));
    });
};

const getGroupRule = async (config: ConfigService, auth: AuthService, groupId: string|null, ruleType: string): Promise<Rule> => {
    groupId = normalizeGroupId(groupId);
    return getRegistryClient(config.getApicurioStudioConfig(), auth).groups.byGroupId(groupId).rules.byRuleType(ruleType).get().then(v => v!);
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

const getArtifactReferences = async (config: ConfigService, auth: AuthService, globalId: number, refType: ReferenceType): Promise<ArtifactReference[]> => {
    return getRegistryClient(config.getApicurioStudioConfig(), auth).ids.globalIds.byGlobalId(globalId).references.get({
    }).then(v => v!);
};

const getLatestArtifact = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string): Promise<string> => {
    return getArtifactVersionContent(config, auth, groupId, artifactId, "latest");
};

const getArtifactVersionContent = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, version: string): Promise<string> => {
    groupId = normalizeGroupId(groupId);
    const versionExpression: string = (version == "latest") ? "branch=latest" : version;
    return getRegistryClient(config.getApicurioStudioConfig(), auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).versions
        .byVersionExpression(versionExpression).content.get({
            headers: {
                "Accept": "*"
            }
        }).then(value => {
            return arrayDecoder.decode(value!);
        });
};

const getArtifactVersions = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, sortBy: VersionSortBy, sortOrder: SortOrder, paging: Paging): Promise<VersionSearchResults> => {
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

const getArtifactVersionComments = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, version: string): Promise<Comment[]> => {
    groupId = normalizeGroupId(groupId);
    console.info("[GroupsService] Getting the list of comments for artifact version: ", groupId, artifactId, version);
    return getRegistryClient(config.getApicurioStudioConfig(), auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).versions
        .byVersionExpression(version).comments.get().then(v => v!);
};

const getArtifactBranches = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, paging: Paging): Promise<VersionSearchResults> => {
    groupId = normalizeGroupId(groupId);
    const start: number = (paging.page - 1) * paging.pageSize;
    const end: number = start + paging.pageSize;
    const queryParams: any = {
        limit: end,
        offset: start
    };

    console.info("[GroupsService] Getting the list of branches for artifact: ", groupId, artifactId);
    return getRegistryClient(config.getApicurioStudioConfig(), auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).branches.get({
        queryParameters: queryParams
    }).then(v => v!);
};

const getArtifactBranchMetaData = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, branchId: string): Promise<BranchMetaData> => {
    groupId = normalizeGroupId(groupId);

    console.info("[GroupsService] Deleting new branch: ", groupId, artifactId, branchId);
    return getRegistryClient(config.getApicurioStudioConfig(), auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).branches.byBranchId(branchId).get().then(v => v!);
};

const getArtifactBranchVersions = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, branchId: string, paging: Paging): Promise<VersionSearchResults> => {
    groupId = normalizeGroupId(groupId);
    const start: number = (paging.page - 1) * paging.pageSize;
    const end: number = start + paging.pageSize;
    const queryParams: any = {
        limit: end,
        offset: start
    };

    console.info("[GroupsService] Getting the list of versions for artifact branch: ", groupId, artifactId, branchId);
    return getRegistryClient(config.getApicurioStudioConfig(), auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).branches.byBranchId(branchId).versions.get({
        queryParameters: queryParams
    }).then(v => v!);
};

const getArtifactRules = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string): Promise<Rule[]> => {
    groupId = normalizeGroupId(groupId);

    console.info("[GroupsService] Getting the list of rules for artifact: ", groupId, artifactId);
    return getRegistryClient(config.getApicurioStudioConfig(), auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).rules.get().then(ruleTypes => {
        return Promise.all(ruleTypes!.map(rt => getArtifactRule(config, auth, groupId, artifactId, rt)));
    });
};

const getArtifactRule = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, ruleType: string): Promise<Rule> => {
    groupId = normalizeGroupId(groupId);
    return getRegistryClient(config.getApicurioStudioConfig(), auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).rules.byRuleType(ruleType).get().then(v => v!);
};

const normalizeGroupId = (groupId: string|null): string => {
    return groupId || "default";
};

export interface GroupsService {
    getGroupMetaData(groupId: string): Promise<GroupMetaData>;
    getGroupArtifacts(groupId: string, sortBy: ArtifactsSortBy, sortOrder: SortOrder, paging: Paging): Promise<ArtifactSearchResults>;

    getGroupRules(groupId: string|null): Promise<Rule[]>;
    getGroupRule(groupId: string|null, ruleType: string): Promise<Rule>;

    getArtifactMetaData(groupId: string|null, artifactId: string): Promise<ArtifactMetaData>;
    getArtifactReferences(globalId: number, refType: ReferenceType): Promise<ArtifactReference[]>;
    getArtifactRules(groupId: string|null, artifactId: string): Promise<Rule[]>;
    getLatestArtifact(groupId: string|null, artifactId: string): Promise<string>;

    getArtifactRule(groupId: string|null, artifactId: string, ruleType: string): Promise<Rule>;

    getArtifactVersions(groupId: string|null, artifactId: string, sortBy: VersionSortBy, sortOrder: SortOrder, paging: Paging): Promise<VersionSearchResults>;
    getArtifactVersionMetaData(groupId: string|null, artifactId: string, version: string): Promise<VersionMetaData>;
    getArtifactVersionContent(groupId: string|null, artifactId: string, version: string): Promise<string>;

    getArtifactVersionComments(groupId: string|null, artifactId: string, version: string): Promise<Comment[]>;

    getArtifactBranches(groupId: string|null, artifactId: string, paging: Paging): Promise<BranchSearchResults>;
    getArtifactBranchMetaData(groupId: string|null, artifactId: string, branchId: string): Promise<BranchMetaData>;
    getArtifactBranchVersions(groupId: string|null, artifactId: string, branchId: string, paging: Paging): Promise<VersionSearchResults>;
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
        getGroupRules(groupId: string|null): Promise<Rule[]> {
            return getGroupRules(config, auth, groupId);
        },
        getGroupRule(groupId: string|null, ruleType: string): Promise<Rule> {
            return getGroupRule(config, auth, groupId, ruleType);
        },
        getArtifactMetaData(groupId: string|null, artifactId: string): Promise<ArtifactMetaData> {
            return getArtifactMetaData(config, auth, groupId, artifactId);
        },
        getArtifactReferences(globalId: number, refType: ReferenceType): Promise<ArtifactReference[]> {
            return getArtifactReferences(config, auth, globalId, refType);
        },
        getArtifactRules(groupId: string|null, artifactId: string): Promise<Rule[]> {
            return getArtifactRules(config, auth, groupId, artifactId);
        },
        getArtifactVersions(groupId: string|null, artifactId: string, sortBy: VersionSortBy, sortOrder: SortOrder, paging: Paging): Promise<VersionSearchResults> {
            return getArtifactVersions(config, auth, groupId, artifactId, sortBy, sortOrder, paging);
        },
        getLatestArtifact(groupId: string|null, artifactId: string): Promise<string> {
            return getLatestArtifact(config, auth, groupId, artifactId);
        },
        getArtifactRule(groupId: string|null, artifactId: string, ruleType: string): Promise<Rule> {
            return getArtifactRule(config, auth, groupId, artifactId, ruleType);
        },
        getArtifactVersionMetaData(groupId: string|null, artifactId: string, version: string): Promise<VersionMetaData> {
            return getArtifactVersionMetaData(config, auth, groupId, artifactId, version);
        },
        getArtifactVersionContent(groupId: string|null, artifactId: string, version: string): Promise<string> {
            return getArtifactVersionContent(config, auth, groupId, artifactId, version);
        },
        getArtifactVersionComments(groupId: string|null, artifactId: string, version: string): Promise<Comment[]> {
            return getArtifactVersionComments(config, auth, groupId, artifactId, version);
        },
        getArtifactBranches(groupId: string|null, artifactId: string, paging: Paging): Promise<VersionSearchResults> {
            return getArtifactBranches(config, auth, groupId, artifactId, paging);
        },
        getArtifactBranchMetaData(groupId: string|null, artifactId: string, branchId: string): Promise<BranchMetaData> {
            return getArtifactBranchMetaData(config, auth, groupId, artifactId, branchId);
        },
        getArtifactBranchVersions(groupId: string|null, artifactId: string, branchId: string, paging: Paging): Promise<VersionSearchResults> {
            return getArtifactBranchVersions(config, auth, groupId, artifactId, branchId, paging);
        }
    };
};
