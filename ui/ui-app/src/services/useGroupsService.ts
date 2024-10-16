import { ConfigService, useConfigService } from "@services/useConfigService.ts";
import { getRegistryClient } from "@utils/rest.utils.ts";
import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { Paging } from "@models/paging.model.ts";
import {
    AddVersionToBranch,
    ArtifactMetaData,
    ArtifactReference,
    ArtifactSearchResults,
    ArtifactSortBy, BranchMetaData, BranchSearchResults,
    Comment,
    CreateArtifact,
    CreateArtifactResponse, CreateBranch,
    CreateGroup,
    CreateRule,
    CreateVersion,
    EditableArtifactMetaData, EditableBranchMetaData,
    EditableGroupMetaData,
    EditableVersionMetaData,
    GroupMetaData, NewComment, ReferenceType, ReferenceTypeObject, ReplaceBranchVersions,
    Rule,
    RuleType,
    SortOrder,
    VersionMetaData,
    VersionSearchResults,
    VersionSortBy
} from "@sdk/lib/generated-client/models";


const arrayDecoder: TextDecoder = new TextDecoder("utf-8");


export interface ClientGeneration {
    clientClassName: string;
    namespaceName: string;
    includePatterns: string,
    excludePatterns: string,
    language: string;
    content: string;
}

const createGroup = async (config: ConfigService, auth: AuthService, data: CreateGroup): Promise<GroupMetaData> => {
    return getRegistryClient(config, auth).groups.post(data).then(v => v!);
};

const getGroupMetaData = async (config: ConfigService, auth: AuthService, groupId: string): Promise<GroupMetaData> => {
    groupId = normalizeGroupId(groupId);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).get().then(v => v!);
};

const getGroupArtifacts = async (config: ConfigService, auth: AuthService, groupId: string, sortBy: ArtifactSortBy, sortOrder: SortOrder, paging: Paging): Promise<ArtifactSearchResults> => {
    groupId = normalizeGroupId(groupId);
    const start: number = (paging.page - 1) * paging.pageSize;
    const end: number = start + paging.pageSize;
    const queryParams: any = {
        limit: end,
        offset: start,
        order: sortOrder,
        orderby: sortBy
    };

    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.get({
        queryParameters: queryParams
    }).then(v => v!);
};

const updateGroupMetaData = async (config: ConfigService, auth: AuthService, groupId: string, metaData: EditableGroupMetaData): Promise<void> => {
    groupId = normalizeGroupId(groupId);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).put(metaData).then(v => v!);
};

const updateGroupOwner = async (config: ConfigService, auth: AuthService, groupId: string, newOwner: string): Promise<void> => {
    return updateGroupMetaData(config, auth, groupId, {
        owner: newOwner
    } as any);
};

const deleteGroup = async (config: ConfigService, auth: AuthService, groupId: string): Promise<void> => {
    groupId = normalizeGroupId(groupId);
    console.info("[GroupsService] Deleting group:", groupId);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).delete();
};


const getGroupRules = async (config: ConfigService, auth: AuthService, groupId: string|null): Promise<Rule[]> => {
    groupId = normalizeGroupId(groupId);

    console.info("[GroupsService] Getting the list of rules for group: ", groupId);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).rules.get().then(ruleTypes => {
        return Promise.all(ruleTypes!.map(rt => getGroupRule(config, auth, groupId, rt)));
    });
};

const getGroupRule = async (config: ConfigService, auth: AuthService, groupId: string|null, ruleType: string): Promise<Rule> => {
    groupId = normalizeGroupId(groupId);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).rules.byRuleType(ruleType).get().then(v => v!);
};

const createGroupRule = async (config: ConfigService, auth: AuthService, groupId: string|null, ruleType: string, configValue: string): Promise<Rule> => {
    groupId = normalizeGroupId(groupId);
    console.info("[GroupsService] Creating group rule:", ruleType);
    const body: CreateRule = {
        config: configValue,
        ruleType: ruleType as RuleType
    };
    return getRegistryClient(config, auth).groups.byGroupId(groupId).rules.post(body).then(v => v!);
};

