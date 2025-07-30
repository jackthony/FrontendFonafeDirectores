/*******************************************************************************************************
 * Nombre del archivo: ubigeo.repository.ts
 * Descripción:         Implementación concreta de `UbigeoInterface`. Este repositorio se encarga
 *                      de gestionar la comunicación HTTP con el backend para recuperar datos de 
 *                      departamentos, provincias y distritos del país.
 *                      Utiliza la librería HttpClient y respeta la arquitectura por capas.
 * Autor:               Daniel Alva
 * Fecha de creación:   23/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 *******************************************************************************************************/
import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { UbigeoInterface } from "../../../application/repositories/business/ubigeo.interface";
import { Observable } from "rxjs";
import { ProvinceEntity } from "../../../domain/entities/business/province.entity";
import { ResponseEntity } from "@models/response.entity";
import { DepartmentEntity } from "../../../domain/entities/business/departament.entity";
import { DistrictEntity } from "../../../domain/entities/business/district.entity";

@Injectable({
    providedIn: 'root',
})
export class UbigeoRepository implements UbigeoInterface {
    private url = `${environment.apiUrlBase}/Ubigeo`; // Base URL para el módulo Ubigeo
    private _http = inject(HttpClient); // Inyección del servicio HttpClient
        /**
     * Obtiene el listado de departamentos desde el backend
     * Endpoint: GET /Ubigeo/listarDepartamentos
     */
    getDepartments(): Observable<ResponseEntity<DepartmentEntity>> {
        return this._http.get<ResponseEntity<DepartmentEntity>>(`${this.url}/listarDepartamentos`);
    }
        /**
     * Obtiene el listado de provincias a partir del código de departamento
     * @param sDepartmentCode - Código del departamento
     * Endpoint: GET /Ubigeo/listarProvincias?sCode=XXX
     */
    getProvinces(sDepartmentCode: string): Observable<ResponseEntity<ProvinceEntity>> {
        const params = new HttpParams().append('sCode', sDepartmentCode);
        return this._http.get<ResponseEntity<ProvinceEntity>>(`${this.url}/listarProvincias`, { params } );
    }
        /**
     * Obtiene el listado de distritos a partir del código de provincia
     * @param sProvinceCode - Código de la provincia
     * Endpoint: GET /Ubigeo/listarDistritos?sCode=XXX
     */
    getDistricts(sProvinceCode: string): Observable<ResponseEntity<DistrictEntity>> {
        const params = new HttpParams().append('sCode', sProvinceCode);
        return this._http.get<ResponseEntity<DistrictEntity>>(`${this.url}/listarDistritos`, { params } );
    }
    
}
