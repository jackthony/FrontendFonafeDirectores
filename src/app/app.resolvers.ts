import { inject } from '@angular/core';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { MessagesService } from 'app/layout/common/messages/messages.service';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { QuickChatService } from 'app/layout/common/quick-chat/quick-chat.service';
import { ShortcutsService } from 'app/layout/common/shortcuts/shortcuts.service';
import { forkJoin } from 'rxjs';

// Define un resolver que obtiene los datos iniciales de varios servicios
export const initialDataResolver = () => {
    // Inyecta los servicios necesarios
    const messagesService = inject(MessagesService); // Servicio para obtener los mensajes
    const navigationService = inject(NavigationService); // Servicio para obtener los datos de navegación
    const notificationsService = inject(NotificationsService); // Servicio para obtener las notificaciones
    const quickChatService = inject(QuickChatService); // Servicio para obtener los chats rápidos
    const shortcutsService = inject(ShortcutsService); // Servicio para obtener los accesos directos

    // Usando forkJoin de RxJS para realizar múltiples llamadas a APIs de manera simultánea
    return forkJoin([ // Ejecuta todos los observables en paralelo
        navigationService.get(), // Llama al método get de NavigationService
        messagesService.getAll(), // Llama al método getAll de MessagesService para obtener todos los mensajes
        notificationsService.getAll(), // Llama al método getAll de NotificationsService para obtener todas las notificaciones
        quickChatService.getChats(), // Llama al método getChats de QuickChatService para obtener los chats rápidos
        shortcutsService.getAll(), // Llama al método getAll de ShortcutsService para obtener todos los accesos directos
    ]);
};