const updateGroupRule = async (config: ConfigService, auth: AuthService, groupId: string|null, ruleType: string, configValue: string): Promise<Rule> => {
    groupId = normalizeGroupId(groupId);
    console.info("[GroupsService] Updating group rule:", ruleType);
    const body: Rule = {
        config: configValue,
        ruleType: ruleType as RuleType
    };
    return getRegistryClient(config, auth).groups.byGroupId(groupId).rules.byRuleType(ruleType).put(body).then(v => v!);
};

const deleteGroupRule = async (config: ConfigService, auth: AuthService, groupId: string|null, ruleType: string): Promise<void> => {
    groupId = normalizeGroupId(groupId);
    console.info("[GroupsService] Deleting group rule:", ruleType);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).rules.byRuleType(ruleType).delete();
};


const createArtifact = async (config: ConfigService, auth: AuthService, groupId: string|null, data: CreateArtifact): Promise<CreateArtifactResponse> => {
    groupId = normalizeGroupId(groupId);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.post(data).then(v => v!);
};

const createArtifactVersion = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, data: CreateVersion): Promise<VersionMetaData> => {
    groupId = normalizeGroupId(groupId);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).versions.post(data).then(v => v!);
};

const getArtifactMetaData = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string): Promise<ArtifactMetaData> => {
    groupId = normalizeGroupId(groupId);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).get().then(v => v!);
};

const getArtifactVersionMetaData = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, version: string): Promise<VersionMetaData> => {
    groupId = normalizeGroupId(groupId);
    const versionExpression: string = (version == "latest") ? "branch=latest" : version;
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).versions
        .byVersionExpression(versionExpression).get().then(v => v!);
};

const getArtifactReferences = async (config: ConfigService, auth: AuthService, globalId: number, refType: ReferenceType): Promise<ArtifactReference[]> => {
    const queryParams: any = {
        refType: refType || ReferenceTypeObject.OUTBOUND
    };
    return getRegistryClient(config, auth).ids.globalIds.byGlobalId(globalId).references.get({
        queryParameters: queryParams
    }).then(v => v!);
};

const getLatestArtifact = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string): Promise<string> => {
    return getArtifactVersionContent(config, auth, groupId, artifactId, "latest");
};

const updateArtifactMetaData = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, metaData: EditableArtifactMetaData): Promise<void> => {
    groupId = normalizeGroupId(groupId);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).put(metaData).then(v => v!);
};

const updateArtifactVersionMetaData = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, version: string, metaData: EditableVersionMetaData): Promise<void> => {
    groupId = normalizeGroupId(groupId);
    const versionExpression: string = (version == "latest") ? "branch=latest" : version;
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).versions
        .byVersionExpression(versionExpression).put(metaData).then(v => v!);
};

const updateArtifactOwner = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, newOwner: string): Promise<void> => {
    return updateArtifactMetaData(config, auth, groupId, artifactId, {
        owner: newOwner
    } as any);
};

const getArtifactVersionContent = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, version: string): Promise<string> => {
    groupId = normalizeGroupId(groupId);
    const versionExpression: string = (version == "latest") ? "branch=latest" : version;
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).versions
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
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).versions.get({
        queryParameters: queryParams
    }).then(v => v!);
};

const getArtifactVersionComments = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, version: string): Promise<Comment[]> => {
    groupId = normalizeGroupId(groupId);
    console.info("[GroupsService] Getting the list of comments for artifact version: ", groupId, artifactId, version);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).versions
        .byVersionExpression(version).comments.get().then(v => v!);
};

const createArtifactVersionComment = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, version: string, data: NewComment): Promise<Comment> => {
    groupId = normalizeGroupId(groupId);
    console.info("[GroupsService] Getting the list of comments for artifact version: ", groupId, artifactId, version);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).versions
        .byVersionExpression(version).comments.post(data).then(v => v!);
};

const updateArtifactVersionComment = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, version: string, commentId: string, data: NewComment): Promise<void> => {
    groupId = normalizeGroupId(groupId);
    console.info("[GroupsService] Getting the list of comments for artifact version: ", groupId, artifactId, version);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).versions
        .byVersionExpression(version).comments.byCommentId(commentId).put(data);
};

