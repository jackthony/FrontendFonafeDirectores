import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MatTreeOptionsNode } from 'app/modules/admin/shared/components/bu-mat-tree-flat/models/mat-tree-options-node';
import { FoContCardComponent } from 'app/modules/admin/shared/components/fo-cont-card/fo-cont-card.component';
import { FoMatTreeFlatComponent } from 'app/modules/admin/shared/components/fo-mat-tree-flat/fo-mat-tree-flat.component';
import { FileData } from 'app/modules/admin/shared/domain/entities/archive-tree.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { ArchiveService } from 'app/modules/admin/shared/domain/services/archive.service';
import { finalize } from 'rxjs';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { FlatNodeAllElements } from 'app/modules/admin/shared/components/bu-mat-tree-flat/models/flat-node-all-elements';
import { ArchivingProcessService } from 'app/modules/admin/shared/domain/services/archiving-process.service';
import { UserService } from 'app/core/user/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-archives-bussiness',
  standalone: true,
  imports: [CommonModule, FoContCardComponent, FoMatTreeFlatComponent, MatIconModule, MatButtonModule],
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
