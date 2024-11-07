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
import { ArtifactMetaData, SearchedVersion } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";
import { ArtifactTypeIcon, NewDraftFromModal, RootPageHeader } from "@app/components";
import { DraftsService, useDraftsService } from "@services/useDraftsService.ts";
import { CreateDraft, Draft } from "@models/drafts";
import { PleaseWaitModal } from "@apicurio/common-ui-components";
import { ConfigService, useConfigService } from "@services/useConfigService.ts";


export type ArtifactPageProps = object

/**
 * The artifact details page.
 */
export const ArtifactPage: FunctionComponent<ArtifactPageProps> = () => {
    const [pageError, setPageError] = useState<PageError>();
    const [loaders, setLoaders] = useState<Promise<any> | Promise<any>[] | undefined>();
    const [artifact, setArtifact] = useState<ArtifactMetaData>();
    const [fromVersion, setFromVersion] = useState<SearchedVersion>();
    const [isCreateDraftFromModalOpen, setIsCreateDraftFromModalOpen] = useState(false);
    const [isPleaseWaitModalOpen, setPleaseWaitModalOpen] = useState(false);
    const [pleaseWaitMessage, setPleaseWaitMessage] = useState("");

    const appNavigation: AppNavigationService = useAppNavigation();
    const config: ConfigService = useConfigService();
    const groups: GroupsService = useGroupsService();
    const drafts: DraftsService = useDraftsService();
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

    const navigateToDraft = (draft: Draft): void => {
        const groupId: string = encodeURIComponent(draft.groupId || "default");
        const draftId: string = encodeURIComponent(draft.draftId!);
        const version: string = encodeURIComponent(draft.version!);

        appNavigation.navigateTo(`/drafts/${groupId}/${draftId}/${version}`);
    };

    const onViewVersionAsDraft = (searchedVersion: SearchedVersion): void => {
        const groupId: string = encodeURIComponent(searchedVersion.groupId || "default");
        const draftId: string = encodeURIComponent(searchedVersion.artifactId!);
        const version: string = encodeURIComponent(searchedVersion.version!);

        appNavigation.navigateTo(`/drafts/${groupId}/${draftId}/${version}`);
    };

    const onViewVersionInRegistry = (searchedVersion: SearchedVersion): void => {
        const registryBaseUrl: string = config.getApicurioStudioConfig().links.registry!;
        const groupId: string = encodeURIComponent(searchedVersion.groupId || "default");
        const artifactId: string = encodeURIComponent(searchedVersion.artifactId!);
        const version: string = encodeURIComponent(searchedVersion.version!);

        const registryUrl: string = `${registryBaseUrl}/explore/${groupId}/${artifactId}/versions/${version}`;
        window.location.href = registryUrl;
    };

    const doCreateDraftFromVersion = (fromVersion: SearchedVersion, groupId: string, draftId: string, version: string): void => {
        pleaseWait("Creating draft, please wait...");
        setIsCreateDraftFromModalOpen(false);

        drafts.getDraftContent(fromVersion.groupId || null, fromVersion.artifactId!, fromVersion.version!).then(draftContent => {
            const createDraft: CreateDraft = {
                groupId: groupId,
                draftId: draftId,
                version: version,
                type: fromVersion.artifactType!,
                name: "",
                description: "",
                labels: {
                    basedOnGroupId: fromVersion.groupId,
                    basedOnArtifactId: fromVersion.artifactId,
                    basedOnVersion: fromVersion.version
                },
                content: draftContent.content,
                contentType: draftContent.contentType
            };
            drafts.createDraft(createDraft).then(draft => {
                setPleaseWaitModalOpen(false);
                console.info("[ArtifactPage] Draft successfully created.  Redirecting to details.");
                navigateToDraft(draft);
            }).catch(error => {
                setPleaseWaitModalOpen(false);
                setPageError(toPageError(error, "Error creating draft."));
            });
        }).catch(error => {
            setPleaseWaitModalOpen(false);
            setPageError(toPageError(error, "Error creating draft."));
        });
    };

    const pleaseWait = (message: string = ""): void => {
        setPleaseWaitModalOpen(true);
        setPleaseWaitMessage(message);
    };

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
                                        onViewVersionAsDraft={onViewVersionAsDraft}
                                        onViewVersionInRegistry={onViewVersionInRegistry}
                                        onCreateNewDraft={(version: SearchedVersion) => {
                                            setFromVersion(version);
                                            setIsCreateDraftFromModalOpen(true);
                                        }} />
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </PageSection>
                <PleaseWaitModal
                    message={pleaseWaitMessage}
                    isOpen={isPleaseWaitModalOpen} />
                <NewDraftFromModal
                    isOpen={isCreateDraftFromModalOpen}
                    onClose={() => setIsCreateDraftFromModalOpen(false)}
                    onCreate={doCreateDraftFromVersion}
                    fromVersion={fromVersion!} />
            </PageDataLoader>
        </PageErrorHandler>
    );

};
