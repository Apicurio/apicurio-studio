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

import {Component, Input, ViewEncapsulation} from "@angular/core";
import {Oas20Operation, Oas30Operation, OasExtension} from "oai-ts-core";
import {CommandService} from "../../../_services/command.service";
import {createDeleteExtensionCommand, createSetExtensionCommand, ICommand} from "oai-ts-commands";

export interface ThreeScaleMetric {
    metric: string;
    increment: number;
}

@Component({
    moduleId: module.id,
    selector: "operation-3scale-section",
    templateUrl: "3scale-section.component.html",
    styleUrls: [ "3scale-section.component.css" ],
    encapsulation: ViewEncapsulation.None
})
export class Operation3scaleSectionComponent {

    EMPTY_ARRAY: any[] = [];

    @Input() operation: Oas20Operation | Oas30Operation;

    constructor(private commandService: CommandService) {}

    public is3scaleEnabled(): boolean {
        let rval: boolean = false;
        if (this.operation.ownerDocument().tags) {
            this.operation.ownerDocument().tags.forEach( tag => {
                if (tag.name === "3scale") {
                    rval = true;
                }
            })
        }
        return rval;
    }

    public metrics(): ThreeScaleMetric[] {
        let metricsExtension: OasExtension = this.getMetricsExtension();
        if (metricsExtension) {
            return metricsExtension.value as ThreeScaleMetric[];
        }
        return this.EMPTY_ARRAY;
    }

    public hasMetrics(): boolean {
        return this.metrics().length > 0;
    }

    private getMetricsExtension(): OasExtension {
        let rval: OasExtension = null;
        if (this.operation.extensions()) {
            this.operation.extensions().forEach(extension => {
                if (extension.name === "x-3scale-metrics") {
                    rval = extension;
                }
            });
        }
        return rval;
    }

    public add(metric: ThreeScaleMetric): void {
        let metrics: any = [ metric ];
        let metricsExtension: OasExtension = this.getMetricsExtension();
        if (metricsExtension) {
            metrics = JSON.parse(JSON.stringify(metricsExtension.value));
            metrics.push(metric);
        }
        let command: ICommand = createSetExtensionCommand(this.operation.ownerDocument(), this.operation, "x-3scale-metrics", metrics);
        this.commandService.emit(command);
    }

    public edit(metric: ThreeScaleMetric): void {
        let metricsExtension: OasExtension = this.getMetricsExtension();
        if (metricsExtension) {
            let metrics: any = JSON.parse(JSON.stringify(metricsExtension.value));
            if (this.updateMetric(metrics, metric)) {
                let command: ICommand = createSetExtensionCommand(this.operation.ownerDocument(), this.operation, "x-3scale-metrics", metrics);
                this.commandService.emit(command);
            }
        }
    }

    public delete(metric: ThreeScaleMetric): void {
        let metricsExtension: OasExtension = this.getMetricsExtension();
        if (metricsExtension) {
            let metrics: any = JSON.parse(JSON.stringify(metricsExtension.value));
            if (this.deleteMetric(metrics, metric.metric)) {
                let command: ICommand = createSetExtensionCommand(this.operation.ownerDocument(), this.operation, "x-3scale-metrics", metrics);
                this.commandService.emit(command);
            }
        }
    }

    public deleteAll(): void {
        let metricsExtension: OasExtension = this.getMetricsExtension();
        if (metricsExtension) {
            let command: ICommand = createDeleteExtensionCommand(this.operation.ownerDocument(), metricsExtension);
            this.commandService.emit(command);
        }
    }

    private updateMetric(metrics: ThreeScaleMetric[], metric: ThreeScaleMetric): boolean {
        if (metrics && Array.isArray(metrics)) {
            for (let m of metrics) {
                if (m.metric === metric.metric) {
                    m.increment = metric.increment;
                    return true;
                }
            }
        }
        return false;
    }

    private deleteMetric(metrics: ThreeScaleMetric[], metricName: string): boolean {
        if (metrics && Array.isArray(metrics)) {
            let idx: number = -1;
            metrics.forEach( (m, midx) => {
                if (m.metric === metricName) {
                    idx = midx;
                }
            });

            if (idx !== -1) {
                metrics.splice(idx, 1);
                return true;
            }
        }
        return false;
    }

}
