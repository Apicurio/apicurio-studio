import { FunctionComponent } from "react";
import "./ExplorePageEmptyState.css";
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
import { IfAuth, IfFeature } from "@app/components";
import { If } from "@apicurio/common-ui-components";
import { ExploreType } from "@app/pages/explore/ExploreType.ts";

/**
 * Properties
 */
export type ExplorePageEmptyStateProps = {
    exploreType: ExploreType;
    isFiltered: boolean;
    onCreateArtifact: () => void;
    onCreateGroup: () => void;
    onImport: () => void;
};


/**
 * Models the empty state for the Explore page (when there are no results).
 */
export const ExplorePageEmptyState: FunctionComponent<ExplorePageEmptyStateProps> = (props: ExplorePageEmptyStateProps) => {
    let entitySingular: string;
    let entityPlural: string;
    switch (props.exploreType) {
        case ExploreType.ARTIFACT:
            entitySingular = "artifact";
            entityPlural = "artifacts";
            break;
        case ExploreType.GROUP:
            entitySingular = "group";
            entityPlural = "groups";
            break;
        case ExploreType.VERSION:
            entitySingular = "version";
            entityPlural = "versions";
            break;
    }
    return (
        <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateIcon icon={PlusCircleIcon}/>
            <Title headingLevel="h5" size="lg">No { entityPlural } found</Title>
            <If condition={() => props.isFiltered}>
                <EmptyStateBody>
                    No {entityPlural} match your filter settings.  Change your filter or perhaps Create a new {entitySingular}.
                </EmptyStateBody>
            </If>
            <If condition={() => !props.isFiltered}>
                <EmptyStateBody>
                    There are currently no {entityPlural} in the registry.  Create one or more {entityPlural} to view them here.
                </EmptyStateBody>
            </If>
            <EmptyStateFooter>
                <EmptyStateActions>
                    <IfAuth isDeveloper={true}>
                        <If condition={props.exploreType === ExploreType.ARTIFACT}>
                            <IfFeature feature="readOnly" isNot={true}>
                                <Button className="empty-btn-create" variant="primary"
                                    data-testid="empty-btn-create" onClick={props.onCreateArtifact}>Create artifact</Button>
                            </IfFeature>
                        </If>
                        <If condition={props.exploreType === ExploreType.GROUP}>
                            <IfFeature feature="readOnly" isNot={true}>
                                <Button className="empty-btn-create" variant="primary"
                                    data-testid="empty-btn-create" onClick={props.onCreateGroup}>Create group</Button>
                            </IfFeature>
                        </If>
                    </IfAuth>
                    <IfAuth isAdmin={true}>
                        <IfFeature feature="readOnly" isNot={true}>
                            <Button className="empty-btn-import" variant="secondary"
                                data-testid="empty-btn-import" onClick={props.onImport}>Import from zip</Button>
                        </IfFeature>
                    </IfAuth>
                </EmptyStateActions>
            </EmptyStateFooter>
        </EmptyState>
    );

};
