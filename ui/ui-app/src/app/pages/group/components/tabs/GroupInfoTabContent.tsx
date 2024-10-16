import { FunctionComponent } from "react";
import "./GroupInfoTabContent.css";
import { RuleList, RuleListType } from "@app/components";
import {
    Card,
    CardBody,
    CardTitle,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Divider,
    Flex,
    FlexItem,
    Icon,
    Label,
    Truncate
} from "@patternfly/react-core";
import { OutlinedFolderIcon, PencilAltIcon } from "@patternfly/react-icons";
import {FromNow, If} from "@apicurio/common-ui-components";
import { isStringEmptyOrUndefined } from "@utils/string.utils.ts";
import { GroupMetaData, Rule } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { labelsToAny } from "@utils/rest.utils.ts";

/**
 * Properties
 */
export type GroupInfoTabContentProps = {
    group: GroupMetaData;
    rules: Rule[];
};

/**
 * Models the content of the Artifact Info tab.
 */
export const GroupInfoTabContent: FunctionComponent<GroupInfoTabContentProps> = (props: GroupInfoTabContentProps) => {

    const description = (): string => {
        return props.group.description || "No description";
    };

    const labels: any = labelsToAny(props.group.labels);

    return (
        <div className="group-tab-content">
            <div className="group-basics">
                <Card>
                    <CardTitle>
                        <div className="title-and-type">
                            <Flex>
                                <FlexItem className="type"><Icon><OutlinedFolderIcon /></Icon></FlexItem>
                                <FlexItem className="title">Group metadata</FlexItem>
                            </Flex>
                        </div>
                    </CardTitle>
                    <Divider />
                    <CardBody>
                        <DescriptionList className="metaData" isCompact={true}>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Description</DescriptionListTerm>
                                <DescriptionListDescription
                                    data-testid="group-details-description"
                                    className={!props.group.description ? "empty-state-text" : ""}
                                >
                                    { description() }
                                </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Created</DescriptionListTerm>
                                <DescriptionListDescription data-testid="group-details-created-on">
                                    <FromNow date={props.group.createdOn} />
                                </DescriptionListDescription>
                            </DescriptionListGroup>
                            <If condition={!isStringEmptyOrUndefined(props.group.owner)}>
                                <DescriptionListGroup>
                                    <DescriptionListTerm>Owner</DescriptionListTerm>
                                    <DescriptionListDescription data-testid="group-details-created-by">
                                        <span>{props.group.owner}</span>
                                    </DescriptionListDescription>
                                </DescriptionListGroup>
                            </If>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Modified</DescriptionListTerm>
                                <DescriptionListDescription data-testid="group-details-modified-on">
                                    <FromNow date={props.group.modifiedOn} />
                                </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Labels</DescriptionListTerm>
                                {!labels || !Object.keys(labels).length ?
                                    <DescriptionListDescription data-testid="group-details-labels" className="empty-state-text">No labels</DescriptionListDescription> :
                                    <DescriptionListDescription data-testid="group-details-labels">{Object.entries(labels).map(([key, value]) =>
                                        <Label key={`label-${key}`} color="purple" style={{ marginBottom: "2px", marginRight: "5px" }}>
                                            <Truncate className="label-truncate" content={`${key}=${value}`} />
                                        </Label>
                                    )}</DescriptionListDescription>
                                }
                            </DescriptionListGroup>
                        </DescriptionList>
                    </CardBody>
                </Card>
            </div>
            <div className="group-rules">
                <Card>
                    <CardTitle>
                        <div className="rules-label">Group-specific rules</div>
                    </CardTitle>
                    <Divider />
                    <CardBody>
                        <p style={{ paddingBottom: "15px" }}>
                            View the content rules for this group.
                        </p>
                        <RuleList
                            type={RuleListType.Group}
                            rules={props.rules}
                        />
                    </CardBody>
                </Card>
            </div>
        </div>
    );

};