const deleteArtifactVersionComment = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, version: string, commentId: string): Promise<void> => {
    groupId = normalizeGroupId(groupId);
    console.info("[GroupsService] Getting the list of comments for artifact version: ", groupId, artifactId, version);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).versions
        .byVersionExpression(version).comments.byCommentId(commentId).delete();
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
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).branches.get({
        queryParameters: queryParams
    }).then(v => v!);
};

const createArtifactBranch = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, data: CreateBranch): Promise<BranchMetaData> => {
    groupId = normalizeGroupId(groupId);

    console.info("[GroupsService] Creating a new branch: ", groupId, artifactId, data);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).branches.post(data).then(v => v!);
};

const deleteArtifactBranch = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, branchId: string): Promise<void> => {
    groupId = normalizeGroupId(groupId);

    console.info("[GroupsService] Deleting new branch: ", groupId, artifactId, branchId);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).branches.byBranchId(branchId).delete();
};

const getArtifactBranchMetaData = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, branchId: string): Promise<BranchMetaData> => {
    groupId = normalizeGroupId(groupId);

    console.info("[GroupsService] Deleting new branch: ", groupId, artifactId, branchId);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).branches.byBranchId(branchId).get().then(v => v!);
};

const updateArtifactBranchMetaData = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, branchId: string, data: EditableBranchMetaData): Promise<void> => {
    groupId = normalizeGroupId(groupId);

    console.info("[GroupsService] Updating branch metadata: ", groupId, artifactId, branchId, data);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).branches.byBranchId(branchId).put(data);
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
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).branches.byBranchId(branchId).versions.get({
        queryParameters: queryParams
    }).then(v => v!);
};

const appendArtifactBranchVersion = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, branchId: string, data: AddVersionToBranch): Promise<void> => {
    groupId = normalizeGroupId(groupId);

    console.info("[GroupsService] Appending a new version to an artifact branch: ", groupId, artifactId, branchId, data);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).branches.byBranchId(branchId).versions.post(data);
};

const replaceArtifactBranchVersions = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, branchId: string, data: ReplaceBranchVersions): Promise<void> => {
    groupId = normalizeGroupId(groupId);

    console.info("[GroupsService] Replacing all versions in an artifact branch: ", groupId, artifactId, branchId, data);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).branches.byBranchId(branchId).versions.put(data);
};

const getArtifactRules = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string): Promise<Rule[]> => {
    groupId = normalizeGroupId(groupId);

    console.info("[GroupsService] Getting the list of rules for artifact: ", groupId, artifactId);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).rules.get().then(ruleTypes => {
        return Promise.all(ruleTypes!.map(rt => getArtifactRule(config, auth, groupId, artifactId, rt)));
    });
};

const getArtifactRule = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, ruleType: string): Promise<Rule> => {
    groupId = normalizeGroupId(groupId);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).rules.byRuleType(ruleType).get().then(v => v!);
};

const createArtifactRule = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, ruleType: string, configValue: string): Promise<Rule> => {
    groupId = normalizeGroupId(groupId);
    console.info("[GroupsService] Creating rule:", ruleType);
    const body: CreateRule = {
        config: configValue,
        ruleType: ruleType as RuleType
    };
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).rules.post(body).then(v => v!);
};

const updateArtifactRule = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, ruleType: string, configValue: string): Promise<Rule> => {
    groupId = normalizeGroupId(groupId);
    console.info("[GroupsService] Updating rule:", ruleType);
    const body: Rule = {
        config: configValue,
        ruleType: ruleType as RuleType
    };
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).rules
        .byRuleType(ruleType).put(body).then(v => v!);
};

const deleteArtifactRule = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, ruleType: string): Promise<void> => {
    groupId = normalizeGroupId(groupId);
    console.info("[GroupsService] Deleting rule:", ruleType);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).rules
        .byRuleType(ruleType).delete();
};

