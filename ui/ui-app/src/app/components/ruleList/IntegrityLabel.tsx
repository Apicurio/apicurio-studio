import { FunctionComponent, useEffect, useState } from "react";
import { Label } from "@patternfly/react-core";
import { If } from "@apicurio/common-ui-components";


/**
 * Properties
 */
export type IntegrityLabelProps = {
    value: string;
};

export const IntegrityLabel: FunctionComponent<IntegrityLabelProps> = ({ value }: IntegrityLabelProps) => {
    const [selectedItems, setSelectedItems] = useState(["FULL"]);

    const parseValue = (value: string): string[] => {
        if (value) {
            return value.split(",").filter(value => value && value.trim().length > 0);
        }
        return [];
    };

    useEffect(() => {
        setSelectedItems(parseValue(value));
    }, [value]);

    const valueToLabel = (value: string): string => {
        switch (value) {
            case "FULL":
                return "Full";
            case "NONE":
                return "None";
            case "NO_DUPLICATES":
                return "No duplicates";
            case "REFS_EXIST":
                return "Refs must exist";
            case "ALL_REFS_MAPPED":
                return "No unmapped refs";
        }
        return "";
    };

    return (
        <>
            <If condition={value === "UNKNOWN"}>
                <span className="rule-value">(Not enabled)</span>
            </If>
            <If condition={value !== "UNKNOWN"}>
                {
                    selectedItems.map((value, idx) =>
                        <Label key={idx} style={{ marginLeft: "3px" }}>{ valueToLabel(value) }</Label>)
                }
            </If>
        </>
    );
};
