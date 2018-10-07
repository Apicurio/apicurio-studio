/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, ElementRef, EventEmitter, Output, QueryList, ViewChildren} from "@angular/core";
import {ModalDirective} from "ngx-bootstrap";
import {ThreeScaleMetric} from "../forms/operation/3scale-section.component";


@Component({
    moduleId: module.id,
    selector: "metric-dialog",
    templateUrl: "metric-dialog.component.html",
    styleUrls: ["metric-dialog.component.css"]
})
export class MetricDialogComponent {

    @Output() onAdd: EventEmitter<ThreeScaleMetric> = new EventEmitter<ThreeScaleMetric>();
    @Output() onEdit: EventEmitter<ThreeScaleMetric> = new EventEmitter<ThreeScaleMetric>();

    @ViewChildren("metricModal") metricModal: QueryList<ModalDirective>;
    @ViewChildren("metricInput") metricInput: QueryList<ElementRef>;

    protected _isOpen: boolean = false;

    protected metric: ThreeScaleMetric;
    protected _mode: string = "add";

    /**
     * Called to open the dialog.
     */
    public open(metric?: ThreeScaleMetric): void {
        if (metric) {
            this._mode = "edit";
            // Clone the input so we don't side effect anything
            this.metric = JSON.parse(JSON.stringify(metric));
        } else {
            this._mode = "add";
            this.metric = {
                metric: "",
                increment: 1
            };
        }
        this._isOpen = true;
        this.metricModal.changes.subscribe( thing => {
            if (this.metricModal.first) {
                this.metricModal.first.show();
            }
        });
    }

    /**
     * Called to close the dialog.
     */
    public close(): void {
        this._isOpen = false;
    }

    /**
     * Called when the user clicks "add".
     */
    protected add(): void {
        this.onAdd.emit(this.metric);
        this.cancel();
    }

    /**
     * Called when the user clicks "edit".
     */
    protected edit(): void {
        this.onEdit.emit(this.metric);
        this.cancel();
    }

    /**
     * Called when the user clicks "cancel".
     */
    protected cancel(): void {
        this.metricModal.first.hide();
    }

    /**
     * Returns true if the dialog is open.
     * @return
     */
    public isOpen(): boolean {
        return this._isOpen;
    }

    /**
     * Called to initialize the selection/focus to the addPathInput field.
     */
    public doSelect(): void {
        if (this.metricInput && this.metricInput.first) {
            this.metricInput.first.nativeElement.focus();
        }
    }

}
