import { FunctionComponent } from "react";
import { Button, CodeBlock, CodeBlockCode, Modal, ModalVariant } from "@patternfly/react-core";

export type ErrorModalProps = {
    title: string | undefined;
    message: string | undefined;
    error: any | undefined;
    isOpen: boolean | undefined;
    onClose: () => void;
}

function formatError(reason: string): string {
    return reason.replaceAll("\\n", "\n").replaceAll("\\t", "\t");
}

export const ErrorModal: FunctionComponent<ErrorModalProps> = ({ error, title, message, isOpen, onClose }: ErrorModalProps) => {
    const errorMessage: string = message || error?.message || "An unexpected error was detected.  Details about the error can be found below.";
    const errorContent: string = error?.reason ? formatError(error?.reason) : JSON.stringify(error, null, 4);

    return (
        <Modal
            variant={ModalVariant.medium}
            title={title || "Error detected"}
            isOpen={isOpen}
            onClose={onClose}
            actions={[
                <Button key="close" variant="primary" onClick={onClose}>Close</Button>,
            ]}
        >
            <p>
                { errorMessage }
            </p>
            <div>
                <CodeBlock>
                    <CodeBlockCode id="error" style={{ overflow: "auto", whiteSpace: "pre" }}>{errorContent}</CodeBlockCode>
                </CodeBlock>
            </div>
        </Modal>
    );
};
