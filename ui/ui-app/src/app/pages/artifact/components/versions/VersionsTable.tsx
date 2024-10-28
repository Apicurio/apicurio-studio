import React, { FunctionComponent, useEffect, useState } from "react";
import { SortByDirection, ThProps } from "@patternfly/react-table";
import { FromNow, If, ObjectDropdown, ResponsiveTable } from "@apicurio/common-ui-components";
import { shash } from "@utils/string.utils.ts";
import { ArtifactDescription } from "@app/components";
import { ArtifactMetaData, SearchedVersion } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { VersionsSortBy } from "@models/versions";
import { SortOrder } from "@models/SortOrder.ts";
import { Flex, FlexItem, Label } from "@patternfly/react-core";

export type VersionsTableProps = {
    artifact: ArtifactMetaData;
    versions: SearchedVersion[];
    sortBy: VersionsSortBy;
    sortOrder: SortOrder;
    onSort: (by: VersionsSortBy, order: SortOrder) => void;
    onCreateNewDraft: (fromVersion: SearchedVersion) => void;
}
type VersionAction = {
    label: string;
    testId: string;
    onClick: () => void;
};

type VersionActionSeparator = {
    isSeparator: true;
};

export const VersionsTable: FunctionComponent<VersionsTableProps> = (props: VersionsTableProps) => {
    const [sortByIndex, setSortByIndex] = useState<number>();

    const columns: any[] = [
        { index: 0, id: "version", label: "Version", width: 65, sortable: true, sortBy: VersionsSortBy.version },
        { index: 1, id: "globalId", label: "Global Id", width: 15, sortable: true, sortBy: VersionsSortBy.globalId },
        { index: 2, id: "createdOn", label: "Created on", width: 20, sortable: true, sortBy: VersionsSortBy.createdOn },
    ];

    const renderColumnData = (column: SearchedVersion, colIndex: number): React.ReactNode => {
        // Name.
        if (colIndex === 0) {
            return (
                <div>
                    <Flex>
                        <FlexItem>
                            <span>{column.version}</span>
                            <If condition={column.name != "" && column.name !== undefined && column.name !== null}>
                                <span style={{ marginLeft: "10px" }}>({column.name})</span>
                            </If>
                        </FlexItem>
                        <FlexItem>
                            <If condition={column.state === "DRAFT"}>
                                <Label color="grey">Draft</Label>
                            </If>
                            <If condition={column.state === "DEPRECATED"}>
                                <Label color="orange">Deprecated</Label>
                            </If>
                            <If condition={column.state === "DISABLED"}>
                                <Label color="red">Disabled</Label>
                            </If>
                        </FlexItem>
                    </Flex>
                    <ArtifactDescription
                        className="version-description"
                        style={{
                            overflow: "hidden",
                            textOverflow: "hidden",
                            whiteSpace: "nowrap",
                            fontSize: "14px" }}
                        description={column.description}
                        truncate={true} />
                </div>
            );
        }
        // Global id.
        if (colIndex === 1) {
            return (
                <span>{ column.globalId }</span>
            );
        }
        // Created on.
        if (colIndex === 2) {
            return (
                <FromNow date={column.createdOn} />
            );
        }
    };

    const actionsFor = (version: SearchedVersion): (VersionAction | VersionActionSeparator)[] => {
        const vhash: number = shash(version.version!);
        return [
            { label: "Create new draft", onClick: () => props.onCreateNewDraft(version), testId: `create-new-version-${vhash}` },
        ];
    };

    const sortParams = (column: any): ThProps["sort"] | undefined => {
        return column.sortable ? {
            sortBy: {
                index: sortByIndex,
                direction: props.sortOrder
            },
            onSort: (_event, index, direction) => {
                props.onSort(columns[index].sortBy, direction === SortByDirection.asc ? SortOrder.asc : SortOrder.desc);
            },
            columnIndex: column.index
        } : undefined;
    };

    useEffect(() => {
        if (props.sortBy === VersionsSortBy.version) {
            setSortByIndex(0);
        }
        if (props.sortBy === VersionsSortBy.globalId) {
            setSortByIndex(1);
        }
        if (props.sortBy === VersionsSortBy.createdOn) {
            setSortByIndex(3);
        }
    }, [props.sortBy]);

    return (
        <div className="versions-table">
            <ResponsiveTable
                ariaLabel="table of versions"
                columns={columns}
                data={props.versions}
                expectedLength={props.versions.length}
                minimumColumnWidth={350}
                onRowClick={(row) => {
                    console.log(row);
                }}
                renderHeader={({ column, Th }) => (
                    <Th sort={sortParams(column)}
                        className="versions-table-header"
                        key={`header-${column.id}`}
                        width={column.width}
                        modifier="truncate">{column.label}</Th>
                )}
                renderCell={({ row, colIndex, Td }) => (
                    <Td className="versions-table-cell" key={`cell-${colIndex}-${shash(row.version!)}`}
                        style={{ maxWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        children={renderColumnData(row as SearchedVersion, colIndex) as any} />
                )}
                renderActions={({ row }) => (
                    <ObjectDropdown
                        items={actionsFor(row)}
                        isKebab={true}
                        label="Actions"
                        itemToString={item => item.label}
                        itemToTestId={item => item.testId}
                        itemIsDivider={item => item.isSeparator}
                        onSelect={item => item.onClick()}
                        testId={`version-actions-${shash(row.version!)}`}
                        popperProps={{
                            position: "right"
                        }}
                    />
                )}
            />
        </div>
    );
};
