/*************************************************************************************
 * Nombre del archivo:  app.component.ts
 * Descripción:         Componente raíz de la aplicación Angular. Contiene el router-outlet
 *                      y módulos compartidos globales como el spinner. Se usa como punto
 *                      de entrada visual y estructural en la arquitectura de componentes.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 22/06/2025 por Daniel Alva
 * Cambios recientes:   Declaración inicial del componente raíz con soporte para RouterOutlet y Spinner.
 *************************************************************************************/
import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { ActivityMonitorService } from '@services/activity-monitor.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { AuthService } from './modules/user/auth/domain/services/auth.service';
import { SessionWarningComponent } from './shared/components/session-warning/session-warning.component';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet, NgxSpinnerModule],
})
export class AppComponent implements OnInit {
    private _activityMonitorService = inject(ActivityMonitorService);
    private dialog = inject(MatDialog);
    private isWarningDialogOpen = signal<boolean>(false);

    @HostListener('document:mousemove')
    @HostListener('document:keypress')
    @HostListener('document:touchstart')
    onUserActivity() {
        if (!this.isWarningDialogOpen()) {
            this._activityMonitorService.reset(); // Reseteamos el temporizador de inactividad
        }
    }

    constructor(private _authService: AuthService) {
        this._authService._authenticatedLogin$
            .pipe(distinctUntilChanged(), takeUntilDestroyed()) // para evitar duplicaciones
            .subscribe((isAuth) => {
                if (isAuth) {
                    this._activityMonitorService.start(); // Iniciar la cuenta de inactividad
                } else {
                    this._activityMonitorService.clearTimeout(); // Detiene la cuenta de inactividad
                }
            });

        this._activityMonitorService.idleStatus
            .pipe(takeUntilDestroyed())
            .subscribe((isIdle) => {
                if (isIdle) return;

                if (this._activityMonitorService.shouldShowWarning() && !this.isWarningDialogOpen()) {
                    this.isWarningDialogOpen.set(true);
                    const remaining = this._activityMonitorService.getRemainingTime();
                    const ref = this.dialog.open(SessionWarningComponent, {
                        data: { remaining },
                        width: "450px",
		                minWidth: "350px",
                        disableClose: true,
                        panelClass: 'mat-dialog-not-padding',
                    });

                    ref.afterClosed().subscribe((result) => {
                        this.isWarningDialogOpen.set(false);
                        if (result) this._activityMonitorService.reset(); // Reinicia solo si el usuario lo decide
                        else this._activityMonitorService.forceLogout(); //Cierra sesión
                    });
                }
            });
    }

    ngOnInit(): void {
    }
}