const deleteArtifact = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string): Promise<void> => {
    groupId = normalizeGroupId(groupId);
    console.info("[GroupsService] Deleting artifact:", groupId, artifactId);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId).delete();
};

const deleteArtifactVersion = async (config: ConfigService, auth: AuthService, groupId: string|null, artifactId: string, version: string): Promise<void> => {
    groupId = normalizeGroupId(groupId);
    console.info("[GroupsService] Deleting version: ", groupId, artifactId, version);
    return getRegistryClient(config, auth).groups.byGroupId(groupId).artifacts.byArtifactId(artifactId)
        .versions.byVersionExpression(version).delete();
};

const normalizeGroupId = (groupId: string|null): string => {
    return groupId || "default";
};

export interface GroupsService {
    createGroup(data: CreateGroup): Promise<GroupMetaData>;
    getGroupMetaData(groupId: string): Promise<GroupMetaData>;
    getGroupArtifacts(groupId: string, sortBy: ArtifactSortBy, sortOrder: SortOrder, paging: Paging): Promise<ArtifactSearchResults>;
    updateGroupMetaData(groupId: string, metaData: EditableGroupMetaData): Promise<void>;
    updateGroupOwner(groupId: string, newOwner: string): Promise<void>;
    deleteGroup(groupId: string): Promise<void>;

    getGroupRules(groupId: string|null): Promise<Rule[]>;
    createGroupRule(groupId: string|null, ruleType: string, configValue: string): Promise<Rule>;
    getGroupRule(groupId: string|null, ruleType: string): Promise<Rule>;
    updateGroupRule(groupId: string|null, ruleType: string, configValue: string): Promise<Rule>;
    deleteGroupRule(groupId: string|null, ruleType: string): Promise<void>;

    createArtifact(groupId: string|null, data: CreateArtifact): Promise<CreateArtifactResponse>;
    getArtifactMetaData(groupId: string|null, artifactId: string): Promise<ArtifactMetaData>;
    getArtifactReferences(globalId: number, refType: ReferenceType): Promise<ArtifactReference[]>;
    getArtifactRules(groupId: string|null, artifactId: string): Promise<Rule[]>;
    getLatestArtifact(groupId: string|null, artifactId: string): Promise<string>;
    updateArtifactMetaData(groupId: string|null, artifactId: string, metaData: EditableArtifactMetaData): Promise<void>;
    updateArtifactOwner(groupId: string|null, artifactId: string, newOwner: string): Promise<void>;
    deleteArtifact(groupId: string|null, artifactId: string): Promise<void>;

    createArtifactRule(groupId: string|null, artifactId: string, ruleType: string, configValue: string): Promise<Rule>;
    getArtifactRule(groupId: string|null, artifactId: string, ruleType: string): Promise<Rule>;
    updateArtifactRule(groupId: string|null, artifactId: string, ruleType: string, configValue: string): Promise<Rule>;
    deleteArtifactRule(groupId: string|null, artifactId: string, ruleType: string): Promise<void>;

    getArtifactVersions(groupId: string|null, artifactId: string, sortBy: VersionSortBy, sortOrder: SortOrder, paging: Paging): Promise<VersionSearchResults>;
    createArtifactVersion(groupId: string|null, artifactId: string, data: CreateVersion): Promise<VersionMetaData>;
    getArtifactVersionMetaData(groupId: string|null, artifactId: string, version: string): Promise<VersionMetaData>;
    getArtifactVersionContent(groupId: string|null, artifactId: string, version: string): Promise<string>;
    updateArtifactVersionMetaData(groupId: string|null, artifactId: string, version: string, metaData: EditableVersionMetaData): Promise<void>;
    deleteArtifactVersion(groupId: string|null, artifactId: string, version: string): Promise<void>;

    getArtifactVersionComments(groupId: string|null, artifactId: string, version: string): Promise<Comment[]>;
    createArtifactVersionComment(groupId: string|null, artifactId: string, version: string, data: NewComment): Promise<Comment>;
    updateArtifactVersionComment(groupId: string|null, artifactId: string, version: string, commentId: string, data: NewComment): Promise<void>;
    deleteArtifactVersionComment(groupId: string|null, artifactId: string, version: string, commentId: string): Promise<void>;

