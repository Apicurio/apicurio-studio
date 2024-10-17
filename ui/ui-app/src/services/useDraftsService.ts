import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { ApicurioStudioConfig, useConfigService } from "@services/useConfigService.ts";
import { getRegistryClient } from "@utils/rest.utils.ts";
import { ApicurioRegistryClient } from "@apicurio/apicurio-registry-sdk";
import { CreateDraft, Draft, DraftInfo, DraftsSearchFilter, DraftsSearchResults, DraftsSortBy } from "@models/drafts";
import { SortOrder } from "@models/SortOrder.ts";
import { Paging } from "@models/Paging.ts";
import {
    Comment,
    CreateArtifact, EditableVersionMetaData, NewComment, SearchedVersion,
    VersionMetaData
} from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import {
    VersionsRequestBuilderGetQueryParameters
} from "@apicurio/apicurio-registry-sdk/dist/generated-client/search/versions";


const normalizeGroupId = (groupId: string|null): string => {
    return groupId || "default";
};

const toDraft = (vmd: VersionMetaData | SearchedVersion | undefined): Draft => {
    const draft: Draft = {
        groupId: vmd!.groupId || "default",
        draftId: vmd!.artifactId!,
        version: vmd!.version!,
        type: vmd!.artifactType!,
        name: vmd!.name!,
        description: vmd!.description!,
        createdBy: vmd!.owner as string,
        createdOn: vmd!.createdOn!,
        // TODO restore this once the modified info is returned here
        // modifiedBy: vmd.modifiedBy!,
        // modifiedOn: vmd.modifiedOn!,
        // TODO implement handling of labels in Studio
        // labels: vmd.labels!,
    };
    return draft;
};

/**
 * Search for drafts.
 */
async function searchDrafts(appConfig: ApicurioStudioConfig, auth: AuthService, filters: DraftsSearchFilter[],
                            sortBy: DraftsSortBy, sortOrder: SortOrder, paging: Paging): Promise<DraftsSearchResults> {
    console.debug("[DraftsService] Searching for drafts: ", filters, paging, sortBy, sortOrder);
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    const start: number = (paging.page - 1) * paging.pageSize;
    const end: number = start + paging.pageSize;
    const queryParams: VersionsRequestBuilderGetQueryParameters = {
        limit: end,
        offset: start,
        order: sortOrder,
        orderby: sortBy as any
    };
    // TODO update this to VersionStateObject.DRAFT once the SDK is updated
    (queryParams as any)["state"] = "DRAFT";

    // Apply filters
    filters.forEach(filter => {
        (queryParams as any)[filter.by] = filter.value;
    });

    return client.search.versions.get({
        queryParameters: queryParams
    }).then(results => {
        const rval: DraftsSearchResults = {
            count: results?.count as number,
            drafts: results?.versions?.map(toDraft) as Draft[]
        };
        return rval;
    });
}

/**
 * Create a draft.
 */
async function createDraft(appConfig: ApicurioStudioConfig, auth: AuthService, data: CreateDraft): Promise<Draft> {
    console.debug("[DraftsService] Creating a new draft: ", data);
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    const createArtifact: CreateArtifact = {
        artifactId: data.draftId,
        artifactType: data.type,
        firstVersion: {
            name: data.name,
            description: data.description,
            version: data.version,
            content: {
                content: data.content,
                contentType: data.contentType
            }
        }
    };
    if (data.draftId === "") {
        delete createArtifact.artifactId;
    }
    if (data.version === "") {
        delete createArtifact.firstVersion?.version;
    }
    if (data.name === "") {
        delete createArtifact.firstVersion?.name;
    }
    if (data.description === "") {
        delete createArtifact.firstVersion?.description;
    }

    // TODO set "isDraft" to true - replace this once Registry 3.0.2 is released and the new SDK is available
    if (createArtifact.firstVersion) {
        createArtifact.firstVersion.additionalData = {
            "isDraft": true
        };
    }

    return client.groups.byGroupId(data.groupId || "default").artifacts.post(createArtifact, {
        queryParameters: {
            ifExists: "CREATE_VERSION"
        }
    }).then(result => toDraft(result!.version!));
}

/**
 * Get a draft.
 */
async function getDraft(appConfig: ApicurioStudioConfig, auth: AuthService, groupId: string | null, draftId: string, version: string): Promise<Draft> {
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    groupId = normalizeGroupId(groupId);
    console.info("[DraftsService] Getting a draft: ", groupId, draftId, version);

    return client.groups.byGroupId(groupId).artifacts.byArtifactId(draftId).versions
        .byVersionExpression(version).get().then(toDraft);
}

/**
 * Get draft comments.
 */
async function getDraftComments(appConfig: ApicurioStudioConfig, auth: AuthService, groupId: string | null, draftId: string, version: string): Promise<Comment[]> {
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    groupId = normalizeGroupId(groupId);
    console.info("[DraftsService] Getting the list of comments for draft: ", groupId, draftId, version);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return client.groups.byGroupId(groupId).artifacts.byArtifactId(draftId).versions
        .byVersionExpression(version).comments.get();
}

/**
 * Create a draft comment.
 */
