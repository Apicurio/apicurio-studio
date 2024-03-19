import { FunctionComponent } from "react";
import {
    Bullseye,
    Button,
    EmptyState,
    EmptyStateActions,
    EmptyStateBody,
    EmptyStateFooter,
    EmptyStateHeader,
    EmptyStateIcon
} from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";

/**
 * Properties
 */
export type DesignsEmptyStateFilteredProps = {
    onClear: () => void;
};

/**
 * The empty state UI shown to the user when no designs are available, either due to
 * filtering or because no designs have been created yet.
 */
export const DesignsEmptyStateFiltered: FunctionComponent<DesignsEmptyStateFilteredProps> = ({ onClear }: DesignsEmptyStateFilteredProps) => {
    return (
        <Bullseye style={{ backgroundColor: "white" }}>
            <EmptyState>
                <EmptyStateHeader titleText="No matching designs" headingLevel="h4" icon={<EmptyStateIcon icon={SearchIcon} />} />
                <EmptyStateBody>
                    Adjust your filters and try again.
                </EmptyStateBody>
                <EmptyStateFooter>
                    <EmptyStateActions>
                        <Button data-testid="btn-clear-all-filters" variant="link" onClick={onClear}>Clear all filters</Button>
                    </EmptyStateActions>
                </EmptyStateFooter>
            </EmptyState>
        </Bullseye>
    );
};
