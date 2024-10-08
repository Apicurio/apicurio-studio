import { FunctionComponent, useState } from "react";
import "./DraftsPageToolbar.css";
import {
    Button,
    ButtonVariant,
    Form,
    InputGroup,
    Pagination,
    TextInput,
    Toolbar,
    ToolbarContent,
    ToolbarItem
} from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";
import { ObjectSelect } from "@apicurio/common-ui-components";
import { DraftsFilterBy, DraftsSearchResults } from "@models/drafts";
import { Paging } from "@models/Paging.ts";

export type DraftsPageToolbarFilterCriteria = {
    filterBy: DraftsFilterBy;
    filterValue: string;
};

export type DraftsPageToolbarProps = {
    results: DraftsSearchResults;
    criteria: DraftsPageToolbarFilterCriteria;
    paging: Paging;

    onCriteriaChange: (criteria: DraftsPageToolbarFilterCriteria) => void;
    onPageChange: (paging: Paging) => void;
    onCreateDraft: () => void;
};

type FilterType = {
    value: DraftsFilterBy;
    label: string;
    testId: string;
};
const FILTER_TYPES: FilterType[] = [
    { value: DraftsFilterBy.name, label: "Name", testId: "drafts-filter-type-name" },
    { value: DraftsFilterBy.groupId, label: "Group Id", testId: "drafts-filter-type-groupid" },
    { value: DraftsFilterBy.artifactId, label: "Artifact Id", testId: "drafts-filter-type-artifactid" },
    { value: DraftsFilterBy.description, label: "Description", testId: "drafts-filter-type-description" },
    { value: DraftsFilterBy.labels, label: "Labels", testId: "drafts-filter-type-labels" },
];


/**
 * Models the toolbar for the Drafts page.
 */
export const DraftsPageToolbar: FunctionComponent<DraftsPageToolbarProps> = (props: DraftsPageToolbarProps) => {
    const [filterType, setFilterType] = useState(FILTER_TYPES[0]);
    const [filterValue, setFilterValue] = useState("");

    const totalDraftsCount = (): number => {
        return props.results.count!;
    };

    const onFilterSubmit = (event: any|undefined): void => {
        const filterTypeValue: DraftsFilterBy = filterType.value;
        fireChangeEvent(filterTypeValue, filterValue);
        if (event) {
            event.preventDefault();
        }
    };

    const onFilterTypeChange = (newType: FilterType): void => {
        setFilterType(newType);
        fireChangeEvent(newType.value, filterValue);
    };

    const fireChangeEvent = (filterBy: DraftsFilterBy, filterValue: string): void => {
        const criteria: DraftsPageToolbarFilterCriteria = {
            filterBy,
            filterValue
        };
        props.onCriteriaChange(criteria);
    };

    const onSetPage = (_event: any, newPage: number, perPage?: number): void => {
        const newPaging: Paging = {
            page: newPage,
            pageSize: perPage ? perPage : props.paging.pageSize
        };
        props.onPageChange(newPaging);
    };

    const onPerPageSelect = (_event: any, newPerPage: number): void => {
        const newPaging: Paging = {
            page: props.paging.page,
            pageSize: newPerPage
        };
        props.onPageChange(newPaging);
    };


    return (
        <Toolbar id="drafts-toolbar-1" className="drafts-toolbar">
            <ToolbarContent>
                <ToolbarItem variant="label">
                    Search for drafts by
                </ToolbarItem>
                <ToolbarItem className="filter-item">
                    <Form onSubmit={onFilterSubmit}>
                        <InputGroup>
                            <ObjectSelect
                                value={filterType}
                                items={FILTER_TYPES}
                                testId="draft-filter-type-select"
                                toggleClassname="draft-filter-type-toggle"
                                onSelect={onFilterTypeChange}
                                itemToTestId={(item) => item.testId}
                                itemToString={(item) => item.label} />
                            <TextInput name="filterValue" id="filterValue" type="search"
                                value={filterValue}
                                onChange={(_evt, value) => setFilterValue(value)}
                                data-testid="draft-filter-value"
                                aria-label="search input example"/>
                            <Button variant={ButtonVariant.control}
                                onClick={onFilterSubmit}
                                data-testid="draft-filter-search"
                                aria-label="search button for search input">
                                <SearchIcon/>
                            </Button>
                        </InputGroup>
                    </Form>
                </ToolbarItem>
                <ToolbarItem className="create-draft-item">
                    <Button className="btn-header-create-draft" data-testid="btn-toolbar-create-draft"
                        variant="primary" onClick={props.onCreateDraft}>Create draft</Button>
                </ToolbarItem>
                <ToolbarItem className="draft-paging-item" align={{ default: "alignRight" }}>
                    <Pagination
                        variant="top"
                        dropDirection="down"
                        itemCount={totalDraftsCount()}
                        perPage={props.paging.pageSize}
                        page={props.paging.page}
                        onSetPage={onSetPage}
                        onPerPageSelect={onPerPageSelect}
                        widgetId="draft-list-pagination"
                        className="draft-list-pagination"
                    />
                </ToolbarItem>
            </ToolbarContent>
        </Toolbar>
    );

};
