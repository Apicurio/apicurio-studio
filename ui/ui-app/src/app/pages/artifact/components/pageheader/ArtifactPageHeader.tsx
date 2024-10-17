import { FunctionComponent } from "react";
import "./ArtifactPageHeader.css";
import { Flex, FlexItem, Text, TextContent, TextVariants } from "@patternfly/react-core";
import { If } from "@apicurio/common-ui-components";
import { ArtifactMetaData } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";


/**
 * Properties
 */
export type ArtifactPageHeaderProps = {
    artifact: ArtifactMetaData;
};

/**
 * Models the page header for the Artifact page.
 */
export const ArtifactPageHeader: FunctionComponent<ArtifactPageHeaderProps> = (props: ArtifactPageHeaderProps) => {
    return (
        <Flex className="example-border">
            <FlexItem>
                <TextContent>
                    <Text component={TextVariants.h1}>
                        <If condition={props.artifact.groupId !== null && props.artifact.groupId !== undefined && props.artifact.groupId !== "default"}>
                            <span>{props.artifact.groupId}</span>
                            <span style={{ color: "#6c6c6c", marginLeft: "10px", marginRight: "10px" }}> / </span>
                        </If>
                        <span>{props.artifact.artifactId}</span>
                    </Text>
                </TextContent>
            </FlexItem>
        </Flex>
    );
};
