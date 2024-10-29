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
    EditDraftInfoModal,
    RootPageHeader
} from "@app/components";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";
import { Link, useParams } from "react-router-dom";
import { Draft, DraftInfo } from "@models/drafts";
import { FromNow, If, ObjectDropdown, PleaseWaitModal } from "@apicurio/common-ui-components";
import { PencilAltIcon } from "@patternfly/react-icons";
import { ConfigService, useConfigService } from "@services/useConfigService.ts";


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

    const { groupId, draftId, version } = useParams();

    const draftsService: DraftsService = useDraftsService();
    const appNavigation: AppNavigationService = useAppNavigation();
    const config: ConfigService = useConfigService();

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

    const doFinalizeDraft = (draft: Draft): void => {
        draftsService.finalizeDraft(draft.groupId, draft.draftId, draft.version).then(() => {
            const groupId: string = encodeURIComponent(draft.groupId || "default");
            const draftId: string = encodeURIComponent(draft.draftId!);
            appNavigation.navigateTo(`/explore/${groupId}/${draftId}`);
        }).catch(e => {
            setPageError(toPageError(e, "Error promoting a draft."));
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
                            <TextContent>
                                Manage this draft by viewing its metadata, managing its comments, and editing its content.
                            </TextContent>
                        </FlexItem>
                        <FlexItem className="actions" align={{ default: "alignRight" }}>
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
                                        divider: true,
                                        isVisible: () => isDeleteEnabled() && isRegistryUIConfigured()
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
                    <PleaseWaitModal
                        message={pleaseWaitMessage}
                        isOpen={isPleaseWaitModalOpen} />
                </PageSection>
            </PageDataLoader>
        </PageErrorHandler>
    );
};
