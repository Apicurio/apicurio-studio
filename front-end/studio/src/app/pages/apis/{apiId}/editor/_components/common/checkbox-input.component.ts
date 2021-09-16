import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation
} from "@angular/core";
import {SelectionService} from "../../_services/selection.service";
import {AbstractInlineEditor} from "./inline-editor.base";

@Component({
    selector: "checkbox-input",
    templateUrl: "checkbox-input.component.html",
    styleUrls: ["checkbox-input.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckBoxInputComponent extends AbstractInlineEditor<boolean> {

    @Input() defaultValue: boolean;
    @Input() id: string;
    @Input() name: string;
    @Input() label: string;

    public state: boolean;

    constructor(selectionService: SelectionService) {
        super(selectionService);
    }

    public getState(): boolean {
        this.state = this.defaultValue;
        return this.state;
    }

    public onSaveState(state: boolean): void {
        this.state = state;
        this.onChange.emit(this.state);
    }

    protected initialValueForEditing(): boolean {
        return this.defaultValue;
    }
}
