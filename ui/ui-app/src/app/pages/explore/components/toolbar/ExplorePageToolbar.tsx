import { FunctionComponent, useState } from "react";
import "./ExplorePageToolbar.css";
import {
    Button,
    ButtonVariant,
    capitalize,
    Form,
    InputGroup,
    TextInput,
    Toolbar,
    ToolbarContent,
    ToolbarItem
} from "@patternfly/react-core";
import { SearchIcon, SortAlphaDownAltIcon, SortAlphaDownIcon } from "@patternfly/react-icons";
import { OnPerPageSelect, OnSetPage } from "@patternfly/react-core/dist/js/components/Pagination/Pagination";
import { If, ObjectSelect } from "@apicurio/common-ui-components";
import { ExploreType } from "@app/pages/explore/ExploreType.ts";
import { Paging } from "@models/Paging.ts";
import { FilterBy } from "@services/useSearchService.ts";
import { GroupSearchResults } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";

export type ExplorePageToolbarFilterCriteria = {
    filterBy: FilterBy;
    filterValue: string;
    ascending: boolean;
};

export type ExplorePageToolbarProps = {
    exploreType: ExploreType;
    results: GroupSearchResults;
    onExploreTypeChange: (exploreType: ExploreType) => void;
    onCriteriaChange: (criteria: ExplorePageToolbarFilterCriteria) => void;
    criteria: ExplorePageToolbarFilterCriteria;
    paging: Paging;
    onPerPageSelect: OnPerPageSelect;
    onSetPage: OnSetPage;
};

type FilterType = {
    value: FilterBy;
    label: string;
    testId: string;
};
const GROUP_FILTER_TYPES: FilterType[] = [
    { value: FilterBy.groupId, label: "Group", testId: "group-filter-typegroup" },
    { value: FilterBy.description, label: "Description", testId: "group-filter-typedescription" },
    { value: FilterBy.labels, label: "Labels", testId: "group-filter-typelabels" },
];

/**
 * Models the toolbar for the Explore page.
 */
export const ExplorePageToolbar: FunctionComponent<ExplorePageToolbarProps> = (props: ExplorePageToolbarProps) => {
    const [groupFilterType, setGroupFilterType] = useState(GROUP_FILTER_TYPES[0]);
    const [filterValue, setFilterValue] = useState("");
    const [filterAscending, setFilterAscending] = useState(true);

    const onFilterSubmit = (event: any | undefined): void => {
        const filterTypeValue: FilterBy = groupFilterType.value;
        fireChangeEvent(filterAscending, filterTypeValue, filterValue);
        if (event) {
            event.preventDefault();
        }
    };

    const onGroupFilterTypeChange = (newType: FilterType): void => {
        setGroupFilterType(newType);
        fireChangeEvent(filterAscending, newType.value, filterValue);
    };

    const onToggleAscending = (): void => {
        const filterTypeValue: FilterBy = groupFilterType.value;
        const newAscending: boolean = !filterAscending;
        setFilterAscending(newAscending);
        fireChangeEvent(newAscending, filterTypeValue, filterValue);
    };

    const fireChangeEvent = (ascending: boolean, filterBy: FilterBy, filterValue: string): void => {
        const criteria: ExplorePageToolbarFilterCriteria = {
            ascending,
            filterBy,
            filterValue
        };
        props.onCriteriaChange(criteria);
    };

    const onExploreTypeChange = (newExploreType: ExploreType): void => {
        setFilterAscending(true);
        setFilterValue("");
        if (newExploreType === ExploreType.GROUP) {
            setGroupFilterType(GROUP_FILTER_TYPES[0]);
        }
        props.onExploreTypeChange(newExploreType);
    };

    return (
        <Toolbar id="artifacts-toolbar-1" className="artifacts-toolbar">
            <ToolbarContent>
                <ToolbarItem variant="label">
                    Search for
                </ToolbarItem>
                <ToolbarItem className="filter-item">
                    <ObjectSelect
                        value={props.exploreType}
                        items={[ExploreType.GROUP]}
                        testId="explore-type-select"
                        toggleClassname="explore-type-toggle"
                        onSelect={onExploreTypeChange}
                        itemToTestId={(item) => `explore-type-${item.toString().toLowerCase()}`}
                        itemToString={(item) => capitalize(item.toString().toLowerCase())}/>
                </ToolbarItem>
                <ToolbarItem variant="label">
                    filter by
                </ToolbarItem>
                <ToolbarItem className="filter-item">
                    <Form onSubmit={onFilterSubmit}>
                        <InputGroup>
                            <If condition={props.exploreType === ExploreType.GROUP}>
                                <ObjectSelect
                                    value={groupFilterType}
                                    items={GROUP_FILTER_TYPES}
                                    testId="group-filter-type-select"
                                    toggleClassname="group-filter-type-toggle"
                                    onSelect={onGroupFilterTypeChange}
                                    itemToTestId={(item) => item.testId}
                                    itemToString={(item) => item.label}/>
                            </If>
                            <TextInput name="filterValue" id="filterValue" type="search"
                                value={filterValue}
                                onChange={(_evt, value) => setFilterValue(value)}
                                data-testid="artifact-filter-value"
                                aria-label="search input example"/>
                            <Button variant={ButtonVariant.control}
                                onClick={onFilterSubmit}
                                data-testid="artifact-filter-search"
                                aria-label="search button for search input">
                                <SearchIcon/>
                            </Button>
                        </InputGroup>
                    </Form>
                </ToolbarItem>
                <ToolbarItem className="sort-icon-item">
                    <Button variant="plain" aria-label="edit" data-testid="artifact-filter-sort"
                        onClick={onToggleAscending}>
                        {
                            filterAscending ? <SortAlphaDownIcon/> : <SortAlphaDownAltIcon/>
                        }
                    </Button>
                </ToolbarItem>
            </ToolbarContent>
        </Toolbar>
    );

};