async function createDraftComment(appConfig: ApicurioStudioConfig, auth: AuthService, groupId: string | null, draftId: string, version: string, data: NewComment): Promise<Comment> {
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    groupId = normalizeGroupId(groupId);
    console.info("[DraftsService] Creating a new comment for draft: ", groupId, draftId, version);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return client.groups.byGroupId(groupId).artifacts.byArtifactId(draftId).versions
        .byVersionExpression(version).comments.post(data);
}

/**
 * Update a draft comment.
 */
async function updateDraftComment(appConfig: ApicurioStudioConfig, auth: AuthService, groupId: string | null, draftId: string, version: string, commentId: string, data: NewComment): Promise<void> {
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    groupId = normalizeGroupId(groupId);
    console.info("[DraftsService] Updating a comment for draft: ", groupId, draftId, version);

    return client.groups.byGroupId(groupId).artifacts.byArtifactId(draftId).versions
        .byVersionExpression(version).comments.byCommentId(commentId).put(data);
}

/**
 * Delete a draft comment.
 */
async function deleteDraftComment(appConfig: ApicurioStudioConfig, auth: AuthService, groupId: string | null, draftId: string, version: string, commentId: string): Promise<void> {
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    groupId = normalizeGroupId(groupId);
    console.info("[DraftsService] Deleting a comment for draft: ", groupId, draftId, version);

    return client.groups.byGroupId(groupId).artifacts.byArtifactId(draftId).versions
        .byVersionExpression(version).comments.byCommentId(commentId).delete();
}

/**
 * Update the info (metadata) for a draft.
 */
function updateDraftInfo(appConfig: ApicurioStudioConfig, auth: AuthService, groupId: string | null, draftId: string, version: string, draftInfo: DraftInfo): Promise<void> {
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    groupId = normalizeGroupId(groupId);
    console.info("[DraftsService] Updating info for draft: ", groupId, draftId, version);

    const metaData: EditableVersionMetaData = draftInfo as EditableVersionMetaData;
    return client.groups.byGroupId(groupId).artifacts.byArtifactId(draftId).versions.byVersionExpression(version).put(metaData);
}

/**
 * Delete a draft.
 */
function deleteDraft(appConfig: ApicurioStudioConfig, auth: AuthService, groupId: string | null, draftId: string, version: string): Promise<void> {
    const client: ApicurioRegistryClient = getRegistryClient(appConfig, auth);

    groupId = normalizeGroupId(groupId);
    console.info("[DraftsService] Deleting a draft: ", groupId, draftId, version);

    return client.groups.byGroupId(groupId).artifacts.byArtifactId(draftId).versions.byVersionExpression(version).delete();
}


/**
 * The Drafts Service interface.
 */
export interface DraftsService {
    searchDrafts(filters: DraftsSearchFilter[], sortBy: DraftsSortBy, sortOrder: SortOrder, paging: Paging): Promise<DraftsSearchResults>;
    createDraft(data: CreateDraft): Promise<Draft>;
    getDraft(groupId: string, draftId: string, version: string): Promise<Draft>;
    updateDraftInfo(groupId: string|null, draftId: string, version: string, draftInfo: DraftInfo): Promise<void>;
    deleteDraft(groupId: string|null, draftId: string, version: string): Promise<void>;

    getDraftComments(groupId: string|null, draftId: string, version: string): Promise<Comment[]>;
    createDraftComment(groupId: string|null, draftId: string, version: string, data: NewComment): Promise<Comment>;
    updateDraftComment(groupId: string|null, draftId: string, version: string, commentId: string, data: NewComment): Promise<void>;
    deleteDraftComment(groupId: string|null, draftId: string, version: string, commentId: string): Promise<void>;

}


/**
 * React hook to get the Drafts service.
 */
export const useDraftsService: () => DraftsService = (): DraftsService => {
    const appConfig: ApicurioStudioConfig = useConfigService().getApicurioStudioConfig();
    const auth: AuthService = useAuth();

    return {
        searchDrafts: (filters: DraftsSearchFilter[], sortBy: DraftsSortBy, sortOrder: SortOrder, paging: Paging) =>
            searchDrafts(appConfig, auth, filters, sortBy, sortOrder, paging),
        createDraft: (data: CreateDraft) =>
            createDraft(appConfig, auth, data),
        getDraft: (groupId: string, draftId: string, version: string) =>
            getDraft(appConfig, auth, groupId, draftId, version),
        updateDraftInfo: (groupId: string|null, draftId: string, version: string, draftInfo: DraftInfo) =>
            updateDraftInfo(appConfig, auth, groupId, draftId, version, draftInfo),
        deleteDraft: (groupId: string|null, draftId: string, version: string) =>
            deleteDraft(appConfig, auth, groupId, draftId, version),


        getDraftComments: (groupId: string|null, draftId: string, version: string) =>
            getDraftComments(appConfig, auth, groupId, draftId, version),
        createDraftComment: (groupId: string|null, draftId: string, version: string, data: NewComment) =>
            createDraftComment(appConfig, auth, groupId, draftId, version, data),
        updateDraftComment: (groupId: string|null, draftId: string, version: string, commentId: string, data: NewComment) =>
            updateDraftComment(appConfig, auth, groupId, draftId, version, commentId, data),
        deleteDraftComment: (groupId: string|null, draftId: string, version: string, commentId: string) =>
            deleteDraftComment(appConfig, auth, groupId, draftId, version, commentId),
    };
};
