import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthorizationService } from 'app/shared/services/authorization.service';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
	const authorizationService = inject(AuthorizationService);
	const router = inject(Router);

	const module = route.data['module'] as string;
	const action = route.data['action'] as string || 'read';

	const hasPermission = authorizationService.canPerform(module, action);
	if(!hasPermission) {
		router.navigate(['/error-404'])
		return false;
	}

    return true;
};
