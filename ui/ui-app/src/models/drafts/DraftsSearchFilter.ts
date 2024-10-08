
export enum DraftsFilterBy {
    name = "name", description = "description", labels = "labels", groupId = "groupId", artifactId = "artifactId",
    state = "state",
}

export interface DraftsSearchFilter {
    by: DraftsFilterBy;
    value: string;
}
