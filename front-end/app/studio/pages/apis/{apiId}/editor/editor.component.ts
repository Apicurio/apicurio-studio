import {Component, EventEmitter, Output, Input} from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'api-editor',
    templateUrl: 'editor.component.html',
    styleUrls: ['editor.component.css']
})
export class ApiEditorComponent {

    @Input() api: any;
    @Output() onDirty: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onSave: EventEmitter<any> = new EventEmitter<any>();

    theme: string = "light";

    /**
     * Constructor.
     */
    constructor() {}

}
