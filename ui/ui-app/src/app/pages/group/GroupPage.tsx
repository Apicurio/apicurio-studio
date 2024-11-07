import { FunctionComponent, useEffect, useState } from "react";
import "./GroupPage.css";
import {
    Breadcrumb, BreadcrumbItem,
    Card,
    CardBody,
    CardTitle,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Divider,
    Flex,
    FlexItem,
    Icon,
    PageSection,
    PageSectionVariants
} from "@patternfly/react-core";
import { Link, useParams } from "react-router-dom";
import {
    ArtifactsTableWithToolbar,
    GroupPageHeader,
    PageDataLoader,
    PageError,
    PageErrorHandler,
    toPageError
} from "@app/pages";

import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";
import { GroupsService, useGroupsService } from "@services/useGroupsService.ts";
import { GroupMetaData, SearchedArtifact } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { RootPageHeader } from "@app/components";
import { OutlinedFolderIcon } from "@patternfly/react-icons";
import { FromNow, If } from "@apicurio/common-ui-components";
import { isStringEmptyOrUndefined } from "@utils/string.utils.ts";
import { ConfigService, useConfigService } from "@services/useConfigService.ts";


export type GroupPageProps = object;

/**
 * The group page.
 */
export const GroupPage: FunctionComponent<GroupPageProps> = () => {
    const [pageError, setPageError] = useState<PageError>();
    const [loaders, setLoaders] = useState<Promise<any> | Promise<any>[] | undefined>();
    const [group, setGroup] = useState<GroupMetaData>();

    const appNavigation: AppNavigationService = useAppNavigation();
    const config: ConfigService = useConfigService();
    const groups: GroupsService = useGroupsService();
    const { groupId } = useParams();


    const createLoaders = (): Promise<any>[] => {
        return [
            groups.getGroupMetaData(groupId as string)
                .then(setGroup)
                .catch(error => {
                    setPageError(toPageError(error, "Error loading page data."));
                }),
        ];
    };

    const onViewArtifact = (artifact: SearchedArtifact): void => {
        const groupId: string = encodeURIComponent(group?.groupId || "default");
        const artifactId: string = encodeURIComponent(artifact.artifactId!);
        appNavigation.navigateTo(`/explore/${groupId}/${artifactId}`);
    };

    const onViewArtifactInRegistry = (artifact: SearchedArtifact): void => {
        const registryBaseUrl: string = config.getApicurioStudioConfig().links.registry!;
        const groupId: string = encodeURIComponent(artifact.groupId || "default");
        const artifactId: string = encodeURIComponent(artifact.artifactId!);

        const registryUrl: string = `${registryBaseUrl}/explore/${groupId}/${artifactId}`;
        window.location.href = registryUrl;
    };

    useEffect(() => {
        setLoaders(createLoaders());
    }, [groupId]);

    const breadcrumbs = (
        <Breadcrumb>
            <BreadcrumbItem><Link to={appNavigation.createLink("/explore")} data-testid="breadcrumb-lnk-explore">Explore</Link></BreadcrumbItem>
            <BreadcrumbItem isActive={true}>{ groupId as string }</BreadcrumbItem>
        </Breadcrumb>
    );

    return (
        <PageErrorHandler error={pageError}>
            <PageDataLoader loaders={loaders}>
                <PageSection className="ps_explore-header" variant={PageSectionVariants.light} padding={{ default: "noPadding" }}>
                    <RootPageHeader tabKey={1} />
                </PageSection>
                <PageSection className="ps_header-breadcrumbs" variant={PageSectionVariants.light} children={breadcrumbs} />
                <PageSection className="ps_group-header" variant={PageSectionVariants.light}>
                    <GroupPageHeader
                        title={groupId as string}
                        groupId={groupId as string} />
                </PageSection>
                <PageSection variant={PageSectionVariants.default} isFilled={true}>
                    <div className="group-details-main-content">
                        <div className="group-basics">
                            <Card>
                                <CardTitle>
                                    <div className="title-and-type">
                                        <Flex>
                                            <FlexItem className="type"><Icon><OutlinedFolderIcon/></Icon></FlexItem>
                                            <FlexItem className="title">Group metadata</FlexItem>
                                        </Flex>
                                    </div>
                                </CardTitle>
                                <Divider/>
                                <CardBody>
                                    <DescriptionList className="metaData" isCompact={true}>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>Description</DescriptionListTerm>
                                            <DescriptionListDescription
                                                data-testid="group-details-description"
                                                className={!(group?.description) ? "empty-state-text" : ""}
                                            >
                                                {group?.description || "No description"}
                                            </DescriptionListDescription>
                                        </DescriptionListGroup>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>Created</DescriptionListTerm>
                                            <DescriptionListDescription data-testid="group-details-created-on">
                                                <FromNow date={group?.createdOn}/>
                                            </DescriptionListDescription>
                                        </DescriptionListGroup>
                                        <If condition={!isStringEmptyOrUndefined(group?.owner)}>
                                            <DescriptionListGroup>
                                                <DescriptionListTerm>Owner</DescriptionListTerm>
                                                <DescriptionListDescription data-testid="group-details-created-by">
                                                    <span>{group?.owner}</span>
                                                </DescriptionListDescription>
                                            </DescriptionListGroup>
                                        </If>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>Modified</DescriptionListTerm>
                                            <DescriptionListDescription data-testid="group-details-modified-on">
                                                <FromNow date={group?.modifiedOn}/>
                                            </DescriptionListDescription>
                                        </DescriptionListGroup>
                                    </DescriptionList>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="artifacts-toolbar-and-table">
                            <Card>
                                <CardTitle>
                                    <div className="title-and-type">
                                        <Flex>
                                            <FlexItem className="title">Artifacts in group</FlexItem>
                                        </Flex>
                                    </div>
                                </CardTitle>
                                <Divider/>
                                <CardBody>
                                    <ArtifactsTableWithToolbar
                                        group={group!}
                                        onViewArtifact={onViewArtifact}
                                        onViewArtifactInRegistry={onViewArtifactInRegistry}
                                    />
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </PageSection>
            </PageDataLoader>
        </PageErrorHandler>
    );

};
