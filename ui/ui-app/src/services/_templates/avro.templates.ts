import { ContentTypes } from "@models/common";
import { Template } from "@models/templates";
import AVRO_BLANK from "./avro/avro-blank.json";

export const AVRO_TEMPLATES: Template[] = [
    {
        id: "avro_blank",
        name: "Blank Avro Schema",
        contentType: ContentTypes.APPLICATION_JSON,
        content: JSON.stringify(AVRO_BLANK, null, 4)
    }
];
