import { FunctionComponent, useState } from "react";
import { ObjectSelect } from "@apicurio/common-ui-components";


/**
 * Properties
 */
export type CompatibilityDropdownProps = {
    value: string;
    onSelect: (newValue: string) => void;
};

type ConfigItem = {
    label: string;
    value: string;
    testId: string;
}

const CONFIG_OPTIONS: ConfigItem[] = [
    { label: "None", value: "NONE", testId: "compatibility-config-none" },
    { label: "Backward", value: "BACKWARD", testId: "compatibility-config-backward" },
    { label: "Backward transitive", value: "BACKWARD_TRANSITIVE", testId: "compatibility-config-backward-transitive" },
    { label: "Forward", value: "FORWARD", testId: "compatibility-config-forward" },
    { label: "Forward transitive", value: "FORWARD_TRANSITIVE", testId: "compatibility-config-forward-transitive" },
    { label: "Full", value: "FULL", testId: "compatibility-config-full" },
    { label: "Full transitive", value: "FULL_TRANSITIVE", testId: "compatibility-config-full-transitive" },
];

const valueToItem = (value: string): ConfigItem => {
    return CONFIG_OPTIONS.filter(item => item.value === value)[0];
};

/**
 * Component.
 */
export const CompatibilitySelect: FunctionComponent<CompatibilityDropdownProps> = (props: CompatibilityDropdownProps) => {
    const [currentValue, setCurrentValue] = useState(valueToItem(props.value));

    const onSelect = (item: any): void => {
        setCurrentValue(item);
        props.onSelect(item.value);
    };

    return (
        <ObjectSelect
            value={currentValue}
            items={CONFIG_OPTIONS}
            onSelect={onSelect}
            testId="rules-compatibility-config-toggle"
            itemToTestId={item => item.testId}
            itemToString={item => item.label} />
    );

};
