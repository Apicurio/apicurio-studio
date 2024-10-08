import { FunctionComponent } from "react";
import "./DraftsPageEmptyState.css";
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
import { If } from "@apicurio/common-ui-components";

/**
 * Properties
 */
export type DraftsPageEmptyStateProps = {
    isFiltered: boolean;
    onCreateDraft: () => void;
};


/**
 * Models the empty state for the Drafts page (when there are no results).
 */
export const DraftsPageEmptyState: FunctionComponent<DraftsPageEmptyStateProps> = (props: DraftsPageEmptyStateProps) => {
    return (
        <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateIcon icon={PlusCircleIcon}/>
            <Title headingLevel="h5" size="lg">No drafts found</Title>
            <If condition={() => props.isFiltered}>
                <EmptyStateBody>
                    No drafts match your filter settings.  Change your filter or perhaps Create a new draft.
                </EmptyStateBody>
            </If>
            <If condition={() => !props.isFiltered}>
                <EmptyStateBody>
                    There are currently no drafts in the registry.  Create one or more draft to view them here.
                </EmptyStateBody>
            </If>
            <EmptyStateFooter>
                <EmptyStateActions>
                    <Button className="empty-btn-create" variant="primary"
                        data-testid="empty-btn-create" onClick={props.onCreateDraft}>Create draft</Button>
                </EmptyStateActions>
            </EmptyStateFooter>
        </EmptyState>
    );

};
