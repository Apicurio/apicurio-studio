import { FunctionComponent, useEffect, useState } from "react";
import "./ArtifactsTableWithToolbar.css";
import { ListWithToolbar } from "@apicurio/common-ui-components";
import { ArtifactsToolbar } from "@app/pages/group/components/artifacts/ArtifactsToolbar.tsx";
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
import { PlusCircleIcon } from "@patternfly/react-icons";
import { ArtifactsTable } from "@app/pages/group/components/artifacts/ArtifactsTable.tsx";
import { GroupsService, useGroupsService } from "@services/useGroupsService.ts";
import {
    ArtifactSearchResults,
    GroupMetaData,
    SearchedArtifact
} from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { SortOrder } from "@models/SortOrder.ts";
import { ArtifactsSortBy } from "@models/artifacts";

/**
 * Properties
 */
export type ArtifactsTableWithToolbarProps = {
    group: GroupMetaData;
    onViewArtifact: (artifact: SearchedArtifact) => void;
};

/**
 * Models the content of the Artifact Info tab.
 */
export const ArtifactsTableWithToolbar: FunctionComponent<ArtifactsTableWithToolbarProps> = (props: ArtifactsTableWithToolbarProps) => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isError, setError] = useState<boolean>(false);
    const [paging, setPaging] = useState<Paging>({
        page: 1,
        pageSize: 20
    });
    const [sortBy, setSortBy] = useState<ArtifactsSortBy>(ArtifactsSortBy.artifactId);
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.asc);
    const [results, setResults] = useState<ArtifactSearchResults>({
        count: 0,
        artifacts: []
    });

    const groups: GroupsService = useGroupsService();

    const refresh = (): void => {
        setLoading(true);

        groups.getGroupArtifacts(props.group.groupId!, sortBy, sortOrder, paging).then(sr => {
            setResults(sr);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
            setError(true);
        });
    };

    useEffect(() => {
        refresh();
    }, [props.group, paging, sortBy, sortOrder]);

    const onSort = (by: ArtifactsSortBy, order: SortOrder): void => {
        setSortBy(by);
        setSortOrder(order);
    };

    const toolbar = (
        <ArtifactsToolbar results={results} paging={paging} onPageChange={setPaging}/>
    );

    const emptyState = (
        <EmptyState variant={EmptyStateVariant.sm}>
            <EmptyStateIcon icon={PlusCircleIcon}/>
            <Title headingLevel="h5" size="lg">No artifacts found</Title>
            <EmptyStateBody>
                There are currently no artifacts in this group.  Create some artifacts in the group to view them here.
            </EmptyStateBody>
            <EmptyStateFooter>
                <EmptyStateActions>
                </EmptyStateActions>
            </EmptyStateFooter>
        </EmptyState>
    );

    return (
        <ListWithToolbar toolbar={toolbar}
            emptyState={emptyState}
            filteredEmptyState={emptyState}
            isLoading={isLoading}
            isError={isError}
            isFiltered={false}
            isEmpty={results.count === 0}
        >
            <ArtifactsTable
                artifacts={results.artifacts!}
                onSort={onSort}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onView={props.onViewArtifact}
            />
        </ListWithToolbar>
    );

};
