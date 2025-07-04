import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FileComponentStateService } from '@services/file-component-state.service';
import { UserService } from 'app/core/user/user.service';
import { FileComponentState } from 'app/shared/interfaces/file-component-state.interface';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ArchivingProcessService } from '../../domain/services/archiving-process.service';

@Component({
    selector: 'app-fo-file-url-upload',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    templateUrl: './fo-file-url-upload.component.html',
    styleUrl: './fo-file-url-upload.component.scss',
    //encapsulation: ViewEncapsulation.None
    //encapsulation: ViewEncapsulation.None
})
export class FoFileUrlUploadComponent implements OnInit {
    
    private _fileComponentStateService = inject(FileComponentStateService);
    private _archivingProcessService = inject(ArchivingProcessService);
    private _userService = inject(UserService);
    private _spinner = inject(NgxSpinnerService);
    private _ngxToastrService = inject(NgxToastrService);

    @Output() eventAction: EventEmitter<void> = new EventEmitter<void>();

    fileComponent = signal<FileComponentState>(null); 
    private destroy$: Subject<void> = new Subject<void>();

    ngOnInit(): void {
        this._fileComponentStateService.fileComponentState$
        .pipe(
            takeUntil(this.destroy$)
        )
        .subscribe((value: FileComponentState) => {
            this.fileComponent.set(value);
        })
    }

    async uploadFile(): Promise<void> {
        /* const file = await this._archivingProcessService.uploadFile();
        const formData: FormData = new FormData();
        formData.append('archivo', file);
        formData.append('nIdEntidadRelacionada', '1'),
        formData.append('nUserId', this._userService.userLogin().usuarioId.toString()),
        formData.append('nIdEntidad', '1');
        formData.append('sRuta', `${this.fileComponent().root}` );
        this._spinner.show();
        this._archivingProcessService.create(new RequestOption({ request: formData }))
        .pipe(
            finalize(() => this._spinner.hide())
        )
        .subscribe({
            next: (response: ResponseModel<number>) => {
                if (response.isSuccess) {
                    //MENSAJE DE SATISFACCION
                    this._ngxToastrService.showSuccess('Documento registrado exitosamente', '¡Éxito!');
                    //refrescar
                    //this.eventRefreshDirectory.emit();
                }
            },
        }) */
        
    }

    clickUpload(): void {
        this.eventAction.emit();
    }

    //BORRAR ................
    async openFolder(): Promise<void> {
        /* this._archivingProcessService.get(new RequestOption({resource: 'OpenFolder', pathVariables: [this.fileComponent().root] })).pipe(
		).subscribe({
			next: ((response) => {
			}),
			error:(() => {
			
			})
		}) */
        /* const folderPath = 'C:/FonafeStorage/Empresa';
        const url = `file:///${folderPath.replace(/\\/g, '/')}`;
        window.open(url, '_blank'); */
    }


    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