    getArtifactBranches(groupId: string|null, artifactId: string, paging: Paging): Promise<BranchSearchResults>;
    createArtifactBranch(groupId: string|null, artifactId: string, data: CreateBranch): Promise<BranchMetaData>;
    deleteArtifactBranch(groupId: string|null, artifactId: string, branchId: string): Promise<void>;
    getArtifactBranchMetaData(groupId: string|null, artifactId: string, branchId: string): Promise<BranchMetaData>;
    updateArtifactBranchMetaData(groupId: string|null, artifactId: string, branchId: string, data: EditableBranchMetaData): Promise<void>;
    getArtifactBranchVersions(groupId: string|null, artifactId: string, branchId: string, paging: Paging): Promise<VersionSearchResults>;
    appendArtifactBranchVersion(groupId: string|null, artifactId: string, branchId: string, data: AddVersionToBranch): Promise<void>;
    replaceArtifactBranchVersions(groupId: string|null, artifactId: string, branchId: string, data: ReplaceBranchVersions): Promise<void>;
}


export const useGroupsService: () => GroupsService = (): GroupsService => {
    const config: ConfigService = useConfigService();
    const auth = useAuth();

    return {
        createGroup(data: CreateGroup): Promise<GroupMetaData> {
            return createGroup(config, auth, data);
        },
        getGroupMetaData(groupId: string): Promise<GroupMetaData> {
            return getGroupMetaData(config, auth, groupId);
        },
        getGroupArtifacts(groupId: string, sortBy: ArtifactSortBy, sortOrder: SortOrder, paging: Paging): Promise<ArtifactSearchResults> {
            return getGroupArtifacts(config, auth, groupId, sortBy, sortOrder, paging);
        },
        updateGroupMetaData(groupId: string, metaData: EditableGroupMetaData): Promise<void> {
            return updateGroupMetaData(config, auth, groupId, metaData);
        },
        updateGroupOwner(groupId: string, newOwner: string): Promise<void> {
            return updateGroupOwner(config, auth, groupId, newOwner);
        },
        deleteGroup(groupId: string): Promise<void> {
            return deleteGroup(config, auth, groupId);
        },

        getGroupRules(groupId: string|null): Promise<Rule[]> {
            return getGroupRules(config, auth, groupId);
        },
        createGroupRule(groupId: string|null, ruleType: string, configValue: string): Promise<Rule> {
            return createGroupRule(config, auth, groupId, ruleType, configValue);
        },
        getGroupRule(groupId: string|null, ruleType: string): Promise<Rule> {
            return getGroupRule(config, auth, groupId, ruleType);
        },
        updateGroupRule(groupId: string|null, ruleType: string, configValue: string): Promise<Rule> {
            return updateGroupRule(config, auth, groupId, ruleType, configValue);
        },
        deleteGroupRule(groupId: string|null, ruleType: string): Promise<void> {
            return deleteGroupRule(config, auth, groupId, ruleType);
        },

        createArtifact(groupId: string|null, data: CreateArtifact): Promise<CreateArtifactResponse> {
            return createArtifact(config, auth, groupId, data);
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
        updateArtifactMetaData(groupId: string|null, artifactId: string, metaData: EditableArtifactMetaData): Promise<void> {
            return updateArtifactMetaData(config, auth, groupId, artifactId, metaData);
        },
        updateArtifactOwner(groupId: string|null, artifactId: string, newOwner: string): Promise<void> {
            return updateArtifactOwner(config, auth, groupId, artifactId, newOwner);
        },
        deleteArtifact(groupId: string|null, artifactId: string): Promise<void> {
            return deleteArtifact(config, auth, groupId, artifactId);
        },

        createArtifactRule(groupId: string|null, artifactId: string, ruleType: string, configValue: string): Promise<Rule> {
            return createArtifactRule(config, auth, groupId, artifactId, ruleType, configValue);
        },
        getArtifactRule(groupId: string|null, artifactId: string, ruleType: string): Promise<Rule> {
            return getArtifactRule(config, auth, groupId, artifactId, ruleType);
        },
        updateArtifactRule(groupId: string|null, artifactId: string, ruleType: string, configValue: string): Promise<Rule> {
            return updateArtifactRule(config, auth, groupId, artifactId, ruleType, configValue);
        },
        deleteArtifactRule(groupId: string|null, artifactId: string, ruleType: string): Promise<void> {
            return deleteArtifactRule(config, auth, groupId, artifactId, ruleType);
        },

        createArtifactVersion(groupId: string|null, artifactId: string, data: CreateVersion): Promise<VersionMetaData> {
            return createArtifactVersion(config, auth, groupId, artifactId, data);
        },
        getArtifactVersionMetaData(groupId: string|null, artifactId: string, version: string): Promise<VersionMetaData> {
            return getArtifactVersionMetaData(config, auth, groupId, artifactId, version);
        },
        getArtifactVersionContent(groupId: string|null, artifactId: string, version: string): Promise<string> {
            return getArtifactVersionContent(config, auth, groupId, artifactId, version);
        },
        updateArtifactVersionMetaData(groupId: string|null, artifactId: string, version: string, metaData: EditableVersionMetaData): Promise<void> {
            return updateArtifactVersionMetaData(config, auth, groupId, artifactId, version, metaData);
        },
        deleteArtifactVersion(groupId: string|null, artifactId: string, version: string): Promise<void> {
            return deleteArtifactVersion(config, auth, groupId, artifactId, version);
        },

        getArtifactVersionComments(groupId: string|null, artifactId: string, version: string): Promise<Comment[]> {
            return getArtifactVersionComments(config, auth, groupId, artifactId, version);
        },
        createArtifactVersionComment(groupId: string|null, artifactId: string, version: string, data: NewComment): Promise<Comment> {
            return createArtifactVersionComment(config, auth, groupId, artifactId, version, data);
        },
        updateArtifactVersionComment(groupId: string|null, artifactId: string, version: string, commentId: string, data: NewComment): Promise<void> {
            return updateArtifactVersionComment(config, auth, groupId, artifactId, version, commentId, data);
        },
        deleteArtifactVersionComment(groupId: string|null, artifactId: string, version: string, commentId: string): Promise<void> {
            return deleteArtifactVersionComment(config, auth, groupId, artifactId, version, commentId);
        },

        getArtifactBranches(groupId: string|null, artifactId: string, paging: Paging): Promise<VersionSearchResults> {
            return getArtifactBranches(config, auth, groupId, artifactId, paging);
        },
        createArtifactBranch(groupId: string|null, artifactId: string, data: CreateBranch): Promise<BranchMetaData> {
            return createArtifactBranch(config, auth, groupId, artifactId, data);
        },
        deleteArtifactBranch(groupId: string|null, artifactId: string, branchId: string): Promise<void> {
            return deleteArtifactBranch(config, auth, groupId, artifactId, branchId);
        },
        getArtifactBranchMetaData(groupId: string|null, artifactId: string, branchId: string): Promise<BranchMetaData> {
            return getArtifactBranchMetaData(config, auth, groupId, artifactId, branchId);
        },
        updateArtifactBranchMetaData(groupId: string|null, artifactId: string, branchId: string, data: EditableBranchMetaData): Promise<void> {
            return updateArtifactBranchMetaData(config, auth, groupId, artifactId, branchId, data);
        },
        getArtifactBranchVersions(groupId: string|null, artifactId: string, branchId: string, paging: Paging): Promise<VersionSearchResults> {
            return getArtifactBranchVersions(config, auth, groupId, artifactId, branchId, paging);
        },
        appendArtifactBranchVersion(groupId: string|null, artifactId: string, branchId: string, data: AddVersionToBranch): Promise<void> {
            return appendArtifactBranchVersion(config, auth, groupId, artifactId, branchId, data);
        },
        replaceArtifactBranchVersions(groupId: string|null, artifactId: string, branchId: string, data: ReplaceBranchVersions): Promise<void> {
            return replaceArtifactBranchVersions(config, auth, groupId, artifactId, branchId, data);
        }

    };
};
