import { FunctionComponent } from "react";
import {
    Card,
    CardBody,
    ClipboardCopy,
    EmptyState,
    EmptyStateBody,
    EmptyStateHeader,
    EmptyStateIcon,
    EmptyStateVariant
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";


export const ImmutableWarning: FunctionComponent<object> = () => {
    return (
        <Card>
            <CardBody>
                <EmptyState variant={EmptyStateVariant.lg}>
                    <EmptyStateHeader titleText="Error: Registry configuration" headingLevel="h4" icon={<EmptyStateIcon icon={ExclamationCircleIcon} />} />
                    <EmptyStateBody>
                        <p style={{ marginBottom: "20px" }}>
                            Studio failed to load because the Registry application is not properly configured. In order
                            for Studio to work, the Registry application must have the "draft mutability" option enabled. This
                            option must be enabled when installing/deploying Registry.
                        </p>
                        <p style={{ marginBottom: "25px" }}>
                            The following option should be set to <code>true</code>:
                        </p>
                        <ClipboardCopy
                            hoverTip="Copy"
                            clickTip="Copied"
                            variant="inline-compact"
                            isCode={true}
                            style={{  padding: "8px", border: "1px solid #ccc" }}
                        >apicurio.rest.mutability.artifact-version-content.enabled</ClipboardCopy>
                    </EmptyStateBody>
                </EmptyState>
            </CardBody>
        </Card>
    );
};
