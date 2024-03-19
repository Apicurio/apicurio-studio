import { Design } from "./Design";

export enum ExportType {
    FILE
}

export interface ExportDesign {
    type: ExportType;
    to: any;
    design: Design;
}
