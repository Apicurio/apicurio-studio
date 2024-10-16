import { FunctionComponent, useEffect, useState } from "react";
import "./ExplorePage.css";
import { PageSection, PageSectionVariants, TextContent } from "@patternfly/react-core";
import {
    ArtifactList,
    ExplorePageEmptyState,
    ExplorePageToolbar,
    ExplorePageToolbarFilterCriteria,
    GroupList,
    ImportModal,
    PageDataLoader,
    PageError,
    PageErrorHandler,
    toPageError
} from "@app/pages";
import { CreateArtifactModal, CreateGroupModal, InvalidContentModal, RootPageHeader } from "@app/components";
import { If, ListWithToolbar, PleaseWaitModal, ProgressModal } from "@apicurio/common-ui-components";
import { useGroupsService } from "@services/useGroupsService.ts";
import { AppNavigation, useAppNavigation } from "@services/useAppNavigation.ts";
import { useAdminService } from "@services/useAdminService.ts";
import { useLoggerService } from "@services/useLoggerService.ts";
import { ExploreType } from "@app/pages/explore/ExploreType.ts";
import { Paging } from "@models/paging.model.ts";
import { FilterBy, SearchFilter, useSearchService } from "@services/useSearchService.ts";
import {
    ArtifactSearchResults,
    ArtifactSortByObject,
    CreateArtifact,
    CreateGroup,
    GroupSearchResults,
    GroupSortByObject,
    RuleViolationProblemDetails,
    SortOrder,
    SortOrderObject
} from "@sdk/lib/generated-client/models";

/**
 * Properties
 */
export type ExplorePageProps = {
    // No properties.
}

