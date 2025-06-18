import { Injectable } from '@angular/core';
import { Permission } from '@models/permission.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthorizationService {
    // BehaviorSubject que almacena la lista de permisos del usuario. Comienza vacío, pero se puede actualizar con los permisos.
    private userPermissions = new BehaviorSubject<Permission[]>([
        /* 
        { module: 'gestion-perfiles', actions: ['read', 'write'] },
        { module: 'gestion-empresas', actions: ['read'] }
        */
    ]);

    /**
     * Método para establecer los permisos del usuario.
     * @param perms Lista de permisos a ser establecidos en el servicio.
     */
    setPermissions(perms: Permission[]) {
        this.userPermissions.next(perms); // Actualiza los permisos del usuario en el BehaviorSubject
    }

    /**
     * Método para obtener los permisos actuales del usuario.
     * @returns La lista de permisos del usuario.
     */
    getPermission() {
        return this.userPermissions.value; // Retorna el valor actual de los permisos
    }

    /**
     * Método para verificar si el usuario tiene permiso para realizar una acción en un módulo.
     * @param module El nombre del módulo donde se desea realizar la acción.
     * @param action La acción que se desea realizar en el módulo.
     * @returns Devuelve true si el usuario tiene permiso para realizar la acción, de lo contrario, devuelve false.
     */
    canPerform(module: string, action: string): boolean {
        const perms = this.userPermissions.value; // Obtiene los permisos actuales
        const permission = perms.find((p) => p.module === module); // Busca si el módulo existe en los permisos
        return permission ? permission.actions.includes(action) : false; // Si el módulo se encuentra, verifica si la acción está permitida
    }
}