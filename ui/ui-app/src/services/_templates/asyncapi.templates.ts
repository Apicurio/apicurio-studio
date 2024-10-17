import { Template } from "@models/templates";
import ASYNCAPI_2_BLANK from "./asyncapi/asyncapi-2-blank.json";
import ASYNCAPI_2_STREETLIGHTS from "./asyncapi/asyncapi-2-streetlights.json";
import { ContentTypes } from "@models/common";

export const ASYNCAPI_2_TEMPLATES: Template[] = [
    {
        id: "asyncapi_2_blank",
        name: "Blank API",
        contentType: ContentTypes.APPLICATION_JSON,
        content: JSON.stringify(ASYNCAPI_2_BLANK, null, 4)
    },
    {
        id: "asyncapi_2_streetlights",
        name: "Street Lights Example",
        contentType: ContentTypes.APPLICATION_JSON,
        content: JSON.stringify(ASYNCAPI_2_STREETLIGHTS, null, 4)
    }
];
