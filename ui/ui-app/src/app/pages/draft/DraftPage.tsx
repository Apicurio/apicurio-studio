import { FunctionComponent, useEffect, useState } from "react";
import "./DraftPage.css";
import "@app/styles/empty.css";
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
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
    Label,
    PageSection,
    PageSectionVariants,
    TextContent,
    Truncate
} from "@patternfly/react-core";
import { DraftComments, PageDataLoader, PageError, PageErrorHandler, toPageError } from "@app/pages";
import { DraftsService, useDraftsService } from "@services/useDraftsService.ts";
import {
    ArtifactTypeIcon,
    ConfirmDeleteModal,
    ConfirmFinalizeModal,
    EditDraftInfoModal, FinalizeDryRunSuccessModal, InvalidContentModal, NewDraftFromModal,
    RootPageHeader
} from "@app/components";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";
import { Link, useParams } from "react-router-dom";
import { CreateDraft, Draft, DraftInfo } from "@models/drafts";
import { FromNow, If, ObjectDropdown, PleaseWaitModal } from "@apicurio/common-ui-components";
import { EyeIcon, PencilAltIcon, WarningTriangleIcon } from "@patternfly/react-icons";
import { ConfigService, useConfigService } from "@services/useConfigService.ts";
import {
    RuleViolationProblemDetails,
    SearchedVersion
} from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";


export type DraftPageProps = object;

