import { FunctionComponent, useState } from "react";
import "./DraftsPageToolbar.css";
import { Button, Pagination, Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { If } from "@apicurio/common-ui-components";
import { DraftsFilterBy, DraftsSearchFilter, DraftsSearchResults } from "@models/drafts";
import { Paging } from "@models/Paging.ts";
import { FilterChips, FilterCriteria, FilterInput, FilterType } from "@app/components";


export type DraftsPageToolbarProps = {
    results: DraftsSearchResults;
    paging: Paging;

    onCriteriaChange: (criteria: DraftsSearchFilter[]) => void;
    onPageChange: (paging: Paging) => void;
    onCreateDraft: () => void;
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
    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);

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

    const fireCriteriaChange = (criteria: FilterCriteria[]): void => {
        props.onCriteriaChange(criteria.map(fc => {
            return {
                value: fc.filterValue,
                by: fc.filterBy.value as DraftsFilterBy
            };
        }));
    };

    const onAddFilterCriteria = (criteria: FilterCriteria): void => {
        if (criteria.filterValue === "") {
            fireCriteriaChange(filterCriteria);
        } else {
            let updated: boolean = false;
            const newCriteria: FilterCriteria[] = filterCriteria.map(fc => {
                if (fc.filterBy === criteria.filterBy) {
                    updated = true;
                    return criteria;
                } else {
                    return fc;
                }
            });
            if (!updated) {
                newCriteria.push(criteria);
            }

            setFilterCriteria(newCriteria);
            fireCriteriaChange(newCriteria);
        }
    };

    const onRemoveFilterCriteria = (criteria: FilterCriteria): void => {
        const newCriteria: FilterCriteria[] = filterCriteria.filter(fc => fc !== criteria);
        setFilterCriteria(newCriteria);
        fireCriteriaChange(newCriteria);
    };

    const onRemoveAllFilterCriteria = (): void => {
        const newCriteria: FilterCriteria[] = [];
        setFilterCriteria(newCriteria);
        fireCriteriaChange(newCriteria);
    };

    return (
        <div>
            <Toolbar id="drafts-toolbar-1" className="drafts-toolbar">
                <ToolbarContent>
                    <ToolbarItem className="filter-item">
                        <FilterInput
                            filterTypes={FILTER_TYPES}
                            onAddCriteria={onAddFilterCriteria} />
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
