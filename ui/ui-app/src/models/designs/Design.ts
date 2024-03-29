export type DesignOriginType = "create" | "file" | "url";
export type DesignType = "OPENAPI" | "ASYNCAPI" | "JSON" | "AVRO" | "PROTOBUF";

export interface Design {

    designId: string;
    type: DesignType;
    name: string;
    description: string|undefined;
    createdBy: string;
    createdOn: Date;
    modifiedBy: string;
    modifiedOn: Date;
    origin: DesignOriginType;

}
