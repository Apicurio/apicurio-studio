import { ContentTypes } from "@models/designs";
import { Template } from "@models/templates";
import ASYNCAPI_2_BLANK from "./asyncapi/asyncapi-2-blank.json";
import ASYNCAPI_2_STREETLIGHTS from "./asyncapi/asyncapi-2-streetlights.json";

export const ASYNCAPI_2_TEMPLATES: Template[] = [
    {
        id: "asyncapi_2_blank",
        name: "Blank API",
        content: {
            contentType: ContentTypes.APPLICATION_JSON,
            data: ASYNCAPI_2_BLANK
        }
    },
    {
        id: "asyncapi_2_streetlights",
        name: "Street Lights Example",
        content: {
            contentType: ContentTypes.APPLICATION_JSON,
            data: ASYNCAPI_2_STREETLIGHTS
        }
    }
];
