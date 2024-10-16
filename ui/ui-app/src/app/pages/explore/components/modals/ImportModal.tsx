import { FunctionComponent, useState } from "react";
import {
    Button,
    FileUpload,
    Form,
    FormGroup,
    FormHelperText,
    HelperText,
    HelperTextItem,
    Modal
} from "@patternfly/react-core";


/**
 * Properties
 */
export type ImportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onImport: (file: File | undefined) => void;
};

/**
 * Models the Import from .ZIP modal dialog.
 */
export const ImportModal: FunctionComponent<ImportModalProps> = (props: ImportModalProps) => {
    const [filename, setFilename] = useState<string>("");
    const [file, setFile] = useState<File>();
    const [isFormValid, setFormValid] = useState<boolean>(false);

    const onFileChange = (_event: any, file: File): void => {
        const filename: string = file.name;
        const isValid: boolean = filename.toLowerCase().endsWith(".zip");
        setFilename(filename);
        setFile(file);
        setFormValid(isValid);
    };

    const fireCloseEvent = (): void => {
        props.onClose();
        setFilename("");
        setFile(undefined);
        setFormValid(false);
    };

    const fireImportEvent = (): void => {
        props.onImport(file);
        setFilename("");
        setFile(undefined);
        setFormValid(false);
    };

    return (
        <Modal
            title="Import from .ZIP"
            variant="medium"
            isOpen={props.isOpen}
            onClose={fireCloseEvent}
            className="import-modal pf-m-redhat-font"
            actions={[
                <Button key="import" variant="primary" data-testid="import-modal-btn-import" onClick={fireImportEvent} isDisabled={!isFormValid}>Import</Button>,
                <Button key="cancel" variant="link" data-testid="import-modal-btn-cancel" onClick={fireCloseEvent}>Cancel</Button>
            ]}
        >
            <Form>
                <FormGroup isRequired={false} fieldId="form-summary">
                    <p>
                        Select a .zip file previously exported from a Registry instance.
                    </p>
                </FormGroup>
                <FormGroup
                    label="ZIP File"
                    isRequired={true}
                    fieldId="form-file"
                >
                    <FileUpload
                        id="import-content"
                        data-testid="form-import"
                        filename={filename}
                        filenamePlaceholder="Drag and drop or choose a .zip file"
                        isRequired={true}
                        onFileInputChange={onFileChange}
                    />
                    <FormHelperText>
                        <HelperText>
                            <HelperTextItem>File format must be .zip</HelperTextItem>
                        </HelperText>
                    </FormHelperText>
                </FormGroup>
            </Form>
        </Modal>
    );

};
