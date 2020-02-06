/**
 * @license
 * Copyright 2020 JBoss Inc
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

import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";

export interface DataTableColumn {
    displayName: string;
    width?: string;
}

export interface DataTableCell {
    displayName: string;
    colspan?: number;
}

export interface DataTableRow {
    value: any;
    cells: DataTableCell[];
}


@Component({
    moduleId: module.id,
    selector: "data-table",
    templateUrl: "data-table.component.html",
    styleUrls: [ "data-table.component.css" ]
})
export class DataTableComponent implements OnChanges {

    @Input() columns: DataTableColumn[];
    @Input() rows: DataTableRow[];
    @Output() onChange: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Input() selectedValues: any[];
    @Output() selectedValuesChange: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Input() pageSize: number = 15;

    filteredRows: DataTableRow[] = [];
    displayRows: DataTableRow[] = [];
    selectedRows: DataTableRow[] = [];
    sortColumn: number = 0;
    sortAsc: boolean = true;
    filterCriteria: string = "";
    page: number = 1;
    numPages: number = 0;
    start: number;
    end: number;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["rows"]) {
            this.selectedRows = [];
            this.sortAndFilter();
        }
        if (changes["selectedValues"]) {
            this.selectedRows = this.getSelectedRowsFrom(this.selectedValues);
        }

        this.numPages = Math.ceil(this.rows.length / this.pageSize);
    }

    select(row: DataTableRow): void {
        if (this.selectedRows.indexOf(row) === -1) {
            this.selectedRows.push(row);
        } else {
            this.selectedRows.splice(this.selectedRows.indexOf(row), 1);
        }
        this.fireChanges();
    }

    private fireChanges(): void {
        let event: any[] = this.getSelectedValues();
        this.onChange.emit(event);
        this.selectedValuesChange.emit(event);
    }

    selectAll(): void {
        // TODO implement this!
    }

    isSelected(row: DataTableRow): boolean {
        return this.selectedRows.indexOf(row) !== -1;
    }

    private getSelectedValues(): any[] {
        let rval: any[] = [];
        this.selectedRows.forEach( row => {
            rval.push(row.value);
        });
        return rval;
    }

    isColSortAsc(col: DataTableColumn): boolean {
        return this.sortColumn == this.columns.indexOf(col) && this.sortAsc;
    }

    isColSortDesc(col: DataTableColumn): boolean {
        return this.sortColumn == this.columns.indexOf(col) && !this.sortAsc;
    }

    filter(): void {
        this.page = 1;
        this.sortAndFilter();
    }

    sortBy(col: DataTableColumn): void {
        this.page = 1;
        let newColIdx: number = this.columns.indexOf(col);
        if (newColIdx == this.sortColumn) {
            this.sortAsc = !this.sortAsc;
        } else {
            this.sortColumn = newColIdx;
            this.sortAsc = true;
        }
        this.sortAndFilter();
    }

    sortAndFilter(): void {
        this.filteredRows = this.rows.slice();
        // First, maybe filter.
        if (this.filterCriteria) {
            this.filteredRows = this.filteredRows.filter( row => {
                let accepted: boolean = false;
                row.cells.forEach( cell => {
                    let cellVal: string = cell.displayName;
                    if (cellVal == null) { cellVal = ""; }
                    cellVal = cellVal.toLowerCase();
                    if (cellVal.indexOf(this.filterCriteria.toLowerCase()) != -1) {
                        accepted = true;
                    }
                });
                return accepted;
            });
        }
        // Then sort.
        this.filteredRows.sort((row1, row2) => {
            let c1: string = row1.cells[this.sortColumn].displayName;
            let c2: string = row2.cells[this.sortColumn].displayName;
            if (!c1) { c1 = ""; }
            if (!c2) { c2 = ""; }
            c1 = c1.toLowerCase();
            c2 = c2.toLowerCase();
            let rval: number = c1.localeCompare(c2);
            if (!this.sortAsc) {
                rval *= -1;
            }
            return rval;
        });
        // Then paginate.
        this.start = (this.page - 1) * this.pageSize;
        this.end = this.start + this.pageSize;
        let maxEnd: number = this.filteredRows.length;
        if (this.end > maxEnd) {
            this.end = maxEnd;
        }
        this.displayRows = this.filteredRows.slice(this.start, this.end);
    }

    showPage(page: number): void {
        this.page = page;
        this.sortAndFilter();
    }

    private getSelectedRowsFrom(values: any[]): DataTableRow[] {
        if (!values) {
            return [];
        }
        return values.map( value => {
            try {
                return this.rows.filter(row => {
                    return row.value === value;
                })[0];
            } catch (e) {
                return null;
            }
        });
    }

    private goToPage(page: number): void {
        this.page = page;
        if (this.page < 1) {
            this.page = 1;
        } else if (this.page > this.numPages) {
            this.page = this.numPages;
        }
        this.sortAndFilter();
    }

    firstPage(): void {
        this.goToPage(1);
    }

    nextPage(): void {
        this.goToPage(this.page + 1);
    }

    previousPage(): void {
        this.goToPage(this.page - 1);
    }

    lastPage(): void {
        this.goToPage(this.numPages);
    }
}
