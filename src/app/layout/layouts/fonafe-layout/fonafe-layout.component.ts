/*******************************************************************************************************
 * Nombre del archivo:  fonafe-layout.component.ts
 * Descripción:          Componente encargado de gestionar la estructura general del layout de la aplicación, 
 *                       incluyendo la barra de carga, la notificación de nuevos mensajes y la opción de 
 *                       cerrar sesión. Este componente escucha y maneja las actualizaciones del usuario 
 *                       actualmente autenticado, y proporciona funcionalidades para redirigir a la página 
 *                       principal de la aplicación.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del componente de layout de Fonafe.
 *******************************************************************************************************/
import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { User } from 'app/modules/user/domain/entities/auth/user.entity';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { NotificationsBellComponent } from 'app/layout/common/notifications-bell/notifications-bell.component';
import { QuitComponent } from 'app/layout/common/quit/quit.component';
import { Subject, takeUntil } from 'rxjs';
@Component({
    selector: 'fonafe-layout',
    templateUrl: './fonafe-layout.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [FuseLoadingBarComponent, RouterOutlet, QuitComponent, NotificationsBellComponent],
})
export class FonafeComponent implements OnInit, OnDestroy {
	private readonly _router = inject(Router);
    private _userService = inject(UserService);
	private _unsubscribeAll: Subject<void> = new Subject<void>();
	user: User;
    
    /**
     * Constructor
     */
    constructor() {}
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });
    }
    redirectToHome(): void {
        this._router.navigate(['home']);
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}