import { Draft } from "./Draft.ts";

export interface DraftsSearchResults {
    drafts: Draft[];
    count: number;
}
