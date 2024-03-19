import { FunctionComponent, useEffect, useState } from "react";
import {
    Button,
    OnPerPageSelect,
    OnSetPage,
    Pagination,
    SearchInput,
    Toolbar,
    ToolbarContent,
    ToolbarItem
} from "@patternfly/react-core";
import { DesignsSearchCriteria, DesignsSearchResults, Paging } from "@models/designs";
import { ImportDropdown, ImportFrom } from "@app/pages";


/**
 * Properties
 */
export type DesignsToolbarProps = {
    criteria: DesignsSearchCriteria;
    paging: Paging;
    designs?: DesignsSearchResults;
    onCriteriaChange: (criteria: DesignsSearchCriteria) => void;
    onPagingChange: (paging: Paging) => void;
    onCreate: () => void;
    onImport: (from: ImportFrom) => void;
};


/**
 * The toolbar to filter (and paginate) the collection of designs.
 */
export const DesignsToolbar: FunctionComponent<DesignsToolbarProps> = (
    { criteria, paging, designs, onCriteriaChange, onPagingChange, onCreate, onImport }: DesignsToolbarProps) => {

    const [ filterValue, setFilterValue ] = useState(criteria.filterValue);

    useEffect(() => {
        setFilterValue(criteria.filterValue);
    }, [criteria]);

    const onSetPage: OnSetPage = (_event: any, newPage: number, perPage?: number): void => {
        onPagingChange({
            ...paging,
            page: newPage,
            pageSize: perPage ? perPage : paging.pageSize
        });
    };

    const onPerPageSelect: OnPerPageSelect = (_event: any, newPerPage: number): void => {
        onPagingChange({
            ...paging,
            pageSize: newPerPage
        });
    };

    const onFilterChange = (_: any, value: string): void => {
        setFilterValue(value);
    };

    const onSearch = (): void => {
        onCriteriaChange({
            ...criteria,
            filterValue
        });
    };

    const onClear = (): void => {
        setFilterValue("");
        onCriteriaChange({
            ...criteria,
            filterValue: ""
        });
    };

    const totalDesignCount = (): number => {
        return designs?.count || 0;
    };

    return (
        <Toolbar id="designs-toolbar" className="designs-toolbar" style={{ paddingLeft: "8px", paddingRight: "24px" }}>
            <ToolbarContent style={{ width: "100%" }}>
                <ToolbarItem variant="search-filter">
                    <SearchInput
                        aria-label="Filter designs"
                        data-testid="search-design-filter"
                        value={filterValue}
                        onChange={onFilterChange}
                        onSearch={onSearch}
                        onClear={onClear} />
                </ToolbarItem>
                <ToolbarItem>
                    <Button variant="primary" data-testid="btn-create-design" onClick={onCreate}>Create design</Button>
                </ToolbarItem>
                <ToolbarItem>
                    <ImportDropdown onImport={onImport} />
                </ToolbarItem>
                <ToolbarItem className="design-paging-item" align={{ default: "alignRight" }}>
                    <Pagination
                        style={{ padding: "0" }}
                        variant="bottom"
                        dropDirection="down"
                        isCompact={true}
                        itemCount={totalDesignCount()}
                        perPage={paging.pageSize}
                        page={paging.page}
                        onSetPage={onSetPage}
                        onPerPageSelect={onPerPageSelect}
                        widgetId="design-list-pagination"
                        className="design-list-pagination"
                    />
                </ToolbarItem>
            </ToolbarContent>
        </Toolbar>
    );
};
