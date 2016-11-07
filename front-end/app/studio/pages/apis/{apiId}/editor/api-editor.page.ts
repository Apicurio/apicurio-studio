import {Component, OnInit, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiDefinition} from "../../../../models/api.model";
import {IApisService} from "../../../../services/apis.service";

@Component({
    moduleId: module.id,
    selector: 'api-editor-page',
    templateUrl: 'api-editor.page.html',
    styleUrls: ['api-editor.page.css']
})
export class ApiEditorPageComponent implements OnInit {

    public apiDefinition: ApiDefinition;

    public dataLoaded: Map<string, boolean> = new Map<string, boolean>();

    /**
     * Constructor.
     * @param router
     * @param route
     * @param apis
     */
    constructor(private router: Router,
                private route: ActivatedRoute,
                @Inject(IApisService) private apis: IApisService) {
        this.apiDefinition = new ApiDefinition();
    }

    public ngOnInit(): void {
        this.route.data.subscribe( value => {
            this.apiDefinition = value["apiDefinition"];
            console.info("[ApiEditorPageComponent] API definition resolved successfully.");
        });
    }

}
