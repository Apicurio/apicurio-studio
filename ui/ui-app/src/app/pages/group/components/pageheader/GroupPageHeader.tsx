import { FunctionComponent } from "react";
import "./GroupPageHeader.css";
import { Flex, FlexItem, Text, TextContent, TextVariants } from "@patternfly/react-core";


/**
 * Properties
 */
export type GroupPageHeaderProps = {
    title: string;
    groupId: string;
};

/**
 * Models the page header for the Group page.
 */
export const GroupPageHeader: FunctionComponent<GroupPageHeaderProps> = (props: GroupPageHeaderProps) => {
    return (
        <Flex className="example-border">
            <FlexItem>
                <TextContent>
                    <Text component={TextVariants.h1}>{ props.title }</Text>
                </TextContent>
            </FlexItem>
        </Flex>
    );
};
