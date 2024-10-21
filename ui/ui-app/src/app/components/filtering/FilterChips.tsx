import { FunctionComponent } from "react";
import { Chip, ChipGroup } from "@patternfly/react-core";
import { FilterCriteria } from "@app/components";

export type FilterChipsProps = {
    criteria: FilterCriteria[];
    onClearAllCriteria: () => void;
    onRemoveCriteria: (criteria: FilterCriteria) => void;
};

/**
 * Models a collection of chips representing the current filter state (multiple filter criteria).
 */
export const FilterChips: FunctionComponent<FilterChipsProps> = (props: FilterChipsProps) => {

    return (
        <ChipGroup categoryName="Filters" isClosable onClick={props.onClearAllCriteria}>
            {props.criteria.map((fc, idx) => (
                <Chip key={idx} onClick={() => props.onRemoveCriteria(fc)}>
                    <b>{fc.filterBy.label}</b>
                    <span>: </span>
                    <span>{fc.filterValue}</span>
                </Chip>
            ))}
        </ChipGroup>
    );

};
