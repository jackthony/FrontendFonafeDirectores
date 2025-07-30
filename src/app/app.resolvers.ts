/*************************************************************************************
 * Nombre del archivo:  initial-data.resolver.ts
 * Descripción:         Función de resolución inicial que carga en paralelo los datos
 *                      esenciales para el layout principal: navegación, mensajes,
 *                      notificaciones, chats y accesos directos. Se ejecuta antes
 *                      de renderizar rutas protegidas por el layout principal.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 22/06/2025 por Daniel Alva
 * Cambios recientes:   Definición inicial del resolver `initialDataResolver` con forkJoin.
 *************************************************************************************/
import { inject } from '@angular/core';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { forkJoin } from 'rxjs';
/**
 * Resolver que carga los datos iniciales necesarios para el layout principal.
 * Utiliza forkJoin para ejecutar múltiples llamadas a servicios en paralelo.
 * 
 * @returns Un observable que emite un array con los datos de navegación, mensajes,
 *          notificaciones, chats y accesos directos.
 */
export const initialDataResolver = () => {
    const navigationService = inject(NavigationService);
    const notificationsService = inject(NotificationsService);
    return forkJoin([
        navigationService.get(),
        notificationsService.getAll(),
    ]);
};