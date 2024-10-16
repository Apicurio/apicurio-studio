import { FunctionComponent, useEffect, useState } from "react";
import "./ExplorePageToolbar.css";
import {
    Button,
    ButtonVariant,
    capitalize,
    Form,
    InputGroup,
    Pagination,
    TextInput,
    Toolbar,
    ToolbarContent,
    ToolbarItem
} from "@patternfly/react-core";
import { SearchIcon, SortAlphaDownAltIcon, SortAlphaDownIcon } from "@patternfly/react-icons";
import { IfAuth, IfFeature } from "@app/components";
import { OnPerPageSelect, OnSetPage } from "@patternfly/react-core/dist/js/components/Pagination/Pagination";
import { If, ObjectDropdown, ObjectSelect } from "@apicurio/common-ui-components";
import { useLoggerService } from "@services/useLoggerService.ts";
import { ExploreType } from "@app/pages/explore/ExploreType.ts";
import { plural } from "pluralize";
import { Paging } from "@models/paging.model.ts";
import { FilterBy } from "@services/useSearchService.ts";
import { ArtifactSearchResults, GroupSearchResults } from "@sdk/lib/generated-client/models";
import { useConfigService } from "@services/useConfigService.ts";

export type ExplorePageToolbarFilterCriteria = {
    filterBy: FilterBy;
    filterValue: string;
    ascending: boolean;
};

export type ExplorePageToolbarProps = {
    exploreType: ExploreType;
    results: ArtifactSearchResults | GroupSearchResults;
    onExploreTypeChange: (exploreType: ExploreType) => void;
    onCriteriaChange: (criteria: ExplorePageToolbarFilterCriteria) => void;
    criteria: ExplorePageToolbarFilterCriteria;
    paging: Paging;
    onPerPageSelect: OnPerPageSelect;
    onSetPage: OnSetPage;
    onCreateArtifact: () => void;
    onCreateGroup: () => void;
    onImport: () => void;
    onExport: () => void;
};

type FilterType = {
    value: FilterBy;
    label: string;
    testId: string;
};
const ARTIFACT_FILTER_TYPES: FilterType[] = [
    { value: FilterBy.name, label: "Name", testId: "artifact-filter-typename" },
    { value: FilterBy.groupId, label: "Group", testId: "artifact-filter-typegroup" },
    { value: FilterBy.description, label: "Description", testId: "artifact-filter-typedescription" },
    { value: FilterBy.labels, label: "Labels", testId: "artifact-filter-typelabels" },
    { value: FilterBy.globalId, label: "Global Id", testId: "artifact-filter-typeglobal-id" },
    { value: FilterBy.contentId, label: "Content Id", testId: "artifact-filter-typecontent-id" },
];
const GROUP_FILTER_TYPES: FilterType[] = [
    { value: FilterBy.groupId, label: "Group", testId: "group-filter-typegroup" },
    { value: FilterBy.description, label: "Description", testId: "group-filter-typedescription" },
    { value: FilterBy.labels, label: "Labels", testId: "group-filter-typelabels" },
];


type ActionType = {
    label: string;
    callback: () => void;
};

/**
 * Models the toolbar for the Explore page.
 */
