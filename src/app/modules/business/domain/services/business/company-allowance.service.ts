/*******************************************************************************************************
 * Nombre del archivo:  company-allowance.service.ts
 * Descripción:          Servicio encargado de gestionar las operaciones relacionadas con las asignaciones 
 *                       de empresa, específicamente obteniendo información de asignaciones por RUC 
 *                       (Registro Único de Contribuyentes) y posición. Este servicio utiliza una fábrica 
 *                       (`CompanyAllowanceFactory`) para obtener una instancia del repositorio que implementa 
 *                       la interfaz `CompanyAllowanceInterface`, y se encarga de interactuar con los datos 
 *                       de asignaciones de empresa.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del servicio para gestionar asignaciones de empresa.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyAllowanceInterface } from '../../../application/repositories/business/company-allowance.interface';
import { CompanyAllowanceFactory } from '../../../infrastructure/business/factory/company-allowance.factory';
import { ResponseEntity } from '@models/response.entity';
import { CompanyAllowanceEntity } from '../../entities/business/companyAllowance.entity';
@Injectable({
    providedIn: 'root',
})
export class CompanyAllowanceService {
    private _companyAllowanceInterface: CompanyAllowanceInterface;
    constructor(private _companyAllowanceFactory : CompanyAllowanceFactory){ 
        this._companyAllowanceInterface = this._companyAllowanceFactory.injectRepository(); 
    }
    getByRuc(sRuc: string, position: number): Observable<ResponseEntity<CompanyAllowanceEntity>> {
        return this._companyAllowanceInterface.getByRuc(sRuc, position);
    }
}