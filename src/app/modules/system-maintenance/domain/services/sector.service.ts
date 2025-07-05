/*******************************************************************************************************
 * Nombre del archivo:  sector.service.ts
 * Descripción:          Servicio encargado de gestionar operaciones relacionadas a los Sectores.
 *                       Implementa métodos CRUD desacoplados mediante la interfaz SectorInterface,
 *                       usando inyección vía una factoría para seguir el principio de inversión de dependencias.
 * 
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Primera versión completa del servicio SectorService con integración a infraestructura.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SectorInterface } from '../../application/repositories/sector.interface';
import { SectorFactory } from '../../infrastructure/sector.factory';
import { SectorEntity } from '../entities/sector.entity';
import { ResponseEntity } from '@models/response.entity';
@Injectable({
    providedIn: 'root',
})
export class SectorService {
    private _sectorInterface: SectorInterface;
    /**
     * Constructor que resuelve la dependencia mediante una factoría.
     * @param _sectorFactory Instancia de la factoría que retorna el repositorio implementado.
     */
    constructor(private _sectorFactory : SectorFactory){ 
        this._sectorInterface = this._sectorFactory.injectRepository();
    }
    /**
     * Obtiene todos los sectores registrados.
     * @returns Observable con un ResponseEntity conteniendo todos los sectores.
     */
    getAll(): Observable<ResponseEntity<SectorEntity>> {
        return this._sectorInterface.getAll();
    }
    /**
     * Obtiene sectores de forma paginada con filtros por nombre y estado.
     * @param param Texto de búsqueda.
     * @param pageIndex Número de página actual.
     * @param pageSize Tamaño de página.
     * @param filterState Filtro de estado (activo/inactivo/null).
     * @returns Observable con lista paginada de sectores.
     */
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<SectorEntity>> {
        return this._sectorInterface.getByPagination(param, pageIndex, pageSize, filterState);
    }
    /**
     * Crea un nuevo sector en el sistema.
     * @param object Objeto SectorEntity con los datos a registrar.
     * @returns Observable con el ID generado.
     */
    create(object: SectorEntity): Observable<ResponseEntity<number>> {
        return this._sectorInterface.create(object);
    }
    /**
     * Actualiza los datos de un sector existente.
     * @param object Objeto SectorEntity con datos actualizados.
     * @returns Observable con éxito o fallo.
     */
    update(object: SectorEntity): Observable<ResponseEntity<boolean>> {
        return this._sectorInterface.update(object);
    }
    /**
     * Elimina un sector, ya sea de forma lógica o física según implementación.
     * @param object Objeto SectorEntity que se desea eliminar.
     * @returns Observable con el resultado de la operación.
     */
    delete(object: SectorEntity): Observable<ResponseEntity<boolean>> {
        return this._sectorInterface.delete(object);
    }
}