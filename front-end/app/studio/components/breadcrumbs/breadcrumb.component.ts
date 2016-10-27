import {Component, Input} from '@angular/core';


@Component({
    moduleId: module.id,
    selector: '[breadcrumb]',
    templateUrl: 'breadcrumb.component.html',
    styleUrls: ['breadcrumb.component.css']
})
export class BreadcrumbComponent {

    @Input() label: string;
    @Input() icon: string;
    @Input() route: string[];

}
