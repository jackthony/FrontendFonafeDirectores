/*******************************************************************************************************
 * Nombre del archivo:  position.repository.ts
 * Descripción:          Implementación del repositorio para la entidad Cargo. Encapsula las operaciones
 *                       de comunicación con la API REST, incluyendo listados, paginación, creación,
 *                       actualización y eliminación lógica de cargos. Cumple con la interfaz definida 
 *                       en PositionInterface, permitiendo desacoplamiento y pruebas.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación inicial del repositorio de cargos.
 *******************************************************************************************************/
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { PositionInterface } from '../../application/repositories/position.interface';
import { PositionEntity } from '../../domain/entities/position.entity';
@Injectable({
    providedIn: 'root',
})
export class PositionRepository implements PositionInterface {  
    private url = `${environment.apiUrlBase}/Cargo`; // URL base para los endpoints relacionados con cargos
    private _http = inject(HttpClient); // Cliente HTTP para realizar las solicitudes
    /**
     * Obtiene todos los cargos disponibles sin aplicar paginación.
     * @returns Observable con la lista completa de cargos.
     */
    getAll(): Observable<ResponseEntity<PositionEntity>> {
        return this._http.get<ResponseEntity<PositionEntity>>(`${this.url}/listar`);
    }
    /**
     * Obtiene una lista paginada de cargos, con filtros opcionales por nombre y estado.
     * @param param Nombre del cargo (filtro de búsqueda).
     * @param pageIndex Página actual solicitada.
     * @param pageSize Número de elementos por página.
     * @param filterState Estado del cargo: true (activo), false (inactivo), null (todos).
     * @returns Observable con la lista paginada de cargos.
     */
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<PositionEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('Nombre', param)
        }
        if(filterState !== null ) params = params.append('Estado', filterState);
        return this._http.get<ResponseEntity<PositionEntity>>(`${this.url}/listar-paginado`, { params });
    }
    /**
     * Crea un nuevo cargo en el sistema.
     * @param object Objeto PositionEntity con los datos del nuevo cargo.
     * @returns Observable con el ID generado del nuevo registro.
     */
    create(object: PositionEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }
    /**
     * Actualiza un cargo existente con los datos proporcionados.
     * @param object Objeto PositionEntity con datos modificados.
     * @returns Observable indicando si la operación fue exitosa.
     */

    update(object: PositionEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }
    /**
     * Realiza la eliminación lógica de un cargo.
     * @param object Objeto PositionEntity que contiene la clave primaria del cargo a eliminar.
     * @returns Observable indicando si la operación fue exitosa.
     */
    delete(object: PositionEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/eliminar`, object);
    }
    
}
