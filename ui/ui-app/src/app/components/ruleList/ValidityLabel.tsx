import { FunctionComponent } from "react";
import { Label } from "@patternfly/react-core";
import { If } from "@apicurio/common-ui-components";


/**
 * Properties
 */
export type ValidityLabelProps = {
    value: string;
};

const CONFIG_OPTIONS: any[] = [
    { label: "Full", value: "FULL" },
    { label: "Syntax only", value: "SYNTAX_ONLY" },
    { label: "None", value: "NONE" },
];

const valueToLabel = (value: string): string => {
    if (value === "UNKNOWN") {
        return "";
    }
    return CONFIG_OPTIONS.filter(item => item.value === value)[0].label;
};

/**
 * Component.
 */
export const ValidityLabel: FunctionComponent<ValidityLabelProps> = (props: ValidityLabelProps) => {

    return (
        <>
            <If condition={props.value === "UNKNOWN"}>
                <span className="rule-value">(Not enabled)</span>
            </If>
            <If condition={props.value !== "UNKNOWN"}>
                <Label>{ valueToLabel(props.value) }</Label>
            </If>
        </>
    );

};
