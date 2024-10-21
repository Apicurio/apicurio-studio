import React, { FunctionComponent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SortByDirection, ThProps } from "@patternfly/react-table";
import { FromNow, If, ObjectDropdown, ResponsiveTable } from "@apicurio/common-ui-components";
import { Draft, DraftsSortBy } from "@models/drafts";
import { SortOrder } from "@models/SortOrder.ts";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";
import { ArtifactDescription, ArtifactTypeIcon } from "@app/components";
import { shash } from "@utils/string.utils.ts";

export type DraftsTableProps = {
    drafts: Draft[];
    sortBy: DraftsSortBy;
    sortOrder: SortOrder;
    onSort: (by: DraftsSortBy, order: SortOrder) => void;
    onView: (version: Draft) => void;
    onDelete: (version: Draft) => void;
}
type DraftAction = {
    label: string;
    testId: string;
    onClick: () => void;
};

type DraftActionSeparator = {
    isSeparator: true;
};

export const DraftsTable: FunctionComponent<DraftsTableProps> = (props: DraftsTableProps) => {
    const [sortByIndex, setSortByIndex] = useState<number>();

    const appNavigation: AppNavigationService = useAppNavigation();

    const columns: any[] = [
        { index: 0, id: "name", label: "Name", width: 60, sortable: true, sortBy: DraftsSortBy.name },
        { index: 1, id: "version", label: "Version", width: 10, sortable: true, sortBy: DraftsSortBy.version },
        { index: 2, id: "modifiedBy", label: "Modifed by", width: 15, sortable: false },
        { index: 3, id: "modifiedOn", label: "Modified on", width: 15, sortable: true, sortBy: DraftsSortBy.modifiedOn },
    ];

    const renderColumnData = (column: Draft, colIndex: number): React.ReactNode => {
        // Name.
        if (colIndex === 0) {
            const groupId: string = encodeURIComponent(column.groupId || "default");
            const artifactId: string = encodeURIComponent(column.draftId!);
            const version: string = encodeURIComponent(column.version!);

            return (
                <div>
                    <Link className="draft-title"
                        style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: "none" }}
                        to={appNavigation.createLink(`/drafts/${groupId}/${artifactId}/${version}`)}
                    >
                        <ArtifactTypeIcon type={column.type} isShowIcon={true} isShowLabel={false} />
                        <span style={{ marginLeft: "5px" }}>{ column.groupId || "default" }</span>
                        <span style={{ color: "#666" }}> / </span>
                        <span>{ column.draftId }</span>
                        <If condition={column.name != "" && column.name !== undefined && column.name !== null}>
                            <span style={{ marginLeft: "10px" }}>({column.name})</span>
                        </If>
                    </Link>
                    <ArtifactDescription className="version-description" style={{ overflow: "hidden", textOverflow: "hidden", whiteSpace: "nowrap", fontSize: "14px" }}
                        description={column.description}
                        truncate={true} />
                </div>
            );
        }
        // Version.
        if (colIndex === 1) {
            return (
                <span>{ column.version }</span>
            );
        }
        // Modified by
        if (colIndex === 2) {
            return (
                <span>{ column.modifiedBy }</span>
            );
        }
        // Modified on.
        if (colIndex === 3) {
            return (
                <FromNow date={column.modifiedOn} />
            );
        }
    };

    const actionsFor = (draft: Draft): (DraftAction | DraftActionSeparator)[] => {
        const vhash = shash(draft.groupId! + draft.draftId! + draft.version!);
        const actions: (DraftAction | DraftActionSeparator)[] = [
            { label: "View draft", onClick: () => props.onView(draft), testId: `view-version-${vhash}` },
        ];

        const isDeleteEnabled: boolean = true;
        // TODO : Implement features in config to check if delete is enabled.
        if (isDeleteEnabled) {
            actions.push(
                { isSeparator: true },
            );
            actions.push(
                { label: "Delete draft", onClick: () => props.onDelete(draft), testId: `delete-draft-${vhash}` }
            );
        }

        return actions;
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
        if (props.sortBy === DraftsSortBy.name) {
            setSortByIndex(0);
        }
        if (props.sortBy === DraftsSortBy.version) {
            setSortByIndex(1);
        }
        if (props.sortBy === DraftsSortBy.modifiedOn) {
            setSortByIndex(3);
        }
    }, [props.sortBy]);

    return (
        <div className="drafts-table">
            <ResponsiveTable
                ariaLabel="table of drafts"
                columns={columns}
                data={props.drafts}
                expectedLength={props.drafts.length}
                minimumColumnWidth={350}
                onRowClick={() => {}}
                renderHeader={({ column, Th }) => (
                    <Th sort={sortParams(column)}
                        className="drafts-table-header"
                        key={`header-${column.id}`}
                        width={column.width}
                        modifier="truncate">{column.label}</Th>
                )}
                renderCell={({ row, colIndex, Td }) => (
                    <Td className="drafts-table-cell" key={`cell-${colIndex}-${shash(row.groupId! + row.draftId! + row.version!)}`}
                        style={{ maxWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        children={renderColumnData(row as Draft, colIndex) as any} />
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
