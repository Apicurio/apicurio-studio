import { FunctionComponent, useEffect, useState } from "react";
import "./DraftPage.css";
import { Breadcrumb, BreadcrumbItem, PageSection, PageSectionVariants, TextContent } from "@patternfly/react-core";
import { PageDataLoader, PageError, PageErrorHandler } from "@app/pages";
import { DraftsService, useDraftsService } from "@services/useDraftsService.ts";
import { RootPageHeader } from "@app/components";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";
import { Link, useParams } from "react-router-dom";


export type DraftPageProps = Record<string, never>;

export const DraftPage: FunctionComponent<DraftPageProps> = () => {
    const [ pageError, setPageError ] = useState<PageError>();
    const [ loaders, setLoaders ] = useState<Promise<any> | Promise<any>[] | undefined>();
    const [ draft, setDraft ] = useState();

    const { groupId, draftId, version } = useParams();

    const draftsService: DraftsService = useDraftsService();
    const appNavigation: AppNavigationService = useAppNavigation();

    const createLoaders = (): Promise<any>[] => {
        return [];
    };

    useEffect(() => {
        setLoaders(createLoaders());
    }, []);

    const breadcrumbs = (
        <Breadcrumb>
            <BreadcrumbItem><Link to={appNavigation.createLink("/drafts")} data-testid="breadcrumb-lnk-drafts">Drafts</Link></BreadcrumbItem>
            <BreadcrumbItem>{ groupId }</BreadcrumbItem>
            <BreadcrumbItem>{ draftId }</BreadcrumbItem>
            <BreadcrumbItem isActive={true}>{ version }</BreadcrumbItem>
        </Breadcrumb>
    );

    return (
        <PageErrorHandler error={pageError}>
            <PageDataLoader loaders={loaders}>
                <PageSection className="ps_draft-header" variant={PageSectionVariants.light} padding={{ default: "noPadding" }}>
                    <RootPageHeader tabKey={0} />
                </PageSection>
                <PageSection className="ps_header-breadcrumbs" variant={PageSectionVariants.light} children={breadcrumbs} />
                <PageSection className="ps_draft-description" variant={PageSectionVariants.light}>
                    <TextContent>
                        Manage this draft by viewing its metadata, managing its comments, and editing its content.
                    </TextContent>
                </PageSection>
                <PageSection variant={PageSectionVariants.default} isFilled={true}>
                    PAGE CONTENT GOES HERE
                </PageSection>
            </PageDataLoader>
        </PageErrorHandler>
    );
};
