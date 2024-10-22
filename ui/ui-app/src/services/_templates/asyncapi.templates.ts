import { Template } from "@models/templates";
import ASYNCAPI_2_BLANK from "./asyncapi/asyncapi-2-blank.json";
import ASYNCAPI_2_STREETLIGHTS from "./asyncapi/asyncapi-2-streetlights.json";
import { ContentTypes } from "@models/common";

export const ASYNCAPI_2_TEMPLATES: Template[] = [
    {
        id: "asyncapi_2_blank",
        name: "Blank AsyncAPI 2.x API",
        description: "An empty API description using AsyncAPI version 2.6.",
        contentType: ContentTypes.APPLICATION_JSON,
        content: JSON.stringify(ASYNCAPI_2_BLANK, null, 4)
    },
    {
        id: "asyncapi_2_streetlights",
        name: "Street Lights API Example",
        description: "An example API description that defines a simple StreetLight API.",
        contentType: ContentTypes.APPLICATION_JSON,
        content: JSON.stringify(ASYNCAPI_2_STREETLIGHTS, null, 4)
    }
];
