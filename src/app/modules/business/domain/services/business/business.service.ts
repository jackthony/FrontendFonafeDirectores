/*******************************************************************************************************
 * Nombre del archivo:  business.service.ts
 * Descripción:          Servicio encargado de gestionar las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) 
 *                       relacionadas con los datos de las empresas. Este servicio interactúa con el repositorio 
 *                       que implementa la interfaz `BusinessInterface` y proporciona métodos para obtener 
 *                       empresas mediante paginación, obtener una empresa por su ID, crear, actualizar y eliminar 
 *                       registros de empresas.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del servicio para gestionar empresas.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BusinessInterface } from '../../../application/repositories/business/business.interface';
import { BusinessFactory } from '../../../infrastructure/business/factory/business.factory';
import { ResponseEntity } from '@models/response.entity';
import { BusinessEntity } from '../../entities/business/business.entity';
@Injectable({
    providedIn: 'root',
})
export class BusinessService {
    private _businessInterface: BusinessInterface;
    constructor(private _businessFactory : BusinessFactory){ 
        this._businessInterface = this._businessFactory.injectRepository();
    }
    getByPagination(nameEnterprise: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<BusinessEntity>> {
        return this._businessInterface.getByPagination(nameEnterprise, pageIndex, pageSize, filterState);
    }
    getById(nIdEmpresa: number): Observable<ResponseEntity<BusinessEntity>> {
        return this._businessInterface.getById(nIdEmpresa);
    }
    create(object: BusinessEntity): Observable<ResponseEntity<number>> {
        return this._businessInterface.create(object);
    }
    update(object: BusinessEntity): Observable<ResponseEntity<boolean>> {
        return this._businessInterface.update(object);
    }
    delete(object: BusinessEntity): Observable<ResponseEntity<boolean>> {
        return this._businessInterface.delete(object);
    }
}