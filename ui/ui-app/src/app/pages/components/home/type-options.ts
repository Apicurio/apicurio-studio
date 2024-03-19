import { ArtifactTypes } from "@models/designs";

export type TypeItem = {
    value: string;
    label: string;
}

export const OPENAPI_TYPE = {
    value: ArtifactTypes.OPENAPI,
    label: "OpenAPI"
};
export const ASYNCAPI_TYPE = {
    value: ArtifactTypes.ASYNCAPI,
    label: "AsyncAPI"
};
export const AVRO_TYPE = {
    value: ArtifactTypes.AVRO,
    label: "Apache Avro"
};
export const JSON_TYPE = {
    value: ArtifactTypes.JSON,
    label: "JSON Schema"
};
export const PROTOBUF_TYPE = {
    value: ArtifactTypes.PROTOBUF,
    label: "Google Protocol Buffers"
};


export const TYPE_ITEMS: TypeItem[] = [
    OPENAPI_TYPE, ASYNCAPI_TYPE, AVRO_TYPE, JSON_TYPE, PROTOBUF_TYPE
];
