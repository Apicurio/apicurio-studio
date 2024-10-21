import { FunctionComponent, useEffect, useState } from "react";
import "./ExplorePage.css";
import { PageSection, PageSectionVariants, TextContent } from "@patternfly/react-core";
import {
    ExplorePageEmptyState,
    ExplorePageToolbar,
    ExplorePageToolbarFilterCriteria,
    GroupList,
    PageDataLoader,
    PageError,
    PageErrorHandler,
    toPageError
} from "@app/pages";
import { RootPageHeader } from "@app/components";
import { If, ListWithToolbar } from "@apicurio/common-ui-components";
import { ExploreType } from "@app/pages/explore/ExploreType.ts";
import { Paging } from "@models/Paging.ts";
import { FilterBy, SearchFilter, useSearchService } from "@services/useSearchService.ts";
import { GroupSearchResults } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { SortOrder } from "@models/SortOrder.ts";
import { GroupsSortBy } from "@models/groups";

/**
 * Properties
 */
export type ExplorePageProps = object;

const EMPTY_RESULTS: GroupSearchResults = {
    groups: [],
    count: 0
};

const DEFAULT_PAGING: Paging = {
    page: 1,
    pageSize: 10
};

/**
 * The Explore page.
 */
export const ExplorePage: FunctionComponent<ExplorePageProps> = () => {
    const [pageError, setPageError] = useState<PageError>();
    const [loaders, setLoaders] = useState<Promise<any> | Promise<any>[] | undefined>();
    const [exploreType, setExploreType] = useState(ExploreType.GROUP);
    const [criteria, setCriteria] = useState<ExplorePageToolbarFilterCriteria>({
        filterBy: FilterBy.name,
        filterValue: "",
        ascending: true
    });
    const [isSearching, setSearching] = useState<boolean>(false);
    const [paging, setPaging] = useState<Paging>(DEFAULT_PAGING);
    const [results, setResults] = useState<GroupSearchResults>(EMPTY_RESULTS);

    const searchSvc = useSearchService();

    const createLoaders = (): Promise<any> => {
        return search(exploreType, criteria, paging);
    };


    const onResultsLoaded = (results: GroupSearchResults): void => {
        setSearching(false);
        setResults(results);
    };

    const onFilterCriteriaChange = (newCriteria: ExplorePageToolbarFilterCriteria): void => {
        setCriteria(newCriteria);
        search(exploreType, newCriteria, paging);
    };

    const isFiltered = (): boolean => {
        return !!criteria.filterValue;
    };

    const search = async (exploreType: ExploreType, criteria: ExplorePageToolbarFilterCriteria, paging: Paging): Promise<any> => {
        setSearching(true);
        const filters: SearchFilter[] = [
            {
                by: criteria.filterBy,
                value: criteria.filterValue
            }
        ];

        const sortOrder: SortOrder = SortOrder.asc;
        if (exploreType === ExploreType.GROUP) {
            return searchSvc.searchGroups(filters, GroupsSortBy.groupId, sortOrder, paging).then(results => {
                onResultsLoaded(results);
            }).catch(error => {
                setPageError(toPageError(error, "Error searching for groups."));
            });
        }
    };

    const onSetPage = (_event: any, newPage: number, perPage?: number): void => {
        const newPaging: Paging = {
            page: newPage,
            pageSize: perPage ? perPage : paging.pageSize
        };
        setPaging(newPaging);
        search(exploreType, criteria, newPaging);
    };

    const onPerPageSelect = (_event: any, newPerPage: number): void => {
        const newPaging: Paging = {
            page: paging.page,
            pageSize: newPerPage
        };
        setPaging(newPaging);
        search(exploreType, criteria, newPaging);
    };

    const onExploreTypeChange = (newExploreType: ExploreType): void => {
        const newCriteria: ExplorePageToolbarFilterCriteria = {
            filterBy: FilterBy.name,
            filterValue: "",
            ascending: true
        };
        const newPaging: Paging = DEFAULT_PAGING;

        setPaging(newPaging);
        setCriteria(newCriteria);
        setExploreType(newExploreType);

        search(newExploreType, newCriteria, newPaging);
    };

    useEffect(() => {
        setLoaders(createLoaders());
    }, []);

    const toolbar = (
        <ExplorePageToolbar
            exploreType={exploreType}
            results={results}
            criteria={criteria}
            paging={paging}
            onPerPageSelect={onPerPageSelect}
            onSetPage={onSetPage}
            onExploreTypeChange={onExploreTypeChange}
            onCriteriaChange={onFilterCriteriaChange} />
    );

    const emptyState = (
        <ExplorePageEmptyState
            exploreType={exploreType}
            isFiltered={isFiltered()}/>
    );

    return (
        <PageErrorHandler error={pageError}>
            <PageDataLoader loaders={loaders}>
                <PageSection className="ps_explore-header" variant={PageSectionVariants.light} padding={{ default: "noPadding" }}>
                    <RootPageHeader tabKey={1} />
                </PageSection>
                <PageSection className="ps_explore-description" variant={PageSectionVariants.light}>
                    <TextContent>
                        Explore content in the registry by searching for groups or artifacts.
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
                        isEmpty={results.count === 0}>
                        <If condition={exploreType === ExploreType.GROUP}>
                            <GroupList groups={(results as GroupSearchResults).groups!} />
                        </If>
                    </ListWithToolbar>
                </PageSection>
            </PageDataLoader>
        </PageErrorHandler>
    );

};
