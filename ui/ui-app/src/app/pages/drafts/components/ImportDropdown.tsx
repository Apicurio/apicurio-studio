import { FunctionComponent } from "react";
import { ObjectDropdown } from "@apicurio/common-ui-components";
import { ImportFrom } from "@app/pages";

type ImportDropdownItem = {
    label: string,
    shortLabel: string,
    handler: () => void;
};

/**
 * Properties
 */
export type ImportDropdownProps = {
    onImport: (from: ImportFrom) => void;
};

/**
 * A control to display the Import dropdown on the main page (used to select how to import content
 * into Apicurio Studio).
 */
export const ImportDropdown: FunctionComponent<ImportDropdownProps> = ({ onImport }: ImportDropdownProps) => {
    const items: ImportDropdownItem[] = [
        {
            label: "Import from URL",
            shortLabel: "URL",
            handler: () => {
                onImport(ImportFrom.URL);
            }
        },
        {
            label: "Import from file",
            shortLabel: "File",
            handler: () => {
                onImport(ImportFrom.FILE);
            }
        }
    ];

    return (
        <ObjectDropdown
            label="Import design"
            items={items}
            testId="drop-import-design"
            itemToString={(item) => item.label as string}
            itemToTestId={(item) => `drop-import-design-option-${item.shortLabel}`}
            noSelectionLabel="Import design"
            onSelect={item => item.handler()}
        />
    );
};
