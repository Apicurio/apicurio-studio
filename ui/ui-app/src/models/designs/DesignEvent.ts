import { DesignEventData } from "./DesignEventData";

export type DesignEventType = "CREATE" | "IMPORT" | "UPDATE" | "REGISTER" | "DOWNLOAD";

export interface DesignEvent {

    eventId?: string;
    id: string;
    type: DesignEventType;
    on: Date;
    data: DesignEventData;

}
