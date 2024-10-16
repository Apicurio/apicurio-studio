import { FunctionComponent, useEffect, useState } from "react";
import "./GroupPage.css";
import { Breadcrumb, BreadcrumbItem, PageSection, PageSectionVariants, Tab, Tabs } from "@patternfly/react-core";
import { Link, useLocation, useParams } from "react-router-dom";
import {
    GroupInfoTabContent,
    GroupPageHeader,
    PageDataLoader,
    PageError,
    PageErrorHandler,
    toPageError
} from "@app/pages";

import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";
import { GroupsService, useGroupsService } from "@services/useGroupsService.ts";
import { ArtifactsTabContent } from "@app/pages/group/components/tabs/ArtifactsTabContent.tsx";
import {
    GroupMetaData,
    Rule,
    SearchedArtifact
} from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";


export type GroupPageProps = {
    // No properties
}

/**
 * The group page.
 */
export const GroupPage: FunctionComponent<GroupPageProps> = () => {
    const [pageError, setPageError] = useState<PageError>();
    const [loaders, setLoaders] = useState<Promise<any> | Promise<any>[] | undefined>();
    const [group, setGroup] = useState<GroupMetaData>();
    const [rules, setRules] = useState<Rule[]>([]);

    const appNavigation: AppNavigationService = useAppNavigation();
    const groups: GroupsService = useGroupsService();
    const { groupId }= useParams();
    const location = useLocation();

    let activeTabKey: string = "overview";
    if (location.pathname.indexOf("/artifacts") !== -1) {
        activeTabKey = "artifacts";
    }

    const createLoaders = (): Promise<any>[] => {
        return [
            groups.getGroupMetaData(groupId as string)
                .then(setGroup)
                .catch(error => {
                    setPageError(toPageError(error, "Error loading page data."));
                }),
            groups.getGroupRules(groupId as string)
                .then(setRules)
                .catch(error => {
                    setPageError(toPageError(error, "Error loading page data."));
                }),
        ];
    };

    const handleTabClick = (_event: any, tabIndex: any): void => {
        if (tabIndex === "overview") {
            appNavigation.navigateTo(`/explore/${groupId}`);
        } else {
            appNavigation.navigateTo(`/explore/${groupId}/${tabIndex}`);
        }
    };


    const onViewArtifact = (artifact: SearchedArtifact): void => {
        const groupId: string = encodeURIComponent(group?.groupId || "default");
        const artifactId: string = encodeURIComponent(artifact.artifactId!);
        appNavigation.navigateTo(`/explore/${groupId}/${artifactId}`);
    };

    useEffect(() => {
        setLoaders(createLoaders());
    }, [groupId]);

    const tabs: any[] = [
        <Tab data-testid="info-tab" eventKey="overview" title="Overview" key="overview" tabContentId="tab-info">
            <GroupInfoTabContent
                group={group as GroupMetaData}
                rules={rules}
                onChangeOwner={() => {}}
            />
        </Tab>,
        <Tab data-testid="artifacts-tab" eventKey="artifacts" title="Artifacts" key="artifacts" tabContentId="tab-artifacts">
            <ArtifactsTabContent
                group={group as GroupMetaData}
                onViewArtifact={onViewArtifact}
            />
        </Tab>,
    ];

    const breadcrumbs = (
        <Breadcrumb>
            <BreadcrumbItem><Link to={appNavigation.createLink("/explore")} data-testid="breadcrumb-lnk-explore">Explore</Link></BreadcrumbItem>
            <BreadcrumbItem isActive={true}>{ groupId as string }</BreadcrumbItem>
        </Breadcrumb>
    );

    return (
        <PageErrorHandler error={pageError}>
            <PageDataLoader loaders={loaders}>
                <PageSection className="ps_artifact-version-header" variant={PageSectionVariants.light}>
                    <GroupPageHeader title={groupId as string}
                        groupId={groupId as string} />
                </PageSection>
                <PageSection variant={PageSectionVariants.light} isFilled={true} padding={{ default: "noPadding" }} className="artifact-details-main">
                    <Tabs className="artifact-page-tabs"
                        id="artifact-page-tabs"
                        unmountOnExit={true}
                        isFilled={false}
                        activeKey={activeTabKey}
                        children={tabs}
                        onSelect={handleTabClick}
                    />
                </PageSection>
            </PageDataLoader>
        </PageErrorHandler>
    );

};
