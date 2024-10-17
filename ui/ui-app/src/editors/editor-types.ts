import React from "react";
import { DraftContent } from "@models/drafts";

export type EditorProps = {
    content: DraftContent;
    onChange: (value: any) => void;
};

export type Editor = React.FunctionComponent<EditorProps>;
