import {Component, Inject, EventEmitter, Output, Input} from '@angular/core';
import {IApisService} from "../../../services/apis.service";
import {Api} from "../../../models/api.model";


@Component({
    moduleId: module.id,
    selector: 'apis-cards',
    templateUrl: 'apis-cards.component.html',
    styleUrls: ['apis-cards.component.css']
})
export class ApisCardsComponent {

    @Input() apis: Api[];
    @Output() onApisSelected: EventEmitter<Api[]> = new EventEmitter<Api[]>();

    selectedApis: Api[] = [];

    /**
     * Constructor.
     */
    constructor() {}

    public toggleApiSelected(api: Api): void {
        if (this.isSelected(api)) {
            this.selectedApis.splice(this.selectedApis.indexOf(api), 1);
        } else {
            this.selectedApis.push(api);
        }
        this.onApisSelected.emit(this.selectedApis);
    }

    public isSelected(api: Api): boolean {
        return this.selectedApis.indexOf(api) != -1;
    }

}
