import { FunctionComponent, useEffect, useState } from "react";
import "./ArtifactPage.css";
import {
    Breadcrumb,
    BreadcrumbItem,
    Card,
    CardBody,
    CardTitle,
    Divider,
    Flex,
    FlexItem,
    PageSection,
    PageSectionVariants
} from "@patternfly/react-core";
import { Link, useParams } from "react-router-dom";
import { PageDataLoader, PageError, PageErrorHandler, toPageError, VersionsTableWithToolbar } from "@app/pages";

import { GroupsService, useGroupsService } from "@services/useGroupsService.ts";
import { ArtifactInfo, ArtifactPageHeader } from "@app/pages/artifact/components";
import { ArtifactMetaData } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";
import { ArtifactTypeIcon, RootPageHeader } from "@app/components";


export type ArtifactPageProps = object

/**
 * The artifact details page.
 */
export const ArtifactPage: FunctionComponent<ArtifactPageProps> = () => {
    const [pageError, setPageError] = useState<PageError>();
    const [loaders, setLoaders] = useState<Promise<any> | Promise<any>[] | undefined>();
    const [artifact, setArtifact] = useState<ArtifactMetaData>();

    const appNavigation: AppNavigationService = useAppNavigation();
    const groups: GroupsService = useGroupsService();
    const { groupId, artifactId } = useParams();

    const createLoaders = (): Promise<any>[] => {
        const gid: string = groupId as string || "default";
        return [
            groups.getArtifactMetaData(gid, artifactId as string)
                .then(setArtifact)
                .catch(error => {
                    setPageError(toPageError(error, "Error loading page data."));
                }),
        ];
    };

    useEffect(() => {
        setLoaders(createLoaders());
    }, [groupId, artifactId]);

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
                <PageSection className="ps_explore-header" variant={PageSectionVariants.light} padding={{ default: "noPadding" }}>
                    <RootPageHeader tabKey={1} />
                </PageSection>
                <PageSection className="ps_header-breadcrumbs" variant={PageSectionVariants.light} children={breadcrumbs} />
                <PageSection className="ps_artifact-header" variant={PageSectionVariants.light}>
                    <ArtifactPageHeader
                        artifact={artifact as ArtifactMetaData} />
                </PageSection>
                <PageSection variant={PageSectionVariants.default} isFilled={true}>
                    <div className="artifact-details-main-content">
                        <div className="artifact-basics">
                            <Card>
                                <CardTitle>
                                    <div className="title-and-type">
                                        <Flex>
                                            <FlexItem className="type"><ArtifactTypeIcon type={artifact?.artifactType || "JSON"} isShowIcon={true} isShowLabel={false} /></FlexItem>
                                            <FlexItem className="title">Artifact metadata</FlexItem>
                                        </Flex>
                                    </div>
                                </CardTitle>
                                <Divider/>
                                <CardBody>
                                    <ArtifactInfo artifact={artifact!} />
                                </CardBody>
                            </Card>
                        </div>
                        <div className="versions-toolbar-and-table">
                            <Card>
                                <CardTitle>
                                    <div className="title-and-type">
                                        <Flex>
                                            <FlexItem className="title">All versions</FlexItem>
                                        </Flex>
                                    </div>
                                </CardTitle>
                                <Divider/>
                                <CardBody>
                                    <VersionsTableWithToolbar
                                        artifact={artifact!}
                                        onCreateNewDraft={() => {}} />
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </PageSection>
            </PageDataLoader>
        </PageErrorHandler>
    );

};
