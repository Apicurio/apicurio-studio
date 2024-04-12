import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {FormlyJsonschema} from "@ngx-formly/core/json-schema";
import {LoggerService} from "../../../services/logger.service";

@Component({
    selector: "dynamic-form",
    templateUrl: "./dynamic-form.component.html",
    styleUrls: ["./dynamic-form.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class DynamicFormComponent implements OnChanges {
    @Input() schema: any;
    @Input() model: any;
    @Output() onModelChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() onValid: EventEmitter<boolean> = new EventEmitter<boolean>();

    form: FormGroup = undefined;
    fields: FormlyFieldConfig[] = undefined;
    isValid: boolean = undefined;

    constructor(private logger: LoggerService, private formlyJsonschema: FormlyJsonschema) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.schema) {
            this.isValid = undefined;
            this.form = new FormGroup({});
            this.fields = [this.formlyJsonschema.toFieldConfig(this.schema)];
            this.form.valueChanges.subscribe(changes => {
                this.onModelChange.emit(this.model);
                this.validate();
            });
        }
        setTimeout(() => {
            if (this.form) {
                this.form.updateValueAndValidity();
            }
            this.validate();
        }, 100);
    }

    private validate(): void {
        if (this.isValid !== this.form.valid) {
            this.onValid.emit(this.form.valid);
        }
        this.isValid = this.form.valid;
    }

}
