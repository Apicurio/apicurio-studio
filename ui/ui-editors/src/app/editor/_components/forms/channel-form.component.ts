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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";

import {
    CommandFactory,
    ICommand,
    Library,
    AaiChannelItem,
    AaiDocument
} from "@apicurio/data-models";
import {SourceFormComponent} from "./source-form.base";
import {SelectionService} from "../../_services/selection.service";
import {CommandService} from "../../_services/command.service";
import {DocumentService} from "../../_services/document.service";
import {EditorsService} from "../../_services/editors.service";

@Component({
    selector: "channel-form",
    templateUrl: "channel-form.component.html",
    styleUrls: [ "channel-form.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChannelFormComponent extends SourceFormComponent<AaiChannelItem> {

    protected _channel: AaiChannelItem;

    @Input()
    set channel(channel: AaiChannelItem) {
        this._channel = channel;
        this.sourceNode = channel;
        this.revertSource();
    }
    get channel(): AaiChannelItem {
        return this._channel;
    }

    public constructor(protected changeDetectorRef: ChangeDetectorRef,
            protected selectionService: SelectionService,
            protected commandService: CommandService,
            protected documentService: DocumentService,
            private editors: EditorsService) {
        super(changeDetectorRef, selectionService, commandService, documentService);
    }

    protected createEmptyNodeForSource(): AaiChannelItem {
        return (<AaiDocument>this.channel.parent()).createChannelItem(this.channel.getName());
    }

    protected createReplaceNodeCommand(node: AaiChannelItem): ICommand {
        return CommandFactory.createReplaceChannelItemCommand(this.channel, node);
    }

    public enableSourceMode(): void {
        this.sourceNode = this.channel;
        super.enableSourceMode();
    }
}
