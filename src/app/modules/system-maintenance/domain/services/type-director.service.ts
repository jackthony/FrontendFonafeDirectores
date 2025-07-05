/*******************************************************************************************************
 * Nombre del archivo:  type-director.service.ts
 * Descripción:          Servicio para gestionar la lógica de negocio relacionada con Tipos de Directores
 *                       en el sistema. Encapsula operaciones de creación, edición, listado y eliminación,
 *                       utilizando el patrón de factoría para desacoplar la infraestructura.
 * 
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación completa del servicio con inyección de dependencia vía factory.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TypeDirectorInterface } from '../../application/repositories/type-director.interface';
import { TypeDirectorEntity } from '../entities/type-director.entity';
import { TypeDirectorFactory } from '../../infrastructure/type-director.factory';
import { ResponseEntity } from '@models/response.entity';
@Injectable({
    providedIn: 'root',
})
export class TypeDirectorService {
    private _typeDirectorInterface: TypeDirectorInterface;
    /**
     * Constructor que inyecta la factoría y resuelve la implementación concreta de la interfaz.
     * @param _industryFactory Factoría para obtener el repositorio de tipo director.
     */
    constructor(private _industryFactory : TypeDirectorFactory){ 
        this._typeDirectorInterface = this._industryFactory.injectRepository();
    }
    /**
     * Obtiene todos los registros de tipo director.
     * @returns Observable con la respuesta que contiene la lista de entidades.
     */
    getAll(): Observable<ResponseEntity<TypeDirectorEntity>> {
        return this._typeDirectorInterface.getAll();
    }
    /**
     * Obtiene los registros paginados según parámetros de búsqueda y estado.
     * @param param Texto para filtrar por nombre.
     * @param pageIndex Página actual.
     * @param pageSize Cantidad de registros por página.
     * @param filterState Filtro por estado (activo/inactivo).
     * @returns Observable con la respuesta paginada.
     */
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<TypeDirectorEntity>> {
        return this._typeDirectorInterface.getByPagination(param, pageIndex, pageSize, filterState);
    }
    /**
     * Registra un nuevo tipo de director.
     * @param object Objeto que representa al tipo de director a registrar.
     * @returns Observable con el resultado del registro.
     */
    create(object: TypeDirectorEntity): Observable<ResponseEntity<number>> {
        return this._typeDirectorInterface.create(object);
    }
    /**
     * Actualiza un tipo de director existente.
     * @param object Objeto actualizado.
     * @returns Observable con el resultado de la operación.
     */
    update(object: TypeDirectorEntity): Observable<ResponseEntity<boolean>> {
        return this._typeDirectorInterface.update(object);
    }
    /**
     * Elimina (lógicamente o físicamente) un tipo de director.
     * @param object Objeto a eliminar.
     * @returns Observable con el resultado de la eliminación.
     */
    delete(object: TypeDirectorEntity): Observable<ResponseEntity<boolean>> {
        return this._typeDirectorInterface.delete(object);
    }
}