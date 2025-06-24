/*************************************************************************************
 * Nombre del archivo:  sign-up.component.ts
 * Descripción:         Componente para registro de nuevos usuarios, gestionando el formulario
 *                      y la comunicación con el servicio de autenticación.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Creación inicial del componente.
 *************************************************************************************/
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
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
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
    ],
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;
    /**
     * Constructor que inyecta servicios esenciales: autenticación, formulario reactivo y enrutamiento.
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    ) {}
    /**
     * Hook de inicialización del componente.
     * Define la estructura del formulario reactivo con sus respectivos validadores.
     */
    ngOnInit(): void {
        this.signUpForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            company: [''],
            agreements: ['', Validators.requiredTrue],
        });
    }
    /**
     * Ejecuta el proceso de registro (Sign Up).
     * Valida el formulario, realiza la solicitud HTTP mediante el servicio de autenticación
     * y navega a la pantalla de confirmación si es exitoso.
     * En caso de error, muestra un mensaje adecuado al usuario.
     */
    signUp(): void {
        if (this.signUpForm.invalid) {
            return;
        }
        this.signUpForm.disable();
        this.showAlert = false;
        this._authService.signUp(this.signUpForm.value).subscribe(
            (response) => {
                this._router.navigateByUrl('/confirmation-required');
            },
            (response) => {
                this.signUpForm.enable();
                this.signUpNgForm.resetForm();
                this.alert = {
                    type: 'error',
                    message: 'Something went wrong, please try again.',
                };
                this.showAlert = true;
            }
        );
    }
}