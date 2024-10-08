import React, { FunctionComponent } from "react";
import "./RateLimitErrorPage.css";
import {
    Button,
    EmptyState,
    EmptyStateActions,
    EmptyStateBody,
    EmptyStateFooter,
    EmptyStateHeader,
    EmptyStateIcon,
    PageSection,
    PageSectionVariants
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { ErrorPageProps } from "./ErrorPage.tsx";


export const RateLimitErrorPage: FunctionComponent<ErrorPageProps> = () => {

    const navigateBack = (): void => {
        window.history.back();
    };

    return (
        <React.Fragment>
            <PageSection className="ps_error" variant={PageSectionVariants.light}>
                <div className="centerizer">
                    <EmptyState>
                        <EmptyStateHeader titleText="Current usage is too high" headingLevel="h4" icon={<EmptyStateIcon icon={ExclamationCircleIcon} />} />
                        <EmptyStateBody>
                            This Registry instance is throttled due to a high request rate. Ensure
                            that existing applications are properly configured to cache the schemas.
                        </EmptyStateBody>
                        <EmptyStateFooter>
                            <EmptyStateActions>
                            </EmptyStateActions>
                            <EmptyStateActions>
                                <Button variant="link"
                                    data-testid="error-btn-back"
                                    onClick={navigateBack}>Return to previous page</Button>
                            </EmptyStateActions>
                        </EmptyStateFooter>
                    </EmptyState>
                </div>
            </PageSection>
        </React.Fragment>
    );

};
