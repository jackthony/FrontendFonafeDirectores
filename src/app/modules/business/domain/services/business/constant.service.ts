/*******************************************************************************************************
 * Nombre del archivo:  constant.service.ts
 * Descripción:          Servicio de dominio para el consumo de constantes del sistema según código.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Integración con patrón factoría y documentación estandarizada.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { ConstantInterface } from '../../../application/repositories/business/constant.interface';
import { ConstantFactory } from '../../../infrastructure/business/factory/constant.factory';
import { Observable } from 'rxjs';
import { ResponseEntity } from '@models/response.entity';
import { ConstantEntity } from '../../entities/business/constant.entity';
@Injectable({
    providedIn: 'root',
})
export class ConstantService {
    private _constantInterface: ConstantInterface;
    /**
     * Inyección de dependencia del repositorio de constantes mediante factoría.
     * @param _constantFactory Factoría que resuelve la implementación del repositorio de constantes.
     */
    constructor(private _constantFactory : ConstantFactory){ 
        this._constantInterface = this._constantFactory.injectRepository();
    }
    /**
     * Obtiene todas las constantes correspondientes a un código de catálogo específico.
     * @param code Código del catálogo de constantes a consultar.
     * @returns Observable con la lista de constantes obtenidas desde el backend.
     */
    getAll(code: number): Observable<ResponseEntity<ConstantEntity>> {
        return this._constantInterface.getAll(code);
    }
}