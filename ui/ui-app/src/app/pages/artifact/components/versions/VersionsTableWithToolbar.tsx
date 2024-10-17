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
import { PlusCircleIcon } from "@patternfly/react-icons";
import { GroupsService, useGroupsService } from "@services/useGroupsService.ts";
import { VersionsTable, VersionsToolbar } from "@app/pages/artifact";
import {
    ArtifactMetaData,
    SearchedVersion,
    VersionSearchResults,
} from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { VersionsSortBy } from "@models/versions";
import { SortOrder } from "@models/SortOrder.ts";

/**
 * Properties
 */
export type VersionsTableWithToolbarProps = {
    artifact: ArtifactMetaData;
    onCreateNewDraft: (version: SearchedVersion) => void;
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

    const groups: GroupsService = useGroupsService();

    const refresh = (): void => {
        setLoading(true);

        groups.getArtifactVersions(props.artifact.groupId!, props.artifact.artifactId!, sortBy, sortOrder, paging).then(sr => {
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
    }, [props.artifact, paging, sortBy, sortOrder]);

    const toolbar = (
        <VersionsToolbar results={results} paging={paging} onPageChange={setPaging} />
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

    return (
        <ListWithToolbar toolbar={toolbar}
            emptyState={emptyState}
            filteredEmptyState={emptyState}
            isLoading={isLoading}
            isError={isError}
            isFiltered={false}
            isEmpty={results.count === 0}
        >
            <VersionsTable
                artifact={props.artifact}
                versions={results.versions!}
                onSort={onSort}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onCreateNewDraft={props.onCreateNewDraft}
            />
        </ListWithToolbar>
    );

};
