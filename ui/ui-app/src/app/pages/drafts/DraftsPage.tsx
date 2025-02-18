import { FunctionComponent, useEffect, useState } from "react";
import { PageSection, PageSectionVariants, TextContent } from "@patternfly/react-core";
import {
    DraftsList,
    DraftsPageEmptyState,
    DraftsPageToolbar,
    PageDataLoader,
    PageError,
    PageErrorHandler,
    toPageError
} from "@app/pages";
import { DraftsService, useDraftsService } from "@services/useDraftsService.ts";
import {
    CreateDraft,
    Draft,
    DraftsFilterBy,
    DraftsSearchFilter,
    DraftsSearchResults,
    DraftsSortBy
} from "@models/drafts";
import { Paging } from "@models/Paging.ts";
import { SortOrder } from "@models/SortOrder.ts";
import { ListWithToolbar, PleaseWaitModal } from "@apicurio/common-ui-components";
import {
    ConfirmDeleteModal,
    ConfirmFinalizeModal,
    CreateDraftModal, FinalizeDryRunSuccessModal, InvalidContentModal,
    NewDraftFromModal,
    RootPageHeader
} from "@app/components";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";
import { ConfigService, useConfigService } from "@services/useConfigService.ts";
import {
    RuleViolationProblemDetails,
    SearchedVersion
} from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";


const EMPTY_RESULTS: DraftsSearchResults = {
    drafts: [],
    count: 0
};

const DEFAULT_PAGING: Paging = {
    page: 1,
    pageSize: 10
};

export type DraftsPageProps = object;

