import React, { CSSProperties, FunctionComponent, useEffect, useState } from "react";
import {
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateVariant,
    PageSection,
    PageSectionVariants,
    Title,
    useInterval
} from "@patternfly/react-core";
import { ArtifactTypes, ContentTypes } from "@models/common";
import { DownloadService, useDownloadService } from "@services/useDownloadService.ts";
import {
    contentTypeForDraft,
    convertToValidFilename,
    fileExtensionForDraft,
    formatContent
} from "@utils/content.utils.ts";
import { TextEditor } from "@editors/TextEditor.tsx";
import { ProtoEditor } from "@editors/ProtoEditor.tsx";
import { OpenApiEditor } from "@editors/OpenApiEditor.tsx";
import { AsyncApiEditor } from "@editors/AsyncApiEditor.tsx";
import { useParams } from "react-router-dom";
import { CompareModal, EditorContext } from "@app/pages/editor/components";
import { Draft, DraftContent } from "@models/drafts";
import { PageDataLoader, PageError, PageErrorHandler, toPageError } from "@app/pages";
import { DraftsService, useDraftsService } from "@services/useDraftsService.ts";
import { PleaseWaitModal } from "@apicurio/common-ui-components";
import { ConfirmOverwriteModal, RootPageHeader } from "@app/components";
import { isStringEmptyOrUndefined } from "@utils/string.utils.ts";
import { WarningTriangleIcon } from "@patternfly/react-icons";

const sectionContextStyle: CSSProperties = {
    borderBottom: "1px solid #ccc",
    marginBottom: "1px",
    padding: "12px 12px 12px 24px"
};
const sectionEditorStyle: CSSProperties = {
    padding: 0,
    display: "flex",
    flexFlow: "column",
    height: "auto",
    width: "100%"
};
const editorParentStyle: CSSProperties = {
    flexGrow: 1
};


export type EditorPageProps = object;


// Event listener used to prevent navigation when the editor is dirty
const onBeforeUnload = (e: Event): void => {
    // Cancel the event
    e.preventDefault();
    // Chrome requires returnValue to be set
    e.returnValue = true;
};

