/**
 * @license
 * Copyright 2022 Red Hat
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

import {Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap/modal";
import {AaiChannelItem, AaiDocument} from "@apicurio/data-models";


@Component({
    selector: "clone-channel-dialog",
    templateUrl: "clone-channel.component.html"
})
export class CloneChannelDialogComponent {

    @Input() channelRegex: string;
    @Output() onClone: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("cloneChannelModal") cloneChannelModal: QueryList<ModalDirective>;
    @ViewChildren("cloneChannelInput") cloneChannelInput: QueryList<ElementRef>;

    private _isOpen: boolean = false;

    channelName: string = "";
    object: AaiChannelItem;

    channelNames: string[] = [];
    channelExists: boolean = false;

    constructor() {
    }

    /**
     * Called to open the dialog.
     * @param document
     * @param channel
     */
    public open(document: AaiDocument, channel: AaiChannelItem): void {
        this.object = channel;
        this.channelName = channel.getName();
        this._isOpen = true;
        this.cloneChannelModal.changes.subscribe( () => {
            if (this.cloneChannelModal.first) {
                this.cloneChannelModal.first.show();
            }
        });

        this.channelNames = [];
        this.channelExists = false;
        if (document.channels) {
            document.getChannels().forEach( channelItem => {
                this.channelNames.push(channelItem.getName());
            });
        }
    }

    /**
     * Called to close the dialog.
     */
    close(): void {
        this._isOpen = false;
        this.channelName = "";
    }

    /**
     * Called when the user clicks "clone".
     */
    clone(): void {
        let modalData: any = {
            channelName: this.channelName,
            object: this.object
        };
        this.onClone.emit(modalData);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void {
        this.cloneChannelModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Called to initialize the selection/focus to the cloneChannelInput field.
     */
    doSelect(): void {
        this.cloneChannelInput.first.nativeElement.focus();
        this.cloneChannelInput.first.nativeElement.selectionStart = this.cloneChannelInput.first.nativeElement.selectionEnd = this.channelName.length
    }

    /**
     * Called whenever the user types anything in the channel field - this validates that the channel entered
     * is OK.
     * @param newChannelName
     */
    validateChannelName(newChannelName: string) {
        this.channelExists = this.channelNames.indexOf(newChannelName) != -1;
    }
}
