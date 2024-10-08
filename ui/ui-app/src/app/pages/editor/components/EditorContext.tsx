import React, { FunctionComponent, useState } from "react";
import "./EditorContext.css";
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Text,
    TextContent
} from "@patternfly/react-core";
import { ArtifactTypes, Design, DesignEvent } from "@models/designs";
import { LocalStorageService, useLocalStorageService } from "@services/useLocalStorageService.ts";
import { ArtifactTypeIcon, Description, NavLink } from "@app/components";
import { If, ObjectDropdown, ToggleIcon } from "@apicurio/common-ui-components";

/**
 * Properties
 */
export type EditorContextProps = {
    design: Design;
    dirty: boolean;
    artifactContent: string;
    onSave: () => void;
    onFormat: () => void;
    onDelete: () => void;
    onDownload: () => void;
    onRename: () => void;
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
 * The context of the design when editing a design on the editor page.
 */
export const EditorContext: FunctionComponent<EditorContextProps> = (props: EditorContextProps) => {
    const lss: LocalStorageService = useLocalStorageService();

    const [originEvent] = useState<DesignEvent>();
    const [isExpanded, setExpanded] = useState(lss.getConfigProperty("editor-context.isExpanded", "false") === "true");

    const menuItems: EditorContextMenuItem[] = [
        {
            label: "Edit design metadata",
            testId: "action-rename",
            onSelect: props.onRename
        },
        {
            label: "Format design content",
            testId: "action-format",
            isVisible: () => { return [ArtifactTypes.AVRO, ArtifactTypes.JSON].includes(props.design?.type); },
            onSelect: props.onFormat
        },
        {
            label: "Show design changes",
            testId: "action-compare",
            isDisabled: () => { return !props.dirty; },
            onSelect: props.onCompareContent
        },
        {
            isDivider: true
        },
        {
            label: "Download design",
            testId: "action-download",
            onSelect: props.onDownload
        },
        {
            isDivider: true
        },
        {
            label: "Delete design",
            testId: "action-delete",
            onSelect: props.onDelete
        },
    ];

    const onToggleExpand = (): void => {
        const newExpanded: boolean = !isExpanded;
        lss.setConfigProperty("editor-context.isExpanded", "" + newExpanded);
        setExpanded(newExpanded);
    };

    const hasFileContext = (): boolean => {
        return originEvent?.data.import?.file !== undefined;
    };

    const hasUrlContext = (): boolean => {
        return originEvent?.data.import?.url !== undefined;
    };

    return (
        <React.Fragment>
            <div className="editor-context">
                <div className="editor-context-breadcrumbs">
                    <Breadcrumb style={{ marginBottom: "10px" }}>
                        <BreadcrumbItem component="button">
                            <NavLink location="/" testId="breadcrumb-designs">API and Schema Designs</NavLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isActive={true}>{props.design?.name}</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <div className="editor-context-last-modified">
                    <span>Last modified:</span>
                    {/*<Moment date={props.design?.modifiedOn} fromNow={true} />*/}
                </div>
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
                <div className="editor-context-toggle">
                    <Button className="btn-toggle" variant="plain" onClick={onToggleExpand}>
                        <ToggleIcon expanded={isExpanded} onClick={() => { setExpanded(!isExpanded); }} />
                    </Button>
                </div>
            </div>
            <If condition={isExpanded}>
                <div className="editor-context-details">
                    <TextContent>
                        <Text component="h1" className="title">{props.design?.name}</Text>
                        <Description className="description" description={props.design?.description} />
                    </TextContent>
                    <div className="metadata">
                        <DescriptionList isHorizontal={true} isCompact={true}>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Type</DescriptionListTerm>
                                <DescriptionListDescription>
                                    <ArtifactTypeIcon type={props.design?.type} isShowLabel={true} isShowIcon={true} />
                                </DescriptionListDescription>
                            </DescriptionListGroup>
                            <If condition={hasFileContext}>
                                <DescriptionListGroup>
                                    <DescriptionListTerm>File name</DescriptionListTerm>
                                    <DescriptionListDescription>
                                        <span>{originEvent?.data.import?.file}</span>
                                    </DescriptionListDescription>
                                </DescriptionListGroup>
                            </If>
                            <If condition={hasUrlContext}>
                                <DescriptionListGroup>
                                    <DescriptionListTerm>URL</DescriptionListTerm>
                                    <DescriptionListDescription>
                                        <a href={originEvent?.data.import?.url}>{originEvent?.data.import?.url}</a>
                                    </DescriptionListDescription>
                                </DescriptionListGroup>
                            </If>
                        </DescriptionList>
                    </div>
                </div>
            </If>
        </React.Fragment>
    );
};
