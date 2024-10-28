import { FunctionComponent } from "react";
import "./DraftsPageToolbar.css";
import { Button, Pagination, Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import {
    ChipFilterCriteria,
    ChipFilterInput,
    ChipFilterType,
    FilterChips,
    If,
    ObjectSelect
} from "@apicurio/common-ui-components";
import { DraftsFilterBy, DraftsSearchFilter, DraftsSearchResults, DraftsSortBy } from "@models/drafts";
import { Paging } from "@models/Paging.ts";
import { SortOrder } from "@models/SortOrder.ts";
import { SortOrderToggle } from "@app/components";


export type DraftsPageToolbarProps = {
    criteria: DraftsSearchFilter[];
    results: DraftsSearchResults;
    paging: Paging;
    sortBy: DraftsSortBy;
    sortOrder: SortOrder;

    onCriteriaChange: (criteria: DraftsSearchFilter[]) => void;
    onPageChange: (paging: Paging) => void;
    onCreateDraft: () => void;
    onSortChange: (sortBy: any, sortOrder: SortOrder) => void;
};

const FILTER_TYPES: ChipFilterType[] = [
    { value: DraftsFilterBy.artifactId, label: "Draft Id", testId: "drafts-filter-type-draftid" },
    { value: DraftsFilterBy.groupId, label: "Group Id", testId: "drafts-filter-type-groupid" },
    { value: DraftsFilterBy.name, label: "Name", testId: "drafts-filter-type-name" },
    { value: DraftsFilterBy.description, label: "Description", testId: "drafts-filter-type-description" },
    { value: DraftsFilterBy.labels, label: "Labels", testId: "drafts-filter-type-labels" },
];
const FILTER_TYPE_LOOKUP: any = {};
FILTER_TYPES.forEach(filterType => {
    FILTER_TYPE_LOOKUP[filterType.value] = filterType;
});


/**
 * Models the toolbar for the Drafts page.
 */
export const DraftsPageToolbar: FunctionComponent<DraftsPageToolbarProps> = (props: DraftsPageToolbarProps) => {
    const filterCriteria: ChipFilterCriteria[] = props.criteria.map(c => {
        return {
            filterBy: FILTER_TYPE_LOOKUP[c.by],
            filterValue: c.value
        };
    });

    const totalDraftsCount = (): number => {
        return props.results.count!;
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

    const fireCriteriaChange = (criteria: DraftsSearchFilter[]): void => {
        props.onCriteriaChange(criteria);
    };

    const onAddFilterCriteria = (criteria: ChipFilterCriteria): void => {
        if (criteria.filterValue === "") {
            fireCriteriaChange(props.criteria);
        } else {
            const dsf: DraftsSearchFilter = {
                by: criteria.filterBy.value,
                value: criteria.filterValue
            };
            
            let updated: boolean = false;
            const newCriteria: DraftsSearchFilter[] = props.criteria.map(c => {
                if (c.by === criteria.filterBy.value) {
                    updated = true;
                    return dsf;
                } else {
                    return c;
                }
            });
            if (!updated) {
                newCriteria.push(dsf);
            }

            fireCriteriaChange(newCriteria);
        }
    };

    const onRemoveFilterCriteria = (criteria: ChipFilterCriteria): void => {
        const newCriteria: DraftsSearchFilter[] = props.criteria.filter(c => c.by !== criteria.filterBy.value);
        fireCriteriaChange(newCriteria);
    };

    const onRemoveAllFilterCriteria = (): void => {
        fireCriteriaChange([]);
    };

    const sortByLabel = (sortBy: DraftsSortBy): string => {
        switch (sortBy) {
            case DraftsSortBy.groupId:
                return "Group Id";
            case DraftsSortBy.artifactId:
                return "Draft Id";
            case DraftsSortBy.version:
                return "Version";
            case DraftsSortBy.name:
                return "Name";
            case DraftsSortBy.modifiedOn:
                return "Modified On";
        }
        return "" + sortBy;
    };

    return (
        <div>
            <Toolbar id="drafts-toolbar-1" className="drafts-toolbar">
                <ToolbarContent>
                    <ToolbarItem variant="label" id="filter-by-label">
                        Filter by
                    </ToolbarItem>
                    <ToolbarItem className="filter-item">
                        <ChipFilterInput
                            filterTypes={FILTER_TYPES}
                            onAddCriteria={onAddFilterCriteria} />
                    </ToolbarItem>
                    <ToolbarItem variant="label" id="order-by-label">
                        Order by
                    </ToolbarItem>
                    <ToolbarItem className="ordering-item">
                        <ObjectSelect
                            value={props.sortBy}
                            items={[
                                DraftsSortBy.artifactId,
                                DraftsSortBy.groupId,
                                DraftsSortBy.name,
                                DraftsSortBy.modifiedOn
                            ]}
                            onSelect={(newSortBy) => {
                                props.onSortChange(newSortBy, props.sortOrder);
                            }}
                            itemToString={item => sortByLabel(item)}
                        />
                        <SortOrderToggle sortOrder={props.sortOrder} onChange={(newSortOrder => {
                            props.onSortChange(props.sortBy, newSortOrder);
                        })} />
                    </ToolbarItem>
                    <ToolbarItem className="create-draft-item" style={{ paddingLeft: "20px" }}>
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
            <If condition={filterCriteria.length > 0}>
                <Toolbar id="drafts-toolbar-2" className="drafts-toolbar">
                    <ToolbarContent>
                        <ToolbarItem className="filter-chips">
                            <FilterChips
                                criteria={filterCriteria}
                                onClearAllCriteria={onRemoveAllFilterCriteria}
                                onRemoveCriteria={onRemoveFilterCriteria} />
                        </ToolbarItem>
                    </ToolbarContent>
                </Toolbar>
            </If>
        </div>
    );

};
