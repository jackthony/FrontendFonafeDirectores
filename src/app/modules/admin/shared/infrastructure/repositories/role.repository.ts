/*******************************************************************************************************
 * Nombre del archivo:  role.repository.ts
 * Descripción:          Implementación del repositorio para la entidad Rol. Gestiona la comunicación 
 *                       con la API REST para realizar operaciones de listado, paginación, registro, 
 *                       actualización y eliminación lógica de roles.
 *                       Cumple con el contrato definido por la interfaz RoleInterface.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación inicial del repositorio de roles.
 *******************************************************************************************************/
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { RoleInterface } from '../../application/repositories/role.interface';
import { RoleEntity } from '../../domain/entities/role.entity';
import { RolePermissionsInsert } from '../../domain/entities/role-permission-insert.entity';
@Injectable({
    providedIn: 'root',
})
export class RoleRepository implements RoleInterface {
    private url = `${environment.apiUrlBase}/Rol`;
    private _http = inject(HttpClient);
    /**
     * Obtiene todos los roles sin paginación.
     * @returns Observable con la lista de roles envuelta en un ResponseEntity.
     */
    getAll(): Observable<ResponseEntity<RoleEntity>> {
        return this._http.get<ResponseEntity<RoleEntity>>(`${this.url}/listar`);
    }
    /**
     * Obtiene roles paginados, con filtros opcionales por nombre y estado.
     * @param param Nombre del rol para filtrar (opcional).
     * @param pageIndex Índice de la página a obtener.
     * @param pageSize Tamaño de la página (número de registros por página).
     * @param filterState Estado del rol (activo/inactivo) para filtrar.
     * @returns Observable con los roles paginados envueltos en un ResponseEntity.
     */
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<RoleEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('Nombre', param)
        }
        if(filterState !== null ) params = params.append('Estado', filterState);
        return this._http.get<ResponseEntity<RoleEntity>>(`${this.url}/listar-paginado`, { params });
    }
    /**
     * Crea un nuevo rol.
     * @param object Objeto de rol a crear.
     * @returns Observable con el ID del nuevo rol envuelto en un ResponseEntity.
     */
    create(object: RoleEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }
    /**
     * Actualiza un rol existente.
     * @param object Objeto de rol actualizado.
     * @returns Observable con la respuesta del backend (true si fue exitoso).
     */
    update(object: RoleEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }
    /**
     * Elimina lógicamente un rol.
     * @param object Objeto de rol a eliminar.
     * @returns Observable con la respuesta del backend (true si fue exitoso).
     */
    delete(object: RoleEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/eliminar`, object);
    }
    /**
     * Registra los permisos a un rol.
     * @param object Objeto a insertar.
     * @returns Observable con la respuesta del backend (true si fue exitoso).
     */
    insertPermissionRole(object: RolePermissionsInsert): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/crearPermisosRol`, object);
    }  
}