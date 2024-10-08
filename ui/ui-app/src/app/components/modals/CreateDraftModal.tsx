import { FunctionComponent, useEffect, useState } from "react";
import "./CreateDraftModal.css";
import {
    FileUpload,
    Form,
    FormGroup,
    FormHelperText,
    Grid,
    GridItem,
    HelperText,
    HelperTextItem,
    Modal,
    Tab,
    Tabs,
    TabTitleText,
    TextArea,
    TextInput,
    Wizard,
    WizardStep,
    WizardFooterProps
} from "@patternfly/react-core";
import { If, ObjectSelect, UrlUpload } from "@apicurio/common-ui-components";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { UrlService, useUrlService } from "@services/useUrlService.ts";
import { detectContentType } from "@utils/content.utils.ts";
import { CreateDraft, DraftType } from "@models/drafts";
import { isStringEmptyOrUndefined } from "@utils/string.utils.ts";


export type ValidType = "default" | "success" | "error";

export type Validities = {
    groupId?: ValidType;
    draftId?: ValidType;
    version?: ValidType;
    type?: ValidType;
    content?: ValidType;
    name?: ValidType;
    description?: ValidType;
};

const checkIdValid = (id: string | undefined | null): boolean => {
    if (!id) {
        //id is optional, server can generate it
        return true;
    } else {
        // character % breaks the ui
        const isAscii = (str: string) => {
            for (let i = 0; i < str.length; i++){
                if (str.charCodeAt(i) > 127){
                    return false;
                }
            }
            return true;
        };
        return id.indexOf("%") == -1 && isAscii(id);
    }
};

const validateField = (value: string | undefined | null): ValidType => {
    const isValid: boolean = checkIdValid(value);
    if (!isValid) {
        return "error";
    }
    if (value === undefined || value === null || value === "") {
        return "default";
    }
    return "success";
};

const validateContent = (content: string | undefined | null): ValidType => {
    const isValid: boolean = !isStringEmptyOrUndefined(content);
    if (!isValid) {
        return "error";
    }
    return "success";
};


const EMPTY_FORM_DATA: CreateDraft = {
    groupId: "",
    draftId: "",
    version: "",
    type: "",
    name: "",
    description: "",
    labels: { },
    content: "",
    contentType: "",
};


type DraftTypeItem = {
    value?: string;
    label?: string;
    isDivider?: boolean;
};

const DRAFT_TYPES: DraftTypeItem[] = [
    {
        label: "OpenAPI",
        value: DraftType.OPENAPI
    },
    {
        label: "AsyncAPI",
        value: DraftType.ASYNCAPI
    },
    {
        label: "Apache Avro",
        value: DraftType.AVRO
    },
];

const DEFAULT_DRAFT_TYPE: DraftTypeItem = DRAFT_TYPES[0];

/**
 * Properties
 */
export type CreateDraftModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: CreateDraft) => void;
};

/**
 * Models the Create Draft modal dialog.
 */
