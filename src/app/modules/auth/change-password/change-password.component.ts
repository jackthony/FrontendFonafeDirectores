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
import { AuthService } from 'app/core/auth/auth.service';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { UserService } from 'app/core/user/user.service';
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
    errorMessages: { message: string; valid: boolean; key: string }[] = [];
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
    ) {}
    /**
     * Hook de inicialización.
     * Suscribe al usuario actual e inicializa formulario con validadores personalizados.
     */
    ngOnInit(): void {
        this.errorMessages = this.generateErrorMessages();
        this._userService.user$
            .subscribe((user: User) => {
                this.user = user;
            });
        this.resetPasswordForm = this._formBuilder.group(
            {
                usuarioId: [this.user.usuarioId],
                passwordActual: ['', [Validators.required]],
                passwordNueva: ['', [Validators.required, Validators.maxLength(32), this._validationFormService.passwordDetailedValidator]],
                passwordConfirm: ['', [Validators.required, Validators.maxLength(32)]],
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
            this.validationPassword(value, this.errorMessages);
        })
        
    }

    validationPassword(password: string, errorMessages:{ message: string; valid: boolean; key: string }[]): { message: string; valid: boolean; key: string }[] {

        const minLengthValid = password?.length >= 8;
        this.updateErrorMessage("minLength", minLengthValid,errorMessages);

        const maxLengthValid = password?.length <= 12;
        this.updateErrorMessage("maxLength", maxLengthValid,errorMessages);

        const lowercaseValid = /[a-z]/.test(password);
        this.updateErrorMessage("lowercase", lowercaseValid,errorMessages);

        const uppercaseValid = /[A-Z]/.test(password);
        this.updateErrorMessage("uppercase", uppercaseValid,errorMessages);

        const numberValid = /[0-9]/.test(password);
        this.updateErrorMessage("number", numberValid,errorMessages);

        const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        this.updateErrorMessage("specialChar", specialCharValid,errorMessages);

        //this.allValid = !errorMessages.every(error => !error.valid);

        return errorMessages;
    }

    generateErrorMessages(): { message: string; valid: boolean; key: string }[] {
        const errorMessages: { message: string; valid: boolean; key: string }[] = [];
        errorMessages.push({
            message: `Requiere al menos 8 caracteres.`,
            valid: true,
            key: 'minLength'
        });
        errorMessages.push({
            message: `Requiere como máximo 12 caracteres.`,
            valid: true,
            key: 'maxLength'
        });
        errorMessages.push({
            message: "Debe incluir una minúscula.",
            valid: true,
            key: 'lowercase'
        });
        errorMessages.push({
            message: "Debe incluir una mayúscula.",
            valid: true,
            key: 'uppercase'
        });
        errorMessages.push({
            message: "Debe incluir un número.",
            valid: true,
            key: 'number'
        });
        errorMessages.push({
            message: "Debe incluir un carácter especial.",
            valid: true,
            key: 'specialChar'
        });
        return errorMessages;
    }

    private updateErrorMessage(key: string, valid: boolean, errorMessages:{ message: string; valid: boolean; key: string }[]): void {
        // Encuentra el error correspondiente y actualiza su estado 'valid' según el key
        const error = errorMessages.find(error => error.key === key);
        if (error) {
            error.valid = !valid;
        }
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