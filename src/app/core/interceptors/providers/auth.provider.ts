/*******************************************************************************************************
 * Nombre del archivo:  auth-provider.ts
 * Descripción:          Proveedor para configurar el cliente HTTP con el interceptor de autenticación 
 *                       y la inicialización de dependencias relacionadas con la autenticación.
 *                       Este proveedor se asegura de que todas las solicitudes HTTP incluyan el token 
 *                       de autenticación en los encabezados y gestiona la inicialización de los servicios 
 *                       de autenticación necesarios al inicio de la aplicación.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Se añadió el interceptor de autenticación para manejar las solicitudes autenticadas.
 *******************************************************************************************************/
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    ENVIRONMENT_INITIALIZER,
    EnvironmentProviders,
    Provider,
    inject,
} from '@angular/core';
import { authInterceptor } from '../auth.interceptor';
import { AuthService } from 'app/modules/user/domain/services/auth/auth.service';
export const provideAuth = (): Array<Provider | EnvironmentProviders> => {
    return [
        provideHttpClient(withInterceptors([authInterceptor])),
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(AuthService),
            multi: true,
        },
    ];
};