import { DesignOriginType, DesignType } from "./Design";

export interface CreateDesign {

    type: DesignType;
    name: string;
    description: string | undefined;
    origin: DesignOriginType;
    contentType: string;
    content: string;

}
