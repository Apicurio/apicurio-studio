import { FunctionComponent, useEffect, useState } from "react";
import {
    Button,
    FileUpload,
    Form,
    FormGroup,
    Modal,
    ModalVariant,
    Spinner,
    TextArea,
    TextInput
} from "@patternfly/react-core";
import {
    ArtifactTypes,
    ContentTypes,
    CreateDesign,
    CreateDesignContent,
    CreateDesignEvent,
    DesignOriginType
} from "@models/designs";
import { isJson, isProto, isYaml, parseJson, parseYaml } from "@utils/content.utils.ts";
import {
    ASYNCAPI_TYPE, AVRO_TYPE,
    ImportFrom, JSON_TYPE,
    OPENAPI_TYPE,
    OPENAPI_VERSIONS, PROTOBUF_TYPE,
    TYPE_ITEMS,
    TypeItem,
    UrlUpload
} from "@app/pages";
import { If, ObjectSelect } from "@apicurio/common-ui-components";


export type ImportDesignModalProps = {
    importType: ImportFrom;
    isOpen: boolean | undefined;
    isImporting: boolean|undefined;
    onImport: (design: CreateDesign, content: CreateDesignContent, event?: CreateDesignEvent) => void;
    onCancel: () => void;
}

type DetectionInfo = {
    type?: TypeItem;
    contentType?: string;
    version?: string;
    name?: string;
    description?: string;
}


