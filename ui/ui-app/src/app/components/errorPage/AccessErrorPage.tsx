import React, { FunctionComponent } from "react";
import "./ErrorPage.css";
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
import { LockedIcon } from "@patternfly/react-icons";
import { ErrorPageProps } from "./ErrorPage.tsx";


//export class AccessErrorPage extends ErrorPage {
export const AccessErrorPage: FunctionComponent<ErrorPageProps> = () => {

    const navigateBack = (): void => {
        window.history.back();
    };

    return (
        <React.Fragment>
            <PageSection className="ps_error" variant={PageSectionVariants.light}>
                <div className="centerizer">
                    <EmptyState>
                        <EmptyStateHeader titleText="Access permissions needed" headingLevel="h4" icon={<EmptyStateIcon icon={LockedIcon} />} />
                        <EmptyStateBody>
                            To access this Registry instance, contact your organization administrator.
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
