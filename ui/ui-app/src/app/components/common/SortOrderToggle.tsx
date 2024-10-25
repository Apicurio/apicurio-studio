import { FunctionComponent } from "react";
import { SortOrder } from "@models/SortOrder.ts";
import { SortAlphaDownAltIcon, SortAlphaDownIcon } from "@patternfly/react-icons";
import { Button } from "@patternfly/react-core";

export type SortOrderToggleProps = {
    sortOrder: SortOrder;
    onChange: (sortOrder: SortOrder) => void;
}


export const SortOrderToggle: FunctionComponent<SortOrderToggleProps> = (props: SortOrderToggleProps) => {

    const icon = props.sortOrder === SortOrder.asc ? (
        <SortAlphaDownIcon />
    ) : (
        <SortAlphaDownAltIcon />
    );

    return (
        <Button variant="plain" children={icon} onClick={() => {
            props.onChange(props.sortOrder === SortOrder.asc ? SortOrder.desc : SortOrder.asc);
        }} />
    );

};
