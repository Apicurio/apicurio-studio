import {Component, Input} from '@angular/core';

export class Breadcrumb {
    constructor(public label: string, public icon: string, public route?: string) {}
}


@Component({
    moduleId: module.id,
    selector: 'breadcrumbs',
    templateUrl: 'breadcrumbs.component.html',
    styleUrls: ['breadcrumbs.component.css']
})
export class BreadcrumbsComponent {

    @Input() breadcrumbs: Breadcrumb[];

}
