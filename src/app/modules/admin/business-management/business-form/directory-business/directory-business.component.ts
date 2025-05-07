import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';

import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';

import { FoButtonComponent } from '@components/fo-button/fo-button.component';
import { FoContCardComponent } from '@components/fo-cont-card/fo-cont-card.component';
import { FoTableComponent } from '@components/fo-table/fo-table.component';
import { COLUMNS_DIRECTORY_BUSINESS, CONFIG_DELETE_DIALOG_DIRECTORY_BUSINESS } from 'app/shared/configs/business-management/directory-business.config';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { FormDirectoryComponent } from './form-directory/form-directory.component';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { Business } from '@models/business/business.interface';
import { DirectorService } from '@services/director.service';
import { finalize } from 'rxjs';
import { ResponseModel } from '@models/IResponseModel';
import { Director } from '@models/business/director.interface';


@Component({
  selector: 'app-directory-business',
  standalone: true,
  imports: [CommonModule, FoContCardComponent, FoButtonComponent, FoTableComponent, FormDirectoryComponent],
  templateUrl: './directory-business.component.html',
  styleUrl: './directory-business.component.scss'
})
export class DirectoryBusinessComponent implements OnInit {

	private _dialogConfirmationService = inject(DialogConfirmationService);

	private _directorService = inject(DirectorService);
	
	textButtonNew = signal<string>('Agregar director');
	iconButtonNew = signal<string>('mat_outline:add_circle_outline');
    business = input.required<Business>();
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTableDirectory = signal<Director[]>([]);
	iconsTable = signal<IconOption<Director>[]>([]);

	newFormDirectory = signal<boolean>(false);

	loadingTable = signal<boolean>(false);

    pageIndexTable = signal<number>(1);
	

	ngOnInit(): void {
		this.headerTable.set(COLUMNS_DIRECTORY_BUSINESS);
		this.searchDirectors();
		this.iconsTable.set(this.defineIconsTable())
	}

    searchDirectors(): void {
		this.loadingTable.set(true);
		const request = new RequestOption();
		request.queryParams = [
			{ key: 'pageIndex' , value: this.pageIndexTable() },
			{ key: 'pageSize' , value: PAGINATOR_PAGE_SIZE },
            { key: 'nIdEmpresa', value: this.business().nIdEmpresa  }
		];
		this._directorService.getByPagination(request).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<Director>) => {
				if(response.isSuccess){
					this.dataTableDirectory.set(response.lstItem);
				} else this.dataTableDirectory.set([])
			}),
		})
	}

	defineIconsTable(): IconOption<any>[]{
        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconDelete = new IconOption("delete", "mat_outline", "Eliminar");

		iconDelete.actionIcono = (data: any) => {
            this.openDialogDelete();
        };

    
        return [iconEdit, iconDelete];
    }

	openDialogDelete(): void {
		this._dialogConfirmationService.open(CONFIG_DELETE_DIALOG_DIRECTORY_BUSINESS);
	}

	openRegisterDirectory(): void {
		this.newFormDirectory.set(true);
	}

    cancelDirectory(): void {
        this.newFormDirectory.set(false);
    }

}
