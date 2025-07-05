/*******************************************************************************************************
 * Nombre del archivo:  sector.repository.ts
 * Descripción:          Implementación del repositorio para la entidad Sector. Proporciona métodos 
 *                       para realizar operaciones de listado, paginación, creación, actualización y 
 *                       eliminación lógica, utilizando la API REST configurada en el entorno.
 *                       Este repositorio cumple con el contrato definido por SectorInterface, 
 *                       siguiendo los principios de arquitectura limpia y desacoplamiento.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación completa del repositorio de sectores.
 *******************************************************************************************************/
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SectorEntity } from '../../../domain/entities/maintenance/sector.entity';
import { ResponseEntity } from '@models/response.entity';
import { SectorInterface } from '../../../application/repositories/maintenance/sector.interface';
@Injectable({
    providedIn: 'root',
})
export class SectorRepository implements SectorInterface {  
    private url = `${environment.apiUrlBase}/Sector`; // URL base del API para la entidad Sector
    private _http = inject(HttpClient); // Inyección del servicio HttpClient para realizar peticiones HTTP
    /**
     * Obtiene todos los registros de sectores sin paginación.
     * @returns Observable con la lista de entidades envuelta en un ResponseEntity.
     */
    getAll(): Observable<ResponseEntity<SectorEntity>> {
        return this._http.get<ResponseEntity<SectorEntity>>(`${this.url}/listar`);
    }
    /**
     * Obtiene sectores paginados, con filtros opcionales por nombre y estado.
     * @param param Nombre para búsqueda (opcional).
     * @param pageIndex Número de página actual.
     * @param pageSize Cantidad de registros por página.
     * @param filterState Estado (true = activo, false = inactivo, null = ambos).
     * @returns Observable con los datos paginados.
     */
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<SectorEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('Nombre', param)
        }
        if(filterState !== null ) params = params.append('Estado', filterState);
        return this._http.get<ResponseEntity<SectorEntity>>(`${this.url}/listar-paginado`, { params });
    }
    /**
     * Crea un nuevo sector.
     * @param object Objeto de sector a crear.
     * @returns Observable con el ID del nuevo sector envuelto en un ResponseEntity.
     */
    create(object: SectorEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }
    /**
     * Actualiza un sector existente.
     * @param object Objeto de sector actualizado.
     * @returns Observable con la respuesta del backend (true si fue exitoso).
     */
    update(object: SectorEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }
    /**
     * Elimina lógicamente un sector.
     * @param object Objeto de sector a eliminar.
     * @returns Observable con la respuesta del backend (true si fue exitoso).
     */
    delete(object: SectorEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/eliminar`, object);
    }
    
}