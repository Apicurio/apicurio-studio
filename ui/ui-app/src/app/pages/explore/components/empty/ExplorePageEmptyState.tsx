import { FunctionComponent } from "react";
import "./ExplorePageEmptyState.css";
import {
    EmptyState,
    EmptyStateBody,
    EmptyStateFooter,
    EmptyStateIcon,
    EmptyStateVariant,
    Title
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { If } from "@apicurio/common-ui-components";
import { ExploreType } from "@app/pages/explore/ExploreType.ts";

/**
 * Properties
 */
export type ExplorePageEmptyStateProps = {
    exploreType: ExploreType;
    isFiltered: boolean;
};


/**
 * Models the empty state for the Explore page (when there are no results).
 */
export const ExplorePageEmptyState: FunctionComponent<ExplorePageEmptyStateProps> = (props: ExplorePageEmptyStateProps) => {
    let entitySingular: string;
    let entityPlural: string;
    switch (props.exploreType) {
        case ExploreType.GROUP:
            entitySingular = "group";
            entityPlural = "groups";
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
            </EmptyStateFooter>
        </EmptyState>
    );
};
