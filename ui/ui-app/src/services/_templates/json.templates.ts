import { ContentTypes } from "@models/designs";
import { Template } from "@models/templates";
import JSON_BLANK from "./json/json-blank.json";

export const JSON_TEMPLATES: Template[] = [
    {
        id: "json_blank",
        name: "Blank JSON Schema",
        content: {
            contentType: ContentTypes.APPLICATION_JSON,
            data: JSON_BLANK
        }
    }
];
