import { PageErrorType } from "@app/pages/PageErrorType.ts";

export interface PageError {
    type: PageErrorType,
    errorMessage: string,
    error: any
}
