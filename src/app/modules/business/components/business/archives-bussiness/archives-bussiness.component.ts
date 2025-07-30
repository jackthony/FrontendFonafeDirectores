/*******************************************************************************************************
 * Nombre del archivo:  archives-business.component.ts
 * Descripción:          Componente encargado de gestionar las funcionalidades relacionadas con los archivos 
 *                       de la empresa. Permite a los usuarios subir archivos y gestionar la carga de documentos 
 *                       asociados a la empresa mediante un sistema de árbol de directorios. Además, muestra 
 *                       notificaciones de éxito o error al usuario dependiendo del resultado de las acciones.
 *                       Utiliza un spinner de carga para indicar el progreso de las operaciones y un sistema de 
 *                       notificaciones con NgxToastr para informar al usuario sobre el estado de las operaciones.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del componente de gestión de archivos para la empresa.
 *******************************************************************************************************/
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FileData } from '@models/archive-tree.entity';
import { ArchiveService } from 'app/modules/business/domain/services/business/archive.service';
import { finalize } from 'rxjs';
import { ArchivingProcessService } from 'app/modules/business/domain/services/business/archiving-process.service';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { ResponseEntity } from '@models/response.entity';
import { FlatNodeAllElements } from 'app/shared/components/fo-mat-tree-flat/models/flat-node-all-elements';
import { MatTreeOptionsNode } from 'app/shared/components/fo-mat-tree-flat/models/mat-tree-options-node';
import { BusinessEntity } from 'app/modules/business/domain/entities/business/business.entity';
import { DeleteFileBusiness } from 'app/modules/business/domain/entities/business/delete-file-business.entity';

@Component({
  selector: 'app-archives-bussiness',
  standalone: false,
  templateUrl: './archives-bussiness.component.html',
  styleUrl: './archives-bussiness.component.scss'
})
export class ArchivesBussinessComponent implements OnInit {
	private _archivingProcessService = inject(ArchivingProcessService);
	private _userService = inject(UserService);
	private _spinner = inject(NgxSpinnerService); // Inyecta el servicio NgxSpinnerService para mostrar un spinner de carga
	private _ngxToastrService = inject(NgxToastrService); // Inyecta el servicio NgxToastrService para mostrar notificaciones
	loadingFolder = signal<boolean>(false);
	dataTree = signal<MatTreeOptionsNode<FileData>[]>([]);
	business = input.required<BusinessEntity>(); // Empresa requerida
	private _archiveService = inject(ArchiveService);
	openFolder = signal<boolean>(false);
	ngOnInit(): void {
	}
	async uploadFile(event: FlatNodeAllElements<FileData>): Promise<void> {
		const file = await this._archivingProcessService.uploadFile();
        const formData: FormData = new FormData();
        formData.append('IsDocumento', 'true');
        formData.append('Archivo', file),
        formData.append('EmpresaId', this.business().nIdEmpresa.toString()),
        formData.append('DirectorId', ''),
        formData.append('CarpetaPadreId', event.id.toString());
        formData.append('UsuarioRegistroId', this._userService.userLogin().usuarioId.toString() );
        this._spinner.show();
        this._archiveService.importFileBussines(formData)
        .pipe(
            finalize(() => this._spinner.hide())
        )
        .subscribe({
            next: (response: ResponseEntity<boolean>) => {
                if (response.isSuccess) {
					this.loadFolderBussiness();
                    this._ngxToastrService.showSuccess('El documento se registró exitosamente', '¡Éxito!');
                }
            },
        })
	}
    loadFolderBussiness(): void {
		this.loadingFolder.set(true);
		this._archiveService.listTreeBussiness(this.business().nIdEmpresa)
		.pipe(
			finalize(() => this.loadingFolder.set(false))
		).subscribe({
			next: ((response: ResponseEntity<MatTreeOptionsNode<FileData>>) => {
				if(response.isSuccess) {
					this.dataTree.set(response.lstItem);
				} else {
					this.dataTree.set([]);
				}
			}),
			error: (() => {
				this.dataTree.set([]); 
			})
		});
	}
	setViewFolder(): void {
		if(!this.business) return;
		this.openFolder.set(!this.openFolder());
		if(this.openFolder()) this.loadFolderBussiness();
	}
	deleteFile(event: FlatNodeAllElements<FileData>): void {
		const request: DeleteFileBusiness = {
			elementoId: event.id,
			usuarioEliminacionId: this._userService.userLogin().usuarioId,
		}
        this._spinner.show();
        this._archiveService.deleteFileBussiness(request)
        .pipe(
            finalize(() => this._spinner.hide())
        )
        .subscribe({
            next: (response: ResponseEntity<boolean>) => {
                if (response.isSuccess) {
					this.loadFolderBussiness();
                    this._ngxToastrService.showSuccess('El documento se eliminó exitosamente', '¡Éxito!');
                }
            },
        })
	}
}