import { Component, EventEmitter, input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from "@angular/material/table";

import { FO_TABLE_IMPORTS } from 'app/shared/imports/components/fo-table.imports';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';

@Component({
  selector: 'fo-table',
  standalone: true,
  imports: [...FO_TABLE_IMPORTS],
  templateUrl: './fo-table.component.html',
  styleUrl: './fo-table.component.scss'
})
export class FoTableComponent<T> {
	@ViewChild(MatTable) table: MatTable<T>;
    //@ViewChild(BuSearchComponent) searcher: BuSearchComponent;
	showFilter = input<boolean>(false);
	spans = input<{ name: string; columns: number }[]>();
	headers = input.required<TableColumnsDefInterface[]>();
	data = input.required<T[]>();
    icons = input<IconOption<T>[]>([]);
    loading = input<boolean>(false);
	showSearcher = input<boolean>(false);

    @Output() eventFilterData: EventEmitter<string> = new EventEmitter<string>();
    @Output() eventRestoreData: EventEmitter<T> = new EventEmitter<T>();

    

    public displayedColumns: string[] = [];
    public dataSource: MatTableDataSource<T>;
    constructor() {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<T>(this.data());
        this.headers()
            .sort((a, b) => (a.id < b.id ? -1 : 1))
            .forEach((column: TableColumnsDefInterface) => {
                this.displayedColumns.push(column.name);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.data?.currentValue) {
            this.dataSource = new MatTableDataSource<T>(this.data());
        }
        if (changes.headers?.previousValue) {
            this.displayedColumns = [];
            this.headers()
                .sort((a, b) => (a.id < b.id ? -1 : 1))
                .forEach((column: TableColumnsDefInterface) => {
                    this.displayedColumns.push(column.name);
                });
        }
    }

    convertToNumber(value: number | boolean): number {
        if (typeof value === "boolean") return +value;
        else return value;
    }

    defineTextPill(value: number | boolean | string): string {
        const val = typeof value === "boolean" ? +value : value;
        const map = {
            0: "componentsBuTable.toggle.inactive",
            1: "componentsBuTable.toggle.active"
        };

        return typeof value === "string" ? value : map[val];
    }

    convertToBool(value: boolean | number): boolean {
        if (typeof value === "number") return value === 1 ? true : false;
        else return value;
    }


    executeIcon(icon: IconOption<T>, dato: T, index: number): void {
        const objDelete: any = { dato: dato, index: index };
        icon.executeAction(index == -1 ? dato : objDelete);
    }

    disabledIcon(index, element, header: TableColumnsDefInterface): boolean {
        const objIcon = this.getNameAttribute(index, header);
        return objIcon ? !element[objIcon[1]] : false;
    }

    getNameAttribute(index, header: TableColumnsDefInterface): string[] {
        const indexCustomIcon = header?.customIcon?.findIndex(cIcon => cIcon[0] === this.icons[index].id);
        if (indexCustomIcon !== undefined && indexCustomIcon !== -1) return header.customIcon[indexCustomIcon];
    }

    showMessageT(index, elemento, header: TableColumnsDefInterface, icon): string {
        const objIcon = this.getNameAttribute(index, header);
        const messageKey = objIcon && !elemento[objIcon[1]] ? objIcon[2] : icon.tooltip;

        return messageKey;
    }

    /* convertBoolToNumber(value: boolean | number): number {
        if (typeof value === "boolean") return value ? 1 : 0;
        else return value;
    } */

    /* restoreTable(): void {
        this.searcher.inputText.nativeElement.value = "";
        this.eventRestoreData.emit();
    } */

    dataSourceReturned(source: MatTableDataSource<T>): void {
        this.dataSource = source;
    }

    /* showSearch(): void {
        this.showSearcher = !this.showSearcher;
    } */

    /* emitFilterEvent(value: string): void {
        //console.log("jeje: ", this.dataSource);
        if (value) {
            this.dataSource.filter = value.trim().toLowerCase();
        } else {
            this.dataSource = new MatTableDataSource(this.dataSource.data);
        }
        //console.log("después: ", this.dataSource.data);
        this.eventFilterData.emit(value);
    } */

}
