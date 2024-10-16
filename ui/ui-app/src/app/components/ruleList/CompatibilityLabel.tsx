import { FunctionComponent } from "react";
import { If } from "@apicurio/common-ui-components";
import { Label } from "@patternfly/react-core";


/**
 * Properties
 */
export type CompatibilityLabelProps = {
    value: string;
};

const CONFIG_OPTIONS: any[] = [
    { label: "None", value: "NONE" },
    { label: "Backward", value: "BACKWARD" },
    { label: "Backward transitive", value: "BACKWARD_TRANSITIVE" },
    { label: "Forward", value: "FORWARD" },
    { label: "Forward transitive", value: "FORWARD_TRANSITIVE" },
    { label: "Full", value: "FULL" },
    { label: "Full transitive", value: "FULL_TRANSITIVE" },
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
export const CompatibilityLabel: FunctionComponent<CompatibilityLabelProps> = (props: CompatibilityLabelProps) => {

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
