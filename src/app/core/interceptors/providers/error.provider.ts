/*******************************************************************************************************
 * Nombre del archivo:  error-provider.ts
 * Descripción:          Proveedor de la configuración del cliente HTTP que agrega el interceptor
 *                       de manejo de errores a las solicitudes HTTP. El interceptor captura errores
 *                       de las respuestas y los maneja según las necesidades de la aplicación.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Se añadió el interceptor de errores para manejar las respuestas con fallos.
 *******************************************************************************************************/
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    EnvironmentProviders,
    Provider,
    inject,
} from '@angular/core';
import { errorInterceptor } from '../error.interceptor';
export const provideError = (): Array<Provider | EnvironmentProviders> => {
    return [
        provideHttpClient(withInterceptors([errorInterceptor])),
    ];
};