const EMPTY_RESULTS: ArtifactSearchResults = {
    artifacts: [],
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
    const [exploreType, setExploreType] = useState(ExploreType.ARTIFACT);
    const [criteria, setCriteria] = useState<ExplorePageToolbarFilterCriteria>({
        filterBy: FilterBy.name,
        filterValue: "",
        ascending: true
    });
    const [isCreateArtifactModalOpen, setCreateArtifactModalOpen] = useState<boolean>(false);
    const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState<boolean>(false);
    const [isImportModalOpen, setImportModalOpen] = useState<boolean>(false);
    const [isInvalidContentModalOpen, setInvalidContentModalOpen] = useState<boolean>(false);
    const [isPleaseWaitModalOpen, setPleaseWaitModalOpen] = useState<boolean>(false);
    const [pleaseWaitMessage, setPleaseWaitMessage] = useState("");
    const [isSearching, setSearching] = useState<boolean>(false);
    const [isImporting, setImporting] = useState(false);
    const [paging, setPaging] = useState<Paging>(DEFAULT_PAGING);
    const [results, setResults] = useState<ArtifactSearchResults | GroupSearchResults>(EMPTY_RESULTS);
    const [invalidContentError, setInvalidContentError] = useState<RuleViolationProblemDetails>();
    const [importProgress, setImportProgress] = useState(0);

    const appNavigation: AppNavigation = useAppNavigation();
    const admin = useAdminService();
    const searchSvc = useSearchService();
    const groups = useGroupsService();
    const logger = useLoggerService();

    const createLoaders = (): Promise<any> => {
        return search(exploreType, criteria, paging);
    };

    const onCreateGroup = (): void => {
        setCreateGroupModalOpen(true);
    };

    const onCreateArtifact = (): void => {
        setCreateArtifactModalOpen(true);
    };

    const onImportArtifacts = (): void => {
        setImportModalOpen(true);
    };

    const onExportArtifacts = (): void => {
        admin.exportAs("all-artifacts.zip").then(dref => {
            const link = document.createElement("a");
            link.href = dref.href || "";
            link.download = "all-artifacts.zip";
            link.click();
        }).catch(error => {
            setPageError(toPageError(error, "Failed to export artifacts"));
        });
    };

    const onCreateArtifactModalClose = (): void => {
        setCreateArtifactModalOpen(false);
    };

    const onImportModalClose = (): void => {
        setImportModalOpen(false);
    };

    const onResultsLoaded = (results: ArtifactSearchResults | GroupSearchResults): void => {
        setSearching(false);
        setResults(results);
    };

    const doImport = (file: File | undefined): void => {
        setImporting(true);
        setImportProgress(0);
        setImportModalOpen(false);

        if (file != null) {
            admin.importFrom(file, (event: any) => {
                let progress: number = 0;
                if (event.lengthComputable) {
                    progress = Math.round(100 * (event.loaded / event.total));
                }
                setImportProgress(progress);
            }).then(() => {
                setTimeout(() => {
                    setImporting(false);
                    setImportProgress(100);
                    setImportModalOpen(false);
                    search(exploreType, criteria, paging);
                }, 1500);
            }).catch(error => {
                setPageError(toPageError(error, "Error importing multiple artifacts"));
            });
        }
    };

    const doCreateArtifact = (groupId: string | undefined, data: CreateArtifact): void => {
        onCreateArtifactModalClose();
        pleaseWait(true);

        if (data !== null) {
            groups.createArtifact(groupId || "default", data).then(response => {
                const groupId: string = response.artifact!.groupId || "default";
                const artifactLocation: string = `/explore/${ encodeURIComponent(groupId) }/${ encodeURIComponent(response.artifact!.artifactId!) }`;
                logger.info("[ExplorePage] Artifact successfully created.  Redirecting to details: ", artifactLocation);
                appNavigation.navigateTo(artifactLocation);
            }).catch( error => {
                pleaseWait(false);
                if (error && (error.status === 400 || error.status === 409)) {
                    handleInvalidContentError(error);
                } else {
                    setPageError(toPageError(error, "Error creating artifact."));
                }
            });
        }
    };

    const doCreateGroup = (data: CreateGroup): void => {
        setCreateGroupModalOpen(false);
        pleaseWait(true);

        groups.createGroup(data).then(response => {
            const groupId: string = response.groupId!;
            const groupLocation: string = `/explore/${ encodeURIComponent(groupId) }`;
            logger.info("[ExplorePage] Group successfully created.  Redirecting to details page: ", groupLocation);
            appNavigation.navigateTo(groupLocation);
        }).catch( error => {
            pleaseWait(false);
            if (error && (error.status === 400 || error.status === 409)) {
                handleInvalidContentError(error);
            } else {
                setPageError(toPageError(error, "Error creating group."));
            }
        });
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

        const sortOrder: SortOrder = criteria.ascending ? SortOrderObject.Asc : SortOrderObject.Desc;
        if (exploreType === ExploreType.ARTIFACT) {
            return searchSvc.searchArtifacts(filters, ArtifactSortByObject.Name, sortOrder, paging).then(results => {
                onResultsLoaded(results);
            }).catch(error => {
                setPageError(toPageError(error, "Error searching for artifacts."));
            });
        } else if (exploreType === ExploreType.GROUP) {
            return searchSvc.searchGroups(filters, GroupSortByObject.GroupId, sortOrder, paging).then(results => {
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

    const closeInvalidContentModal = (): void => {
        setInvalidContentModalOpen(false);
    };

    const pleaseWait = (isOpen: boolean, message: string = ""): void => {
        setPleaseWaitModalOpen(isOpen);
        setPleaseWaitMessage(message);
    };

    const handleInvalidContentError = (error: any): void => {
        logger.info("[ExplorePage] Invalid content error:", error);
        setInvalidContentError(error);
        setInvalidContentModalOpen(true);
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
            onCreateArtifact={onCreateArtifact}
            onCreateGroup={onCreateGroup}
            onExport={onExportArtifacts}
            onImport={onImportArtifacts}
            onCriteriaChange={onFilterCriteriaChange} />
    );

    const emptyState = (
        <ExplorePageEmptyState
            exploreType={exploreType}
            onCreateArtifact={onCreateArtifact}
            onCreateGroup={onCreateGroup}
            onImport={onImportArtifacts}
            isFiltered={isFiltered()}/>
    );

    return (
        <PageErrorHandler error={pageError}>
            <PageDataLoader loaders={loaders}>
                <PageSection className="ps_explore-header" variant={PageSectionVariants.light} padding={{ default: "noPadding" }}>
                    <RootPageHeader tabKey={0} />
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
                        <If condition={exploreType === ExploreType.ARTIFACT}>
                            <ArtifactList artifacts={(results as ArtifactSearchResults).artifacts!} />
                        </If>
                        <If condition={exploreType === ExploreType.GROUP}>
                            <GroupList groups={(results as GroupSearchResults).groups!} />
                        </If>
                    </ListWithToolbar>
                </PageSection>
            </PageDataLoader>
            <CreateArtifactModal
                isOpen={isCreateArtifactModalOpen}
                onClose={onCreateArtifactModalClose}
                onCreate={doCreateArtifact} />
            <CreateGroupModal
                isOpen={isCreateGroupModalOpen}
                onClose={() => setCreateGroupModalOpen(false)}
                onCreate={doCreateGroup} />
            <InvalidContentModal
                error={invalidContentError}
                isOpen={isInvalidContentModalOpen}
                onClose={closeInvalidContentModal} />
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={onImportModalClose}
                onImport={doImport} />
            <PleaseWaitModal
                message={pleaseWaitMessage}
                isOpen={isPleaseWaitModalOpen} />
            <ProgressModal message="Importing"
                title="Import from .ZIP"
                isCloseable={true}
                progress={importProgress}
                onClose={() => setImporting(false)}
                isOpen={isImporting} />
        </PageErrorHandler>
    );

};
