import { Injectable } from '@angular/core';
import { Permission } from '@models/permission.interface';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class AuthorizationService {
    /**
     * Servicio de autorización que maneja los permisos del usuario.
     * Utiliza un BehaviorSubject para almacenar y gestionar los permisos del usuario.
     */
    private userPermissions = new BehaviorSubject<Permission[]>([
    ]);
    /**
     * Método para establecer los permisos del usuario.
     * @param perms Lista de permisos a ser establecidos en el servicio.
     */
    setPermissions(perms: Permission[]) {
        this.userPermissions.next(perms);
    }
    /**
     * Método para obtener los permisos actuales del usuario.
     * @returns La lista de permisos del usuario.
     */
    getPermission() {
        return this.userPermissions.value;
    }
    /**
     * Método para verificar si el usuario tiene permiso para realizar una acción en un módulo.
     * @param module El nombre del módulo donde se desea realizar la acción.
     * @param action La acción que se desea realizar en el módulo.
     * @returns Devuelve true si el usuario tiene permiso para realizar la acción, de lo contrario, devuelve false.
     */
    canPerform(module: string, action: string): boolean {
        const perms = this.userPermissions.value;
        const permission = perms.find((p) => p.module === module);
        return permission ? permission.actions.includes(action) : false;
    }
}