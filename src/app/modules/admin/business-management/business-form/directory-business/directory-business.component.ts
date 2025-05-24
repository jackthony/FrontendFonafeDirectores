import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';

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
import { finalize, forkJoin } from 'rxjs';
import { ResponseModel } from '@models/IResponseModel';
import { Director } from '@models/business/director.interface';
import { DirectorFormService } from '@services/director-form.service';
import { Constant } from '@models/business/constant.interface';
import { Department } from '@models/business/departament.interface';
import { PermissionButtonDirective } from 'app/shared/directives/permission-button.directive';


@Component({
  selector: 'app-directory-business',
  standalone: true,
  imports: [CommonModule, FoContCardComponent, FoButtonComponent, FoTableComponent, FormDirectoryComponent, PermissionButtonDirective],
  templateUrl: './directory-business.component.html',
  styleUrl: './directory-business.component.scss'
})
export class DirectoryBusinessComponent implements OnInit {

	private _dialogConfirmationService = inject(DialogConfirmationService);

	private _directorService = inject(DirectorService);
	private _directorFormService = inject(DirectorFormService);
	
	textButtonNew = signal<string>('Agregar director');
	iconButtonNew = signal<string>('mat_outline:add_circle_outline');
    business = input.required<Business>();
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTableDirectory = signal<Director[]>([]);
	iconsTable = signal<IconOption<Director>[]>([]);

	newFormDirectory = signal<boolean>(false);

	loadingTable = signal<boolean>(false);

    pageIndexTable = signal<number>(1);
	totalPagesTable = signal<number>(1);
	
	director = signal<Director>(null);

    lstTypedocument = signal<Constant[]>([]);
    lstGender = signal<Constant[]>([]);
    lstCargoManager = signal<Constant[]>([]);
    lstTypeDirector = signal<Constant[]>([]);
    lstSpecialty = signal<Constant[]>([]);

    lstDepartments = signal<Department[]>([]);

	@Output() eventTotalMembers: EventEmitter<number> = new EventEmitter<number>();


	ngOnInit(): void {
		this.headerTable.set(COLUMNS_DIRECTORY_BUSINESS);
		this.searchDirectors();
		this.iconsTable.set(this.defineIconsTable());
		this.loadDataForm();
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
					const totalPages = Math.ceil(response.pagination.totalRows/PAGINATOR_PAGE_SIZE);
					this.totalPagesTable.set(totalPages > 0 ? totalPages : 1);
					this.dataTableDirectory.set(response.lstItem);
					this.eventTotalMembers.emit(response?.pagination?.totalRows || 0);
				} else {
					this.dataTableDirectory.set([]);
					this.eventTotalMembers.emit(0);
				} 
			}),
			error:(() => {
				this.totalPagesTable.set(1);
				this.dataTableDirectory.set([]);
				this.eventTotalMembers.emit(0);
			})
		})
	}

	changePageTable(event: number): void {
		this.pageIndexTable.set(event);
		this.searchDirectors();
	}

	loadDataForm(): void {
		forkJoin({
			typeDocument: this._directorFormService.getTypeDocument(),
			gender: this._directorFormService.getGender(),
			deparments : this._directorFormService.getDepartments(),
			cargoManager: this._directorFormService.getCargoManager(),
			typeDirector: this._directorFormService.getTypeDirector(),
			specialty: this._directorFormService.getSpecialty()
		}).subscribe({
			next: (response => {
				this.lstTypedocument.set(response.typeDocument),
				this.lstGender.set(response.gender),
				this.lstDepartments.set(response.deparments),
				this.lstCargoManager.set(response.cargoManager),
				this.lstTypeDirector.set(response.typeDirector),
				this.lstSpecialty.set(response.specialty)
			})
		})
	}

	defineIconsTable(): IconOption<Director>[]{
        const iconEdit = new IconOption("create", "mat_outline", "Editar");

		iconEdit.actionIcono = (data: Director) => {
            this.editDirector(data);
        };

        return [iconEdit];
    }

	editDirector(data: Director): void {
		this.director.set(data);
		this.newFormDirectory.set(true);
	}

	openRegisterDirectory(): void {
		this.director.set(null);
		this.newFormDirectory.set(true);
	}

    cancelDirectory(): void {
        this.newFormDirectory.set(false);
    }

	refreshDirectory(): void {
		this.searchDirectors();//RECARGAR PAGINA 1
		this.newFormDirectory.set(false);
		this.director.set(null);
	}

}
