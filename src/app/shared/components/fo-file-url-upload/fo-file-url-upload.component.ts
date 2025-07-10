/*******************************************************************************************************
 * Nombre del archivo:  fo-file-url-upload.component.ts
 * Descripción:          Componente de carga de archivos desde una URL, que gestiona el estado del
 *                       componente relacionado con la carga de archivos y muestra un spinner mientras
 *                       se procesan las acciones, como la carga y el archivado de archivos.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del componente con funcionalidad de carga de archivos
 *                         y visualización del estado con spinner y notificaciones de éxito.
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FileComponentStateService } from '@services/file-component-state.service';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { ArchivingProcessService } from 'app/modules/business/domain/services/business/archiving-process.service';
import { FileComponentState } from 'app/shared/interfaces/file-component-state.interface';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
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
    }
    clickUpload(): void {
        this.eventAction.emit();
    }
    async openFolder(): Promise<void> {
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}