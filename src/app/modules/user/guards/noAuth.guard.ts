/*******************************************************************************************************
 * Nombre del archivo:  no-auth.guard.ts
 * Descripción:          Guard que protege las rutas para evitar que los usuarios autenticados accedan 
 *                       a áreas de la aplicación que requieren que no estén logueados, como las páginas de login
 *                       o registro. Si el usuario está autenticado, se redirige a la página principal; 
 *                       si no está autenticado, se permite el acceso.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del guard para prevenir acceso de usuarios autenticados 
 *                         a rutas restringidas.
 *******************************************************************************************************/
import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../domain/services/auth/auth.service';
export const NoAuthGuard: CanActivateFn | CanActivateChildFn = (
    route,
    state
) => {
    const router: Router = inject(Router);
    return inject(AuthService)
        .check()
        .pipe(
            switchMap((authenticated) => {
                if (authenticated) {
                    return of(router.parseUrl(''));
                }
                return of(true);
            })
        );
};
