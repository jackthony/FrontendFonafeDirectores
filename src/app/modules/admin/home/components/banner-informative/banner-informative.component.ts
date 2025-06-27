/*******************************************************************************************************
 * Nombre del componente: BannerInformativeComponent
 * Descripción:           Componente encargado de mostrar información relevante al usuario autenticado
 *                        en la parte superior del sistema o módulo actual. Se suscribe a los datos del 
 *                        usuario mediante el UserService y permite el acceso a dicha información.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 * Última modificación:   23/06/2025 por Daniel Alva
 * Cambios recientes:     - Implementación del ciclo de vida completo (OnInit y OnDestroy).
 *                        - Suscripción segura a user$ con takeUntil para evitar memory leaks.
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { User } from '@models/user.interface';
import { UserService } from 'app/core/user/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-banner-informative',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './banner-informative.component.html',
    styleUrl: './banner-informative.component.scss',
})
export class BannerInformativeComponent implements OnInit, OnDestroy {
	private _userService = inject(UserService); // Servicio inyectado para obtener información del usuario autenticado
	private _unsubscribeAll: Subject<void> = new Subject<void>(); // Subject que controla la destrucción de suscripciones activas para evitar memory leaks
	user: User;
	ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => { 
                this.user = user;
            });
    }
	ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}