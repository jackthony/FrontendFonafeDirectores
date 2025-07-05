/*******************************************************************************************************
 * Nombre del archivo:  ministry.repository.ts
 * Descripción:          Repositorio para la entidad Ministerio. Implementa la interfaz MinistryInterface 
 *                       y encapsula la lógica de comunicación con la API para las operaciones CRUD, 
 *                       incluyendo métodos de listado general, paginado, creación, actualización y 
 *                       eliminación lógica.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación inicial del repositorio de ministerios.
 *******************************************************************************************************/
import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { MinistryInterface } from "../../../application/repositories/maintenance/ministry.interface";
import { ResponseEntity } from "@models/response.entity";
import { MinistryEntity } from "../../../domain/entities/maintenance/ministry.entity";
@Injectable({
    providedIn: 'root',
})
export class MinistryRepository implements MinistryInterface {
    private url = `${environment.apiUrlBase}/Ministerio`; // URL base del endpoint para operaciones relacionadas a ministerios
    private _http = inject(HttpClient); // Cliente HTTP para llamadas REST
    /**
     * Obtiene todos los ministerios sin aplicar filtros ni paginación.
     * @returns Observable con todos los registros de ministerios.
     */
    getAll(): Observable<ResponseEntity<MinistryEntity>> {
        return this._http.get<ResponseEntity<MinistryEntity>>(`${this.url}/listar`);
    }
    /**
     * Obtiene una lista paginada de ministerios con filtros opcionales por nombre y estado.
     * @param param Filtro por nombre del ministerio (opcional).
     * @param pageIndex Índice de página solicitado.
     * @param pageSize Número de elementos por página.
     * @param filterState Estado de filtro (true: activo, false: inactivo, null: ambos).
     * @returns Observable con la lista paginada de ministerios.
     */
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<MinistryEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('Nombre', param)
        }
        if(filterState !== null ) params = params.append('Estado', filterState);
        return this._http.get<ResponseEntity<MinistryEntity>>(`${this.url}/listar-paginado`, { params });
    }
    /**
     * Crea un nuevo registro de ministerio.
     * @param object Objeto MinistryEntity con los datos del nuevo ministerio.
     * @returns Observable con el ID del nuevo ministerio registrado.
     */
    create(object: MinistryEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }
    /**
     * Actualiza un ministerio existente.
     * @param object Objeto MinistryEntity con los datos actualizados del ministerio.
     * @returns Observable que indica si la operación fue exitosa.
     */
    update(object: MinistryEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }
    /**
     * Elimina lógicamente un ministerio del sistema.
     * @param object Objeto MinistryEntity que contiene el ID del ministerio a eliminar.
     * @returns Observable que indica si la operación fue exitosa.
     */
    delete(object: MinistryEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/eliminar`, object);
    }
}