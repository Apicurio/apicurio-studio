import { DesignEventType } from "./DesignEvent";
import { DesignEventData } from "./DesignEventData";

export interface CreateDesignEvent {

    type: DesignEventType;
    data: DesignEventData;

}
