import { DesignEventDataCreate } from "./DesignEventDataCreate";
import { DesignEventDataImport } from "./DesignEventDataImport";
import { DesignEventDataUpdate } from "./DesignEventDataUpdate";

export interface DesignEventData {

    create?: DesignEventDataCreate;
    import?: DesignEventDataImport;
    update?: DesignEventDataUpdate;

}