export const CreateDraftModal: FunctionComponent<CreateDraftModalProps> = (props: CreateDraftModalProps) => {
    const [validities, setValidities] = useState<Validities>({});
    const [data, setData] = useState<CreateDraft>(EMPTY_FORM_DATA);
    const [selectedType, setSelectedType] = useState<DraftTypeItem>(DEFAULT_DRAFT_TYPE);
    const [contentTabKey, setContentTabKey] = useState(0);
    const [contentIsLoading, setContentIsLoading] = useState(false);

    const urlService: UrlService = useUrlService();

    const setGroupId = (newGroupId: string): void => {
        setData({
            ...data,
            groupId: newGroupId
        });
    };

    const setDraftId = (newDraftId: string): void => {
        setData({
            ...data,
            draftId: newDraftId
        });
    };

    const setDraftType = (newDraftType: string): void => {
        setData({
            ...data,
            type: newDraftType
        });
    };

    const onFileTextChange = (_event: any, value: string | undefined): void => {
        // TODO probably want to detect content type only when firing the onCreate() event, not ever time the data changes
        setData({
            ...data,
            content: value,
            contentType: detectContentType(data.type, value)
        });
    };

    const onFileClear = (): void => {
        onFileTextChange(null, undefined);
    };

    const onFileReadStarted = (): void => {
        setContentIsLoading(true);
    };

    const onFileReadFinished = (): void => {
        setContentIsLoading(false);
    };

    const setVersionNumber = (newVersion: string): void => {
        setData({
            ...data,
            version: newVersion
        });
    };

    const setVersionName = (newName: string): void => {
        setData({
            ...data,
            name: newName
        });
    };

    const setVersionDescription = (newDescription: string): void => {
        setData({
            ...data,
            description: newDescription
        });
    };

    const fireCloseEvent = (): void => {
        props.onClose();
    };

    const fireCreateEvent = (): void => {
        props.onCreate(data);
    };

    useEffect(() => {
        if (props.isOpen) {
            setData(EMPTY_FORM_DATA);
        }
    }, [props.isOpen]);

    useEffect(() => {
        setDraftType(selectedType.value as string);
    }, [selectedType]);

    useEffect(() => {
        setValidities({
            groupId: validateField(data.groupId),
            draftId: validateField(data.draftId),
            content: validateContent(data.content)
        });
    }, [data]);

    const isGroupIdValid: boolean = validities.groupId !== "error";
    const isDraftIdValid: boolean = validities.draftId !== "error";
    const isCoordinatesValid: boolean = isGroupIdValid && isDraftIdValid;
    const isContentValid: boolean = validities.content === "success";
    const isValid: boolean = isCoordinatesValid && isContentValid;

    const coordinatesStepFooter: Partial<WizardFooterProps> = {
        nextButtonProps: {
            id: "next-wizard-page"
        },
        onClose: props.onClose,
        isNextDisabled: !isCoordinatesValid
    };
    const draftContentStepFooter: Partial<WizardFooterProps> = {
        nextButtonProps: {
            id: "next-wizard-page"
        },
        onClose: props.onClose,
        isNextDisabled: !isContentValid
    };
    const draftMetadataStepFooter: Partial<WizardFooterProps> = {
        nextButtonProps: {
            id: "next-wizard-page"
        },
        nextButtonText: "Create",
        isNextDisabled: !isValid,
        onNext: fireCreateEvent,
        onClose: props.onClose,
    };

    return (
        <Modal
            title="Create Draft"
            variant="large"
            isOpen={props.isOpen}
            onClose={fireCloseEvent}
            className="create-draft-modal pf-m-redhat-font"
        >
            <Wizard title="Create Draft" height={600}>
                <WizardStep name="Draft Coordinates" id="coordinates-step" key={0} footer={coordinatesStepFooter}>
                    <Form>
                        <FormGroup label="Group Id" fieldId="group-id">
                            <TextInput
                                className="group"
                                isRequired={false}
                                type="text"
                                id="form-group"
                                data-testid="create-draft-modal-group"
                                name="form-group"
                                aria-describedby="form-group-helper"
                                value={data.groupId || ""}
                                placeholder="Group Id (optional) will use 'default' if left empty"
                                onChange={(_evt, value) => setGroupId(value)}
                                validated={validities.groupId}
                            />
                            <If condition={!isGroupIdValid}>
                                <FormHelperText>
                                    <HelperText>
                                        <HelperTextItem variant="error" icon={ <ExclamationCircleIcon /> }>Character % and non ASCII characters are not allowed</HelperTextItem>
                                    </HelperText>
                                </FormHelperText>
                            </If>
                        </FormGroup>
                        <FormGroup label="Draft Id" fieldId="draft-id">
                            <TextInput
                                className="draft-id"
                                isRequired={false}
                                type="text"
                                id="form-id"
                                data-testid="create-draft-modal-id"
                                name="form-id"
                                aria-describedby="form-id-helper"
                                value={data.draftId || ""}
                                placeholder="Draft Id (optional) unique ID will be generated if empty"
                                onChange={(_evt, value) => setDraftId(value)}
                                validated={validities.draftId}
                            />
                            <If condition={!isDraftIdValid}>
                                <FormHelperText>
                                    <HelperText>
                                        <HelperTextItem variant="error" icon={ <ExclamationCircleIcon /> }>Character % and non ASCII characters are not allowed</HelperTextItem>
                                    </HelperText>
                                </FormHelperText>
                            </If>
                        </FormGroup>
                        <FormGroup label="Version Number" fieldId="version-number">
                            <TextInput
                                className="version"
                                isRequired={false}
                                type="text"
                                id="form-version"
                                data-testid="create-draft-modal-version"
                                name="form-version"
                                aria-describedby="form-version-helper"
                                value={data.version || ""}
                                placeholder="1.0.0 (optional) will be generated if left blank"
                                onChange={(_evt, value) => setVersionNumber(value)}
                                // validated={groupValidated()}
                            />
                        </FormGroup>
                        <FormGroup label="Type" fieldId="form-draft-type" isRequired={true}>
                            <ObjectSelect
                                value={selectedType}
                                items={DRAFT_TYPES}
                                testId="create-draft-modal-type-select"
                                onSelect={setSelectedType}
                                itemIsDivider={(item) => item.isDivider}
                                itemToTestId={(item) => `create-draft-modal-${item.value}`}
                                itemToString={(item) => item.label}
                                appendTo="document"
                            />
                        </FormGroup>
                    </Form>
                </WizardStep>
                <WizardStep
                    name="Draft Content"
                    id="draft-content-step"
                    key={2}
                    footer={draftContentStepFooter}
                >
                    <Form>
                        <FormGroup label="" isRequired={false} fieldId="form-content">
                            <Tabs
                                className="content-tabs"
                                style={{ marginBottom: "8px" }}
                                activeKey={contentTabKey}
                                onSelect={(_event, eventKey) => {
                                    setContentTabKey(eventKey as number);
                                    onFileTextChange( null, undefined);
                                    _event.preventDefault();
                                    _event.stopPropagation();
                                }}
                                isBox={false}
                                role="region"
                            >
                                <Tab
                                    eventKey={0}
                                    data-testid="create-draft-from-file"
                                    title={<TabTitleText>From file</TabTitleText>}
                                    aria-label="Upload from file"
                                >
                                    <FileUpload
                                        id="draft-content"
                                        data-testid="create-draft-modal-file-upload"
                                        type="text"
                                        value={data.content || ""}
                                        isRequired={false}
                                        allowEditingUploadedText={true}
                                        onDataChange={onFileTextChange}
                                        onTextChange={onFileTextChange}
                                        onClearClick={onFileClear}
                                        onReadStarted={onFileReadStarted}
                                        onReadFinished={onFileReadFinished}
                                        isLoading={contentIsLoading}
                                    />
                                </Tab>
                                <Tab
                                    eventKey={1}
                                    data-testid="create-draft-from-url"
                                    title={<TabTitleText>From URL</TabTitleText>}
                                    aria-label="Upload from URL"
                                >
                                    <UrlUpload
                                        id="draft-content-url"
                                        urlPlaceholder="Enter a valid and accessible URL"
                                        testId="create-draft-modal-url-upload"
                                        onChange={(value) => {
                                            onFileTextChange(null, value);
                                        }}
                                        onUrlFetch={(url) => urlService.fetchUrlContent(url)}
                                    />
                                </Tab>
                            </Tabs>
                        </FormGroup>
                    </Form>
                </WizardStep>
                <WizardStep
                    name="Draft Metadata"
                    id="draft-metadata-step"
                    key={3}
                    footer={draftMetadataStepFooter}
                >
                    <Form>
                        <Grid hasGutter md={6}>
                            <GridItem span={12}>
                                <FormGroup label="Name" fieldId="draft-name">
                                    <TextInput
                                        isRequired={false}
                                        type="text"
                                        id="draft-name"
                                        data-testid="create-draft-modal-draft-metadata-name"
                                        name="draft-name"
                                        aria-describedby="draft-name-helper"
                                        value={data.name || ""}
                                        placeholder="Name of the draft (optional)"
                                        onChange={(_evt, value) => setVersionName(value)}
                                    />
                                </FormGroup>
                            </GridItem>

                            <GridItem span={12}>
                                <FormGroup label="Description" fieldId="draft-description">
                                    <TextArea
                                        isRequired={false}
                                        id="draft-description"
                                        data-testid="create-draft-modal-draft-metadata-description"
                                        name="draft-description"
                                        aria-describedby="draft-description-helper"
                                        value={data.description || ""}
                                        placeholder="Description of the draft (optional)"
                                        style={{ height: "100px" }}
                                        onChange={(_evt, value) => setVersionDescription(value)}
                                    />
                                </FormGroup>
                            </GridItem>
                        </Grid>
                    </Form>
                </WizardStep>
            </Wizard>
        </Modal>
    );

};