export const ExplorePageToolbar: FunctionComponent<ExplorePageToolbarProps> = (props: ExplorePageToolbarProps) => {
    const [artifactFilterType, setArtifactFilterType] = useState(ARTIFACT_FILTER_TYPES[0]);
    const [groupFilterType, setGroupFilterType] = useState(GROUP_FILTER_TYPES[0]);
    const [filterValue, setFilterValue] = useState("");
    const [filterAscending, setFilterAscending] = useState(true);
    const [kebabActions, setKebabActions] = useState<ActionType[]>([]);

    const logger = useLoggerService();
    const config = useConfigService();

    const totalArtifactsCount = (): number => {
        return props.results.count!;
    };

    const onFilterSubmit = (event: any|undefined): void => {
        const filterTypeValue: FilterBy = (props.exploreType === ExploreType.ARTIFACT) ? artifactFilterType.value : groupFilterType.value;
        fireChangeEvent(filterAscending, filterTypeValue, filterValue);
        if (event) {
            event.preventDefault();
        }
    };

    const onArtifactFilterTypeChange = (newType: FilterType): void => {
        setArtifactFilterType(newType);
        fireChangeEvent(filterAscending, newType.value, filterValue);
    };

    const onGroupFilterTypeChange = (newType: FilterType): void => {
        setGroupFilterType(newType);
        fireChangeEvent(filterAscending, newType.value, filterValue);
    };

    const onToggleAscending = (): void => {
        logger.debug("[ExplorePageToolbar] Toggle the ascending flag.");
        const filterTypeValue: FilterBy = (props.exploreType === ExploreType.ARTIFACT) ? artifactFilterType.value : groupFilterType.value;
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
        if (newExploreType === ExploreType.ARTIFACT) {
            setArtifactFilterType(ARTIFACT_FILTER_TYPES[0]);
        } else if (newExploreType === ExploreType.GROUP) {
            setGroupFilterType(GROUP_FILTER_TYPES[0]);
        }
        props.onExploreTypeChange(newExploreType);
    };

    useEffect(() => {
        const adminActions: ActionType[] = config.featureReadOnly() ? [
            { label: "Export all (as .ZIP)", callback: props.onExport }
        ] : [
            { label: "Import from .ZIP", callback: props.onImport },
            { label: "Export all (as .ZIP)", callback: props.onExport }
        ];
        setKebabActions(adminActions);
    }, [props.onExport, props.onImport]);

    return (
        <Toolbar id="artifacts-toolbar-1" className="artifacts-toolbar">
            <ToolbarContent>
                <ToolbarItem variant="label">
                    Search for
                </ToolbarItem>
                <ToolbarItem className="filter-item">
                    <ObjectSelect
                        value={props.exploreType}
                        items={[ExploreType.ARTIFACT, ExploreType.GROUP]}
                        testId="explore-type-select"
                        toggleClassname="explore-type-toggle"
                        onSelect={onExploreTypeChange}
                        itemToTestId={(item) => `explore-type-${plural(item.toString().toLowerCase())}`}
                        itemToString={(item) => capitalize(plural(item.toString().toLowerCase()))} />
                </ToolbarItem>
                <ToolbarItem variant="label">
                    filter by
                </ToolbarItem>
                <ToolbarItem className="filter-item">
                    <Form onSubmit={onFilterSubmit}>
                        <InputGroup>
                            <If condition={props.exploreType === ExploreType.ARTIFACT}>
                                <ObjectSelect
                                    value={artifactFilterType}
                                    items={ARTIFACT_FILTER_TYPES}
                                    testId="artifact-filter-type-select"
                                    toggleClassname="artifact-filter-type-toggle"
                                    onSelect={onArtifactFilterTypeChange}
                                    itemToTestId={(item) => item.testId}
                                    itemToString={(item) => item.label} />
                            </If>
                            <If condition={props.exploreType === ExploreType.GROUP}>
                                <ObjectSelect
                                    value={groupFilterType}
                                    items={GROUP_FILTER_TYPES}
                                    testId="group-filter-type-select"
                                    toggleClassname="group-filter-type-toggle"
                                    onSelect={onGroupFilterTypeChange}
                                    itemToTestId={(item) => item.testId}
                                    itemToString={(item) => item.label} />
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
                    <Button variant="plain" aria-label="edit" data-testid="artifact-filter-sort" onClick={onToggleAscending}>
                        {
                            filterAscending ? <SortAlphaDownIcon/> : <SortAlphaDownAltIcon/>
                        }
                    </Button>
                </ToolbarItem>
                <ToolbarItem className="create-artifact-item">
                    <IfAuth isDeveloper={true}>
                        <IfFeature feature="readOnly" isNot={true}>
                            <If condition={props.exploreType === ExploreType.ARTIFACT}>
                                <Button className="btn-header-create-artifact" data-testid="btn-toolbar-create-artifact"
                                    variant="primary" onClick={props.onCreateArtifact}>Create artifact</Button>
                            </If>
                            <If condition={props.exploreType === ExploreType.GROUP}>
                                <Button className="btn-header-create-group" data-testid="btn-toolbar-create-group"
                                    variant="primary" onClick={props.onCreateGroup}>Create group</Button>
                            </If>
                        </IfFeature>
                    </IfAuth>
                </ToolbarItem>
                <ToolbarItem className="admin-actions-item">
                    <IfAuth isAdmin={true}>
                        <ObjectDropdown
                            label="Admin actions"
                            items={kebabActions}
                            onSelect={(item) => item.callback()}
                            itemToString={(item) => item.label}
                            isKebab={true} />
                    </IfAuth>
                </ToolbarItem>
                <ToolbarItem className="artifact-paging-item" align={{ default: "alignRight" }}>
                    <Pagination
                        variant="top"
                        dropDirection="down"
                        itemCount={totalArtifactsCount()}
                        perPage={props.paging.pageSize}
                        page={props.paging.page}
                        onSetPage={props.onSetPage}
                        onPerPageSelect={props.onPerPageSelect}
                        widgetId="artifact-list-pagination"
                        className="artifact-list-pagination"
                    />
                </ToolbarItem>
            </ToolbarContent>
        </Toolbar>
    );

};
