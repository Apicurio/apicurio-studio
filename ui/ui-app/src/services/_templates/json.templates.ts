import { ContentTypes } from "@models/common";
import { Template } from "@models/templates";
import JSON_BLANK from "./json/json-blank.json";

export const JSON_TEMPLATES: Template[] = [
    {
        id: "json_blank",
        name: "Blank JSON Schema",
        contentType: ContentTypes.APPLICATION_JSON,
        content: JSON.stringify(JSON_BLANK, null, 4)
    }
];
