/*******************************************************************************************************
 * Nombre del archivo:  auth-interceptor.ts
 * Descripción:          Interceptor HTTP que agrega el token de autenticación a las solicitudes
 *                       HTTP salientes, si el token de acceso es válido. Si el token está presente y
 *                       no ha expirado, se incluye en el encabezado de la solicitud bajo el nombre 
 *                       "Authorization". Además, maneja los errores que puedan ocurrir durante la solicitud.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación para agregar el token JWT en los encabezados de las solicitudes.
 *******************************************************************************************************/
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthUtils } from 'app/core/utils/auth.utils';
import { AuthService } from 'app/modules/user/domain/services/auth/auth.service';
import { Observable, catchError, throwError } from 'rxjs';
/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    let newReq = req.clone();
    if (
        authService.accessToken &&
        !AuthUtils.isTokenExpired(authService.accessToken)
    ) {
        newReq = req.clone({
            headers: req.headers.set(
                'Authorization',
                'Bearer ' + authService.accessToken
            ),
        });
    }
    return next(newReq).pipe(
        catchError((error) => {
            return throwError(error);
        })
    );
};