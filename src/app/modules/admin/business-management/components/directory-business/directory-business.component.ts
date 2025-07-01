/*******************************************************************************************************
 * Nombre del archivo : directory-business.component.ts
 * Descripción         : Componente que gestiona el directorio de directores de una empresa. Permite
 *                       listar, agregar, editar y cargar datos asociados al formulario del director.
 * Autor               : Daniel Alva
 * Fecha de creación   : 23/06/2025
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
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
import { PositionEntity } from 'app/modules/admin/shared/domain/entities/position.entity';
import { TypeDirectorEntity } from 'app/modules/admin/shared/domain/entities/type-director.entity';
import { SpecialtyEntity } from 'app/modules/admin/shared/domain/entities/specialty.entity';
import { SectorEntity } from 'app/modules/admin/shared/domain/entities/sector.entity';


@Component({
  selector: 'app-directory-business',
  standalone: true,
  imports: [CommonModule, FoContCardComponent, FoButtonComponent, FoTableComponent, FormDirectoryComponent, PermissionButtonDirective],
  templateUrl: './directory-business.component.html',
  styleUrl: './directory-business.component.scss'
})
export class DirectoryBusinessComponent implements OnInit, OnChanges {
	
	private _dialogConfirmationService = inject(DialogConfirmationService); // Servicio para mostrar diálogos de confirmación
	private _directorService = inject(DirectorService); // Servicio para interactuar con los directores
	private _directorFormService = inject(DirectorFormService); // Servicio para interactuar con los formularios de los directores
	private _fileComponentStateService = inject(FileComponentStateService); // Servicio para manejar el estado de los archivos

	// Señales de texto y valores reactivamente configurados
	textButtonNew = signal<string>('Agregar director'); // Texto del botón para agregar director
	iconButtonNew = signal<string>('mat_outline:add_circle_outline'); // Icono del botón para agregar director
    business = input.required<BusinessEntity>(); // Empresa requerida
	headerTable = signal<TableColumnsDefInterface[]>([]); // Columnas de la tabla
	dataTableDirectory = signal<DirectorEntity[]>([]); // Datos de la tabla de directores
	iconsTable = signal<IconOption<DirectorEntity>[]>([]); // Iconos en la tabla de directores
	newFormDirectory = signal<boolean>(false); // Determina si el formulario de director está activo
	loadingTable = signal<boolean>(false); // Indica si la tabla está cargando datos
	pageIndexTable = signal<number>(1); // Página actual de la tabla
	totalPagesTable = signal<number>(1); // Total de páginas en la tabla
	director = signal<DirectorEntity>(null); // Director seleccionado
    lstTypedocument = signal<ConstantEntity[]>([]); // Lista de tipos de documento
    lstGender = signal<ConstantEntity[]>([]); // Lista de géneros
    lstCargoManager = signal<ConstantEntity[]>([]); // Lista de cargos de gerente
    lstTypeDirector = signal<TypeDirectorEntity[]>([]); // Lista de tipos de director
    lstSpecialty = signal<SpecialtyEntity[]>([]); // Lista de especialidades
    lstDepartments = signal<DepartmentEntity[]>([]); // Lista de departamentos
    lstSector = signal<SectorEntity[]>([]); // Lista de sectores
	blockCreateDirectory = signal<boolean>(false);

	@Output() eventTotalMembers: EventEmitter<number> = new EventEmitter<number>(); // Evento para emitir el total de miembros

	ngOnChanges(changes: SimpleChanges): void {
		if(changes.business) {
			this.verifiyBlockCreate();
		}
	} 

	verifiyBlockCreate(): void {
		const block = this.business().nNumeroMiembros <= (this.dataTableDirectory().filter(data => !!data.nIdRegistro).length);
		this.blockCreateDirectory.set(block);
	}

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
    searchDirectors(resetPage?: boolean): void {
		if(resetPage) this.pageIndexTable.set(1);
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
					this.verifiyBlockCreate();
				} else { 
					this.dataTableDirectory.set([]); 
					this.eventTotalMembers.emit(0);
					this.blockCreateDirectory.set(true);
				}
			}),
			error:(() => { 
				this.totalPagesTable.set(1); 
				this.dataTableDirectory.set([]); 
				this.eventTotalMembers.emit(0); 
				this.blockCreateDirectory.set(true);
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
			typeDocument: this._directorFormService.getTypeDocument(), // Obtiene los tipos de documento
			gender: this._directorFormService.getGender(), // Obtiene los géneros
			deparments : this._directorFormService.getDepartments(), // Obtiene los departamentos
			cargoManager: this._directorFormService.getCargoManager(), // Obtiene los cargos de gerente
			typeDirector: this._directorFormService.getTypeDirector(), // Obtiene los tipos de director
			specialty: this._directorFormService.getSpecialty(), // Obtiene las especialidades
			sector: this._directorFormService.getSector() // Obtiene las especialidades
		}).subscribe({
			next: (response => {
				this.lstTypedocument.set(response.typeDocument),
				this.lstGender.set(response.gender),
				this.lstDepartments.set(response.deparments),
				this.lstCargoManager.set(response.cargoManager),
				this.lstTypeDirector.set(response.typeDirector),
				this.lstSpecialty.set(response.specialty),
				this.lstSector.set(response.sector)
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

		iconEdit.isHidden = (data: DirectorEntity) => !data.nIdRegistro;
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