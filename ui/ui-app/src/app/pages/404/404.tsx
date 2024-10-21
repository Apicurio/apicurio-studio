import { FunctionComponent } from "react";
import {
    Button,
    EmptyState,
    EmptyStateActions,
    EmptyStateBody,
    EmptyStateFooter,
    EmptyStateHeader,
    EmptyStateIcon,
    EmptyStateVariant,
    PageSection,
    PageSectionVariants
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";


/**
 * Properties
 */
export type NotFoundPageProps = object;

/**
 * The "not found" page.
 */
export const NotFoundPage: FunctionComponent<NotFoundPageProps> = () => {
    const appNavigation: AppNavigationService = useAppNavigation();

    return  (
        <PageSection className="ps_rules-header" variant={PageSectionVariants.light}>
            <EmptyState variant={EmptyStateVariant.full}>
                <EmptyStateHeader titleText="404 Error: page not found" headingLevel="h4" icon={<EmptyStateIcon icon={ExclamationCircleIcon} />} />
                <EmptyStateBody>
                    This page couldn't be found.  If you think this is a bug, please report the issue.
                </EmptyStateBody>
                <EmptyStateFooter>
                    <EmptyStateActions>
                        <Button variant="primary"
                            data-testid="error-btn-artifacts"
                            onClick={() => appNavigation.navigateTo("/explore")}>Show all artifacts</Button>
                    </EmptyStateActions>
                </EmptyStateFooter>
            </EmptyState>
        </PageSection>
    );

};
