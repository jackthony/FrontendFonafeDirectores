/*******************************************************************************************************
 * Nombre del archivo:  constant.repository.ts
 * Descripción:          Repositorio para la entidad Constante (Constant). Implementa la interfaz 
 *                       ConstantInterface, permitiendo la consulta de catálogos o constantes del sistema
 *                       a través de un código de agrupamiento (`nConCodigo`).
 * 
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación inicial del repositorio de constantes del sistema.
 *******************************************************************************************************/
import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable, of } from "rxjs";
import { ArchiveInterface } from "../../application/repositories/archive.interface";
@Injectable({
    providedIn: 'root',
})
export class ArchiveRepository implements ArchiveInterface {
    private url = `${environment.apiUrlBase}/Archivo`;// URL base para acceder al controlador Constante
    private _http = inject(HttpClient); // Cliente HTTP inyectado para consumir los servicios REST
    /**
     * Obtiene todas las constantes asociadas a un código de agrupamiento.
     * Este método se utiliza para obtener catálogos como tipo de documento,
     * tipo de dieta, tipo de cargo, etc.
     * 
     * @returns Observable con la respuesta que contiene la lista de archivos.
     */
    getReportExcelBussines(): Observable<ArrayBuffer> {
        const body = { sTipoArchivo: 1 }
        return this._http.post(`${this.url}/exportar`, body, {
            responseType: 'arraybuffer'
        });
    }
    getReportPdfBussines(): Observable<ArrayBuffer> {
        const body = { sTipoArchivo: 2 }
        return this._http.post(`${this.url}/exportar`, body, {
            responseType: 'arraybuffer'
        });
    }

}