
export enum VersionFilterCriteriaType {
    groupId = "groupId", artifactId = "artifactId", version = "version",
    name = "name", description = "description", labels = "labels",
    contentId = "contentId", globalId = "globalId", state = "state",
}

export interface VersionFilterCriteria {
    type: VersionFilterCriteriaType;
    value: string;
}
