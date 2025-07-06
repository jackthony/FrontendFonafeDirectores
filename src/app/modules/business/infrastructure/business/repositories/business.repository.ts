/*******************************************************************************************************
 * Nombre del archivo: business.repository.ts
 * Descripción:         Repositorio encargado de interactuar con los endpoints del recurso Empresa.
 *                      Implementa la interfaz BusinessInterface y encapsula todas las operaciones 
 *                      relacionadas con la gestión de empresas.
 * Autor:               Daniel Alva
 * Fecha de creación:   23/06/2025
 * Última modificación: 23/06/2025
 *******************************************************************************************************/
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BusinessInterface } from '../../../application/repositories/business/business.interface';
import { ResponseEntity } from '@models/response.entity';
import { BusinessEntity } from '../../../domain/entities/business/business.entity';

@Injectable({
    providedIn: 'root',
})
export class BusinessRepository implements BusinessInterface {
    private url = `${environment.apiUrlBase}/Empresa`;
    private _http = inject(HttpClient);
    /**
     * Obtiene la lista de empresas paginada y opcionalmente filtrada
     * @param param - Razon Social (filtro de búsqueda)
     * @param pageIndex - Página actual
     * @param pageSize - Tamaño de la página
     * @param filterState - Estado lógico (true/false) o null para ambos
     */
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<BusinessEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('sRazonSocial', param)
        }
        if(filterState !== null) params = params.append('bEstado', filterState);
        return this._http.get<ResponseEntity<BusinessEntity>>(`${this.url}/listar-paginado`, { params });
    }
    /**
     * Obtiene una empresa por su ID
     * @param nIdEmpresa - Identificador de la empresa
     */
    getById(nIdEmpresa: number): Observable<ResponseEntity<BusinessEntity>> {
        return this._http.get<ResponseEntity<BusinessEntity>>(`${this.url}/${nIdEmpresa}`);
    }
    /**
     * Crea una nueva empresa
     * @param object - Entidad empresa a registrar
     */
    create(object: BusinessEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }
    /**
     * Actualiza una empresa existente
     * @param object - Entidad empresa con datos modificados
     */

    update(object: BusinessEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }
    /**
     * Elimina lógicamente una empresa
     * @param object - Entidad a eliminar (puede usar soft-delete según backend)
     */
    delete(object: BusinessEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/eliminar`, object);
    }
    /**
     * Exporta la lista de empresas en formato Excel
     * @returns - Archivo binario (ArrayBuffer)
     */
    exportExcelEnterprise(): Observable<ArrayBuffer> {
        return this._http.get(`${this.url}/ExportarExcel`, {
            responseType: 'arraybuffer'
        });
    }
    /**
     * Exporta la lista de empresas en formato PDF
     * @returns - Archivo binario (ArrayBuffer)
     */
    exportPdfEnterprise(): Observable<ArrayBuffer> {
        return this._http.get(`${this.url}/ExportarPdf`, {
            responseType: 'arraybuffer'
        });
    }
    
}
