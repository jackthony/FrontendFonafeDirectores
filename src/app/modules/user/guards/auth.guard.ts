import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../domain/services/auth/auth.service';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);
    const _authService = inject(AuthService);

    // Check the authentication status
    return _authService
        .check()
        .pipe(
            switchMap((authenticated) => {
                console.log('PRIMERO ES AUTHGUARD' + 'AUTENTICADO: ' + authenticated );
                
                // If the user is not authenticated...
                if (!authenticated) {
                    // Redirect to the sign-in page with a redirectUrl param
                    const redirectURL =
                        state.url === '/sign-out'
                            ? ''
                            : `redirectURL=${state.url}`;
                    const urlTree = router.parseUrl(`sign-in?${redirectURL}`);

                    return of(urlTree);
                }

                /* console.log('AUTHENTICATEDDD', authenticated);
                
                const sessionState = _authService.getSessionState();

                if (sessionState !== 'ACTIVE') {
                    switch (sessionState) {
                        case 'FORCE_PASSWORD_UPDATE':
                            if (state.url === '/reset-password' || state.url === '/sign-out' )  {
                                return of(true);
                            }
                            return of(router.parseUrl('/reset-password'));
                            /* 
                        case 'PASSWORD_EXPIRED':
                            return of(router.parseUrl('/cambiar-clave-inicial'));
                        case 'ACCOUNT_LOCKED':
                            return of(router.parseUrl('/bloqueado'));
                        default:
                            return of(router.parseUrl('/sign-in'));
                    }
                } */

                // Allow the access
                return of(true);
            })
        );
};
