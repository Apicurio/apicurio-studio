/**
 * @license
 * Copyright 2019 JBoss Inc
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
import {KeypressUtils} from "../../../apis/{apiId}/editor/_util/keypress.util";
import {ValidationProfile} from "../../../../models/validation.model";
import {OasValidationProblemSeverity, OasValidationRuleset, ValidationRuleMetaData} from "oai-ts-core";
import {DropDownOption} from "../../../../components/common/drop-down.component";

export interface ValidationRuleFilter {
    type: string;
    value: any;
}


@Component({
    moduleId: module.id,
    selector: "profile-editor",
    templateUrl: "profile-editor.component.html",
    styleUrls: ["profile-editor.component.css"],
    encapsulation: ViewEncapsulation.None,
})
export class ProfileEditorComponent {

    @Input() profile: ValidationProfile;

    @Output() onSave: EventEmitter<void> = new EventEmitter<void>();
    @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

    rules: ValidationRuleMetaData[];
    filteredRules: ValidationRuleMetaData[];
    selectedRules: {[key: string]: boolean} = {};

    filterType: string = "name";
    filterValue: string = "";
    activeFilters: ValidationRuleFilter[] = [];

    /**
     * Constructor.
     */
    constructor() {
        let ruleset: OasValidationRuleset = new OasValidationRuleset();
        this.rules = ruleset.getAllRules();
        this.filter();
    }

    public onGlobalKeyDown(event: KeyboardEvent): void {
        if (KeypressUtils.isEscapeKey(event)) {
            this.onClose.emit();
        }
    }

    isIgnore(rule: ValidationRuleMetaData): boolean {
        return this.profile.severities[rule.code] === OasValidationProblemSeverity.ignore;
    }

    isInfo(rule: ValidationRuleMetaData): boolean {
        if (this.profile.severities[rule.code] === undefined) {
            return true;
        }
        return this.profile.severities[rule.code] === OasValidationProblemSeverity.low;
    }

    isWarning(rule: ValidationRuleMetaData): boolean {
        return this.profile.severities[rule.code] === OasValidationProblemSeverity.medium;
    }

    isError(rule: ValidationRuleMetaData): boolean {
        return this.profile.severities[rule.code] === OasValidationProblemSeverity.high;
    }

    isSelected(rule: ValidationRuleMetaData): boolean {
        return this.selectedRules[rule.code] == true;
    }

    selectRule(rule: ValidationRuleMetaData): void {
        this.selectedRules[rule.code] = true;
    }

    deselectRule(rule: ValidationRuleMetaData): void {
        delete this.selectedRules[rule.code];
    }

    isAllSelected(): boolean {
        return Object.getOwnPropertyNames(this.selectedRules).length === this.rules.length;
    }

    isSomeSelected(): boolean {
        return !this.isNoneSelected() && !this.isAllSelected();
    }

    isNoneSelected(): boolean {
        return Object.getOwnPropertyNames(this.selectedRules).length === 0;
    }

    getNumSelectedRules(): number {
        return Object.getOwnPropertyNames(this.selectedRules).length;
    }

    toggleRuleSelection(rule: ValidationRuleMetaData): void {
        if (this.isSelected(rule)) {
            this.deselectRule(rule);
        } else {
            this.selectRule(rule);
        }
    }

    toggleAll(): void {
        if (this.isNoneSelected()) {
            this.filteredRules.forEach(rule => {
                this.selectRule(rule);
            });
        } else {
            this.rules.forEach(rule => {
                this.deselectRule(rule);
            });
        }
    }

    deselectAll(): void {
        this.rules.forEach(rule => {
            this.deselectRule(rule);
        });
    }

    ignore(): OasValidationProblemSeverity { return OasValidationProblemSeverity.ignore; }
    high(): OasValidationProblemSeverity { return OasValidationProblemSeverity.high; }
    medium(): OasValidationProblemSeverity { return OasValidationProblemSeverity.medium; }
    low(): OasValidationProblemSeverity { return OasValidationProblemSeverity.low; }

    bulkEdit(severity: OasValidationProblemSeverity): void {
        Object.getOwnPropertyNames(this.selectedRules).forEach( key => {
            let rule: ValidationRuleMetaData = this.findRule(key);
            if (rule) {
                this.profile.severities[rule.code] = severity;
            }
        });
    }

    /**
     * Finds a rule by the code.
     * @param code
     */
    private findRule(code: string): ValidationRuleMetaData {
        for (let rule of this.rules) {
            if (rule.code === code) {
                return rule;
            }
        }
        return null;
    }

    filterTypeOptions(): DropDownOption[] {
        return [
            { name: "Name", value: "name" },
            { name: "Severity", value: "severity" },
            { name: "Rule Type", value: "ruleType" },
            { name: "Entity Type", value: "entityType" },
            { name: "Version", value: "version" }
        ];
    }

    severityOptions(): DropDownOption[] {
        return [
            { name: "None", value: OasValidationProblemSeverity.ignore },
            { name: "Low", value: OasValidationProblemSeverity.low },
            { name: "Medium", value: OasValidationProblemSeverity.medium },
            { name: "High", value: OasValidationProblemSeverity.high },
        ]
    }

    ruleTypeOptions(): DropDownOption[] {
        // TODO calculate these upfront and/or cache them
        let optionNames: any = {};
        this.rules.forEach( rule => {
            optionNames[rule.type] = true;
        });

        let options: DropDownOption[] = [];
        Object.getOwnPropertyNames(optionNames).sort().forEach( name => {
            options.push({
                name: name, value: name
            });
        });
        return options;
    }

    entityTypeOptions(): DropDownOption[] {
        // TODO calculate these upfront and/or cache them
        let optionNames: any = {};
        this.rules.forEach( rule => {
            optionNames[rule.entity] = true;
        });

        let options: DropDownOption[] = [];
        Object.getOwnPropertyNames(optionNames).sort().forEach( name => {
            options.push({
                name: name, value: name
            });
        });
        return options;
    }

    versionOptions(): DropDownOption[] {
        // TODO calculate these upfront and/or cache them
        let optionNames: any = {};
        this.rules.forEach( rule => {
            rule.versions.forEach( version => {
                optionNames[version] = true;
            });
        });

        let options: DropDownOption[] = [];
        Object.getOwnPropertyNames(optionNames).forEach( name => {
            options.push({
                name: name, value: name
            });
        });
        return options;
    }

    /**
     * Returns true if there is at least one active
     */
    hasActiveFilters(): boolean {
        return this.activeFilters.length > 0;
    }

    /**
     * Called when the user activates a filter.
     */
    addFilter(): void {
        let filter: ValidationRuleFilter = {
            type: this.filterType,
            value: this.filterValue
        };
        this.activeFilters.push(filter);
        this.filterValue = null;
        this.deselectAll();
        this.filter();
    }

    /**
     * Called to remove all filters.
     */
    clearAllFilters(): void {
        this.activeFilters = [];
        this.deselectAll();
        this.filter();
    }

    /**
     * Called to clear a specific filter.
     * @param filter
     */
    clearFilter(filter: ValidationRuleFilter): void {
        this.activeFilters.splice(this.activeFilters.indexOf(filter), 1);
        this.deselectAll();
        this.filter();
    }

    /**
     * Called to filter the list of rules.
     */
    private filter(): void {
        this.filteredRules = [];
        this.rules.forEach( rule => {
            if (this.matches(rule)) {
                this.filteredRules.push(rule);
            }
        })
    }

    /**
     * Returns true if the given rule matches the currently active filters.
     * @param rule
     */
    private matches(rule: ValidationRuleMetaData): boolean {
        for (let filter of this.activeFilters) {
            if (!this.matchesFilter(rule, filter)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns true if the given rule matches the given filter.
     * @param rule
     * @param filter
     */
    private matchesFilter(rule: ValidationRuleMetaData, filter: ValidationRuleFilter): boolean {
        if (filter.type === "name") {
            return rule.name.toLocaleLowerCase().indexOf(filter.value.toLocaleLowerCase()) !== -1;
        } else if (filter.type === "severity") {
            return this.profile.severities[rule.code] === filter.value;
        } else if (filter.type === "ruleType") {
            return rule.type === filter.value;
        } else if (filter.type === "entityType") {
            return rule.entity === filter.value;
        } else if (filter.type === "version") {
            return rule.versions.indexOf(filter.value) !== -1;
        }
    }

    getFilterLabel(filter: ValidationRuleFilter): string {
        if (filter.type === "name") {
            return "Name";
        } else if (filter.type === "severity") {
            return "Severity";
        } else if (filter.type === "ruleType") {
            return "Rule Type";
        } else if (filter.type === "entityType") {
            return "Entity Type";
        } else if (filter.type === "version") {
            return "Version";
        }
    }

    getFilterValue(filter: ValidationRuleFilter): string {
        if (filter.type === "severity") {
            if (filter.value === OasValidationProblemSeverity.ignore) {
                return "None";
            } else if (filter.value === OasValidationProblemSeverity.low) {
                return "Low";
            } else if (filter.value === OasValidationProblemSeverity.medium) {
                return "Medium";
            } else if (filter.value === OasValidationProblemSeverity.high) {
                return "High";
            }
        }
        return filter.value;
    }

    onInputKeypress(event: KeyboardEvent): void {
        if (KeypressUtils.isEnterKey(event)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    onNameFilterKeypress(event: KeyboardEvent): void {
        if (KeypressUtils.isEnterKey(event)) {
            event.preventDefault();
            event.stopPropagation();
            this.addFilter();
        }
    }

}
