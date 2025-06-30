/*************************************************************************************
 * Nombre del archivo:  reset-password.component.ts
 * Descripción:         Componente para restablecimiento de contraseña. Gestiona el
 *                      formulario, validaciones, comunicación con el servicio de
 *                      autenticación y notificaciones al usuario.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Establece validación robusta y flujos de redirección tras éxito.
 *************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { User } from '@models/user.interface';
import { PasswordValidationService } from '@services/password-validation.service';
import { AuthService } from 'app/core/auth/auth.service';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { UserService } from 'app/core/user/user.service';
import { ErrorMessagesPassword } from 'app/shared/interfaces/error-messages.interface';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { ValidationFormService } from 'app/shared/services/validation-form.service';
import { environment } from 'environments/environment';
import { NgxCaptchaModule, ReCaptcha2Component } from 'ngx-captcha';
import { finalize, Subject, takeUntil } from 'rxjs';
@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        CommonModule,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterLink,
        TranslateMessageForm,
        NgxCaptchaModule
    ],
})
export class ChangePasswordComponent implements OnInit {
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;
    @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;
    resetPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;
    errorMessages: ErrorMessagesPassword[] = [];
    user: User;
    keyCaptcha = `${environment.siteKeyCaptcha}`;
    private _unsubscribeAll: Subject<void> = new Subject<void>();
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    constructor(
        private _userService: UserService,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _ngxToastrService: NgxToastrService,
        private _router: Router,
        private _validationFormService: ValidationFormService,
        private _passwordValidationService: PasswordValidationService
    ) {}
    /**
     * Hook de inicialización.
     * Suscribe al usuario actual e inicializa formulario con validadores personalizados.
     */
    ngOnInit(): void {
        this.errorMessages = this._passwordValidationService.getDefaultErrors();
        this._userService.user$
            .subscribe((user: User) => {
                this.user = user;
            });
        this.resetPasswordForm = this._formBuilder.group(
            {
                usuarioId: [this.user.usuarioId],
                passwordActual: ['', [Validators.required]],
                passwordNueva: ['', [Validators.required, this._validationFormService.passwordDetailedValidator]],
                passwordConfirm: ['', [Validators.required, Validators.maxLength(12)]],
                captchaResponse: ['', Validators.required],
                token: [this._authService.accessToken]
            },
            {
                validators: FuseValidators.mustMatch(
                    'passwordNueva',
                    'passwordConfirm'
                ),
            }
        );

        this.resetPasswordForm.get('passwordNueva').valueChanges.subscribe(value => {
            this.errorMessages = this._passwordValidationService.validatePassword(value);

        })
        
    }

    /**
     * Envía el formulario de restablecimiento de contraseña al backend.
     */
    resetPassword(): void {
        if (this.resetPasswordForm.invalid) {
            return;
        }
        this.resetPasswordForm.disable();
        this.showAlert = false;
        this._authService
            .changePassword(this.resetPasswordForm.value)
            .pipe(
                finalize(() => {
                    this.resetPasswordForm.enable();
                    //this.resetPasswordNgForm.resetForm();
                })
            )
            .subscribe(
                (response) => {
                    this._authService.signOut();
                    this._ngxToastrService.showSuccess('Su contraseña ha sido restablecida.', '¡Éxito!');
                    this._router.navigate(['sign-in']);
                },
                (response) => {
                    if (this.captchaElem) {
                        this.captchaElem.resetCaptcha();
                    }
                    
                    this.alert = {
                        type: 'error',
                        message: response?.error?.detail ||' Algo salió mal, por favor inténtalo de nuevo.',
                    };
                    this.showAlert = true;
                }
            );
    }
    /**
     * Hook de destrucción: limpia suscripciones.
     */
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}