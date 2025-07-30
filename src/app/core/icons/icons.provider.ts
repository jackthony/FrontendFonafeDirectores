/*******************************************************************************************************
 * Nombre del archivo:  icons.provider.ts
 * Descripción:          Proveedor para inicializar el servicio de iconos en la aplicación Angular. 
 *                       Este proveedor se asegura de que el servicio `IconsService` se cargue al inicio
 *                       de la aplicación, registrando los iconos SVG necesarios para ser utilizados en 
 *                       los componentes.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Se añadió el `IconsService` como parte de la inicialización en la aplicación.
 *******************************************************************************************************/
import {
    ENVIRONMENT_INITIALIZER,
    EnvironmentProviders,
    inject,
    Provider,
} from '@angular/core';
import { IconsService } from 'app/core/icons/icons.service';
export const provideIcons = (): Array<Provider | EnvironmentProviders> => {
    return [
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(IconsService),
            multi: true,
        },
    ];
};
