import { FunctionComponent, useEffect, useState } from "react";
import "./VersionsTableWithToolbar.css";
import { ListWithToolbar } from "@apicurio/common-ui-components";
import { Paging } from "@models/Paging.ts";
import {
    EmptyState,
    EmptyStateActions,
    EmptyStateBody,
    EmptyStateFooter,
    EmptyStateIcon,
    EmptyStateVariant,
    Title
} from "@patternfly/react-core";
import { ExclamationCircleIcon, PlusCircleIcon } from "@patternfly/react-icons";
import { GroupsService, useGroupsService } from "@services/useGroupsService.ts";
import { VersionsTable, VersionsToolbar } from "@app/pages/artifact";
import {
    ArtifactMetaData,
    SearchedVersion,
    VersionSearchResults,
} from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { VersionFilterCriteria, VersionsSortBy } from "@models/versions";
import { SortOrder } from "@models/SortOrder.ts";

/**
 * Properties
 */
export type VersionsTableWithToolbarProps = {
    artifact: ArtifactMetaData;
    onCreateNewDraft: (version: SearchedVersion) => void;
    onViewVersionAsDraft: (version: SearchedVersion) => void;
    onViewVersionInRegistry: (version: SearchedVersion) => void;
};

/**
 * Models the content of the Version Info tab.
 */
export const VersionsTableWithToolbar: FunctionComponent<VersionsTableWithToolbarProps> = (props: VersionsTableWithToolbarProps) => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isError, setError] = useState<boolean>(false);
    const [paging, setPaging] = useState<Paging>({
        page: 1,
        pageSize: 20
    });
    const [sortBy, setSortBy] = useState<VersionsSortBy>(VersionsSortBy.globalId);
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.asc);
    const [results, setResults] = useState<VersionSearchResults>({
        count: 0,
        versions: []
    });
    const [filterCriteria, setFilterCriteria] = useState<VersionFilterCriteria[]>([]);

    const groups: GroupsService = useGroupsService();

    const refresh = (): void => {
        setLoading(true);

        groups.getArtifactVersions(props.artifact.groupId!, props.artifact.artifactId!, filterCriteria, sortBy, sortOrder, paging).then(sr => {
            setResults(sr);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
            setError(true);
        });
    };

    const onSort = (by: VersionsSortBy, order: SortOrder): void => {
        setSortBy(by);
        setSortOrder(order);
    };

    useEffect(() => {
        refresh();
    }, [props.artifact, paging, sortBy, sortOrder, filterCriteria]);

    const toolbar = (
        <VersionsToolbar
            results={results}
            filterCriteria={filterCriteria}
            onFilterCriteriaChange={setFilterCriteria}
            paging={paging}
            onPageChange={setPaging} />
    );

    const emptyState = (
        <EmptyState variant={EmptyStateVariant.sm}>
            <EmptyStateIcon icon={PlusCircleIcon}/>
            <Title headingLevel="h5" size="lg">No versions found</Title>
            <EmptyStateBody>
                There are currently no versions in this artifact.  Create some versions in the artifact to view them here.
            </EmptyStateBody>
            <EmptyStateFooter>
                <EmptyStateActions>
                </EmptyStateActions>
            </EmptyStateFooter>
        </EmptyState>
    );

    const filteredEmptyState = (
        <EmptyState variant={EmptyStateVariant.sm}>
            <EmptyStateIcon icon={ExclamationCircleIcon}/>
            <Title headingLevel="h5" size="lg">No versions found</Title>
            <EmptyStateBody>
                No versions matched the filter criteria.
            </EmptyStateBody>
            <EmptyStateFooter>
                <EmptyStateActions>
                </EmptyStateActions>
            </EmptyStateFooter>
        </EmptyState>
    );

    return (
        <ListWithToolbar
            toolbar={toolbar}
            emptyState={emptyState}
            filteredEmptyState={filteredEmptyState}
            isLoading={isLoading}
            isError={isError}
            isFiltered={filterCriteria.length > 0}
            isEmpty={results.count === 0}
        >
            <VersionsTable
                artifact={props.artifact}
                versions={results.versions!}
                onSort={onSort}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onCreateNewDraft={props.onCreateNewDraft}
                onViewAsDraft={props.onViewVersionAsDraft}
                onViewInRegistry={props.onViewVersionInRegistry}
            />
        </ListWithToolbar>
    );

};
