import {Component, EventEmitter, Output, Input} from '@angular/core';
import {Api} from "../../models/api.model";


@Component({
    moduleId: module.id,
    selector: 'apis-cards',
    templateUrl: 'apis-cards.component.html',
    styleUrls: ['apis-cards.component.css']
})
export class ApisCardsComponent {

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
