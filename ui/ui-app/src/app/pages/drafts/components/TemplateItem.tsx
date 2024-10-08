import { FunctionComponent } from "react";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { Template } from "@models/templates";
import "./TemplateItem.css";

export type TemplateItemProps = {
    template: Template;
    isSelected: boolean;
    testId?: string;
    onSelect: (template: Template) => void;
}

export const TemplateItem: FunctionComponent<TemplateItemProps> = (props: TemplateItemProps) => {
    const onClick = (): void => {
        if (!props.isSelected) {
            props.onSelect(props.template);
        }
    };

    return (
        <div data-testid={props.testId} className={`template ${props.isSelected ? "selected" : ""}`} onClick={onClick}>
            <div className="icon">
                <PlusCircleIcon />
            </div>
            <div className="name">{props.template.name}</div>
        </div>
    );
};
