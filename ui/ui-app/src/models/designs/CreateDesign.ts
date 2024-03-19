import { DesignOriginType } from "./Design";

export interface CreateDesign {

    type: string;
    name: string;
    description: string | undefined;
    origin: DesignOriginType;

}
