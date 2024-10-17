import React, { CSSProperties, FunctionComponent, useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, PageSection, PageSectionVariants } from "@patternfly/react-core";
import { ArtifactTypes, ContentTypes } from "@models/designs";
import { DownloadService, useDownloadService } from "@services/useDownloadService.ts";
import {
    contentTypeForDraft,
    convertToValidFilename, fileExtensionForDraft,
    formatContent
} from "@utils/content.utils.ts";
import { TextEditor } from "@editors/TextEditor.tsx";
import { ProtoEditor } from "@editors/ProtoEditor.tsx";
import { OpenApiEditor } from "@editors/OpenApiEditor.tsx";
import { AsyncApiEditor } from "@editors/AsyncApiEditor.tsx";
import { Link, useParams } from "react-router-dom";
import { CompareModal, EditorContext } from "@app/pages/editor/components";
import { Draft, DraftContent } from "@models/drafts";
import { PageDataLoader, PageError, PageErrorHandler, toPageError } from "@app/pages";
import { DraftsService, useDraftsService } from "@services/useDraftsService.ts";
import { PleaseWaitModal } from "@apicurio/common-ui-components";
import { RootPageHeader } from "@app/components";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";

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


export type EditorPageProps = {
    // No props
};


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
    const [pleaseWaitMessage, setPleaseWaitMessage] = useState("");

    const { groupId, draftId, version } = useParams();

    const drafts: DraftsService = useDraftsService();
    const downloadSvc: DownloadService = useDownloadService();
    const appNavigation: AppNavigationService = useAppNavigation();

    const createLoaders = (): Promise<any>[] => {
        return [
            drafts.getDraft(groupId as string, draftId as string, version as string)
                .then(setDraft)
                .catch(error => {
                    setPageError(toPageError(error, "Error loading page data."));
                }),
            drafts.getDraftContent(groupId as string, draftId as string, version as string).then(content => {
                setOriginalContent(content.content);
                setCurrentContent(content.content);
                setDraftContent(content);
            })
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

    // Called when the user makes an edit in the editor.
    const onSave = (): void => {
        pleaseWait("Saving the draft, please wait...");
        // designsService.updateDesignContent({
        //     contentType: editorDesignContent.contentType,
        //     designId: design?.designId as string,
        //     data: currentContent
        // }).then(() => {
        //     if (design) {
        //         design.modifiedOn = new Date();
        //         setOriginalContent(currentContent);
        //         setDirty(false);
        //     }
        //     alerts.designSaved(design as Design);
        // }).catch(error => {
        //     // TODO handle error
        //     console.error("[EditorPage] Failed to save design content: ", error);
        // });
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
            const filename: string = `${convertToValidFilename(draft.name)}.${fileExtensionForDraft(draft, draftContent)}`;
            const contentType: string = contentTypeForDraft(draft, draftContent);
            const theContent: string = typeof currentContent === "object" ? JSON.stringify(currentContent, null, 4) : currentContent as string;
            downloadSvc.downloadToFS(theContent, contentType, filename);
        }
    };

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
                        onSave={onSave}
                        onFormat={onFormat}
                        onDownload={onDownload}
                        onCompareContent={onCompareContent}
                        artifactContent={currentContent}
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
                <PleaseWaitModal
                    message={pleaseWaitMessage}
                    isOpen={isPleaseWaitModalOpen} />
                {/*<Prompt when={isDirty} message={ "You have unsaved changes.  Do you really want to leave?" }/>*/}
            </PageDataLoader>
        </PageErrorHandler>
    );
};
