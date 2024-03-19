import { ContentTypes } from "@models/designs";
import { Template } from "@models/templates";
import OPENAPI_3_BLANK from "./openapi/openapi-3-blank.json";
import OPENAPI_3_PETSTORE from "./openapi/openapi-3-petstore.json";
import OPENAPI_3_USPTO from "./openapi/openapi-3-uspto.json";
import OPENAPI_2_BLANK from "./openapi/openapi-2-blank.json";
import OPENAPI_2_PETSTORE from "./openapi/openapi-2-petstore.json";


export const OPENAPI_3_TEMPLATES: Template[] = [
    {
        id: "openapi_3_blank",
        name: "Blank API",
        content: {
            contentType: ContentTypes.APPLICATION_JSON,
            data: OPENAPI_3_BLANK
        }
    },
    {
        id: "openapi_3_petstore",
        name: "Pet Store Example",
        content: {
            contentType: ContentTypes.APPLICATION_JSON,
            data: OPENAPI_3_PETSTORE
        }
    },
    {
        id: "openapi_3_uspto",
        name: "USPTO Dataset API",
        content: {
            contentType: ContentTypes.APPLICATION_JSON,
            data: OPENAPI_3_USPTO
        }
    }
];

export const OPENAPI_2_TEMPLATES: Template[] = [
    {
        id: "openapi_2_blank",
        name: "Blank API",
        content: {
            contentType: ContentTypes.APPLICATION_JSON,
            data: OPENAPI_2_BLANK
        }
    },
    {
        id: "openapi_2_petstore",
        name: "Pet Store Example",
        content: {
            contentType: ContentTypes.APPLICATION_JSON,
            data: OPENAPI_2_PETSTORE
        }
    }
];
