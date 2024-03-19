import React, { CSSProperties, FunctionComponent, useEffect, useState } from "react";
import { Button, PageSection, PageSectionVariants, Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { ArtifactTypes, ContentTypes, DesignContent } from "@models/designs";
import { TextEditor } from "@editors/TextEditor.tsx";
import { ProtoEditor } from "@editors/ProtoEditor.tsx";
import { OpenApiEditor } from "@editors/OpenApiEditor.tsx";
import { AsyncApiEditor } from "@editors/AsyncApiEditor.tsx";
import { CompareModal } from "@app/pages/components";
import { IfNotLoading } from "@apicurio/common-ui-components";
import { formatContent, toJsonString, toYamlString } from "@utils/content.utils.ts";

const sectionContextStyle: CSSProperties = {
    borderBottom: "1px solid #ccc",
    marginBottom: "1px",
    padding: "0"
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


export type EmbeddedEditorPageProps = {
    // No props
};

export const EmbeddedEditorPage: FunctionComponent<EmbeddedEditorPageProps> = () => {
    const [isLoading, setLoading] = useState(true);
    const [correlationId, setCorrelationId] = useState("12345");
    const [type, setType] = useState(ArtifactTypes.AVRO);
    const [content, setContent] = useState("{}");
    const [contentType, setContentType] = useState("application/json");
    const [editorDesignContent, setEditorDesignContent] = useState<DesignContent>({
        id: "embedded",
        contentType: "application/json",
        data: "{}"
    });

    const [originalContent, setOriginalContent] = useState<any>();
    const [currentContent, setCurrentContent] = useState<any>();
    const [isDirty, setDirty] = useState(false);
    const [isCompareModalOpen, setCompareModalOpen] = useState(false);

    // Called when the user makes an edit in the editor.
    const onEditorChange = (value: any): void => {
        setCurrentContent(value);
    };

    useEffect(() => {
        setOriginalContent(content);
        setCurrentContent(content);
        setEditorDesignContent({
            id: "embedded",
            data: content,
            contentType: contentType
        });
        setDirty(false);
    }, [content]);

    useEffect(() => {
        setDirty(originalContent != currentContent);
    }, [currentContent]);

    useEffect(() => {
        const eventListener: any = (event: any) => {
            if (event.data && event.data.type === "apicurio_onLoad") {
                const newType: string = event.data.artifactType;
                const newCorrelationId: string = event.data.correlationId;
                let newContent: any = event.data.data.content;
                const newContentType: string = event.data.data.contentType;

                if (typeof newContent === "object") {
                    if (newContentType === ContentTypes.APPLICATION_YAML) {
                        console.info("[EmbeddedEditorPage] New content is 'object', converting to YAML string");
                        newContent = toYamlString(newContent);
                    } else {
                        console.info("[EmbeddedEditorPage] New content is 'object', converting to JSON string");
                        newContent = toJsonString(newContent);
                    }
                }

                setType(newType);
                setCorrelationId(newCorrelationId);
                setContentType(newContentType);
                setContent(newContent);
                setLoading(false);
            }
        };

        console.info("[EmbeddedEditorPage] Adding window event listener.");
        window.addEventListener("message", eventListener, false);
        return () => {
            window.removeEventListener("message", eventListener, false);
        };
    });

    // Called when the user makes an edit in the editor.
    const onSave = (): void => {
        console.info("[EmbeddedEditorPage] Detected a document change");
        const message: any = {
            type: "apicurio_onSave",
            correlationId: correlationId,
            data: {
                content: currentContent
            }
        };
        if (parent) {
            parent.postMessage(message, "*");
        } else if (window.top) {
            window.top.postMessage(message, "*");
        }
        setContent(currentContent);
    };

    const onFormat = (): void => {
        console.info("[EmbeddedEditorPage] Formatting content.");
        const formattedContent: string = formatContent(currentContent, editorDesignContent.contentType);
        console.info("[EditorPage] New content is: ", formattedContent);
        setEditorDesignContent({
            id: "embedded",
            contentType: editorDesignContent.contentType,
            data: formattedContent
        });
        setCurrentContent(formattedContent);
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
        if (type === ArtifactTypes.OPENAPI) {
            return openapiEditor;
        } else if (type === ArtifactTypes.ASYNCAPI) {
            return asyncapiEditor;
        } else if (type === ArtifactTypes.PROTOBUF) {
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
                <Toolbar id="embedded-editor-toolbar">
                    <ToolbarContent>
                        <ToolbarItem>
                            <Button variant="secondary" isDisabled={!isDirty} onClick={onCompareContent}>Diff changes</Button>
                        </ToolbarItem>
                        <ToolbarItem>
                            <Button variant="secondary" onClick={onFormat}>Format content</Button>
                        </ToolbarItem>
                        <ToolbarItem variant="separator" />
                        <ToolbarItem>
                            <Button variant="primary" isDisabled={!isDirty} onClick={onSave}>Save</Button>
                        </ToolbarItem>
                    </ToolbarContent>
                </Toolbar>
            </PageSection>
            <PageSection variant={PageSectionVariants.light} id="section-editor" style={sectionEditorStyle}>
                <div className="editor-parent" style={editorParentStyle} children={editor() as any} />
            </PageSection>
            <CompareModal isOpen={isCompareModalOpen}
                onClose={closeCompareEditor}
                before={originalContent}
                beforeName={""}
                after={currentContent}
                afterName={""}/>
        </IfNotLoading>
    );
};
