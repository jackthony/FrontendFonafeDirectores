import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, Output, signal, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTable, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from '@angular/material/tooltip';
import { BooleanPipe } from 'app/core/pipes/boolean.pipe';
import { EmptyPipe } from 'app/core/pipes/empty.pipe';
import { IconOption } from 'app/shared/interfaces/generic-icon.interface';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FoPillComponent } from '../fo-pill/fo-pill.component';
import { TableColumnsDefInterface } from 'app/shared/interfaces/table-columns-def.interface';

@Component({
  selector: 'fo-table',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    EmptyPipe,
    BooleanPipe,
    MatTooltipModule,
    MatProgressBarModule,
    NgxSkeletonLoaderModule,
    MatProgressSpinnerModule,
    FoPillComponent],
  templateUrl: './fo-table.component.html',
  styleUrl: './fo-table.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FoTableComponent<T> {
	@ViewChild(MatTable) table: MatTable<T>;
	showFilter = input<boolean>(false);
	spans = input<{ name: string; columns: number }[]>();
	headers = input.required<TableColumnsDefInterface[]>();
	data = input.required<T[]>();
    icons = input<IconOption<T>[]>([]);
    loading = input<boolean>(false);
	showSearcher = input<boolean>(false);

    @Output() eventFilterData: EventEmitter<string> = new EventEmitter<string>();
    @Output() eventRestoreData: EventEmitter<T> = new EventEmitter<T>();
    @Output() eventChangePage: EventEmitter<number> = new EventEmitter<number>();

    @Input() currentPage: number = 1;
    totalPages = input<number>(1);

    onPageChange(page: number): void {
      if (page >= 1 && page <= this.totalPages()) {
        //this.currentPage = page;
        this.eventChangePage.emit(page);
      }
    }
  
    get pages(): number[] {
      const pages = [];
      for (let i = 1; i <= this.totalPages(); i++) {
        pages.push(i);
      }
      return pages;
    }

    /*FIN DE PAGINADOR*/
    

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