export const ImportDesignModal: FunctionComponent<ImportDesignModalProps> = ({ importType, isOpen, isImporting, onImport, onCancel }: ImportDesignModalProps) => {
    const [isValid, setValid] = useState(false);

    const [designContent, setDesignContent] = useState<string>();
    const [fileName, setFileName] = useState<string>();
    const [url, setUrl] = useState<string>();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [typeSelection, setTypeSelection] = useState<TypeItem>();
    const [type, setType] = useState<string>();

    const [version, setVersion] = useState("");

    const [contentType, setContentType] = useState<string>();

    const onFileNameChange = (_event: any, file: File): void => {
        setFileName(file.name);
    };

    const onFileTextChange = (_event: any, value: string): void => {
        setDesignContent(value);
    };

    const onFileClear = (): void => {
        setFileName(undefined);
        setDesignContent(undefined);
    };

    const onUrlChange = (value: string|undefined, url: string|undefined): void => {
        setDesignContent(value);
        setUrl(url);
    };

    // Called when the user clicks the Import button in the modal
    const doImport = (): void => {
        const origin: DesignOriginType = importType === ImportFrom.FILE ? "file" : "url";
        const cd: CreateDesign = {
            type: type as string,
            name,
            description,
            origin
        };
        const cdc: CreateDesignContent = {
            contentType: contentType as string,
            data: designContent
        };
        const cde: CreateDesignEvent = {
            type: "IMPORT",
            data: {
                import: {
                    url: url || undefined,
                    file: fileName || undefined
                }
            }
        };

        console.debug("[ImportDesignModal] Importing design: ", cd);
        console.debug("[ImportDesignModal] Importing content-type: ", contentType);
        console.debug("[ImportDesignModal] Importing event: ", cde);
        onImport(cd, cdc, cde);
    };

    const hasDesignContent = (): boolean => {
        return designContent !== undefined && designContent.trim().length > 0;
    };

    const title = (): string => {
        if (importType === ImportFrom.FILE) {
            return "Import design from file";
        } else {
            return "Import design from URL";
        }
    };

    const detectJsonOrYamlInfo = (contentObj: any, contentType: string): DetectionInfo => {
        if (contentObj.openapi) {
            return {
                type: OPENAPI_TYPE,
                contentType: contentType,
                version: "3.0.3",
                name: contentObj.info?.title,
                description: contentObj.info?.description
            };
        }
        if (contentObj.swagger) {
            return {
                type: OPENAPI_TYPE,
                contentType: contentType,
                version: "2.0",
                name: contentObj.info?.title,
                description: contentObj.info?.description
            };
        }
        if (contentObj.asyncapi) {
            return {
                type: ASYNCAPI_TYPE,
                contentType: contentType,
                name: contentObj.info?.title,
                description: contentObj.info?.description
            };
        }
        if (contentObj.$schema) {
            return {
                type: JSON_TYPE,
                contentType: contentType,
                name: contentObj.title,
                description: contentObj.description
            };
        }

        return {
            type: AVRO_TYPE,
            contentType: contentType,
            name: contentObj.name
        };
    };

    // const detectXmlInfo = (content: string): DetectionInfo => {
    //     let type: TypeItem = XML_TYPE;
    //     if (isWsdl(content)) {
    //         type = ArtifactTypes.WSDL;
    //     } else if (isXsd(content)) {
    //         type = ArtifactTypes.XSD;
    //     }
    //     return {
    //         type,
    //         contentType: ContentTypes.TEXT_XML
    //     };
    // };

    const detectProtoInfo = (): DetectionInfo => {
        return {
            contentType: ContentTypes.APPLICATION_PROTOBUF,
            type: PROTOBUF_TYPE
        };
    };

    // Tries to figure out the type and meta-data of the content by parsing it and looking
    // for key indicators.
    const detectInfo = (content: string): DetectionInfo => {
        if (isJson(content)) {
            return detectJsonOrYamlInfo(parseJson(content), ContentTypes.APPLICATION_JSON);
        } else if (isYaml(content)) {
            return detectJsonOrYamlInfo(parseYaml(content), ContentTypes.APPLICATION_YAML);
        // } else if (isXml(content)) {
        //     return detectXmlInfo(content);
        } else if (isProto(content)) {
            return detectProtoInfo();
        }
        console.warn("[ImportDesignModal] Failed to detect the type of the content.");
        // Default: nothing detected
        return {
        };

        // TODO handle parsing of GraphQL
    };

    // Validate the form inputs.
    useEffect(() => {
        let valid: boolean = true;
        if (!designContent) {
            valid = false;
        }
        if (!name) {
            valid = false;
        }
        if (!type) {
            valid = false;
        }
        setValid(valid);
    }, [name, description, type, designContent]);

    // Whenever the modal is opened, set default values for the form.
    useEffect(() => {
        setDesignContent(undefined);
        setName("");
        setDescription("");
        setFileName(undefined);
        setType(undefined);
        setTypeSelection(undefined);
    }, [isOpen]);

    // The type selection was changed - set the type
    useEffect(() => {
        setType(typeSelection?.value);
    }, [typeSelection]);

    // Whenever the content changes (e.g. loaded from file) try to detect the
    // type of the content.
    useEffect(() => {
        if (designContent && designContent.trim().length > 0) {
            const info: DetectionInfo = detectInfo(designContent as string);
            console.debug("[ImportDesignModal] Content detection: ", info);
            console.debug("[ImportDesignModal] Version detected: ", info.version || "");

            setTypeSelection(info.type);
            setVersion(info.version || "");
            setName(info.name || "");
            setDescription(info.description || "");
            setContentType(info.contentType);
        } else {
            console.debug("[ImportDesignModal] Content empty, resetting form fields.");
            setName("");
            setDescription("");
            setTypeSelection(undefined);
            setContentType(undefined);
        }
    }, [designContent]);

    // Whenever the type changes to OpenAPI, set the version to "3.0.2".
    useEffect(() => {
        if (type === ArtifactTypes.OPENAPI && version === undefined) {
            setVersion("3.0.2");
        }
    }, [type]);

    return (
        <Modal
            variant={ModalVariant.medium}
            title={title()}
            isOpen={isOpen}
            onClose={onCancel}
            actions={[
                <Button key="import" variant="primary" isDisabled={!isValid || isImporting} onClick={doImport} data-testid="btn-modal-import" >
                    <If condition={isImporting as boolean}>
                        <Spinner size="sm" style={{ marginRight: "5px" }} />
                        Importing
                    </If>
                    <If condition={!isImporting}>
                        Import
                    </If>
                </Button>,
                <Button key="cancel" variant="link" onClick={onCancel} data-testid="btn-modal-cancel">
                    Cancel
                </Button>
            ]}
        >
            <Form>
                <If condition={importType === ImportFrom.FILE}>
                    <FormGroup label="File" isRequired={true} fieldId="import-design-file">
                        <FileUpload
                            isRequired={true}
                            id="design-text-file"
                            type="text"
                            value={designContent}
                            filename={fileName}
                            filenamePlaceholder="Drag and drop a file or upload one"
                            data-testid="file-upload-design"
                            onDataChange={onFileTextChange}
                            onTextChange={onFileTextChange}
                            onClearClick={onFileClear}
                            onFileInputChange={onFileNameChange}
                        />
                    </FormGroup>
                </If>
                <If condition={importType === ImportFrom.URL}>
                    <FormGroup label="URL" isRequired={true} fieldId="import-design-url">
                        <UrlUpload
                            id="design-text-url"
                            testId="url-upload-design"
                            urlPlaceholder="Enter a valid and accessible URL"
                            onChange={onUrlChange}
                        />
                    </FormGroup>
                </If>
                <If condition={hasDesignContent}>
                    <FormGroup label="Type" isRequired={true} fieldId="import-design-type">
                        <ObjectSelect
                            value={typeSelection}
                            testId="select-design-type"
                            items={TYPE_ITEMS}
                            onSelect={setTypeSelection}
                            itemToTestId={(item) => `select-design-type-${item.value}`}
                            itemToString={(item) => item.label} />
                    </FormGroup>
                    <If condition={type === ArtifactTypes.OPENAPI}>
                        <ObjectSelect
                            value={version}
                            testId="select-design-version"
                            items={OPENAPI_VERSIONS}
                            onSelect={setVersion}
                            itemToTestId={(item) => `select-design-version-${item}`}
                            itemToString={item => item} />
                    </If>
                    <FormGroup label="Name" isRequired={true} fieldId="import-design-name">
                        <TextInput
                            isRequired
                            type="text"
                            id="import-design-name"
                            data-testid="text-design-name"
                            name="import-design-name"
                            aria-describedby="import-design-name-helper"
                            value={name}
                            onChange={(_event, value) => setName(value)}
                        />
                    </FormGroup>
                    <FormGroup label="Description" fieldId="import-design-description">
                        <TextArea
                            type="text"
                            id="import-design-description"
                            data-testid="text-design-description"
                            name="import-design-description"
                            aria-describedby="import-design-description-helper"
                            value={description}
                            onChange={(_event, value) => setDescription(value)}
                        />
                    </FormGroup>
                </If>
            </Form>
        </Modal>
    );
};
