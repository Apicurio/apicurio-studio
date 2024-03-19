import React from "react";
import { DesignContent } from "@models/designs";

export type EditorProps = {
    content: DesignContent;
    onChange: (value: any) => void;
};

export type Editor = React.FunctionComponent<EditorProps>;
