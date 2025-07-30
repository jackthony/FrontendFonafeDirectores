/*******************************************************************************************************
 * Nombre del archivo:  user.service.ts
 * Descripción:          Servicio que gestiona la información del usuario en la aplicación, incluyendo la 
 *                       obtención de los datos del usuario, la actualización de los mismos y la notificación 
 *                       de cambios en el estado del usuario a través de observables. Además, utiliza señales 
 *                       para gestionar el estado reactivo de los datos del usuario en el componente.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del servicio con métodos para obtener y actualizar los datos del usuario.
 *******************************************************************************************************/
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from 'app/modules/user/domain/entities/auth/user.entity';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class UserService {
    private _httpClient = inject(HttpClient);
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    #userLogin = signal<User>(null);
    public userLogin = computed(() => this.#userLogin());
    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        this._user.next(value);
        this.#userLogin.set(value);
    }
    get user$(): Observable<any> {
        return this._user.asObservable();
    }
    /**
     * Get the current signed-in user data
     */
    get(): Observable<User> {
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }
    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/common/user', { user }).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }
}