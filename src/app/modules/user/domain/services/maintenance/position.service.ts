/*******************************************************************************************************
 * Nombre del archivo:  position.service.ts
 * Descripción:          Servicio encargado de gestionar operaciones relacionadas a los Cargos (Positions)
 *                       dentro del sistema. Utiliza el patrón de factoría para desacoplar la lógica
 *                       de inyección del repositorio correspondiente.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Corrección del nombre de propiedad inyectada y documentación estructurada.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseEntity } from '@models/response.entity';
import { PositionEntity } from '../../entities/maintenance/position.entity';
import { PositionFactory } from 'app/modules/user/infrastructure/maintenance/factory/position.factory';
import { PositionInterface } from 'app/modules/user/application/repositories/maintenance/position.interface';
@Injectable({
    providedIn: 'root',
})
export class PositionService {
    private _positionInterface: PositionInterface;
    /**
     * Constructor que utiliza la factoría para inyectar la implementación del repositorio.
     * @param _positionFactory Instancia de la factoría que provee PositionInterface.
     */
    constructor(private _industryFactory : PositionFactory){ 
        this._positionInterface = this._industryFactory.injectRepository();
    }
    /**
     * Obtiene todos los cargos del sistema.
     * @returns Observable con la lista de todos los cargos.
     */
    getAll(): Observable<ResponseEntity<PositionEntity>> {
        return this._positionInterface.getAll();
    }
    /**
     * Obtiene los cargos paginados con filtro por nombre y estado.
     * @param param Texto de búsqueda.
     * @param pageIndex Número de página (índice base 0).
     * @param pageSize Tamaño de página.
     * @param filterState Estado de filtrado: true (activos), false (inactivos), null (todos).
     * @returns Observable con los resultados paginados.
     */

    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<PositionEntity>> {
        return this._positionInterface.getByPagination(param, pageIndex, pageSize, filterState);
    }
    /**
     * Registra un nuevo cargo en el sistema.
     * @param object Entidad con los datos del nuevo cargo.
     * @returns Observable con el ID generado.
     */
    create(object: PositionEntity): Observable<ResponseEntity<number>> {
        return this._positionInterface.create(object);
    }
    /**
     * Actualiza la información de un cargo existente.
     * @param object Entidad con los datos modificados del cargo.
     * @returns Observable con el resultado de la operación.
     */
    update(object: PositionEntity): Observable<ResponseEntity<boolean>> {
        return this._positionInterface.update(object);
    }
    /**
     * Elimina un cargo existente del sistema.
     * @param object Entidad con los datos del cargo a eliminar.
     * @returns Observable con el resultado de la operación.
     */
    delete(object: PositionEntity): Observable<ResponseEntity<boolean>> {
        return this._positionInterface.delete(object);
    }
}