/*******************************************************************************************************
 * Nombre del archivo:  permission.guard.ts
 * Descripción:          Guard que protege las rutas verificando si el usuario tiene los permisos necesarios
 *                       para realizar una acción específica en un módulo determinado. Si no tiene los permisos,
 *                       redirige al usuario a una página de error 404.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del guard con verificación de permisos para módulos y acciones.
 *******************************************************************************************************/
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthorizationService } from 'app/shared/services/authorization.service';
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
	const authorizationService = inject(AuthorizationService);
	const router = inject(Router);
	const module = route.data['module'] as string;
	const action = route.data['action'] as string || 'read';
	const hasPermission = authorizationService.canPerform(module, action);
	console.log('hasPermission', hasPermission);
	if(!hasPermission) {
		router.navigate(['/error-404'])
		return false;
	}
    return true;
};