export enum DraftType {
    OPENAPI = "OPENAPI", ASYNCAPI = "ASYNCAPI", JSON = "JSON", AVRO = "AVRO", PROTOBUF = "PROTOBUF",
}

export interface Draft {

    groupId: string;
    draftId: string;
    version: string;
    type: string;
    name: string;
    description: string|undefined;
    createdBy: string;
    createdOn: Date;
    modifiedBy?: string;
    modifiedOn?: Date;
    labels?: object;
    contentId?: number;

}
