import React, { FunctionComponent } from "react";
import "./ArtifactTypeIcon.css";
import { ArtifactTypes } from "@models/designs";


const icon = (type: string | undefined): string => {
    switch (type) {
        case ArtifactTypes.AVRO:
            return "type-avro";
        case ArtifactTypes.PROTOBUF:
            return "type-protobuf";
        case ArtifactTypes.JSON:
            return "type-json";
        case ArtifactTypes.OPENAPI:
            return "type-openapi";
        case ArtifactTypes.ASYNCAPI:
            return "type-asyncapi";
        case ArtifactTypes.GRAPHQL:
            return "type-graphql";
        case ArtifactTypes.KCONNECT:
            return "type-kconnect";
        case ArtifactTypes.WSDL:
            return "type-wsdl";
        case ArtifactTypes.XSD:
            return "type-xsd";
        case ArtifactTypes.XML:
            return "type-xml";
    }
    return "";
};


/**
 * Properties
 */
export type ArtifactTypeIconProps = {
    className?: string;
    type: string;
    isShowIcon: boolean;
    isShowLabel: boolean;
}

export const ArtifactTypeIcon: FunctionComponent<ArtifactTypeIconProps> = ({ className, type, isShowIcon, isShowLabel }: ArtifactTypeIconProps) => {
    const getTitle = (): string => {
        let title: string = type;
        switch (type) {
            case ArtifactTypes.AVRO:
                title = "Avro Schema";
                break;
            case ArtifactTypes.PROTOBUF:
                title = "Protobuf Schema";
                break;
            case ArtifactTypes.JSON:
                title = "JSON Schema";
                break;
            case ArtifactTypes.OPENAPI:
                title = "OpenAPI Definition";
                break;
            case ArtifactTypes.ASYNCAPI:
                title = "AsyncAPI Definition";
                break;
            case ArtifactTypes.GRAPHQL:
                title = "GraphQL Definition";
                break;
            case ArtifactTypes.KCONNECT:
                title = "Kafka Connect Schema";
                break;
            case ArtifactTypes.WSDL:
                title = "WSDL";
                break;
            case ArtifactTypes.XSD:
                title = "XML Schema";
                break;
            case ArtifactTypes.XML:
                title = "XML";
                break;
        }
        return title;
    };

    const getLabel = (): string => {
        let title: string = type;
        switch (type) {
            case ArtifactTypes.AVRO:
                title = "Avro";
                break;
            case ArtifactTypes.PROTOBUF:
                title = "Protobuf";
                break;
            case ArtifactTypes.JSON:
                title = "JSON schema";
                break;
            case ArtifactTypes.OPENAPI:
                title = "OpenAPI";
                break;
            case ArtifactTypes.ASYNCAPI:
                title = "AsyncAPI";
                break;
            case ArtifactTypes.GRAPHQL:
                title = "GraphQL";
                break;
            case ArtifactTypes.KCONNECT:
                title = "Kafka Connect";
                break;
            case ArtifactTypes.WSDL:
                title = "WSDL";
                break;
            case ArtifactTypes.XSD:
                title = "XML Schema";
                break;
            case ArtifactTypes.XML:
                title = "XML";
                break;
        }
        return title;
    };

    const renderLabel = (): React.ReactNode | undefined => {
        if (isShowLabel) {
            return (
                <span>{getLabel()}</span>
            );
        } else {
            return undefined;
        }
    };

    const typeClass = (): string => {
        return icon(type);
    };

    return (
        <div className={ `artifact-type-icon ${typeClass()} ${isShowIcon ? "show-icon" : ""} ${isShowLabel ? "show-label" : ""} ${className || ""}` }
            title={getTitle()} children={renderLabel() as any}  />
    );
};
