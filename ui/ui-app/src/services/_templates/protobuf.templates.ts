import { ContentTypes } from "@models/common";
import { Template } from "@models/templates";
import PROTOBUF_BLANK from "./protobuf/protobuf-blank.json";

export const PROTOBUF_TEMPLATES: Template[] = [
    {
        id: "protobuf_blank",
        name: "Blank Protobuf Schema",
        contentType: ContentTypes.APPLICATION_PROTOBUF,
        content: PROTOBUF_BLANK.template
    }
];
