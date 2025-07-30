/*******************************************************************************************************
 * Nombre del archivo:  reset-password-token.guard.ts
 * Descripción:          Guard que protege la ruta de restablecimiento de contraseña verificando la validez 
 *                       del token en la URL. Si no se encuentra un token o si el token es inválido, 
 *                       redirige al usuario a una página de error 404.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del guard para validar el token de restablecimiento de contraseña.
 *******************************************************************************************************/
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../domain/services/auth/auth.service';
import { tap } from 'rxjs';
export const ResetPasswordTokenGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const token = route.queryParams['token'];
    if (!token) {
		router.navigate(['/error-404']);
	} 
    return authService.verifyToken(token).pipe(
        tap((isValid) => {
          if (!isValid) {
            router.navigate(['/404']);
          }
        })
      );
};