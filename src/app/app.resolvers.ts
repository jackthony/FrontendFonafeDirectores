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
import { MessagesService } from 'app/layout/common/messages/messages.service';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { QuickChatService } from 'app/layout/common/quick-chat/quick-chat.service';
import { ShortcutsService } from 'app/layout/common/shortcuts/shortcuts.service';
import { forkJoin } from 'rxjs';
/**
 * Resolver que carga los datos iniciales necesarios para el layout principal.
 * Utiliza forkJoin para ejecutar múltiples llamadas a servicios en paralelo.
 * 
 * @returns Un observable que emite un array con los datos de navegación, mensajes,
 *          notificaciones, chats y accesos directos.
 */
export const initialDataResolver = () => {
    const messagesService = inject(MessagesService);
    const navigationService = inject(NavigationService);
    const notificationsService = inject(NotificationsService);
    const quickChatService = inject(QuickChatService);
    const shortcutsService = inject(ShortcutsService);
    return forkJoin([
        navigationService.get(),
        messagesService.getAll(),
        notificationsService.getAll(),
        quickChatService.getChats(),
        shortcutsService.getAll(),
    ]);
};