import { MutableRefObject, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Editor as DraftEditor, EditorProps } from "./editor-types";
import { draftContentToLanguage, draftContentToString } from "@utils/content.utils.ts";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

/**
 * Simple text editor.  This is a fallback editor for any text based content
 * we might want to edit.
 */
export const TextEditor: DraftEditor = ({ content, onChange }: EditorProps) => {
    const defaultValue: string = draftContentToString(content);
    const defaultLanguage: string = draftContentToLanguage(content);

    const [value, setValue] = useState<string>(defaultValue);
    const [language, setLanguage] = useState<string>(defaultLanguage);

    const editorRef: MutableRefObject<IStandaloneCodeEditor|undefined> = useRef<IStandaloneCodeEditor>();

    useEffect(() => {
        const contentString: string = draftContentToString(content);
        const lang: string = draftContentToLanguage(content);

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
