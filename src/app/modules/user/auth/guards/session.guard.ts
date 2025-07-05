import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../domain/services/auth.service';

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
