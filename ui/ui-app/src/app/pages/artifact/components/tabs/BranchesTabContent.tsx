import { FunctionComponent, useEffect, useState } from "react";
import "./BranchesTabContent.css";
import { ListWithToolbar } from "@apicurio/common-ui-components";
import { Paging } from "@models/Paging.ts";
import {
    Button,
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
import { ArtifactMetaData, BranchSearchResults, SearchedBranch, } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { BranchesTable, BranchesTabToolbar } from "@app/pages/artifact";

/**
 * Properties
 */
export type BranchesTabContentProps = {
    artifact: ArtifactMetaData;
    onCreateBranch: () => void;
    onViewBranch: (version: SearchedBranch) => void;
    onDeleteBranch: (version: SearchedBranch, deleteSuccessCallback: () => void) => void;
};

/**
 * Models the content of the Artifact branches tab.
 */
export const BranchesTabContent: FunctionComponent<BranchesTabContentProps> = (props: BranchesTabContentProps) => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isError, setError] = useState<boolean>(false);
    const [paging, setPaging] = useState<Paging>({
        page: 1,
        pageSize: 20
    });
    const [results, setResults] = useState<BranchSearchResults>({
        count: 0,
        branches: []
    });

    const groups: GroupsService = useGroupsService();

    const refresh = (): void => {
        setLoading(true);

        groups.getArtifactBranches(props.artifact.groupId!, props.artifact.artifactId!, paging).then(sr => {
            setResults(sr);
            setLoading(false);
        }).catch(error => {
            setLoading(false);
            setError(true);
        });
    };

    useEffect(() => {
        refresh();
    }, [props.artifact, paging]);

    const toolbar = (
        <BranchesTabToolbar results={results} paging={paging} onPageChange={setPaging}/>
    );

    const emptyState = (
        <EmptyState variant={EmptyStateVariant.sm}>
            <EmptyStateIcon icon={PlusCircleIcon}/>
            <Title headingLevel="h5" size="lg">No branches found</Title>
            <EmptyStateBody>
                There are currently no branches in this artifact.  Create some branches in the artifact to view them here.
            </EmptyStateBody>
            <EmptyStateFooter>
                <EmptyStateActions>
                </EmptyStateActions>
            </EmptyStateFooter>
        </EmptyState>
    );

    return (
        <div className="branches-tab-content">
            <div className="branches-toolbar-and-table">
                <ListWithToolbar toolbar={toolbar}
                    emptyState={emptyState}
                    filteredEmptyState={emptyState}
                    isLoading={isLoading}
                    isError={isError}
                    isFiltered={false}
                    isEmpty={results.count === 0}
                >
                    <BranchesTable
                        artifact={props.artifact}
                        branches={results.branches!}
                        onView={props.onViewBranch}
                    />
                </ListWithToolbar>
            </div>
        </div>
    );

};
