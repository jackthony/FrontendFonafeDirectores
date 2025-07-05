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
import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';
import { ButtonEnum } from 'app/shared/enums/button.enum';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { finalize, Subject } from 'rxjs';
import { ResponseEntity } from '@models/response.entity';
import { SegUserService } from '../../../domain/services/profile/seg-user.service';
import { SegUserEntity } from '../../../domain/entities/profile/seg-user.entity';
import { AuthService } from 'app/modules/user/domain/services/auth/auth.service';
@Component({
    selector: 'app-change-password-adm',
    standalone: false,
    templateUrl: './change-password-adm.component.html',
    styleUrl: './change-password-adm.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class ChangePasswordAdmComponent implements OnInit {
    private _fb = inject(FormBuilder); // Inyección del FormBuilder para crear formularios reactivos de manera más sencilla
    public data: { object: SegUserEntity } = inject(MAT_DIALOG_DATA); // Inyección de los datos del diálogo que se pasan desde el componente que invoca este diálogo
    private readonly dialogRef = inject(MatDialogRef<ChangePasswordAdmComponent>);// Referencia al diálogo para cerrar el diálogo después de una acción
    private _userService = inject(UserService);// Servicios inyectados para obtener y manejar la información del usuario
    private _segUserService = inject(SegUserService);
    private _authService = inject(AuthService);
    private _unsubscribeAll: Subject<void> = new Subject<void>(); // Subject para controlar el ciclo de vida de las suscripciones y evitar memory leaks
    loadingService = signal<boolean>(false); 
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
    typeInputPassword = signal<boolean>(false);
    form: FormGroup;
    ngOnInit(): void {
        this.form = this._fb.group({
            //usuarioId: [this._userService.userLogin().usuarioId, Validators.required],
            usuarioId: [this.data.object.nIdUsuario, Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
            token: [this._authService.accessToken, Validators.required],
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
            .updatePasswordByAdmin(this.form.value)
            .pipe(finalize(() => this.loadingService.set(false))) 
            .subscribe({
                next: (response: ResponseEntity<boolean>) => {
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
}