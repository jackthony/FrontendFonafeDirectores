/*******************************************************************************************************
 * Nombre del archivo:  industry.repository.ts
 * Descripción:          Repositorio para la entidad Rubro (Industry). Implementa la interfaz 
 *                       IndustryInterface, centralizando todas las operaciones de acceso remoto 
 *                       a la API, como listado general, paginado, creación, actualización y eliminación.
 * 
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación inicial del repositorio de rubros.
 *******************************************************************************************************/
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IndustryInterface } from '../../application/repositories/industry.interface';
import { IndustryEntity } from '../../domain/entities/industry.entity';
import { ResponseEntity } from '@models/response.entity';
@Injectable({
    providedIn: 'root',
})
export class IndustryRepository implements IndustryInterface {  
    private url = `${environment.apiUrlBase}/Rubro`; // URL base del controlador Rubro en la API
    private _http = inject(HttpClient); // Cliente HTTP inyectado para realizar las peticiones a la API
    /**
     * Obtiene todos los registros de rubros disponibles sin paginación ni filtros.
     * @returns Observable con todos los rubros del sistema.
     */
    getAll(): Observable<ResponseEntity<IndustryEntity>> {
        return this._http.get<ResponseEntity<IndustryEntity>>(`${this.url}/listar`);
    }
    /**
     * Obtiene una lista paginada de rubros, aplicando filtro por nombre y estado si se especifican.
     * @param param Filtro opcional por nombre del rubro.
     * @param pageIndex Índice de la página actual.
     * @param pageSize Número de elementos por página.
     * @param filterState Estado del rubro: true = activo, false = inactivo, null = todos.
     * @returns Observable con los rubros paginados y filtrados.
     */
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<IndustryEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('Nombre', param)
        }
        if(filterState !== null ) params = params.append('Estado', filterState);
        return this._http.get<ResponseEntity<IndustryEntity>>(`${this.url}/listar-paginado`, { params });
    }
    /**
     * Registra un nuevo rubro en el sistema.
     * @param object Objeto IndustryEntity con los datos del nuevo rubro.
     * @returns Observable con el ID generado del nuevo rubro.
     */
    create(object: IndustryEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }
    /**
     * Actualiza los datos de un rubro existente.
     * @param object Objeto IndustryEntity con la información actualizada.
     * @returns Observable que indica si la operación fue exitosa.
     */
    update(object: IndustryEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }
    /**
     * Elimina lógicamente un rubro (cambio de estado a inactivo).
     * @param object Objeto IndustryEntity con el ID del rubro a eliminar.
     * @returns Observable que indica si la operación fue exitosa.
     */
    delete(object: IndustryEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/eliminar`, object);
    }
    
}