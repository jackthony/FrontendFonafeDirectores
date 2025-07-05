/*******************************************************************************************************
 * Nombre del archivo:  role.service.ts
 * Descripción:          Servicio encargado de gestionar operaciones relacionadas a los Roles del sistema.
 *                       Utiliza un patrón de factoría para inyectar dinámicamente el repositorio correspondiente.
 * 
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Corrección del nombre de la propiedad inyectada y documentación formal.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoleFactory } from '../../../infrastructure/maintenance/factory/role.factory';
import { ResponseEntity } from '@models/response.entity';
import { RoleEntity } from '../../entities/maintenance/role.entity';
import { RoleInterface } from 'app/modules/user/application/repositories/maintenance/role.interface';
import { RolePermissionsInsert } from '../../entities/maintenance/role-permission-insert.entity';
@Injectable({
    providedIn: 'root',
})
export class RoleService {
    private _roleInterface: RoleInterface;
    /**
     * Constructor que inyecta dinámicamente el repositorio mediante la factoría RoleFactory.
     * @param _roleFactory Instancia de la factoría que provee la implementación de RoleInterface.
     */
    constructor(private _industryFactory : RoleFactory){ 
        this._roleInterface = this._industryFactory.injectRepository(); //Inyección del Factory
    }
    /**
     * Obtiene todos los roles disponibles en el sistema.
     * @returns Observable con la respuesta que contiene todos los roles.
     */
    getAll(): Observable<ResponseEntity<RoleEntity>> {
        return this._roleInterface.getAll();
    }
    /**
     * Obtiene los roles de forma paginada con filtros.
     * @param param Texto de búsqueda.
     * @param pageIndex Número de página.
     * @param pageSize Tamaño de página.
     * @param filterState Estado (activo/inactivo/null).
     * @returns Observable con roles filtrados y paginados.
     */
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<RoleEntity>> {
        return this._roleInterface.getByPagination(param, pageIndex, pageSize, filterState);
    }
    /**
     * Registra un nuevo rol en el sistema.
     * @param object Entidad RoleEntity con los datos del nuevo rol.
     * @returns Observable con el ID generado.
     */
    create(object: RoleEntity): Observable<ResponseEntity<number>> {
        return this._roleInterface.create(object);
    }
    /**
     * Actualiza la información de un rol existente.
     * @param object Entidad RoleEntity con los datos modificados.
     * @returns Observable indicando el resultado de la operación.
     */
    update(object: RoleEntity): Observable<ResponseEntity<boolean>> {
        return this._roleInterface.update(object);
    }
    /**
     * Elimina un rol existente.
     * @param object Entidad RoleEntity con los datos a eliminar.
     * @returns Observable con el resultado de la eliminación.
     */
    delete(object: RoleEntity): Observable<ResponseEntity<boolean>> {
        return this._roleInterface.delete(object);
    }
    /**
     * Registra los permisos a un rol.
     * @param object Objeto a insertar.
     * @returns Observable con la respuesta del backend (true si fue exitoso).
     */
    insertPermissionRole(object: RolePermissionsInsert): Observable<ResponseEntity<boolean>> {
        return this._roleInterface.insertPermissionRole(object);
    }
}
