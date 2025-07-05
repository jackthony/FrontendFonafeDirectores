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
		//this.loadFolderBussiness();
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
		this.openFolder.set(!this.openFolder());
		if(this.openFolder()) this.loadFolderBussiness();
	}
}
