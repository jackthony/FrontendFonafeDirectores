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
import { ModuleInterface } from '../../application/repositories/module.interface';
import { ModuleEntity } from '../../domain/entities/module.entity';
@Injectable({
    providedIn: 'root',
})
export class ModuleRepository implements ModuleInterface {
    
    private url = `${environment.apiUrlBase}/Modulo`;
    private _http = inject(HttpClient);
    /**
     * Obtiene todos los modulos y acciones.
     * @param rolId Código del rol para filtrar.
     * @returns Observable con la lista de modulos envuelta en un ResponseEntity.
     */
    getAllActionsModules(rolId: number): Observable<ResponseEntity<ModuleEntity>> {
        let params = new HttpParams().append('rolId', rolId);
        return this._http.get<ResponseEntity<ModuleEntity>>(`${this.url}/listarModulosAcciones`, { params });
    }  
    
}