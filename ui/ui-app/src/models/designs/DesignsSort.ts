export type SortDirection = "asc" | "desc";
export type SortBy = "name" | "modifiedOn" | "createdOn" | "type";

export interface DesignsSort {
    by: SortBy;
    direction: SortDirection;
}