export const DraftPage: FunctionComponent<DraftPageProps> = () => {
    const [ pageError, setPageError ] = useState<PageError>();
    const [ loaders, setLoaders ] = useState<Promise<any> | Promise<any>[] | undefined>();
    const [ draft, setDraft ] = useState<Draft>({
        createdBy: "",
        createdOn: new Date(),
        description: undefined,
        draftId: "",
        groupId: "",
        labels: {},
        modifiedBy: "",
        modifiedOn: new Date(),
        name: "",
        type: "",
        version: ""
    });
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [isConfirmFinalizeModalOpen, setIsConfirmFinalizeModalOpen] = useState(false);
    const [isEditDraftInfoModalOpen, setIsEditDraftInfoModalOpen] = useState(false);
    const [isPleaseWaitModalOpen, setPleaseWaitModalOpen] = useState(false);
    const [pleaseWaitMessage, setPleaseWaitMessage] = useState("");
    const [isCreateDraftFromModalOpen, setIsCreateDraftFromModalOpen] = useState(false);
    const [isInvalidContentModalOpen, setIsInvalidContentModalOpen] = useState(false);
    const [invalidContentError, setInvalidContentError] = useState<RuleViolationProblemDetails>();
    const [isFinalizeDryRunSuccessModalOpen, setIsFinalizeDryRunSuccessModalOpen] = useState(false);

    const { groupId, draftId, version } = useParams();

    const draftsService: DraftsService = useDraftsService();
    const appNavigation: AppNavigationService = useAppNavigation();
    const config: ConfigService = useConfigService();

    const fromVersion: SearchedVersion = {
        groupId: draft.groupId,
        artifactId: draft.draftId,
        version: draft.version
    };

    const isDeleteEnabled = (): boolean => {
        return config.getApicurioRegistryConfig().features?.deleteVersion || false;
    };

    const isRegistryUIConfigured = (): boolean => {
        return config.getApicurioStudioConfig().links.registry !== undefined && config.getApicurioStudioConfig().links.registry.length > 0;
    };

    const createLoaders = (): Promise<any>[] => {
        return [
            draftsService.getDraft(groupId as string, draftId as string, version as string)
                .then(setDraft)
                .catch(error => {
                    setPageError(toPageError(error, "Error loading page data."));
                }),
        ];
    };

    useEffect(() => {
        setLoaders(createLoaders());
    }, []);

    const pleaseWait = (message: string = ""): void => {
        setPleaseWaitModalOpen(true);
        setPleaseWaitMessage(message);
    };

    const handleInvalidContentError = (error: any): void => {
        console.info("[DraftsPage] Invalid content error:", error);
        setInvalidContentError(error);
        setIsInvalidContentModalOpen(true);
    };

    const navigateToDraft = (draft: Draft): void => {
        const groupId: string = encodeURIComponent(draft.groupId || "default");
        const draftId: string = encodeURIComponent(draft.draftId!);
        const version: string = encodeURIComponent(draft.version!);

        appNavigation.navigateTo(`/drafts/${groupId}/${draftId}/${version}`);
    };

    const doDeleteDraft = (): void => {
        setIsConfirmDeleteModalOpen(false);
        pleaseWait("Deleting draft, please wait.");
        draftsService.deleteDraft(groupId as string, draftId as string, version as string).then( () => {
            setPleaseWaitModalOpen(false);
            appNavigation.navigateTo("/drafts");
        }).catch( error => {
            setPageError(toPageError(error, "Error deleting a draft."));
            setPleaseWaitModalOpen(false);
        });
    };

    const doCreateDraft = (data: CreateDraft): void => {
        draftsService.createDraft(data).then(draft => {
            setPleaseWaitModalOpen(false);
            console.info("[DraftPage] Draft successfully created.  Redirecting to details.");
            navigateToDraft(draft);
        }).catch(error => {
            setPleaseWaitModalOpen(false);
            setPageError(toPageError(error, "Error creating draft."));
        });
    };

    const doCreateDraftFromVersion = (fromVersion: SearchedVersion, groupId: string, draftId: string, version: string): void => {
        pleaseWait("Creating draft, please wait...");
        setIsCreateDraftFromModalOpen(false);

        draftsService.getDraftContent(fromVersion.groupId || null, fromVersion.artifactId!, fromVersion.version!).then(draftContent => {
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
            doCreateDraft(createDraft);
        }).catch(error => {
            setPleaseWaitModalOpen(false);
            setPageError(toPageError(error, "Error creating draft."));
        });
    };

    const doFinalizeDraft = (draft: Draft, dryRun?: boolean): void => {
        setIsConfirmFinalizeModalOpen(false);
        pleaseWait("Finalizing draft, please wait...");
        draftsService.finalizeDraft(draft.groupId, draft.draftId, draft.version, dryRun || false).then(() => {
            if (!dryRun) {
                const groupId: string = encodeURIComponent(draft.groupId || "default");
                const draftId: string = encodeURIComponent(draft.draftId!);
                appNavigation.navigateTo(`/explore/${groupId}/${draftId}`);
            } else {
                setPleaseWaitModalOpen(false);
                setIsFinalizeDryRunSuccessModalOpen(true);
            }
        }).catch(error => {
            setPleaseWaitModalOpen(false);
            if (error && (error.status === 400 || error.status === 409)) {
                handleInvalidContentError(error);
            } else {
                setPageError(toPageError(error, "Error finalizing a draft."));
            }
        });
    };

    const doEditDraftInfo = (draftInfo: DraftInfo): void => {
        setIsEditDraftInfoModalOpen(false);
        pleaseWait("Updating draft information...");
        draftsService.updateDraftInfo(groupId as string, draftId as string, version as string, draftInfo).then( () => {
            setPleaseWaitModalOpen(false);
            setDraft({
                ...draft,
                ...draftInfo
            });
        }).catch( error => {
            setPleaseWaitModalOpen(false);
            setPageError(toPageError(error, "Error editing draft info."));
        });
    };

    const navigateToEditor = (): void => {
        const groupId: string = encodeURIComponent(draft.groupId || "default");
        const draftId: string = encodeURIComponent(draft.draftId!);
        const version: string = encodeURIComponent(draft.version!);

        appNavigation.navigateTo(`/drafts/${groupId}/${draftId}/${version}/editor`);
    };

    const navigateToExplore = (): void => {
        const groupId: string = encodeURIComponent(draft.groupId || "default");
        const draftId: string = encodeURIComponent(draft.draftId!);

        appNavigation.navigateTo(`/explore/${groupId}/${draftId}`);
    };

    const viewDraftInRegistry = (): void => {
        const registryBaseUrl: string = config.getApicurioStudioConfig().links.registry!;
        const groupId: string = encodeURIComponent(draft.groupId || "default");
        const draftId: string = encodeURIComponent(draft.draftId!);
        const version: string = encodeURIComponent(draft.version!);

        const registryUrl: string = `${registryBaseUrl}/explore/${groupId}/${draftId}/versions/${version}`;
        window.location.href = registryUrl;
    };


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
                    <Flex>
                        <FlexItem className="instructions">
                            <If condition={draft.isDraft!}>
                                <TextContent>
                                    Manage this draft by viewing its metadata, managing its comments, and editing its content.
                                </TextContent>
                            </If>
                            <If condition={!draft.isDraft!}>
                                <TextContent>
                                    <WarningTriangleIcon color="orange" style={{ marginRight: "5px" }} />
                                    This artifact version is not in <em>DRAFT</em> status and so its content cannot be edited.
                                </TextContent>
                            </If>
                        </FlexItem>
                        <FlexItem className="actions" align={{ default: "alignRight" }}>
                            <If condition={draft.isDraft!}>
                                <Button id="edit-action"
                                    data-testid="draft-btn-edit"
                                    onClick={navigateToEditor}
                                    variant="primary"><PencilAltIcon />{" "}Edit draft</Button>
                                <Button id="finalize-action"
                                    data-testid="draft-btn-finalize"
                                    style={{ marginLeft: "8px" }}
                                    onClick={() => setIsConfirmFinalizeModalOpen(true)}
                                    variant="secondary">Finalize draft</Button>
                                <ObjectDropdown
                                    label=""
                                    isKebab={true}
                                    testId="draft-actions-dropdown"
                                    popperProps={{
                                        position: "right"
                                    }}
                                    items={[
                                        {
                                            id: "view-draft-in-registry",
                                            label: "View in Registry",
                                            testId: "view-draft-in-registry",
                                            isVisible: isRegistryUIConfigured,
                                            action: viewDraftInRegistry
                                        },
                                        {
                                            id: "create-draft-from",
                                            label: "Create new draft",
                                            testId: "create-draft-from",
                                            action: () => setIsCreateDraftFromModalOpen(true)
                                        },
                                        {
                                            divider: true,
                                            isVisible: isDeleteEnabled
                                        },
                                        {
                                            id: "delete-draft",
                                            label: "Delete draft",
                                            testId: "delete-draft",
                                            isVisible: isDeleteEnabled,
                                            action: () => setIsConfirmDeleteModalOpen(true)
                                        }
                                    ]}
                                    onSelect={item => item.action()}
                                    itemToString={item => item.label}
                                    itemToTestId={item => item.testId}
                                    itemIsDivider={item => item.divider}
                                    itemIsVisible={item => !item.isVisible || item.isVisible()}
                                />
                            </If>
                            <If condition={!draft.isDraft!}>
                                <Button id="explore-action"
                                    data-testid="draft-btn-explore"
                                    onClick={navigateToExplore}
                                    icon={<EyeIcon />}
                                    variant="primary">Explore</Button>
                            </If>
                        </FlexItem>
                    </Flex>
                </PageSection>
                <PageSection variant={PageSectionVariants.default} isFilled={true} padding={{ default: "noPadding" }}>
                    <div className="draft-content">
                        <div className="draft-basics">
                            <Card>
                                <CardTitle>
                                    <div className="title-and-type">
                                        <Flex>
                                            <FlexItem className="title">Draft info</FlexItem>
                                            <FlexItem className="actions" align={{ default: "alignRight" }}>
                                                <Button id="edit-info-action"
                                                    data-testid="draft-btn-edit-info"
                                                    onClick={() => {
                                                        setIsEditDraftInfoModalOpen(true);
                                                    }}
                                                    variant="link"><PencilAltIcon />{" "}Edit info</Button>
                                            </FlexItem>
                                        </Flex>
                                    </div>
                                </CardTitle>
                                <Divider />
                                <CardBody>
                                    <DescriptionList className="metaData" isCompact={true}>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>Type</DescriptionListTerm>
                                            <DescriptionListDescription data-testid="draft-details-type">
                                                <ArtifactTypeIcon type={draft!.type} isShowIcon={true} isShowLabel={true} />
                                            </DescriptionListDescription>
                                        </DescriptionListGroup>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>Name</DescriptionListTerm>
                                            <DescriptionListDescription
                                                data-testid="draft-details-name"
                                                className={!(draft!.name) ? "empty-state-text" : ""}
                                            >
                                                {draft!.name || "No name"}
                                            </DescriptionListDescription>
                                        </DescriptionListGroup>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>Description</DescriptionListTerm>
                                            <DescriptionListDescription
                                                data-testid="draft-details-description"
                                                className={!(draft!.description) ? "empty-state-text" : ""}
                                            >
                                                {draft!.description || "No description"}
                                            </DescriptionListDescription>
                                        </DescriptionListGroup>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>Created</DescriptionListTerm>
                                            <DescriptionListDescription data-testid="draft-details-created-on">
                                                <FromNow date={draft!.createdOn}/>
                                            </DescriptionListDescription>
                                        </DescriptionListGroup>
                                        <If condition={draft!.createdBy !== undefined && draft!.createdBy !== ""}>
                                            <DescriptionListGroup>
                                                <DescriptionListTerm>Owner</DescriptionListTerm>
                                                <DescriptionListDescription data-testid="draft-details-created-by">
                                                    <span>{draft!.createdBy}</span>
                                                </DescriptionListDescription>
                                            </DescriptionListGroup>
                                        </If>
                                        <If condition={draft!.modifiedOn !== undefined}>
                                            <DescriptionListGroup>
                                                <DescriptionListTerm>Modified</DescriptionListTerm>
                                                <DescriptionListDescription data-testid="draft-details-modified-on">
                                                    <FromNow date={draft!.modifiedOn}/>
                                                </DescriptionListDescription>
                                            </DescriptionListGroup>
                                        </If>
                                        <If condition={draft!.modifiedBy !== undefined && draft!.modifiedBy.length > 0}>
                                            <DescriptionListGroup>
                                                <DescriptionListTerm>Modified by</DescriptionListTerm>
                                                <DescriptionListDescription data-testid="draft-details-modified-by">
                                                    <span>{draft!.modifiedBy}</span>
                                                </DescriptionListDescription>
                                            </DescriptionListGroup>
                                        </If>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>Labels</DescriptionListTerm>
                                            {!draft.labels || !Object.keys(draft.labels).length ?
                                                <DescriptionListDescription data-testid="draft-details-labels"
                                                    className="empty-state-text">No
                                                    labels</DescriptionListDescription> :
                                                <DescriptionListDescription
                                                    data-testid="draft-details-labels">{Object.entries(draft.labels).map(([key, value]) =>
                                                        <Label key={`label-${key}`} color="purple"
                                                            style={{ marginBottom: "2px", marginRight: "5px" }}>
                                                            <Truncate className="label-truncate" content={`${key}=${value}`}/>
                                                        </Label>
                                                    )}</DescriptionListDescription>
                                            }
                                        </DescriptionListGroup>
                                    </DescriptionList>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="draft-comments">
                            <Card>
                                <CardTitle>
                                    <div className="comments-label">Comments</div>
                                </CardTitle>
                                <Divider/>
                                <CardBody>
                                    <DraftComments draft={draft!} />
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                    <ConfirmDeleteModal
                        title="Delete draft"
                        message="Do you want to delete this draft? This action cannot be undone."
                        isOpen={isConfirmDeleteModalOpen}
                        onDelete={doDeleteDraft}
                        onClose={() => setIsConfirmDeleteModalOpen(false)} />
                    <EditDraftInfoModal
                        isOpen={isEditDraftInfoModalOpen}
                        name={draft.name || ""}
                        description={draft.description || ""}
                        onClose={() => setIsEditDraftInfoModalOpen(false)}
                        onEdit={doEditDraftInfo} />
                    <ConfirmFinalizeModal
                        draft={draft}
                        onClose={() => setIsConfirmFinalizeModalOpen(false)}
                        onFinalize={doFinalizeDraft}
                        isOpen={isConfirmFinalizeModalOpen} />
                    <NewDraftFromModal
                        isOpen={isCreateDraftFromModalOpen}
                        onClose={() => setIsCreateDraftFromModalOpen(false)}
                        onCreate={doCreateDraftFromVersion}
                        fromVersion={fromVersion!} />
                    <InvalidContentModal
                        error={invalidContentError}
                        isOpen={isInvalidContentModalOpen}
                        onClose={() => {
                            setInvalidContentError(undefined);
                            setIsInvalidContentModalOpen(false);
                        }} />
                    <PleaseWaitModal
                        message={pleaseWaitMessage}
                        isOpen={isPleaseWaitModalOpen} />
                    <FinalizeDryRunSuccessModal
                        isOpen={isFinalizeDryRunSuccessModalOpen}
                        onClose={() => setIsFinalizeDryRunSuccessModalOpen(false)} />
                </PageSection>
            </PageDataLoader>
        </PageErrorHandler>
    );
};
