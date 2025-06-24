/*******************************************************************************************************
 * Nombre del componente: ChangePasswordAdmComponent
 * Descripción:           Componente encargado de gestionar el cambio forzado de contraseña de un 
 *                        usuario desde el módulo de administración. Permite validar y actualizar la 
 *                        nueva contraseña ingresada, además de controlar la visibilidad del campo.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 * Última modificación:   23/06/2025 por Daniel Alva
 * Cambios recientes:     - Implementación del formulario reactivo para cambio de contraseña.
 *                        - Integración con el servicio SegUserService para actualización segura.
 *                        - Control del ciclo de vida con Subject para evitar memory leaks.
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal, ViewEncapsulation } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResponseModel } from '@models/IResponseModel';
import { User } from '@models/user.interface';
import { ButtonEnum } from 'app/core/enums/button.enum';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { UserService } from 'app/core/user/user.service';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SegUserService } from '../../domain/services/seg-user.service';
import { SegUserEntity } from '../../domain/entities/seg-user.entity';
import { FoButtonDialogComponent } from 'app/modules/admin/shared/components/fo-button-dialog/fo-button-dialog.component';
@Component({
    selector: 'app-change-password-adm',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormInputModule,
        FoButtonDialogComponent,
        TranslateMessageForm,
        ReactiveFormsModule,
        MatDialogModule,
        MatTooltipModule,
        MatButtonModule,
    ],
    templateUrl: './change-password-adm.component.html',
    styleUrl: './change-password-adm.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class ChangePasswordAdmComponent implements OnInit, OnDestroy {
    private _fb = inject(FormBuilder); // Inyección del FormBuilder para crear formularios reactivos de manera más sencilla
    public data: { object: SegUserEntity } = inject(MAT_DIALOG_DATA); // Inyección de los datos del diálogo que se pasan desde el componente que invoca este diálogo
    private readonly dialogRef = inject(MatDialogRef<ChangePasswordAdmComponent>);// Referencia al diálogo para cerrar el diálogo después de una acción
    private _userService = inject(UserService);// Servicios inyectados para obtener y manejar la información del usuario
    private _segUserService = inject(SegUserService);
    private _unsubscribeAll: Subject<void> = new Subject<void>(); // Subject para controlar el ciclo de vida de las suscripciones y evitar memory leaks
    loadingService = signal<boolean>(false); 
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
    typeInputPassword = signal<boolean>(false);
    user: User;
    form: FormGroup;
    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll)) 
            .subscribe((user: User) => {
                this.user = user;
            });
        this.form = this._fb.group({
            user: [this.data.object.nIdUsuario, Validators.required],
            password: ['', [Validators.required, Validators.maxLength(32)]],
            nUsuarioModificacion: [this.user?.usuarioId, Validators.required],
        });
    }
    /**
     * Método encargado de enviar la solicitud para cambiar la contraseña del usuario seleccionado.
     * Realiza validación previa del formulario y usa el servicio SegUserService para ejecutar el cambio.
     */
    changePassword(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.loadingService.set(true);
        this._segUserService
            .updatePassword(this.form.value)
            .pipe(finalize(() => this.loadingService.set(false))) 
            .subscribe({
                next: (response: ResponseModel<boolean>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }
    /**
     * Método que alterna la visibilidad del campo de contraseña (mostrar u ocultar).
     * Ideal para mejorar la experiencia del usuario durante el ingreso de la nueva clave.
     */
    viewPassword(): void {
        this.typeInputPassword.set(!this.typeInputPassword());
    }
    /**
     * Método que se ejecuta automáticamente al destruir el componente.
     * Se encarga de cancelar todas las suscripciones activas para prevenir fugas de memoria.
     */
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}