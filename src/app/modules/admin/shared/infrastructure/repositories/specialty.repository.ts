/*******************************************************************************************************
 * Nombre del archivo:  specialty.repository.ts
 * Descripción:          Implementación del repositorio para la entidad Especialidad. Gestiona operaciones
 *                       CRUD y paginación, delegando la comunicación con la API REST correspondiente.
 *                       Cumple con el contrato definido por SpecialtyInterface, manteniendo el principio
 *                       de inversión de dependencias y promoviendo una arquitectura desacoplada.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación completa del repositorio de especialidades.
 *******************************************************************************************************/
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { SpecialtyInterface } from '../../application/repositories/specialty.interface';
import { SpecialtyEntity } from '../../domain/entities/specialty.entity';
@Injectable({
    providedIn: 'root',
})
export class SpecialtyRepository implements SpecialtyInterface {  
    private url = `${environment.apiUrlBase}/Especialidad`;
    private _http = inject(HttpClient);
    /**
     * Obtiene todos los registros de especialidades sin paginación.
     * @returns Observable con la lista de entidades envuelta en un ResponseEntity.
     */
    getAll(): Observable<ResponseEntity<SpecialtyEntity>> {
        return this._http.get<ResponseEntity<SpecialtyEntity>>(`${this.url}/listar`);
    }
    /**
     * Obtiene especialidades paginadas con filtros opcionales por nombre y estado.
     * @param param Nombre para búsqueda (opcional).
     * @param pageIndex Número de página actual.
     * @param pageSize Cantidad de registros por página.
     * @param filterState Estado (true = activo, false = inactivo, null = ambos).
     * @returns Observable con los datos paginados.
     */
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<SpecialtyEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('Nombre', param)
        }
        if(filterState !== null ) params = params.append('Estado', filterState);
        return this._http.get<ResponseEntity<SpecialtyEntity>>(`${this.url}/listar-paginado`, { params });
    }
    /**
     * Crea una nueva especialidad.
     * @param object Objeto de especialidad a crear.
     * @returns Observable con el ID de la nueva especialidad envuelto en un ResponseEntity.
     */
    create(object: SpecialtyEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }
    /**
     * Actualiza una especialidad existente.
     * @param object Objeto de especialidad actualizado.
     * @returns Observable con la respuesta del backend (true si fue exitoso).
     */
    update(object: SpecialtyEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }
    /**
     * Elimina una especialidad.
     * @param object Objeto de especialidad a eliminar.
     * @returns Observable con la respuesta del backend (true si fue exitoso).
     */
    delete(object: SpecialtyEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/eliminar`, object);
    }
    
}