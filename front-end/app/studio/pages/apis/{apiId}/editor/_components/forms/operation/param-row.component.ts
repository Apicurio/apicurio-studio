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

import {Component, EventEmitter, Input, Output, ViewEncapsulation} from "@angular/core";
import {SimplifiedType} from "oai-ts-commands";
import {Oas20Parameter, Oas30Parameter, OasOperation, OasParameterBase, OasPathItem} from "oai-ts-core";
import {AbstractTypedItemComponent} from "./typed-item.component";
import {AbstractCombinedVisitorAdapter} from "../../../_visitors/base.visitor";


@Component({
    moduleId: module.id,
    selector: "param-row",
    templateUrl: "param-row.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ParamRowComponent extends AbstractTypedItemComponent {

    private _param: OasParameterBase;
    private _overriddenParam: OasParameterBase;
    @Input()
    set param(param: OasParameterBase) {
        this._param = param;
        this.missingFlag = this.param.n_attribute("missing") === true;
        this._overriddenParam = this.getOverriddenParam(param);
        this.overrideFlag = this._overriddenParam !== null;
    }
    get param(): OasParameterBase {
        return this._param;
    }

    @Input() parameterClass: string = "";

    @Output() onCreate: EventEmitter<boolean> = new EventEmitter<boolean>();

    private missingFlag: boolean;
    private overrideFlag: boolean;

    protected modelForEditing(): SimplifiedType {
        return this.paramToSimplifiedType(this.param);
    }

    protected modelForViewing(): SimplifiedType {
        if (this.missingFlag && this._overriddenParam !== null) {
            return this.paramToSimplifiedType(this._overriddenParam);
        } else {
            return this.paramToSimplifiedType(this.param);
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

    public getOverriddenParam(param: OasParameterBase): OasParameterBase {
        let viz: DetectOverrideVisitor = new DetectOverrideVisitor(param);
        param.parent().accept(viz);
        return viz.overriddenParam;
    }

    private paramToSimplifiedType(param: OasParameterBase): SimplifiedType {
        if (param.ownerDocument().getSpecVersion() === "2.0") {
            return SimplifiedType.fromItems(param as Oas20Parameter);
        } else {
            return SimplifiedType.fromSchema((param as Oas30Parameter).schema);
        }
    }

}


class DetectOverrideVisitor extends AbstractCombinedVisitorAdapter {

    public overriddenParam: OasParameterBase = null;

    constructor(private param: OasParameterBase) {
        super();
    }

    public visitOperation(node: OasOperation): void {
        this.overriddenParam = (<OasPathItem>node.parent()).parameter(this.param.in, this.param.name) as OasParameterBase;
    }

}