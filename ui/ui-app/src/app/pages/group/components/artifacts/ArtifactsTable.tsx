import React, { FunctionComponent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SortByDirection, ThProps } from "@patternfly/react-table";
import { FromNow, ObjectDropdown, ResponsiveTable } from "@apicurio/common-ui-components";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";
import { ArtifactDescription, ArtifactTypeIcon } from "@app/components";
import { shash } from "@utils/string.utils.ts";
import { Truncate } from "@patternfly/react-core";
import { SearchedArtifact, } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { SortOrder } from "@models/SortOrder.ts";
import { ArtifactsSortBy } from "@models/artifacts";
import { ConfigService, useConfigService } from "@services/useConfigService.ts";

export type ArtifactsTableProps = {
    artifacts: SearchedArtifact[];
    sortBy: ArtifactsSortBy;
    sortOrder: SortOrder;
    onSort: (by: ArtifactsSortBy, order: SortOrder) => void;
    onView: (artifact: SearchedArtifact) => void;
    onViewInRegistry: (artifact: SearchedArtifact) => void;
}
type ArtifactAction = {
    label: string;
    testId: string;
    onClick: () => void;
    isVisible?: () => boolean;
};

type ArtifactActionSeparator = {
    isSeparator: true;
};

export const ArtifactsTable: FunctionComponent<ArtifactsTableProps> = (props: ArtifactsTableProps) => {
    const [sortByIndex, setSortByIndex] = useState<number>();

    const appNavigation: AppNavigationService = useAppNavigation();
    const config: ConfigService = useConfigService();

    const isRegistryUIConfigured = (): boolean => {
        return config.getApicurioStudioConfig().links.registry !== undefined && config.getApicurioStudioConfig().links.registry.length > 0;
    };

    const columns: any[] = [
        {
            index: 0,
            id: "artifactId",
            label: "Artifact Id",
            width: 40,
            sortable: true,
            sortBy: ArtifactsSortBy.artifactId
        },
        {
            index: 1,
            id: "type",
            label: "Type",
            width: 15,
            sortable: true,
            sortBy: ArtifactsSortBy.artifactType
        },
        {
            index: 2,
            id: "createdOn",
            label: "Created on",
            width: 15,
            sortable: true,
            sortBy: ArtifactsSortBy.createdOn
        },
        {
            index: 3,
            id: "modifiedOn",
            label: "Modified on",
            width: 15,
            sortable: true,
            sortBy: ArtifactsSortBy.modifiedOn
        },
    ];

    const idAndName = (artifact: SearchedArtifact): string => {
        return artifact.artifactId + (artifact.name ? ` (${artifact.name})` : "");
    };

    const renderColumnData = (column: SearchedArtifact, colIndex: number): React.ReactNode => {
        // Name.
        if (colIndex === 0) {
            return (
                <div>
                    <Link className="artifact-title"
                        style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        to={appNavigation.createLink(`/explore/${encodeURIComponent(column.groupId as string)}/${encodeURIComponent(column.artifactId!)}`)}
                    >
                        <Truncate content={idAndName(column)}/>
                    </Link>
                    <ArtifactDescription className="artifact-description" style={{
                        overflow: "hidden",
                        textOverflow: "hidden",
                        whiteSpace: "nowrap",
                        fontSize: "14px"
                    }}
                    description={column.description}
                    truncate={true}/>
                </div>
            );
        }
        // Type.
        if (colIndex === 1) {
            return (
                <ArtifactTypeIcon type={column.artifactType!} isShowIcon={true} isShowLabel={true} />
            );
        }
        // Created on.
        if (colIndex === 2) {
            return (
                <FromNow date={column.createdOn}/>
            );
        }
        // Modified on.
        if (colIndex === 3) {
            return (
                <FromNow date={column.modifiedOn}/>
            );
        }
    };

    const actionsFor = (artifact: SearchedArtifact): (ArtifactAction | ArtifactActionSeparator)[] => {
        const ahash: number = shash(artifact.artifactId!);

        return [
            { label: "Explore artifact", onClick: () => props.onView(artifact), testId: `explore-artifact-${ahash}` },
            { label: "View in Registry", onClick: () => props.onViewInRegistry(artifact), testId: `view-artifact-in-registry-${ahash}`, isVisible: isRegistryUIConfigured },
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
        if (props.sortBy === ArtifactsSortBy.artifactId) {
            setSortByIndex(0);
        }
        if (props.sortBy === ArtifactsSortBy.artifactType) {
            setSortByIndex(1);
        }
        if (props.sortBy === ArtifactsSortBy.createdOn) {
            setSortByIndex(2);
        }
        if (props.sortBy === ArtifactsSortBy.modifiedOn) {
            setSortByIndex(3);
        }
    }, [props.sortBy]);

    return (
        <div className="artifacts-table">
            <ResponsiveTable
                ariaLabel="table of artifacts"
                columns={columns}
                data={props.artifacts}
                expectedLength={props.artifacts.length}
                minimumColumnWidth={350}
                onRowClick={(row) => {
                    console.log(row);
                }}
                renderHeader={({ column, Th }) => (
                    <Th sort={sortParams(column)}
                        className="artifacts-table-header"
                        key={`header-${column.id}`}
                        width={column.width}
                        modifier="truncate">{column.label}</Th>
                )}
                renderCell={({ row, colIndex, Td }) => (
                    <Td className="artifacts-table-cell" key={`cell-${colIndex}-${shash(row.artifactId!)}`}
                        style={{ maxWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        children={renderColumnData(row as SearchedArtifact, colIndex) as any}/>
                )}
                renderActions={({ row }) => (
                    <ObjectDropdown
                        items={actionsFor(row)}
                        isKebab={true}
                        label="Actions"
                        itemToString={item => item.label}
                        itemToTestId={item => item.testId}
                        itemIsDivider={item => item.isSeparator}
                        itemIsVisible={item => item.isVisible || (() => true)}
                        onSelect={item => item.onClick()}
                        testId={`artifact-actions-${shash(row.artifactId!)}`}
                        popperProps={{
                            position: "right"
                        }}
                    />
                )}
            />
        </div>
    );
};
