
export enum ArtifactFilterCriteriaType {
    groupId = "groupId", artifactId = "artifactId", name = "name", description = "description",
    contentId = "contentId", globalId = "globalId", labels = "labels",
}

export interface ArtifactFilterCriteria {
    type: ArtifactFilterCriteriaType;
    value: string;
}
