import {Component, Inject, EventEmitter, Output, Input} from '@angular/core';
import {IApisService} from "../../services/apis.service";
import {Api} from "../../models/api.model";


@Component({
    moduleId: module.id,
    selector: 'apis-list',
    templateUrl: 'apis-list.component.html',
    styleUrls: ['apis-list.component.css']
})
export class ApisListComponent {

    @Input() apis: Api[];
    @Input() selectedApis: Api[];
    @Output() onApiSelected: EventEmitter<Api> = new EventEmitter<Api>();
    @Output() onApiDeselected: EventEmitter<Api> = new EventEmitter<Api>();

    /**
     * Constructor.
     */
    constructor() {}

    public toggleApiSelected(api: Api): void {
        if (this.isSelected(api)) {
            this.onApiDeselected.emit(api);
        } else {
            this.onApiSelected.emit(api);
        }
    }

    public isSelected(api: Api): boolean {
        return this.selectedApis.indexOf(api) != -1;
    }

}
