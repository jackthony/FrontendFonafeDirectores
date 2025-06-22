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
import { FoButtonDialogComponent } from '@components/fo-button-dialog/fo-button-dialog.component';
import { ResponseModel } from '@models/IResponseModel';
import { User } from '@models/user.interface';
import { ButtonEnum } from 'app/core/enums/button.enum';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { UserService } from 'app/core/user/user.service';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SegUserService } from '../../domain/services/seg-user.service';
import { SegUserEntity } from '../../domain/entities/seg-user.entity';

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
    // Inyección del FormBuilder para crear formularios reactivos de manera más sencilla
    private _fb = inject(FormBuilder);

    // Inyección de los datos del diálogo que se pasan desde el componente que invoca este diálogo
    public data: { object: SegUserEntity } = inject(MAT_DIALOG_DATA);

    // Referencia al diálogo para cerrar el diálogo después de una acción
    private readonly dialogRef = inject(MatDialogRef<ChangePasswordAdmComponent>);

    // Servicios inyectados para obtener y manejar la información del usuario
    private _userService = inject(UserService);
    private _segUserService = inject(SegUserService);

    // Subject para controlar el ciclo de vida de las suscripciones y evitar memory leaks
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    // Señales reactivas para controlar el estado de carga, botones y tipo de entrada de la contraseña
    loadingService = signal<boolean>(false);
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
    typeInputPassword = signal<boolean>(false);

    // Variables que almacenan los datos del usuario y el formulario reactivo
    user: User;
    form: FormGroup;

    // Método que se ejecuta cuando el componente se inicializa
    ngOnInit(): void {
        // Se suscribe al observable 'user$' de UserService para obtener los datos del usuario
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll)) // Usamos 'takeUntil' para cancelar la suscripción cuando el componente se destruya
            .subscribe((user: User) => {
                this.user = user;
            });

        // Inicializa el formulario reactivo con los valores predeterminados
        this.form = this._fb.group({
            user: [this.data.object.nIdUsuario, Validators.required], // Campo de usuario, requerido
            password: ['', [Validators.required, Validators.maxLength(32)]], // Campo de contraseña, requerido y con un límite de 32 caracteres
            nUsuarioModificacion: [this.user?.usuario, Validators.required], // Campo de usuario que realiza la modificación
        });
    }

    // Método para cambiar la contraseña
    changePassword(): void {
        // Si el formulario es inválido, marca todos los campos como tocados para mostrar los errores
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        // Marca que el servicio está en proceso de carga
        this.loadingService.set(true);
        // Llama al servicio para cambiar la contraseña y maneja la respuesta
        this._segUserService
            .updatePassword(this.form.value) // Llama al servicio para crear la solicitud
            .pipe(finalize(() => this.loadingService.set(false))) // Finaliza la operación y desactiva el estado de carga
            .subscribe({
                next: (response: ResponseModel<boolean>) => {
                    // Si la respuesta es exitosa, cierra el diálogo con un valor verdadero
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }

    // Método para alternar la visibilidad de la contraseña
    viewPassword(): void {
        // Alterna el tipo de entrada para la contraseña (mostrar u ocultar)
        this.typeInputPassword.set(!this.typeInputPassword());
    }

    // Método que se ejecuta cuando el componente es destruido
    ngOnDestroy(): void {
        // Limpia las suscripciones activas para evitar memory leaks
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
