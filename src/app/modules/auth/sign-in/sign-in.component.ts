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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { environment } from 'environments/environment';
import { NgxCaptchaModule } from 'ngx-captcha';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        RouterLink,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        NgxCaptchaModule
    ],
})
export class AuthSignInComponent implements OnInit {
    // Inyecta los servicios y módulos necesarios
    @ViewChild('signInNgForm') signInNgForm: NgForm; // Referencia al formulario de inicio de sesión

    alert: { type: FuseAlertType; message: string } = { // Configura el tipo y mensaje de alerta
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup; // Define el formulario reactivo para el inicio de sesión
    showAlert: boolean = false; // Controla la visibilidad de la alerta
    keyCaptcha = `${environment.siteKeyCaptcha}`; // Captcha para la verificación de usuario, obtiene la clave desde el entorno

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute, // Servicio para obtener parámetros de la ruta activada
        private _authService: AuthService, // Servicio de autenticación para gestionar el inicio de sesión
        private _formBuilder: UntypedFormBuilder, // Servicio para crear formularios reactivos
        private _router: Router, // Servicio para la navegación de rutas
        private _ngxToastrService: NgxToastrService // Servicio para mostrar notificaciones
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Crea el formulario de inicio de sesión
        this.signInForm = this._formBuilder.group({
            email: [
                'rodrigo@fonafe.pe', // Valor predeterminado del correo
                [Validators.required, Validators.email], // Validadores para asegurarse de que sea un correo válido
            ],
            password: ['123456', Validators.required], // Valor predeterminado de la contraseña
            recaptcha: ['', Validators.required], // Campo de captcha obligatorio
            rememberMe: [''], // Campo para recordar la sesión (checkbox)
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Si el formulario es inválido, retorna y no realiza la autenticación
        if (this.signInForm.invalid) {
            return;
        }

        // Deshabilita el formulario mientras se realiza la autenticación
        this.signInForm.disable();

        // Oculta la alerta
        this.showAlert = false;

        // Realiza la autenticación
        this._authService.signIn(this.signInForm.value).subscribe(
            (res) => {
                // Obtiene la URL de redirección desde los parámetros de la ruta
                const redirectURL =
                    this._activatedRoute.snapshot.queryParamMap.get(
                        'redirectURL'
                    ) || '/signed-in-redirect';
                
                // Navega a la URL de redirección
                this._router.navigateByUrl(redirectURL);
            },
            (response) => {
                // Vuelve a habilitar el formulario si la autenticación falla
                this.signInForm.enable();
                this._ngxToastrService.showError('Credenciales inválidas.'); // Muestra un mensaje de error
                // Establece el mensaje de alerta
                this.alert = {
                    type: 'error',
                    message: 'Wrong email or password', // Mensaje de error para las credenciales incorrectas
                };

                // Muestra la alerta
                this.showAlert = true;
            }
        );
    }
}