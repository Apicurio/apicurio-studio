import React, { FunctionComponent, useEffect, useState } from "react";
import "./RulesPage.css";
import { PageSection, PageSectionVariants, TextContent } from "@patternfly/react-core";
import { RootPageHeader, RuleList, RuleListType } from "@app/components";
import { PageDataLoader, PageError, PageErrorHandler, toPageError } from "@app/pages";
import { Rule, RuleType } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import {AdminService, useAdminService} from "@services/useAdminService.ts";


export type RulesPageProps = {
    // No properties.
}

/**
 * The global rules page.
 */
export const RulesPage: FunctionComponent<RulesPageProps> = () => {
    const [pageError, setPageError] = useState<PageError>();
    const [loaders, setLoaders] = useState<Promise<any> | Promise<any>[] | undefined>();
    const [rules, setRules] = useState<Rule[]>([]);

    const admin: AdminService = useAdminService();

    const createLoaders = (): Promise<any> => {
        return admin.getRules().then(setRules).catch(error => {
            setPageError(toPageError(error, "Error loading rules."));
        });
    };

    useEffect(() => {
        setLoaders(createLoaders());
    }, []);

    return (
        <PageErrorHandler error={pageError}>
            <PageDataLoader loaders={loaders}>
                <PageSection className="ps_rules-header" variant={PageSectionVariants.light} padding={{ default: "noPadding" }}>
                    <RootPageHeader tabKey={1} />
                </PageSection>
                <PageSection className="ps_rules-description" variant={PageSectionVariants.light}>
                    <TextContent>
                        View the global rules for artifact content for this registry. Each global rule can be individually enabled, configured, and disabled.
                    </TextContent>
                </PageSection>
                <PageSection variant={PageSectionVariants.default} isFilled={true}>
                    <React.Fragment>
                        <RuleList
                            type={RuleListType.Global}
                            rules={rules} />
                    </React.Fragment>
                </PageSection>
            </PageDataLoader>
        </PageErrorHandler>
    );

};
