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
import { DraftsFilterBy, DraftsSearchFilter, DraftsSearchResults, DraftsSortBy } from "@models/drafts";
import { Paging } from "@models/Paging.ts";
import { SortOrder } from "@models/SortOrder.ts";
import { DraftsPageHeader } from "@app/pages/drafts/components/header";
import { ListWithToolbar } from "@apicurio/common-ui-components";


const EMPTY_RESULTS: DraftsSearchResults = {
    drafts: [],
    count: 0
};

const DEFAULT_PAGING: Paging = {
    page: 1,
    pageSize: 10
};

export type DraftsPageProps = Record<string, never>;

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

    const draftsService: DraftsService = useDraftsService();
    // const nav: AppNavigationService = useAppNavigation();

    const createLoaders = (): Promise<any> => {
        return search(criteria, sortBy, sortOrder, paging);
    };

    useEffect(() => {
        setLoaders(createLoaders());
    }, []);

    //
    // const createDesign = async (info: CreateDesign, template: Template): Promise<void> => {
    //     info.content = template.content.replace("$NAME", info.name).replace("$SUMMARY", info.description || "");
    //     info.contentType = template.contentType;
    //     setCreating(true);
    //     return designsSvc.createDesign(info).then((design: Design) => {
    //         setCreating(false);
    //         setCreateModalOpen(false);
    //         nav.navigateTo(`/designs/${design.designId}/editor`);
    //     }).catch((error: any) => {
    //         console.error(error);
    //         setCreateModalOpen(false);
    //         setCreating(false);
    //         setError(error);
    //     });
    // };

    const onResultsLoaded = (results: DraftsSearchResults): void => {
        setSearching(false);
        setResults(results);
    };

    const isFiltered = (): boolean => {
        return !!criteria.filterValue;
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
            onCreateDraft={() => {}}
            onCriteriaChange={setCriteria} />
    );

    const emptyState = (
        <DraftsPageEmptyState
            isFiltered={isFiltered()}
            onCreateDraft={() => {}} />
    );

    return (
        <PageErrorHandler error={pageError}>
            <PageDataLoader loaders={loaders}>
                <PageSection className="ps_explore-header" variant={PageSectionVariants.light} padding={{ default: "noPadding" }}>
                    <DraftsPageHeader />
                </PageSection>
                <PageSection className="ps_explore-description" variant={PageSectionVariants.light}>
                    <TextContent>
                        Search for APIs and Schemas that are already in Draft status, and therefore can be edited.
                    </TextContent>
                </PageSection>
                <PageSection variant={PageSectionVariants.default} isFilled={true}>
                    <ListWithToolbar toolbar={toolbar}
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
                            onView={() => {}}
                            onSort={(by, order) => {
                                setSortBy(by);
                                setSortOrder(order);
                            }}
                        />
                    </ListWithToolbar>
                </PageSection>
            </PageDataLoader>
        </PageErrorHandler>
    );
};
