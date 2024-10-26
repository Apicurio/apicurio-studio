import { FunctionComponent } from "react";
import "./DraftsList.css";
import { Draft } from "@models/drafts";
import {
    DataList,
    DataListAction,
    DataListCell,
    DataListItemCells,
    DataListItemRow,
    Label,
    Truncate
} from "@patternfly/react-core";
import { ArtifactTypeIcon } from "@app/components";
import { FromNow, If, ObjectDropdown } from "@apicurio/common-ui-components";
import { DraftId } from "@app/pages/drafts/components/list/DraftId.tsx";

export type DraftsListProps = {
    drafts: Draft[];
    onGroupClick: (groupId: string) => void;
    onView: (version: Draft) => void;
    onDelete: (version: Draft) => void;
}

export const DraftsList: FunctionComponent<DraftsListProps> = (props: DraftsListProps) => {

    return (
        <DataList aria-label="List of drafts" className="drafts-list" id="drafts-list">
            {
                props.drafts.map( (draft, idx) =>
                    <DataListItemRow className="drafts-list-item" key={idx}>
                        <DataListItemCells
                            dataListCells={[
                                <DataListCell key="type icon" className="type-icon-cell">
                                    <ArtifactTypeIcon type={draft.type!} isShowIcon={true} isShowLabel={false} />
                                </DataListCell>,
                                <DataListCell key="main content" className="content-cell">
                                    <div className="draft-title">
                                        <a className="group" onClick={() => props.onGroupClick(draft.groupId)}>{ draft.groupId || "default" }</a>
                                        <DraftId
                                            groupId={draft.groupId!}
                                            draftId={draft.draftId!}
                                            version={draft.version!}
                                            name={draft.name!}
                                            testId={`draft-title-id-${idx}`} />
                                    </div>
                                    <div className="draft-description">{draft.description || "No description."}</div>
                                    <If condition={draft.labels !== undefined && Object.getOwnPropertyNames(draft.labels).length > 0}>
                                        <div className="draft-tags">
                                            {
                                                Object.entries(draft.labels as any).map(([key, value]) =>
                                                    <Label
                                                        key={`label-${key}`}
                                                        color="purple"
                                                        style={{ marginBottom: "2px", marginRight: "5px" }}
                                                    >
                                                        <Truncate
                                                            className="label-truncate"
                                                            content={`${key}=${value}`} />
                                                    </Label>
                                                )
                                            }
                                        </div>
                                    </If>
                                </DataListCell>,
                                <DataListCell key="version" className="version-cell">
                                    <div>
                                        <span className="version" style={{ fontWeight: "bold" }}>{draft.version}</span>
                                    </div>
                                </DataListCell>,
                                <DataListCell key="modified" className="modified-cell">
                                    <div>
                                        <span>Modified by</span>
                                        <span>&nbsp;</span>
                                        <span className="modified-by">{draft.modifiedBy || "anonymous"}</span>
                                    </div>
                                    <div>
                                        <FromNow date={draft.modifiedOn}/>
                                    </div>
                                </DataListCell>,
                            ]}
                        />
                        <DataListAction
                            id={`draft-actions-${idx}`}
                            aria-label="Draft actions"
                            aria-labelledby={`draft-actions-${idx}`}
                            isPlainButtonAction={true}
                        >
                            <ObjectDropdown
                                label=""
                                isKebab={true}
                                testId={`draft-actions-dropdown-${idx}`}
                                popperProps={{
                                    position: "right"
                                }}
                                items={[
                                    {
                                        id: "view-draft",
                                        label: "View draft",
                                        testId: "view-draft-" + idx,
                                        action: () => props.onView(draft)
                                    },
                                    {
                                        divider: true
                                    },
                                    {
                                        id: "delete-draft",
                                        label: "Delete draft",
                                        testId: "delete-draft-" + idx,
                                        action: () => props.onDelete(draft)
                                    }
                                ]}
                                onSelect={item => item.action()}
                                itemToString={item => item.label}
                                itemToTestId={item => item.testId}
                                itemIsDivider={item => item.divider}
                            />
                        </DataListAction>
                    </DataListItemRow>
                )
            }

        </DataList>
    );
};
