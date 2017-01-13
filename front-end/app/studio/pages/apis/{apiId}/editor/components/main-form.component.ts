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

import {Component, Input, ViewEncapsulation} from '@angular/core';
import {OasDocument, Oas20Document} from "oai-ts-core";


@Component({
    moduleId: module.id,
    selector: 'main-form',
    templateUrl: 'main-form.component.html',
    encapsulation: ViewEncapsulation.None
})
export class MainFormComponent {

    @Input() document: OasDocument;

    public doc(): Oas20Document {
        return <Oas20Document> this.document;
    }

    /**
     * returns the title.
     */
    public title(): string {
        if (this.doc().info) {
            return this.doc().info.title;
        } else {
            return "";
        }
    }

    /**
     * returns the version.
     */
    public version(): string {
        if (this.doc().info) {
            return this.doc().info.version;
        } else {
            return "";
        }
    }

    /**
     * returns the description.
     */
    public description(): string {
        if (this.doc().info) {
            return this.doc().info.description;
        } else {
            return "";
        }
    }

    /**
     * returns the terms of service.
     */
    public tos(): string {
        if (this.doc().info) {
            return this.doc().info.termsOfService;
        } else {
            return "";
        }
    }

    /**
     * returns the contact name.
     */
    public contactName(): string {
        if (this.doc().info && this.doc().info.contact) {
            return this.doc().info.contact.name;
        } else {
            return "";
        }
    }

    /**
     * returns the contact email.
     */
    public contactEmail(): string {
        if (this.doc().info && this.doc().info.contact) {
            return this.doc().info.contact.email;
        } else {
            return "";
        }
    }

    /**
     * returns the contact url.
     */
    public contactUrl(): string {
        if (this.doc().info && this.doc().info.contact) {
            return this.doc().info.contact.url;
        } else {
            return "";
        }
    }

    /**
     * returns the license name.
     */
    public licenseName(): string {
        if (this.doc().info && this.doc().info.license) {
            return this.doc().info.license.name;
        } else {
            return "";
        }
    }

    /**
     * returns the license url.
     */
    public licenseUrl(): string {
        if (this.doc().info && this.doc().info.license) {
            return this.doc().info.license.url;
        } else {
            return "";
        }
    }

    /**
     * Called when the user changes the title.
     * @param newTitle
     */
    public onTitleChange(newTitle: string): void {
        console.info("User changed the title to: " + newTitle);
    }

}
