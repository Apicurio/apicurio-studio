import {Component, Inject, EventEmitter, Output} from '@angular/core';
import {IApisService} from "../../../services/apis.service";
import {Api} from "../../../models/api.model";


@Component({
    moduleId: module.id,
    selector: 'newapi-form',
    templateUrl: 'newapi-form.component.html',
    styleUrls: ['newapi-form.component.css']
})
export class NewApiFormComponent {

    @Output() onCreateApi = new EventEmitter<Api>();

    repositoryTypes: string[];
    model: Api;
    creatingApi: boolean;

    /**
     * Constructor.
     * @param apis
     */
    constructor(@Inject(IApisService) private apis: IApisService) {
        this.repositoryTypes = apis.getSupportedRepositoryTypes();
        this.model = new Api();
        this.model.repositoryResource.repositoryType = this.repositoryTypes[0];
        this.creatingApi = false;
    }

    /**
     * Called when the user clicks the "Create API" submit button on the form.
     */
    public createApi(): void {
        this.creatingApi = true;
        this.onCreateApi.emit(this.model);
    }

}
