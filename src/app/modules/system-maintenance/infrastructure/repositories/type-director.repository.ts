/*******************************************************************************************************
 * Nombre del archivo:  type-director.repository.ts
 * Descripción:          Implementación del repositorio para la entidad TipoDirector. Expone operaciones 
 *                       CRUD y de paginación mediante el uso de HttpClient, comunicándose con la API REST.
 *                       Cumple con el contrato definido en TypeDirectorInterface y mantiene el principio
 *                       de inversión de dependencias según la Clean Architecture.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación completa del repositorio de tipo director.
 *******************************************************************************************************/
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TypeDirectorInterface } from '../../application/repositories/type-director.interface';
import { TypeDirectorEntity } from '../../domain/entities/type-director.entity';
import { ResponseEntity } from '@models/response.entity';
@Injectable({
    providedIn: 'root',
})
export class TypeDirectorRepository implements TypeDirectorInterface {  
    private url = `${environment.apiUrlBase}/TipoDirector`; // URL base del API para la entidad TipoDirector
    private _http = inject(HttpClient); // Inyección del servicio HttpClient para realizar peticiones HTTP
    /**
     * Obtiene todos los registros de tipo director sin paginación.
     * @returns Observable con la lista de entidades envuelta en un ResponseEntity.
     */
    getAll(): Observable<ResponseEntity<TypeDirectorEntity>> {
        return this._http.get<ResponseEntity<TypeDirectorEntity>>(`${this.url}/listar`);
    }
    /**
     * Obtiene registros de tipo director paginados, filtrados por nombre y estado.
     * @param param Nombre del tipo director para filtrar.
     * @param pageIndex Índice de la página a obtener.
     * @param pageSize Tamaño de la página (número de registros por página).
     * @param filterState Estado del tipo director (activo/inactivo) para filtrar.
     * @returns Observable con los registros paginados envueltos en un ResponseEntity.
     */
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<TypeDirectorEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('Nombre', param)
        }
        if(filterState !== null ) params = params.append('Estado', filterState);
        return this._http.get<ResponseEntity<TypeDirectorEntity>>(`${this.url}/listar-paginado`, { params });
    }
    /**
     * Obtiene un registro de tipo director por su ID.
     * @param id Identificador del tipo director a buscar.
     * @returns Observable con la entidad encontrada envuelta en un ResponseEntity.
     */
    create(object: TypeDirectorEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }
    /**
     * Actualiza un tipo director existente.
     * @param object Objeto actualizado.
     * @returns Observable con la respuesta del backend (true si fue exitoso).
     */
    update(object: TypeDirectorEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }
    /**
     * Elimina lógicamente un tipo director.
     * @param object Objeto a eliminar.
     * @returns Observable con la respuesta del backend (true si fue exitoso).
     */
    delete(object: TypeDirectorEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/eliminar`, object);
    }
    
}