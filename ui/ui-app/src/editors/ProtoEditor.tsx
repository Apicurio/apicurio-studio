import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Editor as DesignEditor, EditorProps } from "./editor-types";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import { designContentToString } from "@utils/content.utils.ts";

const protoBufThemeData = {
    base: "vs",
    inherit: true,
    rules: [
        { token: "keyword", foreground: "DB2121" },
        { token: "typeKeyword", foreground: "F84842", fontStyle: "italic" },
        { token: "identifier", foreground: "0C5ED7", fontStyle: "bold" },
        { token: "type.identifier", foreground: "00CA8C", fontStyle: "bold" },
        { token: "comment", foreground: "7A7A7A" },
        { token: "number", foreground: "000000", fontStyle: "italic" },
        { token: "string", fontStyle: "italic" }
    ]
};

/**
 * Protobuf text editor with support for syntax hint and highlight.
 */
export const ProtoEditor: DesignEditor = ({ content, onChange }: EditorProps) => {
    const defaultValue: string = designContentToString(content);
    const [value, setValue] = useState<string>(defaultValue);

    const editorRef: MutableRefObject<IStandaloneCodeEditor|undefined> = useRef<IStandaloneCodeEditor>();

    useEffect(() => {
        const contentString: string = designContentToString(content);
        setValue(contentString);

        if (editorRef.current) {
            editorRef.current?.setValue(contentString);
        }
    }, [content]);

    const registerProto = (monaco: Monaco) => {
        monaco.languages.register({ id: "protobuf" });
        monaco.languages.setMonarchTokensProvider("protobuf", {
            keywords: [
                "import", "option", "message", "package", "service",
                "optional", "rpc", "returns", "return", "true", "false", "required"
            ],
            typeKeywords: [
                "double", "float", "int32", "int64", "uint32",
                "uint64", "sint32", "sint64", "fixed32", "fixed64",
                "sfixed32", "sfixed64", "bool", "string", "bytes"
            ],
            operators: [
                "=", ">", "<", "!", "~", "?", ":", "==", "<=", ">=", "!=",
                "&&", "||", "++", "--", "+", "-", "*", "/", "&", "|", "^", "%",
                "<<", ">>", ">>>", "+=", "-=", "*=", "/=", "&=", "|=", "^=",
                "%=", "<<=", ">>=", ">>>="
            ],
            symbols: /[=><!~?:&|+\-*/^%]+/,
            escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
            tokenizer: {
                root: [
                    [/[a-z_$][\w$]*/, {
                        cases: {
                            "@typeKeywords": "typeKeyword",
                            "@keywords": "keyword",
                            "@default": "identifier"
                        }
                    }],
                    [/[A-Z][\w$]*/, "type.identifier"],
                    { include: "@whitespace" },

                    // delimiters and operators
                    [/[{}()[\]]/, "@brackets"],
                    [/[<>](?!@symbols)/, "@brackets"],
                    [/@symbols/, {
                        cases: {
                            "@operators": "operator",
                            "@default": ""
                        }
                    }],
                    // @ annotations.
                    [/@\s*[a-zA-Z_$][\w$]*/, { token: "annotation", log: "annotation token: $0" }],
                    // numbers
                    [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
                    [/0[xX][0-9a-fA-F]+/, "number.hex"],
                    [/\d+/, "number"],
                    // delimiter: after number because of .\d floats
                    [/[;,.]/, "delimiter"],
                    // strings
                    [/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
                    [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
                    // characters
                    [/'[^\\']'/, "string"],
                    [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
                    [/'/, "string.invalid"]
                ],
                comment: [
                    [/[^/*]+/, "comment"],
                    [/\/\*/, "comment", "@push"], // nested comment
                    ["\\*/", "comment", "@pop"],
                    [/[/*]/, "comment"]
                ],
                string: [
                    [/[^\\"]+/, "string"],
                    [/@escapes/, "string.escape"],
                    [/\\./, "string.escape.invalid"],
                    [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
                ],
                whitespace: [
                    [/[ \t\r\n]+/, "white"],
                    [/\/\*/, "comment", "@comment"],
                    [/\/\/.*$/, "comment"]
                ]
            }
        });
        monaco.editor.defineTheme("protobuf", protoBufThemeData as any);
    };

    return (
        <Editor
            beforeMount={registerProto}
            className="text-editor"
            defaultLanguage="protobuf"
            defaultValue={value}
            onChange={onChange}
            height="100%"
            options={{
                automaticLayout: true
            }}
            onMount={(editor) => {
                editorRef.current = editor;
            }}
        />
    );
};
