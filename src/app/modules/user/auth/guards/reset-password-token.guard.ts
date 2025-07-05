import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../domain/services/auth.service';
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
            // Redirigir a una página 404 si el token es inválido
            router.navigate(['/404']);
          }
        })
      );
};
