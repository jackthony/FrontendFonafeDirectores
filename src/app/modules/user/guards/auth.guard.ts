/*******************************************************************************************************
 * Nombre del archivo:  auth.guard.ts
 * Descripción:          Guard que protege las rutas y asegura que solo los usuarios autenticados puedan acceder
 *                       a ciertas secciones de la aplicación. Si el usuario no está autenticado, se le redirige 
 *                       a la página de inicio de sesión, y se conserva la URL de la ruta solicitada para redirigir 
 *                       automáticamente después de un inicio de sesión exitoso.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del guard con control de acceso basado en autenticación.
 *******************************************************************************************************/
import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../domain/services/auth/auth.service';
export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);
    const _authService = inject(AuthService);
    return _authService
        .check()
        .pipe(
            switchMap((authenticated) => {
                console.log('PRIMERO ES AUTHGUARD' + 'AUTENTICADO: ' + authenticated );
                if (!authenticated) {
                    const redirectURL =
                        state.url === '/sign-out'
                            ? ''
                            : `redirectURL=${state.url}`;
                    const urlTree = router.parseUrl(`sign-in?${redirectURL}`);
                    return of(urlTree);
                }
                return of(true);
            })
        );
};
