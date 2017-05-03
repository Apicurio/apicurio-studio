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

import {Component, ViewEncapsulation, Input, Output, EventEmitter} from "@angular/core";
import {SimplifiedType} from "../../../_models/simplified-type.model";
import {Oas20NodeVisitorAdapter, Oas20Operation, Oas20Parameter, Oas20PathItem} from "oai-ts-core";
import {AbstractTypedItemComponent} from "./typed-item.component";


@Component({
    moduleId: module.id,
    selector: "param-row",
    templateUrl: "param-row.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ParamRowComponent extends AbstractTypedItemComponent {

    private _param: Oas20Parameter;
    private _overriddenParam: Oas20Parameter;
    @Input()
    set param(param: Oas20Parameter) {
        this._param = param;
        this.missingFlag = this.param.n_attribute("missing") === true;
        this._overriddenParam = this.getOverriddenParam(param);
        this.overrideFlag = this._overriddenParam !== null;
    }
    get param(): Oas20Parameter {
        return this._param;
    }

    @Input() parameterClass: string = "";

    @Output() onCreate: EventEmitter<boolean> = new EventEmitter<boolean>();

    private missingFlag: boolean;
    private overrideFlag: boolean;

    protected modelForEditing(): SimplifiedType {
        return SimplifiedType.fromItems(this.param);
    }

    protected modelForViewing(): SimplifiedType {
        if (this.missingFlag && this._overriddenParam !== null) {
            return SimplifiedType.fromItems(this._overriddenParam);
        } else {
            return SimplifiedType.fromItems(this.param);
        }
    }

    protected paramDescription(): string {
        if (this.missingFlag && this._overriddenParam !== null) {
            return this._overriddenParam.description;
        } else {
            return this._param.description;
        }
    }

    public isMissing(): boolean {
        return this.missingFlag && !this.overrideFlag;
    }

    public isExists(): boolean {
        return !this.missingFlag;
    }

    public isOverride(): boolean {
        return !this.missingFlag && this.overrideFlag;
    }

    public isOverridable(): boolean {
        return this.missingFlag && this.overrideFlag;
    }

    public create(): void {
        this.onCreate.emit(true);
    }

    public getOverriddenParam(param: Oas20Parameter): Oas20Parameter {
        let viz: DetectOverrideVisitor = new DetectOverrideVisitor(param);
        param.parent().accept(viz);
        return viz.overriddenParam;
    }

}


class DetectOverrideVisitor extends Oas20NodeVisitorAdapter {

    public overriddenParam: Oas20Parameter = null;

    constructor(private param: Oas20Parameter) {
        super();
    }

    public visitOperation(node: Oas20Operation): void {
        this.overriddenParam = (<Oas20PathItem>node.parent()).parameter(this.param.in, this.param.name);
    }

}