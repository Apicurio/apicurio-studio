import { FunctionComponent } from "react";
import "./GroupList.css";
import { DataList, DataListCell, DataListItemCells, DataListItemRow, Icon } from "@patternfly/react-core";
import { OutlinedFolderIcon } from "@patternfly/react-icons";
import { ArtifactGroup } from "@app/pages";
import { SearchedGroup } from "@sdk/lib/generated-client/models";

/**
 * Properties
 */
export type GroupListProps = {
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

    return (
        <DataList aria-label="List of groups" className="group-list">
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
                                    {/*<div className="group-labels">*/}
                                    {/*    {*/}
                                    {/*        labels(group).map( label =>*/}
                                    {/*            <Badge key={label} isRead={true}>{label}</Badge>*/}
                                    {/*        )*/}
                                    {/*    }*/}
                                    {/*</div>*/}
                                </DataListCell>
                            ]}
                        />
                    </DataListItemRow>
                )
            }
        </DataList>
    );

};
