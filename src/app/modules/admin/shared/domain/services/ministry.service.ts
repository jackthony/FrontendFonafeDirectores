/*******************************************************************************************************
 * Nombre del archivo:  ministry.service.ts
 * Descripción:          Servicio de dominio encargado de manejar operaciones CRUD para Ministerios,
 *                       utilizando una factoría para desacoplar el repositorio correspondiente.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Aplicación de inyección por factoría y documentación técnica profesional.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MinistryInterface } from '../../application/repositories/ministry.interface';
import { MinistryFactory } from '../../infrastructure/ministry.factory';
import { MinistryEntity } from '../../../business-management/domain/entities/ministry.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
@Injectable({
    providedIn: 'root',
})
export class MinistryService {
    private _ministryInterface: MinistryInterface;
    /**
     * Constructor que inyecta dinámicamente la implementación del repositorio usando la factoría.
     * @param _ministryFactory Factoría encargada de proporcionar la implementación del repositorio.
     */
    constructor(private _ministryFactory : MinistryFactory){ 
        this._ministryInterface = this._ministryFactory.injectRepository();
    }
    /**
     * Obtiene todos los ministerios registrados en el sistema.
     * @returns Observable con la respuesta que contiene la lista completa de ministerios.
     */
    getAll(): Observable<ResponseEntity<MinistryEntity>> {
        return this._ministryInterface.getAll();
    }
    /**
     * Obtiene los ministerios de forma paginada, con filtros opcionales por nombre y estado.
     * @param param Texto de búsqueda por nombre.
     * @param pageIndex Índice de página (base cero).
     * @param pageSize Tamaño de página a devolver.
     * @param filterState true para activos, false para inactivos, null para ambos.
     * @returns Observable con la respuesta que contiene los datos paginados.
     */
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<MinistryEntity>> {
        return this._ministryInterface.getByPagination(param, pageIndex, pageSize, filterState);
    }
    /**
     * Crea un nuevo registro de ministerio en el sistema.
     * @param object Entidad con los datos del nuevo ministerio.
     * @returns Observable con la respuesta que incluye el ID generado.
     */
    create(object: MinistryEntity): Observable<ResponseEntity<number>> {
        return this._ministryInterface.create(object);
    }
    /**
     * Actualiza la información de un ministerio existente.
     * @param object Entidad con los datos del ministerio a actualizar.
     * @returns Observable con la respuesta indicando éxito o fallo.
     */
    update(object: MinistryEntity): Observable<ResponseEntity<boolean>> {
        return this._ministryInterface.update(object);
    }
    /**
     * Elimina un ministerio del sistema.
     * @param object Entidad con la información del ministerio a eliminar.
     * @returns Observable con la respuesta indicando el resultado de la operación.
     */
    delete(object: MinistryEntity): Observable<ResponseEntity<boolean>> {
        return this._ministryInterface.delete(object);
    }
}
