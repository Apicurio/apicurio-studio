import { FunctionComponent, useEffect, useState } from "react";
import "./CompareModal.css";
import { Modal, ToggleGroup, ToggleGroupItem } from "@patternfly/react-core";
import { editor } from "monaco-editor";
import { DiffEditor } from "@monaco-editor/react";
import { ArrowsAltHIcon } from "@patternfly/react-icons";
import IDiffEditorConstructionOptions = editor.IDiffEditorConstructionOptions;
import { contentToString } from "@utils/content.utils.ts";

/**
 * Properties
 */
export type CompareModalProps = {
    isOpen: boolean|undefined;
    before: any;
    beforeName: string;
    after: any;
    afterName: string;
    onClose: () => void;
};

export const CompareModal: FunctionComponent<CompareModalProps> = ({ isOpen, onClose, before, beforeName, after, afterName }: CompareModalProps) => {
    const [diffEditorContentOptions, setDiffEditorContentOptions] = useState({
        renderSideBySide: true,
        automaticLayout: true,
        wordWrap: "off",
        readOnly: true,
        inDiffEditor: true,
        originalAriaLabel: "Original",
        modifiedAriaLabel: "Modified"
    } as IDiffEditorConstructionOptions);

    const [beforeAsString, setBeforeAsString] = useState<string>();
    const [afterAsString, setAfterAsString] = useState<string>();

    const [isDiffInline, setIsDiffInline] = useState(false);
    const [isDiffWrapped, setIsDiffWrapped] = useState(false);

    const switchInlineCompare = () => {
        setDiffEditorContentOptions({
            ...diffEditorContentOptions as IDiffEditorConstructionOptions,
            renderSideBySide: !diffEditorContentOptions.renderSideBySide
        });
        setIsDiffInline(!!diffEditorContentOptions.renderSideBySide);
    };

    const switchWordWrap = () => {
        setDiffEditorContentOptions({
            ...diffEditorContentOptions as IDiffEditorConstructionOptions,
            wordWrap: diffEditorContentOptions.wordWrap == "off" ? "on" : "off"
        });
        setIsDiffWrapped(diffEditorContentOptions.wordWrap != "on");
    };

    useEffect(() => {
        setBeforeAsString(contentToString(before));
    }, [before]);

    useEffect(() => {
        setAfterAsString(contentToString(after));
    }, [after]);

    return (
        <Modal id="compare-modal"
            title="Unsaved changes"
            isOpen={isOpen}
            onClose={onClose}>
            <div className="compare-view">
                <ToggleGroup className="compare-toggle-group"
                    aria-label="Compare view toggle group">
                    <ToggleGroupItem text="Inline" key={1} buttonId="second"
                        isSelected={isDiffInline}
                        onChange={switchInlineCompare}/>
                    <ToggleGroupItem text="Wrap text" key={0} buttonId="first"
                        isSelected={isDiffWrapped}
                        onChange={switchWordWrap}/>
                </ToggleGroup>
                <div className="compare-label">
                    <span className="before">Original: {beforeName}</span>
                    <span className="divider">
                        <ArrowsAltHIcon />
                    </span>
                    <span className="after">Modified: {afterName}</span>
                </div>
                <div className="compare-editor">
                    <DiffEditor
                        className="text-editor"
                        original={beforeAsString}
                        modified={afterAsString}
                        options={diffEditorContentOptions}
                    />
                </div>
            </div>
        </Modal>
    );
};
