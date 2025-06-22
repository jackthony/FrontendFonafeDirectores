import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';

import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';

import { FoButtonComponent } from '@components/fo-button/fo-button.component';
import { FoContCardComponent } from '@components/fo-cont-card/fo-cont-card.component';
import { FoTableComponent } from '@components/fo-table/fo-table.component';
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


@Component({
  selector: 'app-directory-business',
  standalone: true,
  imports: [CommonModule, FoContCardComponent, FoButtonComponent, FoTableComponent, FormDirectoryComponent, PermissionButtonDirective],
  templateUrl: './directory-business.component.html',
  styleUrl: './directory-business.component.scss'
})
export class DirectoryBusinessComponent implements OnInit { // Define la clase del componente que implementa OnInit

	// Inyección de dependencias necesarias para la funcionalidad del componente
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
    lstTypeDirector = signal<ConstantEntity[]>([]); // Lista de tipos de director
    lstSpecialty = signal<ConstantEntity[]>([]); // Lista de especialidades
    lstDepartments = signal<DepartmentEntity[]>([]); // Lista de departamentos

	@Output() eventTotalMembers: EventEmitter<number> = new EventEmitter<number>(); // Evento para emitir el total de miembros

	/**
	 * Método que se ejecuta al inicializar el componente
	 */
	ngOnInit(): void {
		this.headerTable.set(COLUMNS_DIRECTORY_BUSINESS); // Establece las columnas de la tabla
		this.searchDirectors(); // Realiza la búsqueda de los directores
		this.iconsTable.set(this.defineIconsTable()); // Establece los iconos en la tabla
		this.loadDataForm(); // Carga los datos necesarios para el formulario
	}

    /**
     * Método para buscar los directores
     */
    searchDirectors(): void {
		this.loadingTable.set(true); // Establece que la tabla está cargando
		this._directorService.getByPagination(this.business().nIdEmpresa, this.pageIndexTable(), PAGINATOR_PAGE_SIZE).pipe(
			finalize(() => this.loadingTable.set(false)) // Finaliza la carga de la tabla
		).subscribe({
			next: ((response: ResponseModel<DirectorEntity>) => {
				if(response.isSuccess){ // Si la respuesta es exitosa
					const totalPages = Math.ceil(response.pagination.totalRows/PAGINATOR_PAGE_SIZE); // Calcula el total de páginas
					this.totalPagesTable.set(totalPages > 0 ? totalPages : 1); // Establece el total de páginas
					this.dataTableDirectory.set(response.lstItem); // Establece los datos de los directores
					this.eventTotalMembers.emit(response?.pagination?.totalRows || 0); // Emite el total de miembros
				} else { // Si la respuesta es negativa
					this.dataTableDirectory.set([]); // Establece la tabla vacía
					this.eventTotalMembers.emit(0); // Emite cero miembros
				} 
			}),
			error:(() => { // Si ocurre un error
				this.totalPagesTable.set(1); // Establece una sola página
				this.dataTableDirectory.set([]); // Establece la tabla vacía
				this.eventTotalMembers.emit(0); // Emite cero miembros
			})
		})
	}

	/**
	 * Método para cambiar la página de la tabla
	 */
	changePageTable(event: number): void {
		this.pageIndexTable.set(event); // Cambia el índice de la página
		this.searchDirectors(); // Realiza nuevamente la búsqueda de los directores
	}

	/**
	 * Método para cargar los datos del formulario
	 */
	loadDataForm(): void {
		// Carga las listas de opciones para los campos del formulario
		forkJoin({
			typeDocument: this._directorFormService.getTypeDocument(), // Obtiene los tipos de documento
			gender: this._directorFormService.getGender(), // Obtiene los géneros
			deparments : this._directorFormService.getDepartments(), // Obtiene los departamentos
			cargoManager: this._directorFormService.getCargoManager(), // Obtiene los cargos de gerente
			typeDirector: this._directorFormService.getTypeDirector(), // Obtiene los tipos de director
			specialty: this._directorFormService.getSpecialty() // Obtiene las especialidades
		}).subscribe({
			next: (response => {
				// Establece los datos en las señales correspondientes
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
        const iconEdit = new IconOption("create", "mat_outline", "Editar"); // Icono de editar

		iconEdit.actionIcono = (data: DirectorEntity) => {
            this.editDirector(data); // Ejecuta el método de edición
        };

        return [iconEdit]; // Devuelve los iconos de la tabla
    }

	/**
	 * Método para editar un director
	 */
	editDirector(data: DirectorEntity): void {
		this.director.set(data); // Establece el director seleccionado
		this.newFormDirectory.set(true); // Activa el formulario para editar
	}

	/**
	 * Método para abrir el formulario de registro de un nuevo director
	 */
	openRegisterDirectory(): void {
		this.director.set(null); // Establece que no hay director seleccionado
		this.newFormDirectory.set(true); // Activa el formulario para agregar un nuevo director
	}

	/**
	 * Método para cancelar la edición o registro de un director
	 */
    cancelDirectory(): void {
        this.newFormDirectory.set(false); // Desactiva el formulario
		this.setFileComponentToEnterprise(); // Establece el estado del componente de archivos
    }

	/**
	 * Método para refrescar la lista de directores
	 */
	refreshDirectory(): void {
		this.searchDirectors(); // Recarga la página 1 de la lista de directores
		this.newFormDirectory.set(false); // Desactiva el formulario
		this.director.set(null); // Elimina el director seleccionado
		this.setFileComponentToEnterprise(); // Establece el estado del componente de archivos
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
