import YAML from "yaml";
import { parse } from "protobufjs";
import { ArtifactTypes, ContentTypes, Design, DesignContent } from "@models/designs";

/**
 * Returns true if the given content is JSON formatted.
 * @param content the content to check
 */
export function isJson(content: string): boolean {
    try {
        JSON.parse(content);
        return true;
    } catch (e) {
        return false;
    }
}
export function parseJson(content: string): any {
    return JSON.parse(content);
}
export function toJsonString(content: any): string {
    return JSON.stringify(content, null, 4);
}


/**
 * Returns true if the given content is YAML formatted.
 * @param content the content to check
 */
export function isYaml(content: string): boolean {
    try {
        const result: any = YAML.parse(content);
        if (typeof result === "object") {
            return true;
        }
    } catch (e) {
        // Do nothing - it's not a YAML file.
    }
    return false;
}
export function parseYaml(content: string): any {
    return YAML.parse(content);
}
export function toYamlString(content: any): string {
    return YAML.stringify(content, null, 4);
}

/**
 * Returns true if the given content is XML formatted.
 * @param content the content to check
 */
export function isXml(content: string): boolean {
    try {
        const xmlParser: DOMParser = new DOMParser();
        const dom: Document = xmlParser.parseFromString(content, "application/xml");
        const isParseError: boolean = dom.getElementsByTagName("parsererror").length !== 0;
        return !isParseError;
    } catch (e) {
        return false;
    }
}

function isXmlWithRootNode(content: string, namespace: string, localName: string): boolean {
    try {
        const xmlParser: DOMParser = new DOMParser();
        const dom: Document = xmlParser.parseFromString(content, "application/xml");
        const isParseError: boolean = dom.getElementsByTagName("parsererror").length !== 0;
        return !isParseError &&
               dom.documentElement.namespaceURI === namespace &&
               dom.documentElement.localName === localName;
    } catch (e) {
        return false;
    }
}
export function isWsdl(content: string): boolean {
    return isXmlWithRootNode(content, "http://schemas.xmlsoap.org/wsdl/", "definitions");
}
export function isXsd(content: string): boolean {
    return isXmlWithRootNode(content, "http://www.w3.org/2001/XMLSchema", "schema");
}


/**
 * Returns true if the given content is PROTO formatted.
 * @param content the content to check
 */
export function isProto(content: string): boolean {
    try {
        /*const result: IParserResult = */parse(content);
        return true;
    } catch (e) {
        return false;
    }
}


export function fileExtensionForDesign(design: Design, content: DesignContent): string {
    // If the design was originally imported from a file, let's just use the extension
    // from that file.
    // FIXME we now need to get this information from the first event
    // if (design.origin && design.origin.type === "file") {
    //     const filename: string = design.origin.file?.fileName as string;
    //     if (filename.indexOf(".") > 0) {
    //         const split: string[] = filename.split(".");
    //         return split[split.length - 1];
    //     }
    // }

    if (design.type === ArtifactTypes.PROTOBUF) {
        return "proto";
    }
    if (design.type === ArtifactTypes.WSDL) {
        return "wsdl";
    }
    if (design.type === ArtifactTypes.XSD) {
        return "xsd";
    }
    if (design.type === ArtifactTypes.XML) {
        return "xml";
    }
    if (design.type === ArtifactTypes.GRAPHQL) {
        return "graphql";
    }

    if (content.contentType && content.contentType === ContentTypes.APPLICATION_JSON) {
        return "json";
    }
    if (content.contentType && content.contentType === ContentTypes.APPLICATION_YAML) {
        return "yaml";
    }

    return "txt";
}

export function contentTypeForDesign(design: Design, content: DesignContent): string {
    if (content.contentType) {
        return content.contentType;
    }

    if (design.type === ArtifactTypes.PROTOBUF) {
        return ContentTypes.APPLICATION_PROTOBUF;
    }
    if (design.type === ArtifactTypes.WSDL) {
        return ContentTypes.APPLICATION_WSDL;
    }
    if (design.type === ArtifactTypes.XSD) {
        return ContentTypes.TEXT_XML;
    }
    if (design.type === ArtifactTypes.XML) {
        return ContentTypes.TEXT_XML;
    }
    if (design.type === ArtifactTypes.GRAPHQL) {
        return ContentTypes.APPLICATION_GRAPHQL;
    }

    return ContentTypes.APPLICATION_JSON;
}


/**
 * Called to format (pretty print) the given content.  For example, if the content is JSON
 * then the content will be parsed and then stringified with better whitespace.
 * @param value
 * @param contentType
 */
export function formatContent(value: string, contentType: string): string {
    try {
        if (contentType === ContentTypes.APPLICATION_JSON) {
            const parsed: any = JSON.parse(value);
            return JSON.stringify(parsed, null, 4);
        }
    } catch (e) {
        console.error(e);
        return value;
    }
    return value;
}

/**
 * Converts a given string to something that's allowed in a filename.
 * @param value
 */
export function convertToValidFilename(value: string): string {
    return (value.replace(/[/|\\:*?"<>]/g, ""));
}

/**
 * Converts content (which might be a JS object) to a string.
 * @param content
 */
export function contentToString(content: any): string {
    if (typeof content === "string") {
        return content as string;
    } else {
        return JSON.stringify(content as string, null, 4);
    }
}

export const designContentToString = (content: DesignContent): string => {
    return contentToString(content.data);
};


export const designContentToLanguage = (content: DesignContent): string => {
    if (content.contentType === ContentTypes.APPLICATION_YAML) {
        return "yaml";
    } else if (content.contentType === ContentTypes.APPLICATION_XML) {
        return "xml";
    } else if (content.contentType === ContentTypes.TEXT_XML) {
        return "xml";
    } else if (content.contentType === ContentTypes.APPLICATION_WSDL) {
        return "xml";
    }
    return "json";
};
