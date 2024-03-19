import { Design } from "./Design";

export interface DesignsSearchResults {
    designs: Design[];
    count: number;
    page: number;
    pageSize: number;
}
