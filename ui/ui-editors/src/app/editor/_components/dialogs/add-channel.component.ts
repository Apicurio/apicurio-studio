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
import {AaiDocument} from "@apicurio/data-models";


@Component({
    selector: "add-channel-dialog",
    templateUrl: "add-channel.component.html"
})
export class AddChannelDialogComponent {

    @Input() channelRegex: string = "";

    @Output() onAdd: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("addChannelModal") addChannelModal: QueryList<ModalDirective>;
    @ViewChildren("addChannelInput") addChannelInput: QueryList<ElementRef>;

    private _isOpen: boolean = false;

    channel: string = "";
    channels: string[] = [];
    channelExists: boolean = false;

    constructor(){
    }

    /**
     * Called to open the dialog.
     * @param document
     * @param channel
     */
    public open(document: AaiDocument, channel?: string): void {
        this.channel = channel;
        if (!channel) {
            this.channel = "";
        }
        this._isOpen = true;
        this.addChannelModal.changes.subscribe( thing => {
            if (this.addChannelModal.first) {
                this.addChannelModal.first.show();
            }
        });

        this.channels = [];
        this.channelExists = false;
        if (document.channels) {
            document.getChannels().forEach( channelItem => {
                this.channels.push(channelItem.getName());
            });
        }
    }

    /**
     * Called to close the dialog.
     */
    close(): void {
        this._isOpen = false;
        this.channel = "";
    }

    /**
     * Called when the user clicks "add".
     */
    add(): void {
        this.onAdd.emit(this.channel);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    cancel(): void {
        this.addChannelModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Called to initialize the selection/focus to the addPathInput field.
     */
    doSelect(): void {
        this.addChannelInput.first.nativeElement.focus();
        this.addChannelInput.first.nativeElement.selectionStart = this.addChannelInput.first.nativeElement.selectionEnd = this.channel.length
    }

    /**
     * Called whenever the user types anything in the channel field - this validates that the channel entered
     * is OK.
     * @param newChannel
     */
    validateChannel(newChannel: string) {
        this.channelExists = this.channels.indexOf(newChannel) != -1;
    }

    channelValidation(): string{
        return this.channelRegex;
    }
}
