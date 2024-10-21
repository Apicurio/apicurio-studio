import { FunctionComponent, useEffect, useState } from "react";
import { PageSection, PageSectionVariants, TextContent } from "@patternfly/react-core";
import {
    DraftsPageEmptyState,
    DraftsPageToolbar,
    DraftsPageToolbarFilterCriteria,
    DraftsTable,
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
import { CreateDraftModal, RootPageHeader } from "@app/components";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";


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
    const [ pageError, setPageError ] = useState<PageError>();
    const [ loaders, setLoaders ] = useState<Promise<any> | Promise<any>[] | undefined>();
    const [ criteria, setCriteria ] = useState<DraftsPageToolbarFilterCriteria>({
        filterBy: DraftsFilterBy.name,
        filterValue: ""
    });
    const [ isSearching, setSearching ] = useState(false);
    const [ paging, setPaging ] = useState<Paging>(DEFAULT_PAGING);
    const [ sortBy, setSortBy ] = useState<DraftsSortBy>(DraftsSortBy.name);
    const [ sortOrder, setSortOrder ] = useState<SortOrder>(SortOrder.asc);
    const [ results, setResults ] = useState<DraftsSearchResults>(EMPTY_RESULTS);
    const [ isPleaseWaitModalOpen, setPleaseWaitModalOpen ] = useState(false);
    const [ pleaseWaitMessage, setPleaseWaitMessage ] = useState("");
    const [ isCreateDraftModalOpen, setIsCreateDraftModalOpen ] = useState(false);

    const draftsService: DraftsService = useDraftsService();
    // const nav: AppNavigationService = useAppNavigation();

    const createLoaders = (): Promise<any> => {
        return search(criteria, sortBy, sortOrder, paging);
    };

    const appNavigation: AppNavigationService = useAppNavigation();

    useEffect(() => {
        setLoaders(createLoaders());
    }, []);

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

    const pleaseWait = (isOpen: boolean, message: string = ""): void => {
        setPleaseWaitModalOpen(isOpen);
        setPleaseWaitMessage(message);
    };

    const isFiltered = (): boolean => {
        return !!criteria.filterValue;
    };

    const doCreateDraft = (data: CreateDraft): void => {
        setIsCreateDraftModalOpen(false);
        pleaseWait(true);

        draftsService.createDraft(data).then(draft => {
            pleaseWait(false);
            console.info("[DraftsPage] Draft successfully created.  Redirecting to details.");
            onViewDraft(draft);
        }).catch(error => {
            pleaseWait(false);
            setPageError(toPageError(error, "Error creating draft."));
        });
    };

    const search = async (criteria: DraftsPageToolbarFilterCriteria, sortBy: DraftsSortBy, sortOrder: SortOrder, paging: Paging): Promise<any> => {
        setSearching(true);
        const filters: DraftsSearchFilter[] = [
            {
                by: criteria.filterBy,
                value: criteria.filterValue
            }
        ];

        return draftsService.searchDrafts(filters, sortBy, sortOrder, paging).then(results => {
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
            onPageChange={setPaging}
            onCreateDraft={() => setIsCreateDraftModalOpen(true)}
            onCriteriaChange={setCriteria} />
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
                        <DraftsTable
                            drafts={results.drafts}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onView={onViewDraft}
                            onSort={(by, order) => {
                                setSortBy(by);
                                setSortOrder(order);
                            }}
                        />
                    </ListWithToolbar>
                </PageSection>
            </PageDataLoader>
            <CreateDraftModal
                isOpen={isCreateDraftModalOpen}
                onClose={() => setIsCreateDraftModalOpen(false)}
                onCreate={doCreateDraft} />
            <PleaseWaitModal
                message={pleaseWaitMessage}
                isOpen={isPleaseWaitModalOpen} />
        </PageErrorHandler>
    );
};
