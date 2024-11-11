import { FunctionComponent } from "react";
import "./GroupList.css";
import {
    DataList,
    DataListCell,
    DataListItemCells,
    DataListItemRow,
    Icon,
    Label,
    Truncate
} from "@patternfly/react-core";
import { OutlinedFolderIcon } from "@patternfly/react-icons";
import { SearchedGroup } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { ArtifactGroup } from "@app/components";
import { labelsToAny } from "@utils/rest.utils.ts";
import { If } from "@apicurio/common-ui-components";

/**
 * Properties
 */
export type GroupListProps = {
    isFiltered: boolean;
    groups: SearchedGroup[];
};


/**
 * Models the list of groups.
 */
export const GroupList: FunctionComponent<GroupListProps> = (props: GroupListProps) => {

    const description = (group: SearchedGroup): string => {
        if (group.description) {
            return group.description;
        }
        return "A group with no description.";
    };

    console.info(props.groups);

    return (
        <DataList aria-label="List of groups" className="group-list">
            <If condition={!props.isFiltered}>
                <DataListItemRow
                    className="group-list-item"
                    key="default"
                    style={{ marginTop: "3px", marginBottom: "4px", borderTop: "1px #ccc dashed", borderBottom: "1px #ccc dashed" }}
                >
                    <DataListItemCells
                        dataListCells={[
                            <DataListCell key="type icon" className="type-icon-cell">
                                <Icon>
                                    <OutlinedFolderIcon />
                                </Icon>
                            </DataListCell>,
                            <DataListCell key="main content" className="content-cell">
                                <div className="group-title">
                                    <ArtifactGroup groupId="default" />
                                </div>
                                <div className="group-description">The default group (system generated).</div>
                            </DataListCell>
                        ]}
                    />
                </DataListItemRow>
            </If>
            {
                props.groups?.map( (group, /* idx */) =>
                    <DataListItemRow className="group-list-item" key={group.groupId}>
                        <DataListItemCells
                            dataListCells={[
                                <DataListCell key="type icon" className="type-icon-cell">
                                    <Icon>
                                        <OutlinedFolderIcon />
                                    </Icon>
                                </DataListCell>,
                                <DataListCell key="main content" className="content-cell">
                                    <div className="group-title">
                                        <ArtifactGroup groupId={group.groupId!} />
                                    </div>
                                    <div className="group-description">{description(group)}</div>
                                    <div className="group-labels">
                                        {
                                            Object.entries(labelsToAny(group.labels)).map(([key, value]) =>
                                                <Label
                                                    key={`label-${key}`}
                                                    color="purple"
                                                    style={{ marginBottom: "2px", marginRight: "5px", marginTop: "5px" }}
                                                >
                                                    <Truncate
                                                        className="label-truncate"
                                                        content={`${key}=${value}`} />
                                                </Label>
                                            )
                                        }
                                    </div>
                                </DataListCell>
                            ]}
                        />
                    </DataListItemRow>
                )
            }
        </DataList>
    );

};