export const DraftsPage: FunctionComponent<DraftsPageProps> = () => {
    const [pageError, setPageError] = useState<PageError>();
    const [loaders, setLoaders] = useState<Promise<any> | Promise<any>[] | undefined>();
    const [criteria, setCriteria] = useState<DraftsSearchFilter[]>([]);
    const [isSearching, setSearching] = useState(false);
    const [paging, setPaging] = useState<Paging>(DEFAULT_PAGING);
    const [sortBy, setSortBy] = useState<DraftsSortBy>(DraftsSortBy.artifactId);
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.asc);
    const [results, setResults] = useState<DraftsSearchResults>(EMPTY_RESULTS);
    const [isPleaseWaitModalOpen, setPleaseWaitModalOpen] = useState(false);
    const [pleaseWaitMessage, setPleaseWaitMessage] = useState("");
    const [draftToDelete, setDraftToDelete] = useState<Draft>();
    const [isCreateDraftModalOpen, setIsCreateDraftModalOpen] = useState(false);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [isConfirmFinalizeModalOpen, setIsConfirmFinalizeModalOpen] = useState(false);
    const [draftToFinalize, setDraftToFinalize] = useState<Draft>();
    const [fromVersion, setFromVersion] = useState<SearchedVersion>();
    const [isCreateDraftFromModalOpen, setIsCreateDraftFromModalOpen] = useState(false);
    const [isInvalidContentModalOpen, setIsInvalidContentModalOpen] = useState<boolean>(false);
    const [invalidContentError, setInvalidContentError] = useState<RuleViolationProblemDetails>();
    const [isFinalizeDryRunSuccessModalOpen, setIsFinalizeDryRunSuccessModalOpen] = useState(false);

    const config: ConfigService = useConfigService();
    const draftsService: DraftsService = useDraftsService();
    const appNavigation: AppNavigationService = useAppNavigation();

    const createLoaders = (): Promise<any> => {
        return search(criteria, sortBy, sortOrder, paging);
    };

    useEffect(() => {
        setLoaders([]);
    }, []);

    const pleaseWait = (message: string = ""): void => {
        setPleaseWaitModalOpen(true);
        setPleaseWaitMessage(message);
    };

    const handleInvalidContentError = (error: any): void => {
        console.info("[DraftsPage] Invalid content error:", error);
        setInvalidContentError(error);
        setIsInvalidContentModalOpen(true);
    };

    const onResultsLoaded = (results: DraftsSearchResults): void => {
        setSearching(false);
        setResults(results);
    };

    const onViewDraft = (draft: Draft): void => {
        const groupId: string = encodeURIComponent(draft.groupId || "default");
        const draftId: string = encodeURIComponent(draft.draftId!);
        const version: string = encodeURIComponent(draft.version!);

        appNavigation.navigateTo(`/drafts/${groupId}/${draftId}/${version}`);
    };

    const onViewDraftInRegistry = (draft: Draft): void => {
        const registryBaseUrl: string = config.getApicurioStudioConfig().links.registry!;
        const groupId: string = encodeURIComponent(draft.groupId || "default");
        const draftId: string = encodeURIComponent(draft.draftId!);
        const version: string = encodeURIComponent(draft.version!);

        const registryUrl: string = `${registryBaseUrl}/explore/${groupId}/${draftId}/versions/${version}`;
        window.location.href = registryUrl;
    };

    const doFinalizeDraft = (draft: Draft, dryRun?: boolean): void => {
        setIsConfirmFinalizeModalOpen(false);
        pleaseWait("Finalizing draft, please wait...");
        draftsService.finalizeDraft(draft.groupId, draft.draftId, draft.version, dryRun || false).then(() => {
            if (!dryRun) {
                const groupId: string = encodeURIComponent(draft.groupId || "default");
                const draftId: string = encodeURIComponent(draft.draftId!);
                appNavigation.navigateTo(`/explore/${groupId}/${draftId}`);
            } else {
                setPleaseWaitModalOpen(false);
                setIsFinalizeDryRunSuccessModalOpen(true);
            }
        }).catch(error => {
            setPleaseWaitModalOpen(false);
            if (error && (error.status === 400 || error.status === 409)) {
                handleInvalidContentError(error);
            } else {
                setPageError(toPageError(error, "Error finalizing a draft."));
            }
        });
    };

    const onDeleteDraft = (draft: Draft): void => {
        setDraftToDelete(draft);
        setIsConfirmDeleteModalOpen(true);
    };

    const doDeleteDraft = (): void => {
        setIsConfirmDeleteModalOpen(false);
        pleaseWait("Deleting draft, please wait.");

        const groupId: string = draftToDelete?.groupId || "default";
        const draftId: string = draftToDelete?.draftId || "";
        const version: string = draftToDelete?.version || "";

        draftsService.deleteDraft(groupId, draftId, version).then( () => {
            setPleaseWaitModalOpen(false);
            createLoaders();
        }).catch( error => {
            setPleaseWaitModalOpen(false);
            setPageError(toPageError(error, "Error deleting a draft."));
        });
    };

    const isFiltered = (): boolean => {
        return criteria.length > 0;
    };

    const doCreateDraft = (data: CreateDraft): void => {
        setIsCreateDraftModalOpen(false);
        pleaseWait("Creating draft, please wait...");

        draftsService.createDraft(data).then(draft => {
            setPleaseWaitModalOpen(false);
            console.info("[DraftsPage] Draft successfully created.  Redirecting to details.");
            onViewDraft(draft);
        }).catch(error => {
            setPleaseWaitModalOpen(false);
            setPageError(toPageError(error, "Error creating draft."));
        });
    };

    const doCreateDraftFromVersion = (fromVersion: SearchedVersion, groupId: string, draftId: string, version: string): void => {
        pleaseWait("Creating draft, please wait...");
        setIsCreateDraftFromModalOpen(false);

        draftsService.getDraftContent(fromVersion.groupId || null, fromVersion.artifactId!, fromVersion.version!).then(draftContent => {
            const createDraft: CreateDraft = {
                groupId: groupId,
                draftId: draftId,
                version: version,
                type: fromVersion.artifactType!,
                name: "",
                description: "",
                labels: {
                    basedOnGroupId: fromVersion.groupId,
                    basedOnArtifactId: fromVersion.artifactId,
                    basedOnVersion: fromVersion.version
                },
                content: draftContent.content,
                contentType: draftContent.contentType
            };
            doCreateDraft(createDraft);
        }).catch(error => {
            setPleaseWaitModalOpen(false);
            setPageError(toPageError(error, "Error creating draft."));
        });
    };

    const filterByGroupId = (groupId: string): void => {
        const dsf: DraftsSearchFilter = {
            by: DraftsFilterBy.groupId,
            value: groupId
        };

        let updated: boolean = false;
        const newCriteria: DraftsSearchFilter[] = criteria.map(c => {
            if (c.by === dsf.by) {
                updated = true;
                return dsf;
            } else {
                return c;
            }
        });
        if (!updated) {
            newCriteria.push(dsf);
        }
        setCriteria(newCriteria);
    };

    const search = async (criteria: DraftsSearchFilter[], sortBy: DraftsSortBy, sortOrder: SortOrder, paging: Paging): Promise<any> => {
        setSearching(true);

        return draftsService.searchDrafts(criteria, sortBy, sortOrder, paging).then(results => {
            onResultsLoaded(results);
        }).catch(error => {
            setPageError(toPageError(error, "Error searching for artifacts."));
        });
    };

    useEffect(() => {
        search(criteria, sortBy, sortOrder, paging);
    }, [criteria, paging, sortBy, sortOrder]);

    const toolbar = (
        <DraftsPageToolbar
            results={results}
            criteria={criteria}
            paging={paging}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onPageChange={setPaging}
            onCreateDraft={() => setIsCreateDraftModalOpen(true)}
            onSortChange={(by, dir) => {
                setSortBy(by);
                setSortOrder(dir);
            }}
            onCriteriaChange={setCriteria}
            onRefresh={() => {
                search(criteria, sortBy, sortOrder, paging);
            }}
        />
    );

    const emptyState = (
        <DraftsPageEmptyState
            isFiltered={isFiltered()}
            onCreateDraft={() => setIsCreateDraftModalOpen(true)} />
    );

    return (
        <PageErrorHandler error={pageError}>
            <PageDataLoader loaders={loaders}>
                <PageSection className="ps_explore-header" variant={PageSectionVariants.light} padding={{ default: "noPadding" }}>
                    <RootPageHeader tabKey={0} />
                </PageSection>
                <PageSection className="ps_explore-description" variant={PageSectionVariants.light}>
                    <TextContent>
                        Search for APIs and Schemas that are already in Draft status, and therefore can be edited.
                    </TextContent>
                </PageSection>
                <PageSection variant={PageSectionVariants.default} isFilled={true}>
                    <ListWithToolbar
                        toolbar={toolbar}
                        emptyState={emptyState}
                        filteredEmptyState={emptyState}
                        alwaysShowToolbar={true}
                        isLoading={isSearching}
                        isError={false}
                        isFiltered={isFiltered()}
                        isEmpty={results.count === 0}
                    >
                        <DraftsList
                            drafts={results.drafts}
                            onGroupClick={groupId => filterByGroupId(groupId)}
                            onView={onViewDraft}
                            onFinalize={(draft) => {
                                setDraftToFinalize(draft);
                                setIsConfirmFinalizeModalOpen(true);
                            }}
                            onCreateDraftFrom={(draft) => {
                                setFromVersion({
                                    groupId: draft.groupId,
                                    artifactId: draft.draftId,
                                    version: draft.version
                                });
                                setIsCreateDraftFromModalOpen(true);
                            }}
                            onViewInRegistry={onViewDraftInRegistry}
                            onDelete={onDeleteDraft}
                        />
                    </ListWithToolbar>
                </PageSection>
            </PageDataLoader>
            <CreateDraftModal
                isOpen={isCreateDraftModalOpen}
                onClose={() => setIsCreateDraftModalOpen(false)}
                onCreate={doCreateDraft} />
            <ConfirmDeleteModal
                title="Delete draft"
                message="Do you want to delete this draft? This action cannot be undone."
                isOpen={isConfirmDeleteModalOpen}
                onDelete={doDeleteDraft}
                onClose={() => setIsConfirmDeleteModalOpen(false)} />
            <ConfirmFinalizeModal
                draft={draftToFinalize}
                onClose={() => setIsConfirmFinalizeModalOpen(false)}
                onFinalize={doFinalizeDraft}
                isOpen={isConfirmFinalizeModalOpen} />
            <InvalidContentModal
                error={invalidContentError}
                isOpen={isInvalidContentModalOpen}
                onClose={() => {
                    setInvalidContentError(undefined);
                    setIsInvalidContentModalOpen(false);
                }} />
            <NewDraftFromModal
                isOpen={isCreateDraftFromModalOpen}
                onClose={() => setIsCreateDraftFromModalOpen(false)}
                onCreate={doCreateDraftFromVersion}
                fromVersion={fromVersion!} />
            <PleaseWaitModal
                message={pleaseWaitMessage}
                isOpen={isPleaseWaitModalOpen} />
            <FinalizeDryRunSuccessModal
                isOpen={isFinalizeDryRunSuccessModalOpen}
                onClose={() => setIsFinalizeDryRunSuccessModalOpen(false)} />
        </PageErrorHandler>
    );
};
