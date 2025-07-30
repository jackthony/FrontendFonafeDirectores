/*******************************************************************************************************
 * Nombre del archivo:  ubigeo.service.ts
 * Descripción:          Servicio encargado de gestionar los datos geográficos (Ubigeo) relacionados con 
 *                       departamentos, provincias y distritos. Este servicio interactúa con un repositorio 
 *                       que implementa la interfaz `UbigeoInterface` para obtener la información de ubicaciones 
 *                       de manera estructurada.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del servicio de Ubigeo con acceso a repositorios.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UbigeoInterface } from '../../../application/repositories/business/ubigeo.interface';
import { UbigeoFactory } from '../../../infrastructure/business/factory/ubigeo.factory';
import { ProvinceEntity } from '../../entities/business/province.entity';
import { ResponseEntity } from '@models/response.entity';
import { DistrictEntity } from '../../entities/business/district.entity';
import { DepartmentEntity } from '../../entities/business/departament.entity';
@Injectable({
    providedIn: 'root',
})
export class UbigeoService {
    private _ubigeoInterface: UbigeoInterface;
    constructor(private _ubigeoFactory : UbigeoFactory){ 
        this._ubigeoInterface = this._ubigeoFactory.injectRepository(); 
    }
    getDepartments(): Observable<ResponseEntity<DepartmentEntity>>{
        return this._ubigeoInterface.getDepartments();
    }
    getProvinces(sDepartmentCode: string): Observable<ResponseEntity<ProvinceEntity>>{
        return this._ubigeoInterface.getProvinces(sDepartmentCode);
    }
    getDistricts(sProvinceCode: string): Observable<ResponseEntity<DistrictEntity>>{
        return this._ubigeoInterface.getDistricts(sProvinceCode);
    }
}