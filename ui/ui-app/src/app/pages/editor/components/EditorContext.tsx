import React, { FunctionComponent } from "react";
import "./EditorContext.css";
import { Breadcrumb, BreadcrumbItem, Button } from "@patternfly/react-core";
import { FromNow, If, ObjectDropdown } from "@apicurio/common-ui-components";
import { ArtifactTypes } from "@models/designs";
import { Draft } from "@models/drafts";
import { Link } from "react-router-dom";
import { AppNavigationService, useAppNavigation } from "@services/useAppNavigation.ts";

/**
 * Properties
 */
export type EditorContextProps = {
    draft: Draft;
    dirty: boolean;
    artifactContent: string;
    onSave: () => void;
    onFormat: () => void;
    onDownload: () => void;
    onCompareContent: () => void;
}

type EditorContextMenuItem = {
    label?: string;
    isDivider?: boolean;
    testId?: string;
    isVisible?: () => boolean;
    isDisabled?: () => boolean;
    onSelect?: () => void;
};


/**
 * The context of the draft when editing a draft on the editor page.
 */
export const EditorContext: FunctionComponent<EditorContextProps> = (props: EditorContextProps) => {
    const appNavigation: AppNavigationService = useAppNavigation();

    const menuItems: EditorContextMenuItem[] = [
        {
            label: "Format draft content",
            testId: "action-format",
            isVisible: () => { return [ArtifactTypes.AVRO, ArtifactTypes.JSON].includes(props.draft?.type); },
            onSelect: props.onFormat
        },
        {
            label: "Show draft changes",
            testId: "action-compare",
            isDisabled: () => { return !props.dirty; },
            onSelect: props.onCompareContent
        },
        {
            isDivider: true
        },
        {
            label: "Download draft",
            testId: "action-download",
            onSelect: props.onDownload
        },
    ];

    const groupId: string = encodeURIComponent(props.draft.groupId || "default");
    const draftId: string = encodeURIComponent(props.draft.draftId!);
    const version: string = encodeURIComponent(props.draft.version!);

    const breadcrumbs = (
        <Breadcrumb>
            <BreadcrumbItem key="bc_drafts"><Link to={appNavigation.createLink("/drafts")} data-testid="breadcrumb-lnk-drafts">Drafts</Link></BreadcrumbItem>
            <BreadcrumbItem key="bc_groupId">{ props.draft.groupId }</BreadcrumbItem>
            <BreadcrumbItem key="bc_draftId">{ props.draft.draftId }</BreadcrumbItem>
            <BreadcrumbItem key="bc_version" isActive={true}>
                <Link to={appNavigation.createLink(`/drafts/${groupId}/${draftId}/${version}`)} data-testid="breadcrumb-lnk-version">{ props.draft.version }</Link>
            </BreadcrumbItem>
            <BreadcrumbItem key="bc_editor" isActive={true}>Editor</BreadcrumbItem>
        </Breadcrumb>
    );

    return (
        <React.Fragment>
            <div className="editor-context">
                <div className="editor-context-breadcrumbs" children={breadcrumbs} />
                <If condition={props.draft.modifiedOn !== undefined}>
                    <div className="editor-context-last-modified">
                        <span>Last modified:</span>
                        <FromNow date={props.draft.modifiedOn}/>
                    </div>
                </If>
                <div className="editor-context-actions">
                    <ObjectDropdown
                        label="Actions"
                        items={menuItems}
                        testId="select-actions"
                        onSelect={item => item.onSelect()}
                        noSelectionLabel="Actions"
                        itemToTestId={item => item.testId}
                        itemIsVisible={item => !item.isVisible || item.isVisible()}
                        itemIsDivider={item => item.isDivider}
                        itemIsDisabled={item => item.isDisabled === undefined ? false : item.isDisabled()}
                        itemToString={item => item.label} />
                </div>
                <div className="editor-context-save">
                    <Button className="btn-save" variant="primary" onClick={props.onSave} isDisabled={!props.dirty}>Save</Button>
                </div>
            </div>
        </React.Fragment>
    );
};
