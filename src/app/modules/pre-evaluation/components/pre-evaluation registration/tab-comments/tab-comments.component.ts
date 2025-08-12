import { Component, input, OnInit, signal } from '@angular/core';
import { COLUMNS_PRE_EVALUATION_COMMENTS } from 'app/modules/pre-evaluation/config/pre-evaluation-comments.config';
import { GeneralButtonEnum } from 'app/shared/enums/general-button.enum';
import { TableColumnsDefInterface } from 'app/shared/interfaces/table-columns-def.interface';

@Component({
  selector: 'app-tab-comments',
  standalone: false,
  templateUrl: './tab-comments.component.html',
  styleUrl: './tab-comments.component.scss'
})
export class TabCommentsComponent implements OnInit {
	iconBtnSearch = signal<string>('mat_outline:add_box');
	btnInverter = signal<number>(GeneralButtonEnum.INVERTER);
	lstComments = signal<any[]>([]);
	loadingTable = signal<boolean>(false);
	headerTable = signal<TableColumnsDefInterface[]>([]);

	totalPagesTable = signal<number>(1);
	pageIndexTable = signal<number>(1);
	dataTable = signal<any[]>([]);
	
	ngOnInit(): void {
		this.headerTable.set(COLUMNS_PRE_EVALUATION_COMMENTS);
	}

	changePageTable(event: number): void {
		this.pageIndexTable.set(event);
		//this.searchBusiness(); 
	}
	
}
