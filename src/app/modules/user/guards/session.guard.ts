/*******************************************************************************************************
 * Nombre del archivo:  session.guard.ts
 * Descripción:          Guard de navegación que protege las rutas según el estado de la sesión del usuario.
 *                       Si la sesión requiere una actualización de contraseña, redirige al usuario a la página 
 *                       de cambio de contraseña. Si la sesión está activa, permite el acceso a la ruta solicitada.
 *                       Si no se cumple ninguna de estas condiciones, redirige al usuario al inicio de sesión.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del guard con control de estado de sesión y redirección.
 *******************************************************************************************************/
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../domain/services/auth/auth.service';
export const SessionGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const sessionState = authService.getSessionState();
    if (sessionState === 'FORCE_PASSWORD_UPDATE') {
		if (state.url === '/reset-password' || state.url === '/sign-out' )  {
			return of(true);
		}
		return of(router.parseUrl('/reset-password'));
	} 
    if (sessionState === 'ACTIVE') {
		if(state.url === '/reset-password') return of(router.parseUrl('/home'));
        return of(true);
    }
    authService.signOut();
    return of(router.parseUrl('/sign-in'));
};