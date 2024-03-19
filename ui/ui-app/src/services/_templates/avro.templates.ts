import { ContentTypes } from "@models/designs";
import { Template } from "@models/templates";
import AVRO_BLANK from "./avro/avro-blank.json";

export const AVRO_TEMPLATES: Template[] = [
    {
        id: "avro_blank",
        name: "Blank Avro Schema",
        content: {
            contentType: ContentTypes.APPLICATION_JSON,
            data: AVRO_BLANK
        }
    }
];
