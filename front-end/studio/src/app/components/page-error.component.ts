/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, Input} from "@angular/core";


@Component({
    moduleId: module.id,
    selector: "page-error",
    templateUrl: "page-error.component.html",
    styleUrls: [ "page-error.component.css" ]
})
export class PageErrorComponent {

    @Input() error: any;

    private eobj: any = null;
    public showDetails: boolean = false;

    /**
     * Called to reload the browser page.
     */
    public reloadPage(): void {
        window.location.reload();
    }

    /**
     * Called to toggle the error details.
     */
    public toggleDetails(): void {
        this.showDetails = !this.showDetails;
    }

    /**
     * Returns the error code.
     */
    public errorCode(): number {
        return this.error.status;
    }

    /**
     * Returns the error type.  Only valid when the error code is 500.
     * 
     */
    public errorMessage(): string {
        if (this.errorObj().message) {
            return this.errorObj().message;
        }
        return this.error.statusText;
    }

    /**
     * Returns the error stack trace.  Only valid when the error code is 500.
     */
    public stackTrace(): string {
        return this.errorObj().trace;
    }

    /**
     * Returns the error type.  Only valid when the error code is 500.
     * 
     */
    public errorType(): string {
        return this.errorObj().errorType;
    }

    /**
     * Returns the parsed error body.
     * 
     */
    private errorObj(): any {
        if (this.eobj === null) {
            this.eobj = this.error.error;
        }
        return this.eobj;
    }

}
