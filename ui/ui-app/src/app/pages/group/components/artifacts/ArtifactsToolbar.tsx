import { FunctionComponent } from "react";
import "./ArtifactsToolbar.css";
import { Pagination, Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { Paging } from "@models/Paging.ts";
import { ArtifactSearchResults } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { ChipFilterInput, FilterChips, If } from "@apicurio/common-ui-components";
import { ChipFilterType } from "@apicurio/common-ui-components/dist/filtering/ChipFilterType";
import { ArtifactFilterCriteria } from "@models/artifacts";
import { ChipFilterCriteria } from "@apicurio/common-ui-components/dist/filtering/ChipFilterCriteria";

const FILTER_TYPES: ChipFilterType[] = [
    {
        label: "Artifact Id",
        value: "artifactId",
        testId: "filter-artifacts-artifactId"
    },
    {
        label: "Name",
        value: "name",
        testId: "filter-artifacts-artifactId"
    },
    {
        label: "Description",
        value: "description",
        testId: "filter-artifacts-description"
    },
    {
        label: "Label",
        value: "labels",
        testId: "filter-artifacts-label"
    },
];

/**
 * Properties
 */
export type ArtifactsToolbarProps = {
    results: ArtifactSearchResults;
    filterCriteria: ArtifactFilterCriteria[];
    paging: Paging;
    onFilterCriteriaChange: (newFilters: ArtifactFilterCriteria[]) => void;
    onPageChange: (paging: Paging) => void;
};


/**
 * Models the toolbar for the Artifacts tab on the Group page.
 */
export const ArtifactsToolbar: FunctionComponent<ArtifactsToolbarProps> = (props: ArtifactsToolbarProps) => {

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
        const newCriteria: ArtifactFilterCriteria[] = props.filterCriteria.filter(fc => fc.type !== criteria.filterBy.value);
        props.onFilterCriteriaChange(newCriteria);
    };

    const onAddFilterCriteria = (criteria: ChipFilterCriteria): void => {
        if (criteria.filterValue === "") {
            props.onFilterCriteriaChange(props.filterCriteria);
        } else {
            const afc: ArtifactFilterCriteria = {
                type: criteria.filterBy.value,
                value: criteria.filterValue
            };

            let updated: boolean = false;
            const newCriteria: ArtifactFilterCriteria[] = props.filterCriteria.map(fc => {
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
            <Toolbar id="artifacts-toolbar-1" className="group-artifacts-toolbar">
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
                            widgetId="reference-list-pagination"
                            className="reference-list-pagination"
                        />
                    </ToolbarItem>
                </ToolbarContent>
            </Toolbar>
            <If condition={props.filterCriteria.length > 0}>
                <Toolbar id="artifacts-toolbar-2" className="group-artifacts-toolbar-2" style={{ padding: "0" }}>
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
