/*******************************************************************************************************
 * Nombre del archivo : directory-business.component.ts
 * Descripción         : Componente que gestiona el directorio de directores de una empresa. Permite
 *                       listar, agregar, editar y cargar datos asociados al formulario del director.
 * Autor               : Daniel Alva
 * Fecha de creación   : 23/06/2025
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';
import { FoButtonComponent } from 'app/modules/admin/shared/components/fo-button/fo-button.component';
import { FoTableComponent } from 'app/modules/admin/shared/components/fo-table/fo-table.component';
import { COLUMNS_DIRECTORY_BUSINESS } from 'app/shared/configs/business-management/directory-business.config';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { FormDirectoryComponent } from '../form-directory/form-directory.component';
import { PAGINATOR_PAGE_SIZE } from 'app/core/config/paginator.config';
import { finalize, forkJoin } from 'rxjs';
import { ResponseModel } from '@models/IResponseModel';
import { PermissionButtonDirective } from 'app/shared/directives/permission-button.directive';
import { FileComponentStateService } from '@services/file-component-state.service';
import { DirectorService } from '../../domain/services/director.service';
import { DirectorEntity } from '../../domain/entities/director.entity';
import { ConstantEntity } from '../../domain/entities/constant.entity';
import { DirectorFormService } from '../../domain/services/director-form.service';
import { DepartmentEntity } from '../../domain/entities/departament.entity';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { FoContCardComponent } from 'app/modules/admin/shared/components/fo-cont-card/fo-cont-card.component';
@Component({
  selector: 'app-directory-business',
  standalone: true,
  imports: [CommonModule, FoContCardComponent, FoButtonComponent, FoTableComponent, FormDirectoryComponent, PermissionButtonDirective],
  templateUrl: './directory-business.component.html',
  styleUrl: './directory-business.component.scss'
})
export class DirectoryBusinessComponent implements OnInit { 
	private _dialogConfirmationService = inject(DialogConfirmationService); // Servicio para mostrar diálogos de confirmación
	private _directorService = inject(DirectorService); // Servicio para interactuar con los directores
	private _directorFormService = inject(DirectorFormService); // Servicio para interactuar con los formularios de los directores
	private _fileComponentStateService = inject(FileComponentStateService); // Servicio para manejar el estado de los archivos
	textButtonNew = signal<string>('Agregar director');
	iconButtonNew = signal<string>('mat_outline:add_circle_outline');
    business = input.required<BusinessEntity>(); 
	headerTable = signal<TableColumnsDefInterface[]>([]); 
	dataTableDirectory = signal<DirectorEntity[]>([]); 
	iconsTable = signal<IconOption<DirectorEntity>[]>([]); 
	newFormDirectory = signal<boolean>(false); 
	loadingTable = signal<boolean>(false); 
	pageIndexTable = signal<number>(1); 
	totalPagesTable = signal<number>(1);
	director = signal<DirectorEntity>(null);
    lstTypedocument = signal<ConstantEntity[]>([]);
    lstGender = signal<ConstantEntity[]>([]);
    lstCargoManager = signal<ConstantEntity[]>([]);
    lstTypeDirector = signal<ConstantEntity[]>([]); 
    lstSpecialty = signal<ConstantEntity[]>([]); 
    lstDepartments = signal<DepartmentEntity[]>([]);
	@Output() eventTotalMembers: EventEmitter<number> = new EventEmitter<number>();
	/**
	 * Método que se ejecuta al inicializar el componente
	 */
	ngOnInit(): void {
		this.headerTable.set(COLUMNS_DIRECTORY_BUSINESS); 
		this.searchDirectors(); 
		this.iconsTable.set(this.defineIconsTable()); 
		this.loadDataForm();
	}
    /**
     * Método para buscar los directores
     */
    searchDirectors(): void {
		this.loadingTable.set(true);
		this._directorService.getByPagination(this.business().nIdEmpresa, this.pageIndexTable(), PAGINATOR_PAGE_SIZE).pipe(
			finalize(() => this.loadingTable.set(false))
		).subscribe({
			next: ((response: ResponseModel<DirectorEntity>) => {
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
	/**
	 * Método para cambiar la página de la tabla
	 */
	changePageTable(event: number): void {
		this.pageIndexTable.set(event); 
		this.searchDirectors();
	}
	/**
	 * Método para cargar los datos del formulario
	 */
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
	/**
	 * Método para definir los iconos de la tabla
	 */
	defineIconsTable(): IconOption<DirectorEntity>[]{
        const iconEdit = new IconOption("create", "mat_outline", "Editar");
		iconEdit.actionIcono = (data: DirectorEntity) => {
            this.editDirector(data); 
        };
        return [iconEdit]; 
    }
	/**
	 * Método para editar un director
	 */
	editDirector(data: DirectorEntity): void {
		this.director.set(data); 
		this.newFormDirectory.set(true); 
	}
	/**
	 * Método para abrir el formulario de registro de un nuevo director
	 */
	openRegisterDirectory(): void {
		this.director.set(null); 
		this.newFormDirectory.set(true);
	}
	/**
	 * Método para cancelar la edición o registro de un director
	 */
    cancelDirectory(): void {
        this.newFormDirectory.set(false);
		this.setFileComponentToEnterprise();
    }
	/**
	 * Método para refrescar la lista de directores
	 */
	refreshDirectory(): void {
		this.searchDirectors(); 
		this.newFormDirectory.set(false); 
		this.director.set(null); 
		this.setFileComponentToEnterprise();
	}
	/**
	 * Método para establecer el estado del componente de archivos
	 */
	setFileComponentToEnterprise(): void {
		const fileState = {
			title: 'Empresa', // Título del archivo
			isDisabled: false, // Habilita el componente de archivo
			root: `Empresa\\${this.business().sRazonSocial}` // Ruta raíz para los archivos
		}
		this._fileComponentStateService.setFileComponentState(fileState); // Establece el estado del componente de archivos
	}
}