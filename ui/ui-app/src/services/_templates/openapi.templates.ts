import { ContentTypes } from "@models/common";
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
        contentType: ContentTypes.APPLICATION_JSON,
        content: JSON.stringify(OPENAPI_3_BLANK, null, 4)
    },
    {
        id: "openapi_3_petstore",
        name: "Pet Store Example",
        contentType: ContentTypes.APPLICATION_JSON,
        content: JSON.stringify(OPENAPI_3_PETSTORE, null, 4)
    },
    {
        id: "openapi_3_uspto",
        name: "USPTO Dataset API",
        contentType: ContentTypes.APPLICATION_JSON,
        content: JSON.stringify(OPENAPI_3_USPTO, null, 4)
    }
];

export const OPENAPI_2_TEMPLATES: Template[] = [
    {
        id: "openapi_2_blank",
        name: "Blank API",
        contentType: ContentTypes.APPLICATION_JSON,
        content: JSON.stringify(OPENAPI_2_BLANK, null, 4)
    },
    {
        id: "openapi_2_petstore",
        name: "Pet Store Example",
        contentType: ContentTypes.APPLICATION_JSON,
        content: JSON.stringify(OPENAPI_2_PETSTORE, null, 4)
    }
];
