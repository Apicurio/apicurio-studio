import { FunctionComponent } from "react";
import {
    Button, Card, CardBody,
    EmptyState,
    EmptyStateActions,
    EmptyStateBody,
    EmptyStateFooter,
    EmptyStateHeader,
    EmptyStateIcon
} from "@patternfly/react-core";
import { AddCircleOIcon } from "@patternfly/react-icons";
import { ImportDropdown, ImportFrom } from "@app/pages";

/**
 * Properties
 */
export type DesignsEmptyStateProps = {
    onCreate: () => void;
    onImport: (from: ImportFrom) => void;
};

/**
 * The empty state UI shown to the user when no designs are available, either due to
 * filtering or because no designs have been created yet.
 */
export const DesignsEmptyState: FunctionComponent<DesignsEmptyStateProps> = ({ onCreate, onImport }: DesignsEmptyStateProps) => {
    return (
        <Card>
            <CardBody>
                <EmptyState>
                    <EmptyStateHeader titleText="No designs" headingLevel="h4" icon={<EmptyStateIcon icon={AddCircleOIcon} />} />
                    <EmptyStateBody>
                        To get started, create or import a design.
                    </EmptyStateBody>
                    <EmptyStateFooter>
                        <EmptyStateActions>
                            <Button data-testid="btn-create-design" variant="primary" onClick={onCreate}>Create design</Button>
                        </EmptyStateActions>
                        <EmptyStateActions>
                            <ImportDropdown onImport={onImport} />
                        </EmptyStateActions>
                    </EmptyStateFooter>
                </EmptyState>
            </CardBody>
        </Card>
    );
};
