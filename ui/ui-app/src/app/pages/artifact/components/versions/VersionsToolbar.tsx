import { FunctionComponent } from "react";
import "./VersionsToolbar.css";
import { Pagination, Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { Paging } from "@models/Paging.ts";
import { VersionSearchResults } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { ChipFilterType } from "@apicurio/common-ui-components/dist/filtering/ChipFilterType";
import { VersionFilterCriteria, VersionFilterCriteriaType } from "@models/versions";
import { ChipFilterCriteria } from "@apicurio/common-ui-components/dist/filtering/ChipFilterCriteria";
import { ChipFilterInput, FilterChips, If } from "@apicurio/common-ui-components";


const FILTER_TYPES: ChipFilterType[] = [
    {
        label: "Version",
        value: VersionFilterCriteriaType.version,
        testId: "filter-versions-artifactId"
    },
    {
        label: "Name",
        value: VersionFilterCriteriaType.name,
        testId: "filter-versions-artifactId"
    },
    {
        label: "Description",
        value: VersionFilterCriteriaType.description,
        testId: "filter-versions-description"
    },
    {
        label: "Label",
        value: VersionFilterCriteriaType.labels,
        testId: "filter-versions-label"
    },
];

/**
 * Properties
 */
export type VersionsToolbarProps = {
    results: VersionSearchResults;
    filterCriteria: VersionFilterCriteria[];
    paging: Paging;
    onFilterCriteriaChange: (newFilters: VersionFilterCriteria[]) => void;
    onPageChange: (paging: Paging) => void;
};


/**
 * Models the toolbar for the Versions tab on the Artifact page.
 */
export const VersionsToolbar: FunctionComponent<VersionsToolbarProps> = (props: VersionsToolbarProps) => {

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

    const criteria: ChipFilterCriteria[] = props.filterCriteria.map(fc => {
        const filterBy: ChipFilterType = FILTER_TYPES.filter(ft => ft.value === fc.type)[0];
        return {
            filterBy: filterBy,
            filterValue: fc.value
        };
    });

    const onRemoveCriteria = (criteria: ChipFilterCriteria): void => {
        const newCriteria: VersionFilterCriteria[] = props.filterCriteria.filter(fc => fc.type !== criteria.filterBy.value);
        props.onFilterCriteriaChange(newCriteria);
    };

    const onAddFilterCriteria = (criteria: ChipFilterCriteria): void => {
        if (criteria.filterValue === "") {
            props.onFilterCriteriaChange(props.filterCriteria);
        } else {
            const afc: VersionFilterCriteria = {
                type: criteria.filterBy.value,
                value: criteria.filterValue
            };

            let updated: boolean = false;
            const newCriteria: VersionFilterCriteria[] = props.filterCriteria.map(fc => {
                if (fc.type === criteria.filterBy.value) {
                    updated = true;
                    return afc;
                } else {
                    return fc;
                }
            });
            if (!updated) {
                newCriteria.push(afc);
            }

            props.onFilterCriteriaChange(newCriteria);
        }
    };

    return (
        <div>
            <Toolbar id="versions-toolbar-1" className="versions-toolbar">
                <ToolbarContent>
                    <ToolbarItem>
                        <ChipFilterInput
                            filterTypes={FILTER_TYPES}
                            onAddCriteria={onAddFilterCriteria}
                        />
                    </ToolbarItem>
                    <ToolbarItem className="paging-item" align={{ default: "alignRight" }}>
                        <Pagination
                            variant="top"
                            dropDirection="down"
                            itemCount={ props.results.count as number }
                            perPage={ props.paging.pageSize }
                            page={ props.paging.page }
                            onSetPage={ onSetPage }
                            onPerPageSelect={ onPerPageSelect }
                            widgetId="version-list-pagination"
                            className="version-list-pagination"
                        />
                    </ToolbarItem>
                </ToolbarContent>
            </Toolbar>
            <If condition={props.filterCriteria.length > 0}>
                <Toolbar id="versions-toolbar-2" className="group-versions-toolbar-2" style={{ padding: "0" }}>
                    <ToolbarContent>
                        <ToolbarItem>
                            <FilterChips
                                criteria={criteria}
                                onClearAllCriteria={() => props.onFilterCriteriaChange([])}
                                onRemoveCriteria={onRemoveCriteria} />
                        </ToolbarItem>
                    </ToolbarContent>
                </Toolbar>
            </If>
        </div>
    );
};
