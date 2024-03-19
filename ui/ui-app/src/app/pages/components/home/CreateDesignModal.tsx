import { FunctionComponent, useEffect, useState } from "react";
import {
    Button,
    Form,
    FormGroup,
    Gallery,
    GalleryItem,
    Modal,
    ModalVariant,
    Spinner,
    TextArea,
    TextInput
} from "@patternfly/react-core";
import { ArtifactTypes, CreateDesign } from "@models/designs";
import { Template } from "@models/templates";
import { TemplatesService, useTemplatesService } from "@services/useTemplatesService.ts";
import { OPENAPI_VERSIONS, TemplateItem, TYPE_ITEMS, TypeItem } from "@app/pages";
import { If, ObjectSelect } from "@apicurio/common-ui-components";

export type CreateDesignModalProps = {
    isOpen: boolean|undefined;
    isCreating: boolean|undefined;
    onCreate: (event: CreateDesign, template: Template) => void;
    onCancel: () => void;
}

export const CreateDesignModal: FunctionComponent<CreateDesignModalProps> = ({ isOpen, isCreating, onCreate, onCancel }: CreateDesignModalProps) => {
    const [isValid, setValid] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [typeSelection, setTypeSelection] = useState<TypeItem>(TYPE_ITEMS[0]);
    const [type, setType] = useState(ArtifactTypes.OPENAPI);
    const [version, setVersion] = useState("");

    const [templates, setTemplates] = useState<Template[]>();
    const [template, setTemplate] = useState<Template>();

    const templatesSvc: TemplatesService = useTemplatesService();

    // Called when the user clicks the Create button in the modal
    const doCreate = (): void => {
        const cd: CreateDesign = {
            type,
            name,
            description,
            origin: "create"
        };
        onCreate(cd, template as Template);
    };

    // Validate the form inputs.
    useEffect(() => {
        let valid: boolean = true;
        if (!name) {
            valid = false;
        }
        if (!type) {
            valid = false;
        }
        if (!template) {
            valid = false;
        }
        setValid(valid);
    }, [name, description, type, template]);

    // Whenever the modal is opened, set default values for the form.
    useEffect(() => {
        setName("");
        setDescription("");
        setType(ArtifactTypes.OPENAPI);
        setTypeSelection(TYPE_ITEMS[0]);
        setVersion("3.0.3");
        if (templates) {
            setTemplate(templates[0]);
        } else {
            setTemplate(undefined);
        }
    }, [isOpen]);

    // The type selection was changed - set the type
    useEffect(() => {
        setType(typeSelection.value);
    }, [typeSelection]);

    // Whenever the type changes, load the templates for that type. If the type is
    // OpenAPI, set the version to "3.0.3".
    useEffect(() => {
        let newVersion: string = "";
        if (type === ArtifactTypes.OPENAPI) {
            newVersion = "3.0.3";
        }
        setVersion(newVersion);
        templatesSvc.getTemplatesFor(type, newVersion).then(setTemplates);
    }, [type]);

    // Whenever the version changes, fetch the templates for the current type and version.
    useEffect(() => {
        templatesSvc.getTemplatesFor(type, version).then(setTemplates);
    }, [version]);

    // Whenever the templates changes, auto-select the first one
    useEffect(() => {
        if (templates && templates.length > 0) {
            setTemplate(templates[0]);
        }
    }, [templates]);

    return (
        <Modal
            variant={ModalVariant.medium}
            title="Create a design"
            isOpen={isOpen}
            onClose={onCancel}
            actions={[
                <Button key="create" variant="primary" isDisabled={!isValid || isCreating} onClick={doCreate} data-testid="btn-modal-create">
                    <If condition={!!isCreating}>
                        <Spinner size="sm" style={{ marginRight: "5px" }} />
                        Creating
                    </If>
                    <If condition={!isCreating}>
                        Create
                    </If>
                </Button>,
                <Button key="cancel" variant="link" onClick={onCancel} data-testid="btn-modal-cancel">
                    Cancel
                </Button>
            ]}
        >
            <Form>
                <FormGroup label="Name" isRequired={true} fieldId="create-design-name">
                    <TextInput
                        isRequired
                        type="text"
                        id="create-design-name"
                        data-testid="text-design-name"
                        name="create-design-name"
                        aria-describedby="create-design-name-helper"
                        value={name}
                        onChange={(_event, value) => {setName(value);}}
                    />
                </FormGroup>
                <FormGroup label="Description" fieldId="create-design-description">
                    <TextArea
                        type="text"
                        id="create-design-description"
                        data-testid="textarea-design-description"
                        name="create-design-description"
                        aria-describedby="create-design-description-helper"
                        value={description}
                        onChange={(_event, value) => {setDescription(value);}}
                    />
                </FormGroup>
                <FormGroup label="Type" isRequired={true} fieldId="create-design-type">
                    <ObjectSelect
                        value={typeSelection}
                        testId="select-design-type"
                        items={TYPE_ITEMS}
                        onSelect={setTypeSelection}
                        itemToTestId={item => `select-design-type-item-${item.value}`}
                        itemToString={item => item.label} />
                </FormGroup>
                <If condition={type === ArtifactTypes.OPENAPI}>
                    <FormGroup label="Version" isRequired={true} fieldId="create-design-version">
                        <ObjectSelect
                            value={version}
                            testId="select-design-version"
                            items={OPENAPI_VERSIONS}
                            onSelect={setVersion}
                            itemToTestId={item => `select-design-version-item-${item}`}
                            itemToString={item => item} />
                    </FormGroup>
                </If>
                <If condition={(templates && templates.length > 1) as boolean}>
                    <FormGroup label="Template" fieldId="create-design-template">
                        <Gallery hasGutter minWidths={{ default: "125px" }} maxWidths={{ default: "125px" }}>
                            {
                                templates?.map(t => (
                                    <GalleryItem key={t.id}>
                                        <TemplateItem testId={`template-${t.id}`} template={t} isSelected={t === template} onSelect={() => {
                                            setTemplate(t);
                                        }} />
                                    </GalleryItem>
                                ))
                            }
                        </Gallery>
                    </FormGroup>
                </If>
            </Form>
        </Modal>
    );
};
