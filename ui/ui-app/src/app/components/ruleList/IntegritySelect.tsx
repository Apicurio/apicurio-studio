import React, { FunctionComponent, useEffect, useState } from "react";
import { MenuToggle, MenuToggleElement, Select, SelectList, SelectOption, Tooltip } from "@patternfly/react-core";


/**
 * Properties
 */
export type IntegritySelectProps = {
    value: string;
    onSelect: (newValue: string) => void;
};

export const IntegritySelect: FunctionComponent<IntegritySelectProps> = ({ value, onSelect }: IntegritySelectProps) => {
    const menuRef = React.useRef<HTMLDivElement>(null);
    const [isOpen, setOpen] = useState<boolean>(false);
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

    const onToggle = (): void => {
        setOpen(!isOpen);
    };

    const onOpenChange = (isOpen: boolean): void => {
        if (!isOpen) {
            const newValue: string = selectedItems.join(",");
            if (newValue !== value) {
                onSelect(newValue);
            }
        }
        setOpen(isOpen);
    };

    const doSelect = (_event: any, itemId: string | number | undefined): void => {
        let newSelectedItems: string[];

        if (selectedItems.includes(itemId as string)) {
            newSelectedItems = selectedItems.filter(item => item !== itemId);
        } else {
            newSelectedItems = [...selectedItems, itemId as string];
        }

        if ((itemId === "FULL" || itemId == "NONE") && newSelectedItems.includes(itemId as string)) {
            newSelectedItems = [itemId as string];
        } else {
            newSelectedItems = newSelectedItems.filter(item => item !== "NONE" && item !== "FULL");
        }

        // Handle the case where there aren't any items in the array.  The user has deselected *everything*
        if (newSelectedItems.length === 0) {
            newSelectedItems = ["NONE"];
        }

        setSelectedItems(newSelectedItems);
    };

    const displayValue = (): string => {
        if (selectedItems.length === 1) {
            switch (selectedItems[0]) {
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
        } else {
            return "(Multiple)";
        }

        return "";
    };

    const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
            ref={toggleRef}
            onClick={onToggle}
            isExpanded={isOpen}
            data-testid="rules-integrity-config-toggle"
            style={{ width: "200px" }}
        >
            <span>{ displayValue() }</span>
        </MenuToggle>
    );

    return (
        <Select
            id="integrity-select"
            ref={menuRef}
            isOpen={isOpen}
            selected={selectedItems}
            onSelect={doSelect}
            onOpenChange={onOpenChange}
            toggle={toggle}
        >
            <SelectList>
                <SelectOption data-testid="integrity-config-none" hasCheckbox itemId="NONE" isSelected={selectedItems.includes("NONE")}>
                    <Tooltip content={<div>The rule will do nothing.</div>}>
                        <span>None</span>
                    </Tooltip>
                </SelectOption>
                <SelectOption data-testid="integrity-config-no-duplicates" hasCheckbox itemId="NO_DUPLICATES" isSelected={selectedItems.includes("NO_DUPLICATES")}>
                    <Tooltip content={<div>Disallows multiple mappings for the same reference (even when the mapping is the same).</div>}>
                        <span>No duplicates</span>
                    </Tooltip>
                </SelectOption>
                <SelectOption data-testid="integrity-config-refs-exist" hasCheckbox itemId="REFS_EXIST" isSelected={selectedItems.includes("REFS_EXIST")}>
                    <Tooltip content={<div>Ensures that all provided reference mappings point to existing artifacts.</div>}>
                        <span>Refs must exist</span>
                    </Tooltip>
                </SelectOption>
                <SelectOption data-testid="integrity-config-all-refs-mapped" hasCheckbox itemId="ALL_REFS_MAPPED" isSelected={selectedItems.includes("ALL_REFS_MAPPED")}>
                    <Tooltip content={<div>Requires that all references found in the content being registered have an appropriate mapping.</div>}>
                        <span>No unmapped refs</span>
                    </Tooltip>
                </SelectOption>
                <SelectOption data-testid="integrity-config-full" hasCheckbox itemId="FULL" isSelected={selectedItems.includes("FULL")}>
                    <Tooltip content={<div>Enable all of the above settings.</div>}>
                        <span>Full (all)</span>
                    </Tooltip>
                </SelectOption>
            </SelectList>
        </Select>
    );
};
