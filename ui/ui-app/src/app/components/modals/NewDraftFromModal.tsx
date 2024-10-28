import { FunctionComponent, useEffect, useState } from "react";
import {
    Alert,
    Button,
    Form,
    FormGroup,
    FormHelperText,
    HelperText, HelperTextItem,
    Modal,
    Spinner,
    TextInput
} from "@patternfly/react-core";
import { SearchedVersion } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { GroupsService, useGroupsService } from "@services/useGroupsService.ts";
import { If } from "@apicurio/common-ui-components";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

export type ValidType = "default" | "success" | "error";

export type Validities = {
    groupId?: ValidType;
    draftId?: ValidType;
    version?: ValidType;
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

/**
 * Properties
 */
export type NewDraftFromModalProps = {
    fromVersion: SearchedVersion;
    isOpen: boolean;
    onClose: () => void;
    onCreate: (fromVersion: SearchedVersion, groupId: string, draftId: string, version: string) => void;
};

const deriveVersion = (fromVersion: string): string => {
    // Regex patterns for different version formats
    const numberRegex = /^\d+$/; // Single number: 42

    if (fromVersion.indexOf(".") > 0) {
        const idx: number = fromVersion.lastIndexOf(".");
        const lastComponent: string = fromVersion.substring(idx + 1);
        const prefix: string = fromVersion.substring(0, idx + 1);
        return prefix + (parseInt(lastComponent, 10) + 1);
    } else if (numberRegex.test(fromVersion)) {
        // If the version is a single number, increment it
        return (parseInt(fromVersion, 10) + 1).toString();
    } else {
        // If there is no numeric component, append "2" to the version string
        return fromVersion + "2";
    }
};

export const NewDraftFromModal: FunctionComponent<NewDraftFromModalProps> = (props: NewDraftFromModalProps) => {
    const [validities, setValidities] = useState<Validities>({});
    const [groupId, setGroupId] = useState("");
    const [draftId, setDraftId] = useState("");
    const [version, setVersion] = useState("");
    const [isValidatingCoordinates, setIsValidatingCoordinates] = useState(false);
    const [isCoordinatesAvailable, setIsCoordinatesAvailable] = useState(true);
    const [timeoutId, setTimeoutId] = useState<any>();

    const groups: GroupsService = useGroupsService();

    const validateCoordinates = (): void => {
        setIsValidatingCoordinates(true);
        groups.getArtifactVersionMetaData(groupId, draftId, version).then(() => {
            setIsCoordinatesAvailable(false);
            setIsValidatingCoordinates(false);
        }).catch(() => {
            setIsCoordinatesAvailable(true);
            setIsValidatingCoordinates(false);
        });
    };

    useEffect(() => {
        if (props.isOpen) {
            setGroupId(props.fromVersion.groupId || "default");
            setDraftId(props.fromVersion.artifactId!);
            setVersion(deriveVersion(props.fromVersion?.version || ""));
        }
    }, [props.isOpen]);

    useEffect(() => {
        setValidities({
            groupId: validateField(groupId),
            draftId: validateField(draftId)
        });
    }, [groupId, draftId, version]);

    useEffect(() => {
        const isGroupIdValid: boolean = validateField(groupId) !== "error";
        const isDraftIdValid: boolean = validateField(draftId) !== "error";

        if (draftId && draftId.length > 0 && version && version.length > 0 && isGroupIdValid && isDraftIdValid) {
            setIsCoordinatesAvailable(false);
            setIsValidatingCoordinates(true);
            // Debounce the validation logic because it hits the REST API each time.
            clearTimeout(timeoutId);
            setTimeoutId(setTimeout(validateCoordinates, 1000));
        } else {
            setIsCoordinatesAvailable(true);
        }
    }, [groupId, draftId, version]);

    const isGroupIdValid: boolean = validities.groupId !== "error";
    const isDraftIdValid: boolean = validities.draftId !== "error";
    const isCoordinatesValid: boolean = isGroupIdValid && isDraftIdValid;
    const isValid: boolean = isCoordinatesValid && isCoordinatesAvailable;

    return (
        <Modal
            title="Create new draft version"
            variant="medium"
            isOpen={props.isOpen}
            onClose={props.onClose}
            className="create-draft-from pf-m-redhat-font"
            description="Create a new draft from the content in this artifact version.  This will create a new editable version of the artifact."
            actions={[
                <Button key="create" variant="primary" data-testid="modal-btn-create" onClick={() => {
                    props.onCreate(props.fromVersion, groupId, draftId, version); }} isDisabled={!isValid}>Create</Button>,
                <Button key="cancel" variant="link" data-testid="modal-btn-cancel" onClick={props.onClose}>Cancel</Button>
            ]}
        >
            <Form>
                <FormGroup label="Group Id" fieldId="group-id">
                    <TextInput
                        className="groupId"
                        isRequired={false}
                        type="text"
                        id="form-groupId"
                        data-testid="create-draft-modal-groupId"
                        name="form-groupId"
                        aria-describedby="form-groupId-helper"
                        value={groupId}
                        placeholder="Group Id (optional) will use 'default' if left empty"
                        validated={validities.groupId}
                        onChange={(_evt, value) => setGroupId(value)}
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
                        className="draftId"
                        isRequired={false}
                        type="text"
                        id="form-draftId"
                        data-testid="create-draft-modal-draftId"
                        name="form-draftId"
                        aria-describedby="form-draftId-helper"
                        value={draftId}
                        placeholder="Draft Id (optional) unique ID will be generated if empty"
                        validated={validities.draftId}
                        onChange={(_evt, value) => setDraftId(value)}
                    />
                    <If condition={!isDraftIdValid}>
                        <FormHelperText>
                            <HelperText>
                                <HelperTextItem variant="error" icon={ <ExclamationCircleIcon /> }>Character % and non ASCII characters are not allowed</HelperTextItem>
                            </HelperText>
                        </FormHelperText>
                    </If>
                </FormGroup>
                <FormGroup label="Version" fieldId="form-version" isRequired={true}>
                    <TextInput
                        className="version"
                        isRequired={false}
                        type="text"
                        id="form-version"
                        data-testid="create-draft-modal-version"
                        name="form-version"
                        aria-describedby="form-version-helper"
                        value={version}
                        placeholder="1.0.0 (optional) will be generated if left blank"
                        validated={validities.version}
                        onChange={(_evt, value) => setVersion(value)}
                    />
                </FormGroup>
                <If condition={isValidatingCoordinates}>
                    <FormGroup>
                        <Alert customIcon={<Spinner size="sm" />} title="Validating draft coordinates..." />
                    </FormGroup>
                </If>
                <If condition={!isValidatingCoordinates && isCoordinatesAvailable}>
                    <FormGroup>
                        <Alert variant="success" title="Draft coordinates available, draft should be created successfully." ouiaId="SuccessAlert" />
                    </FormGroup>
                </If>
                <If condition={!isValidatingCoordinates && !isCoordinatesAvailable}>
                    <FormGroup>
                        <Alert variant="danger" title="Draft coordinates unavailable." ouiaId="DangerAlert" />
                    </FormGroup>
                </If>
                <span>&nbsp;</span>
            </Form>
        </Modal>
    );

};
