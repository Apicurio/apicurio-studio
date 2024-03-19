import { MutableRefObject, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import { Editor as DesignEditor, EditorProps } from "./editor-types";
import { designContentToLanguage, designContentToString } from "@utils/content.utils.ts";

/**
 * Simple text editor.  This is a fallback editor for any text based content
 * we might want to edit.
 */
export const TextEditor: DesignEditor = ({ content, onChange }: EditorProps) => {
    const defaultValue: string = designContentToString(content);
    const defaultLanguage: string = designContentToLanguage(content);

    const [value, setValue] = useState<string>(defaultValue);
    const [language, setLanguage] = useState<string>(defaultLanguage);

    const editorRef: MutableRefObject<IStandaloneCodeEditor|undefined> = useRef<IStandaloneCodeEditor>();

    useEffect(() => {
        const contentString: string = designContentToString(content);
        const lang: string = designContentToLanguage(content);

        setValue(contentString);
        setLanguage(lang);

        if (editorRef.current) {
            editorRef.current?.setValue(contentString);
        }
    }, [content]);

    return (
        <Editor
            className="text-editor"
            language={language}
            value={value}
            onChange={onChange}
            options={{
                automaticLayout: true,
                wordWrap: "on"
            }}
            onMount={(editor) => {
                editorRef.current = editor;
            }}
        />
    );
};
