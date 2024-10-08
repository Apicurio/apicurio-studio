import { PageError } from "@app/pages/PageError.ts";
import { PageErrorType } from "@app/pages/PageErrorType.ts";

export const toPageError = (error: any, errorMessage: any): PageError => {
    console.error("[PageDataLoader] Handling an error loading page data.");
    console.error("[PageDataLoader] ", errorMessage);
    console.error("[PageDataLoader] ", error);
    return {
        error,
        errorMessage,
        type: PageErrorType.Server
    };
};
