/*******************************************************************************************************
 * Nombre del archivo:  authorization.service.ts
 * Descripción:          Servicio que administra los permisos del usuario para autorizar acciones por módulo.
 *                      Utiliza BehaviorSubject para almacenamiento reactivo de permisos.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    - Adaptación del modelo de permisos a estructura con permisos anidados por módulo.
 *                       - Método canPerform actualizado para trabajar con lista de objetos tipo Permission.
 *******************************************************************************************************/
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
        const permission = perms.find((p) => p.nombreModulo === module);
        return permission ? permission.permisos.some(a => a.nombrePermiso === action) : false;
    }
}