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

	// Inyección del servicio UserService que se usará para obtener la información del usuario.
	private _userService = inject(UserService);

	// Se crea un Subject para controlar las suscripciones y asegurarse de que se limpien correctamente.
	private _unsubscribeAll: Subject<void> = new Subject<void>();

	// Variable que almacenará los datos del usuario.
	user: User;

	// Método que se ejecuta cuando el componente es inicializado.
	// Se suscribe al observable 'user$' de UserService, que emite los datos del usuario.
	ngOnInit(): void {
        // Suscripción al observable user$ para recibir los datos del usuario y actualizar la variable 'user'.
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll)) // 'takeUntil' asegura que la suscripción se cancelará cuando _unsubscribeAll emita un valor.
            .subscribe((user: User) => { // Asigna los datos del usuario a la variable 'user' cada vez que se emite un valor.
                this.user = user;
            });
    }

	// Método que se ejecuta cuando el componente es destruido.
	// Se utiliza para limpiar las suscripciones y evitar memory leaks.
	ngOnDestroy(): void {
        // Emite un valor en _unsubscribeAll para cancelar todas las suscripciones activas.
        this._unsubscribeAll.next(null);
        // Completa el Subject para liberar recursos.
        this._unsubscribeAll.complete();
    }
}