export const EditorPage: FunctionComponent<EditorPageProps> = () => {
    const [pageError, setPageError] = useState<PageError>();
    const [loaders, setLoaders] = useState<Promise<any> | Promise<any>[] | undefined>();
    const [draft, setDraft] = useState<Draft>({
        createdBy: "",
        createdOn: new Date(),
        description: undefined,
        draftId: "",
        groupId: "",
        labels: {},
        modifiedBy: "",
        modifiedOn: new Date(),
        contentId: 0,
        name: "",
        type: "",
        version: ""
    });
    const [draftContent, setDraftContent] = useState<DraftContent>({
        content: "",
        contentType: ContentTypes.APPLICATION_JSON,
    });
    const [originalContent, setOriginalContent] = useState<any>();
    const [currentContent, setCurrentContent] = useState<any>();
    const [isDirty, setDirty] = useState(false);
    const [isCompareModalOpen, setCompareModalOpen] = useState(false);
    const [isPleaseWaitModalOpen, setPleaseWaitModalOpen] = useState(false);
    const [isConfirmOverwriteModalOpen, setConfirmOverwriteModalOpen] = useState(false);
    const [pleaseWaitMessage, setPleaseWaitMessage] = useState("");
    const [isContentConflicting, setIsContentConflicting] = useState(false);

    const { groupId, draftId, version } = useParams();

    const drafts: DraftsService = useDraftsService();
    const downloadSvc: DownloadService = useDownloadService();

    // Poll the server for new content every 60s.  If the content has been updated on
    // the server then we have a conflict that we need to report to the user.
    useInterval(() => {
        detectContentConflict();
    }, 30000);

    const createLoaders = (): Promise<any>[] => {
        return [
            drafts.getDraft(groupId as string, draftId as string, version as string)
                .then(d => {
                    setDraft(d);
                })
                .catch(error => {
                    setPageError(toPageError(error, "Error loading page data."));
                }),
            drafts.getDraftContent(groupId as string, draftId as string, version as string).then(content => {
                setOriginalContent(content.content);
                setCurrentContent(content.content);
                setDraftContent(content);
            }),
        ];
    };

    useEffect(() => {
        setLoaders(createLoaders());
        // Cleanup any possible event listener we might still have registered
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
        };
    }, []);

    // Add browser hook to prevent navigation and tab closing when the editor is dirty
    useEffect(() => {
        if (isDirty) {
            window.addEventListener("beforeunload", onBeforeUnload);
        } else {
            window.removeEventListener("beforeunload", onBeforeUnload);
        }
    }, [isDirty]);

    // Add a react router prompt that will be used when *navigating* but the editor is dirty
    // unstable_usePrompt({
    //     message: "You have unsaved changes.  Do you really want to navigate away and lose them?",
    //     when: () => isDirty
    // });

    // Called when the user makes an edit in the editor.
    const onEditorChange = (value: any): void => {
        setCurrentContent(value);
    };

    useEffect(() => {
        setDirty(originalContent != currentContent);
    }, [currentContent]);

    const pleaseWait = (message: string = ""): void => {
        setPleaseWaitModalOpen(true);
        setPleaseWaitMessage(message);
    };

    const detectContentConflict = (): void => {
        drafts.getDraft(groupId as string, draftId as string, version as string).then(currentDraft => {
            console.info(`[EditorPage] Detecting conflicting content.  Latest contentId: ${currentDraft.contentId}  Editor contentId: ${draft.contentId}`);
            if (currentDraft.contentId !== draft.contentId) {
                console.debug(`[EditorPage] Detected Draft content conflict.  Expected '${draft.contentId}' but found '${currentDraft.contentId}'`);
                setIsContentConflicting(true);
            }
        });
    };

    const updateDraftMetadata = (): void => {
        drafts.getDraft(groupId as string, draftId as string, version as string).then(setDraft);
    };

    // Called when the user makes an edit in the editor.  First checks that the
    // content hasn't been changed on the server by someone else...
    const onSave = (overwrite?: boolean): Promise<void> => {
        pleaseWait("Saving the draft, please wait...");

        if (overwrite === undefined) {
            overwrite = false;
        }

        if (overwrite) {
            const content: DraftContent = {
                content: currentContent,
                contentType: draftContent.contentType
            };
            return drafts.updateDraftContent(groupId as string, draftId as string, version as string, content).then(() => {
                setPleaseWaitModalOpen(false);
                if (draft) {
                    updateDraftMetadata();
                    setOriginalContent(currentContent);
                    setDirty(false);
                }
            }).catch(error => {
                setPleaseWaitModalOpen(false);
                // TODO handle error
                console.error("[EditorPage] Failed to save design content: ", error);
            });
        } else {
            console.debug("[EditorPage] Checking for conflicting Draft content");
            return drafts.getDraft(groupId as string, draftId as string, version as string).then(currentDraft => {
                if (currentDraft.contentId !== draft.contentId) {
                    console.debug(`[EditorPage] Detected Draft content conflict.  Expected '${draft.contentId}' but found '${currentDraft.contentId}'.'`);
                    // Uh oh, if we save now we'll be overwriting someone else's changes!
                    setPleaseWaitModalOpen(false);
                    setConfirmOverwriteModalOpen(true);
                    return Promise.resolve();
                } else {
                    console.debug("[EditorPage] Draft content not in conflict, saving...");
                    return onSave(true);
                }
            }).catch(error => {
                setPleaseWaitModalOpen(false);
                // TODO handle error
                console.error("[EditorPage] Failed to save design content: ", error);
            });
        }
    };

    const onFormat = (): void => {
        console.info("[EditorPage] Formatting content.");
        const formattedContent: string = formatContent(currentContent, draftContent.contentType);
        console.info("[EditorPage] New content is: ", formattedContent);
        setDraftContent({
            contentType: draftContent.contentType,
            content: formattedContent
        });
        setCurrentContent(formattedContent);
    };

    const onDownload = (): void => {
        if (draft) {
            const fname: string = isStringEmptyOrUndefined(draft.name) ? draft.draftId : draft.name;
            const filename: string = `${convertToValidFilename(fname)}.${fileExtensionForDraft(draft, draftContent)}`;
            const contentType: string = contentTypeForDraft(draft, draftContent);
            const theContent: string = typeof currentContent === "object" ? JSON.stringify(currentContent, null, 4) : currentContent as string;
            downloadSvc.downloadToFS(theContent, contentType, filename);
        }
    };

    const notDraftEmptyState = (
        <EmptyState variant={EmptyStateVariant.sm}>
            <EmptyStateIcon icon={WarningTriangleIcon}/>
            <Title headingLevel="h5" size="lg">Not a Draft</Title>
            <EmptyStateBody>
                This artifact is not in <em>DRAFT</em> status and so its content cannot be edited.
            </EmptyStateBody>
        </EmptyState>
    );

    const textEditor: React.ReactElement = (
        <TextEditor content={draftContent} onChange={onEditorChange}/>
    );

    const protoEditor: React.ReactElement = (
        <ProtoEditor content={draftContent} onChange={onEditorChange}/>
    );

    const openapiEditor: React.ReactElement = (
        <OpenApiEditor content={draftContent} onChange={onEditorChange}/>
    );

    const asyncapiEditor: React.ReactElement = (
        <AsyncApiEditor content={draftContent} onChange={onEditorChange}/>
    );

    const editor = (): React.ReactElement => {
        if (!draft.isDraft!) {
            return notDraftEmptyState;
        }

        if (draft?.type === ArtifactTypes.OPENAPI) {
            return openapiEditor;
        } else if (draft?.type === ArtifactTypes.ASYNCAPI) {
            return asyncapiEditor;
        } else if (draft?.type === ArtifactTypes.PROTOBUF) {
            return protoEditor;
        }

        // TODO create different text editors depending on the content type?  Or assume
        // that the text editor can configure itself appropriately?
        return textEditor;
    };

    const onCompareContent = () => {
        setCompareModalOpen(true);
    };

    const closeCompareEditor = () => {
        setCompareModalOpen(false);
    };

    return (
        <PageErrorHandler error={pageError}>
            <PageDataLoader loaders={loaders}>
                <PageSection className="ps_draft-header" variant={PageSectionVariants.light} padding={{ default: "noPadding" }}>
                    <RootPageHeader tabKey={0} />
                </PageSection>
                <PageSection variant={PageSectionVariants.light} id="section-context" style={sectionContextStyle}>
                    <EditorContext
                        draft={draft}
                        dirty={isDirty}
                        contentConflict={isContentConflicting}
                        onSave={onSave}
                        onFormat={onFormat}
                        onDownload={onDownload}
                        onCompareContent={onCompareContent}
                    />
                </PageSection>
                <PageSection variant={PageSectionVariants.light} id="section-editor" style={sectionEditorStyle}>
                    <div className="editor-parent" style={editorParentStyle} children={editor() as any} />
                </PageSection>
                <CompareModal isOpen={isCompareModalOpen}
                    onClose={closeCompareEditor}
                    before={originalContent}
                    beforeName={draft?.name || ""}
                    after={currentContent}
                    afterName={draft?.name || ""}/>
                <ConfirmOverwriteModal
                    isOpen={isConfirmOverwriteModalOpen}
                    onOverwrite={() => {
                        setConfirmOverwriteModalOpen(false);
                        onSave(true);
                    }}
                    onClose={() => setConfirmOverwriteModalOpen(false)} />
                <PleaseWaitModal
                    message={pleaseWaitMessage}
                    isOpen={isPleaseWaitModalOpen} />
                {/*<Prompt when={isDirty} message={ "You have unsaved changes.  Do you really want to leave?" }/>*/}
            </PageDataLoader>
        </PageErrorHandler>
    );
};
