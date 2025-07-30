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
import { ConstantInterface } from "../../../application/repositories/business/constant.interface";
import { ResponseEntity } from "@models/response.entity";
import { ConstantEntity } from "../../../domain/entities/business/constant.entity";
@Injectable({
    providedIn: 'root',
})
export class ConstantRepository implements ConstantInterface {
    private url = `${environment.apiUrlBase}/Constante`;// URL base para acceder al controlador Constante
    private _http = inject(HttpClient); // Cliente HTTP inyectado para consumir los servicios REST
    /**
     * Obtiene todas las constantes asociadas a un código de agrupamiento.
     * Este método se utiliza para obtener catálogos como tipo de documento,
     * tipo de dieta, tipo de cargo, etc.
     * 
     * @param code Código de agrupamiento (nConCodigo) que identifica el catálogo.
     * @returns Observable con la respuesta que contiene la lista de constantes.
     */
    getAll(code: number): Observable<ResponseEntity<ConstantEntity>> {
        let params = new HttpParams().append('nConCodigo', code);
        return this._http.get<ResponseEntity<ConstantEntity>>(`${this.url}/listar`, { params });
    }
    
}