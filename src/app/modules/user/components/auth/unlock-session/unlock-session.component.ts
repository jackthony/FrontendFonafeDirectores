/*******************************************************************************************************
 * Nombre del archivo:  unlock-session.component.ts
 * Descripción:         Componente encargado del desbloqueo de sesión por medio de contraseña,
 *                      permitiendo que el usuario continúe su navegación de forma segura.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Incorporación de encabezado técnico estandarizado para trazabilidad del código.
 *******************************************************************************************************/
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { AuthService } from '../../../domain/services/auth/auth.service';
@Component({
    selector: 'auth-unlock-session',
    templateUrl: './unlock-session.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterLink,
    ],
})
export class AuthUnlockSessionComponent implements OnInit {
    @ViewChild('unlockSessionNgForm') unlockSessionNgForm: NgForm;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    name: string;
    showAlert: boolean = false;
    unlockSessionForm: UntypedFormGroup;
    private _email: string;
    /**
     * Constructor del componente
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _userService: UserService
    ) {}
    /**
     * Hook de inicialización del componente.
     * Obtiene los datos del usuario actual y configura el formulario reactivo.
     */
    ngOnInit(): void {
        this._userService.user$.subscribe((user) => {
            this.name = user.name;
            this._email = user.email;
        });
        this.unlockSessionForm = this._formBuilder.group({
            name: [
                {
                    value: this.name,
                    disabled: true,
                },
            ],
            password: ['', Validators.required],
        });
    }
    /**
     * Ejecuta la lógica de desbloqueo de sesión.
     * Valida el formulario, consume el servicio de autenticación y redirige o muestra errores según el resultado.
     */
    unlock(): void {
        if (this.unlockSessionForm.invalid) {
            return;
        }
        this.unlockSessionForm.disable();
        this.showAlert = false;
        this._authService
            .unlockSession({
                email: this._email ?? '',
                password: this.unlockSessionForm.get('password').value,
            })
            .subscribe(
                () => {
                    const redirectURL =
                        this._activatedRoute.snapshot.queryParamMap.get(
                            'redirectURL'
                        ) || '/signed-in-redirect';
                    this._router.navigateByUrl(redirectURL);
                },
                (response) => {
                    this.unlockSessionForm.enable();
                    this.unlockSessionNgForm.resetForm({
                        name: {
                            value: this.name,
                            disabled: true,
                        },
                    });
                    this.alert = {
                        type: 'error',
                        message: 'Invalid password',
                    };
                    this.showAlert = true;
                }
            );
    }
}