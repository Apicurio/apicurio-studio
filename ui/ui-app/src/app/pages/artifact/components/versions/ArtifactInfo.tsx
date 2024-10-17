import { FunctionComponent } from "react";
import "./ArtifactInfo.css";
import {
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Label,
    Truncate
} from "@patternfly/react-core";
import { FromNow, If } from "@apicurio/common-ui-components";
import { isStringEmptyOrUndefined } from "@utils/string.utils.ts";
import { ArtifactMetaData } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { labelsToAny } from "@utils/rest.utils.ts";

/**
 * Properties
 */
export type ArtifactInfoProps = {
    artifact: ArtifactMetaData;
};

/**
 * Models the content of the Artifact Info tab.
 */
export const ArtifactInfo: FunctionComponent<ArtifactInfoProps> = (props: ArtifactInfoProps) => {

    const description = (): string => {
        return props.artifact.description || "No description";
    };

    const artifactName = (): string => {
        return props.artifact.name || "No name";
    };

    const labels: any = labelsToAny(props.artifact.labels);

    return (
        <DescriptionList className="metaData" isCompact={true}>
            <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription
                    data-testid="artifact-details-name"
                    className={!props.artifact.name ? "empty-state-text" : ""}
                >
                    { artifactName() }
                </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
                <DescriptionListTerm>Description</DescriptionListTerm>
                <DescriptionListDescription
                    data-testid="artifact-details-description"
                    className={!props.artifact.description ? "empty-state-text" : ""}
                >
                    { description() }
                </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
                <DescriptionListTerm>Created</DescriptionListTerm>
                <DescriptionListDescription data-testid="artifact-details-created-on">
                    <FromNow date={props.artifact.createdOn} />
                </DescriptionListDescription>
            </DescriptionListGroup>
            <If condition={!isStringEmptyOrUndefined(props.artifact.owner)}>
                <DescriptionListGroup>
                    <DescriptionListTerm>Owner</DescriptionListTerm>
                    <DescriptionListDescription data-testid="artifact-details-created-by">
                        <span>{props.artifact.owner}</span>
                    </DescriptionListDescription>
                </DescriptionListGroup>
            </If>
            <DescriptionListGroup>
                <DescriptionListTerm>Modified</DescriptionListTerm>
                <DescriptionListDescription data-testid="artifact-details-modified-on">
                    <FromNow date={props.artifact.modifiedOn} />
                </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
                <DescriptionListTerm>Labels</DescriptionListTerm>
                {!labels || !Object.keys(labels).length ?
                    <DescriptionListDescription data-testid="artifact-details-labels" className="empty-state-text">No labels</DescriptionListDescription> :
                    <DescriptionListDescription data-testid="artifact-details-labels">{Object.entries(labels).map(([key, value]) =>
                        <Label key={`label-${key}`} color="purple" style={{ marginBottom: "2px", marginRight: "5px" }}>
                            <Truncate className="label-truncate" content={`${key}=${value}`} />
                        </Label>
                    )}</DescriptionListDescription>
                }
            </DescriptionListGroup>
        </DescriptionList>
    );

};
