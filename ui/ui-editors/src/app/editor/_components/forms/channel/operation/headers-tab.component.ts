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
    ViewEncapsulation
} from "@angular/core";
import {
    AaiDocument,
    AaiMessage,
    AaiOperation,
    CommandFactory,
    ICommand,
    SimplifiedType
} from "@apicurio/data-models";
import {CommandService} from "../../../../_services/command.service";
import {DocumentService} from "../../../../_services/document.service";
import {AbstractBaseComponent} from "../../../common/base-component";
import {SelectionService} from "../../../../_services/selection.service";

@Component({
    selector: "headers-tab",
    templateUrl: "headers-tab.component.html",
    styleUrls: [ "headers-tab.component.css" ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadersTabComponent extends AbstractBaseComponent {

    @Input() message: AaiMessage;

    protected _model: SimplifiedType = null;
    protected editing: boolean = false;
    protected tab: string = "";

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService,
        private commandService: CommandService, private selectionService: SelectionService) {
            super(changeDetectorRef, documentService, selectionService);
    }

    public model(): SimplifiedType {
        return this._model;
    }
    public document(): AaiDocument {
        return <AaiDocument> this.message.ownerDocument();
    }

    public toggleTab(tab: string): void {
        if (this.isEditing() && this.tab === tab) {
            this.editing = false;
        } else {
            this.editing = true;
            this.tab = tab;
        }
    }
    public isEditing(): boolean {
        return this.editing;
    }
    public isEditingTab(tab: string): boolean {
        return this.isEditing() && this.tab === tab;
    }

    public toggleType(): void {
        this.toggleTab("type");
    }
    public isEditingType(): boolean {
        return this.isEditingTab("type");
    }

    public displayType(): SimplifiedType {
        let type: SimplifiedType = new SimplifiedType();
        if (this.message.headers && this.message.headers.$ref) {
            type.type = this.message.headers.$ref;
        }
        return type;
    }

    public changeRefType(newType: SimplifiedType): void {
        let nt: SimplifiedType = new SimplifiedType();
        nt.type = newType.type;
        nt.enum_ = newType.enum_;
        nt.of = newType.of;
        nt.as = newType.as;

        let command: ICommand = CommandFactory.createChangeHeadersRefCommand_Aai20(nt.type, this.message.parent() as AaiOperation);
        this.commandService.emit(command);
        this._model = nt;
    }
}
