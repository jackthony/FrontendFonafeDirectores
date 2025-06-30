import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const ResetPasswordTokenGuard: CanActivateFn = (route, state) => {
    const token = route.queryParams['token'];
    const router = inject(Router);
    if (!token) {
		router.navigate(['/error-404']);
	} 

    return true;
};
