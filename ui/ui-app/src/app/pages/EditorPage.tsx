import React, { CSSProperties, FunctionComponent, useEffect, useState } from "react";
import {
    PageSection,
    PageSectionVariants
} from "@patternfly/react-core";
import { ArtifactTypes, ContentTypes, Design, DesignContent } from "@models/designs";
import { DesignsService, useDesignsService } from "@services/useDesignsService.ts";
import { DownloadService, useDownloadService } from "@services/useDownloadService.ts";
import { AlertsService, useAlertsService } from "@services/useAlertsService.tsx";
import {
    contentTypeForDesign,
    convertToValidFilename,
    fileExtensionForDesign,
    formatContent
} from "@utils/content.utils.ts";
import { TextEditor } from "@editors/TextEditor.tsx";
import { ProtoEditor } from "@editors/ProtoEditor.tsx";
import { OpenApiEditor } from "@editors/OpenApiEditor.tsx";
import { AsyncApiEditor } from "@editors/AsyncApiEditor.tsx";
import { CompareModal, DeleteDesignModal, EditorContext, RenameData, RenameModal } from "@app/pages/components";
import { useParams } from "react-router-dom";
import { IfNotLoading } from "@apicurio/common-ui-components";
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
    const [isLoading, setLoading] = useState(true);
    const [design, setDesign] = useState<Design>();
    const [editorDesignContent, setEditorDesignContent] = useState<DesignContent>({
        id: "",
        contentType: ContentTypes.APPLICATION_JSON,
        data: ""
    });
    const [originalContent, setOriginalContent] = useState<any>();
    const [currentContent, setCurrentContent] = useState<any>();
    const [isDirty, setDirty] = useState(false);
    const [isRenameModalOpen, setRenameModalOpen] = useState(false);
    const [isCompareModalOpen, setCompareModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const params = useParams();

    const designsService: DesignsService = useDesignsService();
    const downloadSvc: DownloadService = useDownloadService();
    const navigation: AppNavigationService = useAppNavigation();
    const alerts: AlertsService = useAlertsService();

    useEffect(() => {
        // Cleanup any possible event listener we might still have registered
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
        };
    }, []);

    // Load the design based on the design ID (from the path param).
    useEffect(() => {
        setLoading(true);
        const designId: string | undefined = params["designId"];

        Promise.all([
            designsService.getDesign(designId as string).then(design => {
                setDesign(design);
            }),
            designsService.getDesignContent(designId as string).then(content => {
                setOriginalContent(content.data);
                setCurrentContent(content.data);
                setEditorDesignContent(content);
            })
        ]).then(() => {
            setLoading(false);
            setDirty(false);
        }).catch(error => {
            // TODO better error handling needed!
            console.error(`[EditorPage] Failed to get design content with id ${designId}: `, error);
        });
    }, [params]);

    // Add browser hook to prevent navigation and tab closing when the editor is dirty
    useEffect(() => {
        if (isDirty) {
            window.addEventListener("beforeunload", onBeforeUnload);
        } else {
            window.removeEventListener("beforeunload", onBeforeUnload);
        }
    }, [isDirty]);

    // Called when the user makes an edit in the editor.
    const onEditorChange = (value: any): void => {
        setCurrentContent(value);
    };

    useEffect(() => {
        setDirty(originalContent != currentContent);
    }, [currentContent]);

    // Called when the user makes an edit in the editor.
    const onSave = (): void => {
        designsService.updateDesignContent({
            contentType: editorDesignContent.contentType,
            id: design?.id as string,
            data: currentContent
        }).then(() => {
            if (design) {
                design.modifiedOn = new Date();
                setOriginalContent(currentContent);
                setDirty(false);
            }
            alerts.designSaved(design as Design);
        }).catch(error => {
            // TODO handle error
            console.error("[EditorPage] Failed to save design content: ", error);
        });
    };

    const onFormat = (): void => {
        console.info("[EditorPage] Formatting content.");
        const formattedContent: string = formatContent(currentContent, editorDesignContent.contentType);
        console.info("[EditorPage] New content is: ", formattedContent);
        setEditorDesignContent({
            id: design?.id as string,
            contentType: editorDesignContent.contentType,
            data: formattedContent
        });
        setCurrentContent(formattedContent);
    };

    const onDelete = (): void => {
        setDeleteModalOpen(true);
    };

    const onDeleteDesignConfirmed = (design: Design): void => {
        designsService.deleteDesign(design.id).then(() => {
            alerts.designDeleted(design as Design);
            navigation.navigateTo("/");
        }).catch(error => {
            console.error("[Editor] Design delete failed: ", error);
            alerts.designDeleteFailed(design as Design, error);
        });
        setDeleteModalOpen(false);
    };

    const onDownload = (): void => {
        if (design) {
            const filename: string = `${convertToValidFilename(design.name)}.${fileExtensionForDesign(design, editorDesignContent)}`;
            const contentType: string = contentTypeForDesign(design, editorDesignContent);
            const theContent: string = typeof currentContent === "object" ? JSON.stringify(currentContent, null, 4) : currentContent as string;
            downloadSvc.downloadToFS(theContent, contentType, filename);
        }
    };

    const doRenameDesign = (event: RenameData): void => {
        designsService.renameDesign(design?.id as string, event.name, event.description).then(() => {
            if (design) {
                design.name = event.name;
                design.description = event.description;
            }
            setRenameModalOpen(false);
            alerts.designRenamed(event);
        }).catch(error => {
            // TODO error handling
            console.error(error);
        });
    };

    const textEditor: React.ReactElement = (
        <TextEditor content={editorDesignContent} onChange={onEditorChange}/>
    );

    const protoEditor: React.ReactElement = (
        <ProtoEditor content={editorDesignContent} onChange={onEditorChange}/>
    );

    const openapiEditor: React.ReactElement = (
        <OpenApiEditor content={editorDesignContent} onChange={onEditorChange}/>
    );

    const asyncapiEditor: React.ReactElement = (
        <AsyncApiEditor content={editorDesignContent} onChange={onEditorChange}/>
    );

    const editor = (): React.ReactElement => {
        if (design?.type === ArtifactTypes.OPENAPI) {
            return openapiEditor;
        } else if (design?.type === ArtifactTypes.ASYNCAPI) {
            return asyncapiEditor;
        } else if (design?.type === ArtifactTypes.PROTOBUF) {
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
        <IfNotLoading isLoading={isLoading}>
            <PageSection variant={PageSectionVariants.light} id="section-context" style={sectionContextStyle}>
                <EditorContext
                    design={design as Design}
                    dirty={isDirty}
                    onSave={onSave}
                    onFormat={onFormat}
                    onDelete={onDelete}
                    onDownload={onDownload}
                    onRename={() => setRenameModalOpen(true)}
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
                beforeName={design?.name || ""}
                after={currentContent}
                afterName={design?.name || ""}/>
            <RenameModal design={design}
                isOpen={isRenameModalOpen}
                onRename={doRenameDesign}
                onCancel={() => setRenameModalOpen(false)}/>
            <DeleteDesignModal design={design}
                isOpen={isDeleteModalOpen}
                onDelete={onDeleteDesignConfirmed}
                onDownload={onDownload}
                onCancel={() => setDeleteModalOpen(false)}/>
            {/*<Prompt when={isDirty} message={ "You have unsaved changes.  Do you really want to leave?" }/>*/}
        </IfNotLoading>
    );
};
