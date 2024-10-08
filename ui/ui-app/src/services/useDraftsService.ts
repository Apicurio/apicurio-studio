import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { ApicurioStudioConfig, useConfigService } from "@services/useConfigService.ts";
import { getRegistryClient } from "@utils/rest.utils.ts";
import { ApicurioRegistryClient } from "@apicurio/apicurio-registry-sdk";
import { CreateDraft, Draft, DraftsSearchFilter, DraftsSearchResults, DraftsSortBy } from "@models/drafts";
import { SortOrder } from "@models/SortOrder.ts";
import { Paging } from "@models/Paging.ts";
import {
    ArtifactMetaData,
    CreateArtifact,
    VersionMetaData
} from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import {
    VersionsRequestBuilderGetQueryParameters
} from "@apicurio/apicurio-registry-sdk/dist/generated-client/search/versions";


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
            drafts: results?.versions?.map(version => {
                const draft: Draft = {
                    groupId: version.groupId || "default",
                    draftId: version.artifactId!,
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    createArtifact.firstVersion.isDraft = true;

    return client.groups.byGroupId(data.groupId || "default").artifacts.post(createArtifact, {
        queryParameters: {
            ifExists: "CREATE_VERSION"
        }
    }).then(result => {
        const amd: ArtifactMetaData = result?.artifact as ArtifactMetaData;
        const vmd: VersionMetaData = result?.version as VersionMetaData;
        const draft: Draft = {
            groupId: amd.groupId || "default",
            draftId: amd.artifactId!,
            version: vmd.version!,
            type: amd.artifactType!,
            name: vmd.name!,
            description: vmd.description!,
            createdBy: vmd.owner as string,
            createdOn: vmd.createdOn!,
            // TODO restore this once the modified info is returned here
            // modifiedBy: vmd.modifiedBy!,
            // modifiedOn: vmd.modifiedOn!,
            // TODO implement handling of labels in Studio
            // labels: vmd.labels!,
        };
        return draft;
    });
}

/**
 * The Drafts Service interface.
 */
export interface DraftsService {
    searchDrafts(filters: DraftsSearchFilter[], sortBy: DraftsSortBy, sortOrder: SortOrder, paging: Paging): Promise<DraftsSearchResults>;
    createDraft(data: CreateDraft): Promise<Draft>;
}


/**
 * React hook to get the Drafts service.
 */
export const useDraftsService: () => DraftsService = (): DraftsService => {
    const appConfig: ApicurioStudioConfig = useConfigService().getApicurioStudioConfig();
    const auth: AuthService = useAuth();

    return {
        searchDrafts: (filters: DraftsSearchFilter[], sortBy: DraftsSortBy, sortOrder: SortOrder, paging: Paging) => searchDrafts(appConfig, auth, filters, sortBy, sortOrder, paging),
        createDraft: (data: CreateDraft) => createDraft(appConfig, auth, data)
    };
};
