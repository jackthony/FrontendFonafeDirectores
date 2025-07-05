/*******************************************************************************************************
 * Nombre del archivo: director.repository.ts
 * Descripción:         Implementación del repositorio que interactúa con el endpoint `/Director`.
 *                      Encapsula las operaciones para obtener, crear y actualizar información de directores
 *                      asociada a una empresa.
 * Autor:               Daniel Alva
 * Fecha de creación:   23/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 *******************************************************************************************************/
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DirectorInterface } from '../../application/repositories/director.interface';
import { DirectorEntity } from '../../domain/entities/director.entity';
import { ResponseEntity } from '@models/response.entity';
@Injectable({
    providedIn: 'root',
})
export class DirectorRepository implements DirectorInterface {
    private url = `${environment.apiUrlBase}/Director`; // URL base del módulo Director, construida dinámicamente desde environment
    private _http = inject(HttpClient); // Inyección del HttpClient para operaciones HTTP
    /**
     * Obtiene los directores paginados por empresa
     * @param nIdEmpresa - ID de la empresa
     * @param pageIndex - Índice de página actual (1-based)
     * @param pageSize - Cantidad de registros por página
     * @returns Observable con la entidad paginada de directores
     */
    getByPagination(nIdEmpresa: number, pageIndex: number, pageSize: number): Observable<ResponseEntity<DirectorEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize).append('nIdEmpresa', nIdEmpresa);
        return this._http.get<ResponseEntity<DirectorEntity>>(`${this.url}/listar-paginado`, { params });
    }
        /**
     * Crea un nuevo registro de director
     * @param object - Entidad de tipo DirectorEntity
     * @returns Observable con el ID generado
     */
    create(object: DirectorEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }
        /**
     * Actualiza un registro existente de director
     * @param object - Entidad de tipo DirectorEntity a actualizar
     * @returns Observable con resultado booleano de la operación
     */
    update(object: DirectorEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }
}
