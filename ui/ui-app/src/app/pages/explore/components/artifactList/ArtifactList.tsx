import { FunctionComponent } from "react";
import "./ArtifactList.css";
import { DataList, DataListCell, DataListItemCells, DataListItemRow } from "@patternfly/react-core";
import { ArtifactTypeIcon } from "@app/components";
import { ArtifactGroup, ArtifactName } from "@app/pages";
import { SearchedArtifact } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";

/**
 * Properties
 */
export type ArtifactListProps = {
    artifacts: SearchedArtifact[];
};


/**
 * Models the list of artifacts.
 */
export const ArtifactList: FunctionComponent<ArtifactListProps> = (props: ArtifactListProps) => {

    const description = (artifact: SearchedArtifact): string => {
        if (artifact.description) {
            return artifact.description;
        }
        return `An artifact of type ${artifact.artifactType} with no description.`;
    };

    return (
        <DataList aria-label="List of artifacts" className="artifact-list">
            {
                props.artifacts.map( (artifact, /* idx */) =>
                    <DataListItemRow className="artifact-list-item" key={artifact.artifactId}>
                        <DataListItemCells
                            dataListCells={[
                                <DataListCell key="type icon" className="type-icon-cell">
                                    <ArtifactTypeIcon artifactType={artifact.artifactType!}/>
                                </DataListCell>,
                                <DataListCell key="main content" className="content-cell">
                                    <div className="artifact-title">
                                        <ArtifactGroup groupId={artifact.groupId!} />
                                        <ArtifactName groupId={artifact.groupId!} id={artifact.artifactId!} name={artifact.name!} />
                                        {/*{*/}
                                        {/*    statuses(artifact).map( status =>*/}
                                        {/*        <Badge className="status-badge" key={status} isRead={true}>{status}</Badge>*/}
                                        {/*    )*/}
                                        {/*}*/}
                                    </div>
                                    <div className="artifact-description">{description(artifact)}</div>
                                    {/*<div className="artifact-tags">*/}
                                    {/*    {*/}
                                    {/*        labels(artifact).map( label =>*/}
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
