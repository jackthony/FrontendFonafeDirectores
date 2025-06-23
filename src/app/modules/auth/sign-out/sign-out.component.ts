/*************************************************************************************
   * Nombre del archivo:  sign-out.component.ts
   * Descripción:         Componente que gestiona el cierre de sesión, ejecuta el
   *                      signOut y muestra un contador antes de redirigir al sign-in.
   * Autor:               Daniel Alva
   * Fecha de creación:   01/06/2025
   * Última modificación: 23/06/2025 por Daniel Alva
   * Cambios recientes:   Creación inicial del componente de cierre de sesión.
   **************************************************************************************/
import { I18nPluralPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { Subject, finalize, takeUntil, takeWhile, tap, timer } from 'rxjs';
@Component({
    selector: 'auth-sign-out',
    templateUrl: './sign-out.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterLink, I18nPluralPipe],
})
export class AuthSignOutComponent implements OnInit, OnDestroy {
    countdown: number = 5;
    countdownMapping: any = {
        '=1': '# second',
        other: '# seconds',
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {}
    /**
     * Hook de inicialización del componente.
     * Ejecuta el cierre de sesión inmediato y luego inicia un `timer` de 5 segundos
     * que decrementa cada segundo. Al finalizar, redirige a la vista de inicio de sesión.
     */
    ngOnInit(): void {
        this._authService.signOut();
        timer(1000, 1000)
            .pipe(
                finalize(() => {
                    this._router.navigate(['sign-in']);
                }),
                takeWhile(() => this.countdown > 0),
                takeUntil(this._unsubscribeAll),
                tap(() => this.countdown--)
            )
            .subscribe();
    }
        /**
     * Hook de destrucción del componente.
     * Libera los recursos y cancela la suscripción al `timer`.
     */
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}