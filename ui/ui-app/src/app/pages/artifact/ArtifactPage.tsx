import { FunctionComponent, useEffect, useState } from "react";
import "./ArtifactPage.css";
import { Breadcrumb, BreadcrumbItem, PageSection, PageSectionVariants, Tab, Tabs } from "@patternfly/react-core";
import { Link, useLocation, useParams } from "react-router-dom";
import { PageDataLoader, PageError, PageErrorHandler, toPageError } from "@app/pages";

import { GroupsService, useGroupsService } from "@services/useGroupsService.ts";
import {
    ArtifactInfoTabContent,
    ArtifactPageHeader,
    BranchesTabContent,
    VersionsTabContent
} from "@app/pages/artifact/components";
import {
    ArtifactMetaData,
    Rule,
    SearchedBranch,
    SearchedVersion
} from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import {AppNavigationService, useAppNavigation} from "@services/useAppNavigation.ts";


export type ArtifactPageProps = {
    // No properties
}

/**
 * The artifact version page.
 */
export const ArtifactPage: FunctionComponent<ArtifactPageProps> = () => {
    const [pageError, setPageError] = useState<PageError>();
    const [loaders, setLoaders] = useState<Promise<any> | Promise<any>[] | undefined>();
    const [artifact, setArtifact] = useState<ArtifactMetaData>();
    const [pleaseWaitMessage, setPleaseWaitMessage] = useState("");
    const [rules, setRules] = useState<Rule[]>([]);

    const appNavigation: AppNavigationService = useAppNavigation();
    const groups: GroupsService = useGroupsService();
    const { groupId, artifactId }= useParams();
    const location = useLocation();

    let activeTabKey: string = "overview";
    if (location.pathname.indexOf("/versions") !== -1) {
        activeTabKey = "versions";
    } else if (location.pathname.indexOf("/branches") !== -1) {
        activeTabKey = "branches";
    }

    const createLoaders = (): Promise<any>[] => {
        let gid: string|null = groupId as string;
        if (gid == "default") {
            gid = null;
        }
        return [
            groups.getArtifactMetaData(gid, artifactId as string)
                .then(setArtifact)
                .catch(error => {
                    setPageError(toPageError(error, "Error loading page data."));
                }),
            groups.getArtifactRules(gid, artifactId as string)
                .then(setRules)
                .catch(error => {
                    setPageError(toPageError(error, "Error loading page data."));
                }),
        ];
    };

    const handleTabClick = (_event: any, tabIndex: any): void => {
        if (tabIndex === "overview") {
            appNavigation.navigateTo(`/explore/${groupId}/${artifactId}`);
        } else {
            appNavigation.navigateTo(`/explore/${groupId}/${artifactId}/${tabIndex}`);
        }
    };


    const onViewVersion = (version: SearchedVersion): void => {
        const groupId: string = encodeURIComponent(artifact?.groupId || "default");
        const artifactId: string = encodeURIComponent(artifact?.artifactId || "");
        const ver: string = encodeURIComponent(version.version!);
        appNavigation.navigateTo(`/explore/${groupId}/${artifactId}/versions/${ver}`);
    };

    const onViewBranch = (branch: SearchedBranch): void => {
        const groupId: string = encodeURIComponent(artifact?.groupId || "default");
        const artifactId: string = encodeURIComponent(artifact?.artifactId || "");
        const branchId: string = encodeURIComponent(branch.branchId!);
        appNavigation.navigateTo(`/explore/${groupId}/${artifactId}/branches/${branchId}`);
    };

    useEffect(() => {
        setLoaders(createLoaders());
    }, [groupId, artifactId]);

    const tabs: any[] = [
        <Tab data-testid="info-tab" eventKey="overview" title="Overview" key="overview" tabContentId="tab-info">
            <ArtifactInfoTabContent
                artifact={artifact as ArtifactMetaData}
                rules={rules}
            />
        </Tab>,
        <Tab data-testid="versions-tab" eventKey="versions" title="Versions" key="versions" tabContentId="tab-versions">
            <VersionsTabContent
                artifact={artifact as ArtifactMetaData}
                onViewVersion={onViewVersion}
            />
        </Tab>,
        <Tab data-testid="branches-tab" eventKey="branches" title="Branches" key="branches" tabContentId="tab-branches">
            <BranchesTabContent
                artifact={artifact as ArtifactMetaData}
                onViewBranch={onViewBranch}
            />
        </Tab>,
    ];

    const gid: string = groupId || "default";
    const hasGroup: boolean = gid != "default";
    let breadcrumbs = (
        <Breadcrumb>
            <BreadcrumbItem><Link to={appNavigation.createLink("/explore")} data-testid="breadcrumb-lnk-explore">Explore</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={appNavigation.createLink(`/explore/${ encodeURIComponent(gid) }/artifacts`)}
                data-testid="breadcrumb-lnk-group">{ gid }</Link></BreadcrumbItem>
            <BreadcrumbItem isActive={true}>{ artifactId as string }</BreadcrumbItem>
        </Breadcrumb>
    );
    if (!hasGroup) {
        breadcrumbs = (
            <Breadcrumb>
                <BreadcrumbItem><Link to="/explore" data-testid="breadcrumb-lnk-explore">Explore</Link></BreadcrumbItem>
                <BreadcrumbItem isActive={true}>{ artifactId as string }</BreadcrumbItem>
            </Breadcrumb>
        );
    }

    return (
        <PageErrorHandler error={pageError}>
            <PageDataLoader loaders={loaders}>
                <PageSection className="ps_artifact-version-header" variant={PageSectionVariants.light}>
                    <ArtifactPageHeader
                        artifact={artifact as ArtifactMetaData} />
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
