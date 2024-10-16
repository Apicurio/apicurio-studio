import React, {FunctionComponent} from "react";
import {Link} from "react-router-dom";
import {FromNow, If, ObjectDropdown, ResponsiveTable} from "@apicurio/common-ui-components";
import {AppNavigationService, useAppNavigation} from "@services/useAppNavigation.ts";
import {shash} from "@utils/string.utils.ts";
import {ArtifactDescription} from "@app/components";
import {ArtifactMetaData, SearchedBranch} from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import {DesktopIcon} from "@patternfly/react-icons";
import {Tooltip} from "@patternfly/react-core";
import {ConfigService, useConfigService} from "@services/useConfigService.ts";

export type BranchesTableProps = {
    artifact: ArtifactMetaData;
    branches: SearchedBranch[];
    onView: (branch: SearchedBranch) => void;
    onDelete: (branch: SearchedBranch) => void;
}
type BranchAction = {
    label: string;
    testId: string;
    onClick: () => void;
    isVisible?: boolean;
    isDisabled?: boolean;
};

type BranchActionSeparator = {
    isSeparator: true;
    isVisible?: boolean;
};

export const BranchesTable: FunctionComponent<BranchesTableProps> = (props: BranchesTableProps) => {
    const appNavigation: AppNavigationService = useAppNavigation();
    const config: ConfigService = useConfigService();

    const columns: any[] = [
        {index: 0, id: "branch", label: "Branch", width: 50, sortable: false},
        {index: 1, id: "createdOn", label: "Created on", width: 25, sortable: false},
        {index: 2, id: "modifiedOn", label: "Modified on", width: 25, sortable: false},
    ];

    const renderColumnData = (column: SearchedBranch, colIndex: number): React.ReactNode => {
        // Name.
        if (colIndex === 0) {
            return (
                <div>
                    <Link className="branch-title"
                          style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              textDecoration: "none"
                          }}
                          to={appNavigation.createLink(`/explore/${encodeURIComponent(props.artifact.groupId || "default")}/${encodeURIComponent(props.artifact.artifactId!)}/branches/${encodeURIComponent(column.branchId!)}`)}
                    >
                        <span>{column.branchId}</span>
                        <If condition={column.systemDefined || false}>
                            <Tooltip content="System defined">
                                <DesktopIcon style={{marginLeft: "8px"}}/>
                            </Tooltip>
                        </If>
                    </Link>
                    <ArtifactDescription className="branch-description" style={{
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
        // Created on.
        if (colIndex === 1) {
            return (
                <FromNow date={column.createdOn}/>
            );
        }
        // Modified on.
        if (colIndex === 2) {
            return (
                <FromNow date={column.modifiedOn}/>
            );
        }
    };

    const actionsFor = (branch: SearchedBranch): (BranchAction | BranchActionSeparator)[] => {
        const vhash: number = shash(branch.branchId!);
        return [{label: "View branch", onClick: () => props.onView(branch), testId: `view-branch-${vhash}`}];
    };

    return (
        <div className="branches-table">
            <ResponsiveTable
                ariaLabel="table of branches"
                columns={columns}
                data={props.branches}
                expectedLength={props.branches.length}
                minimumColumnWidth={350}
                onRowClick={(row) => {
                    console.log(row);
                }}
                renderHeader={({column, Th}) => (
                    <Th className="branches-table-header"
                        key={`header-${column.id}`}
                        width={column.width}
                        modifier="truncate">{column.label}</Th>
                )}
                renderCell={({row, colIndex, Td}) => (
                    <Td className="branches-table-cell" key={`cell-${colIndex}-${shash(row.branchId!)}`}
                        style={{maxWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}
                        children={renderColumnData(row as SearchedBranch, colIndex) as any}/>
                )}
                renderActions={({row}) => (
                    <ObjectDropdown
                        items={actionsFor(row)}
                        isKebab={true}
                        label="Actions"
                        itemToString={item => item.label}
                        itemToTestId={item => item.testId}
                        itemIsDivider={item => item.isSeparator}
                        itemIsDisabled={item => item.isDisabled}
                        itemIsVisible={item => item.isVisible === undefined ? true : item.isVisible}
                        onSelect={item => item.onClick()}
                        testId={`branch-actions-${shash(row.branchId!)}`}
                        popperProps={{
                            position: "right"
                        }}
                    />
                )}
            />
        </div>
    );
};
