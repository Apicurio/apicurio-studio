import React, { RefObject, useEffect } from "react";
import { Editor as DesignEditor, EditorProps } from "./editor-types";
import "./OpenApiEditor.css";
import { ContentTypes } from "@models/designs";
import { parseJson, parseYaml, toJsonString, toYamlString } from "@utils/content.utils.ts";
import { ApicurioStudioConfig, useConfigService } from "@services/useConfigService.ts";


export type OpenApiEditorProps = {
    className?: string;
} & EditorProps;


/**
 * OpenAPI editor.  The actual editor logic is written in Angular as a separate application
 * and loaded via an iframe.  This component is a bridge - it acts as a React component that
 * bridges to the iframe.
 */
export const OpenApiEditor: DesignEditor = ({ content, onChange, className }: OpenApiEditorProps) => {
    const ref: RefObject<any> = React.createRef();
    const config: ApicurioStudioConfig = useConfigService().getApicurioStudioConfig();

    const editorsUrl: string = config.components.editors.url;

    useEffect(() => {
        console.info("[OpenApiEditor] URL location of editors: ", editorsUrl);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore

        const eventListener: any = (event) => {
            if (event.data && event.data.type === "apicurio_onChange") {
                let newContent: any = event.data.data.content;
                if (typeof newContent === "object") {
                    if (content.contentType === ContentTypes.APPLICATION_YAML) {
                        console.info("[OpenApiEditor] New content is 'object', converting to YAML string");
                        newContent = toYamlString(newContent);
                    } else {
                        console.info("[OpenApiEditor] New content is 'object', converting to JSON string");
                        newContent = toJsonString(newContent);
                    }
                } else if (typeof newContent === "string" && content.contentType === ContentTypes.APPLICATION_YAML) {
                    console.info("[OpenApiEditor] Converting from JSON string to YAML string.");
                    newContent = toYamlString(parseJson(newContent as string));
                }
                onChange(newContent);
            }
        };
        window.addEventListener("message", eventListener, false);
        return () => {
            window.removeEventListener("message", eventListener, false);
        };
    });

    const editorAppUrl = (): string => {
        return editorsUrl;
    };

    const onEditorLoaded = (): void => {
        // Now it's OK to post a message to iframe with the content to edit.
        let value: string;
        if (typeof content.data === "object") {
            console.info("[OpenApiEditor] Loading editor data from 'object' - converting to JSON string.");
            value = toJsonString(content.data);
        } else if (typeof content.data === "string" && content.contentType === ContentTypes.APPLICATION_YAML) {
            console.info("[OpenApiEditor] Loading editor data from 'string' - converting from YAML to JSON.");
            value = toJsonString(parseYaml(content.data as string));
        } else {
            console.info("[OpenApiEditor] Loading editor data from 'string' without content conversion.");
            value = content.data as string;
        }
        const message: any = {
            type: "apicurio-editingInfo",
            // tslint:disable-next-line:object-literal-sort-keys
            data: {
                content: {
                    type: "OPENAPI",
                    value: value
                },
                features: {
                    allowCustomValidations: false,
                    allowImports: false
                }
            }
        };
        ref.current.contentWindow.postMessage(message, "*");
    };

    return (
        <iframe id="openapi-editor-frame"
            ref={ ref }
            className={ className ? className : "editor-openapi-flex-container" }
            onLoad={ onEditorLoaded }
            src={ editorAppUrl() } />
    );
};
