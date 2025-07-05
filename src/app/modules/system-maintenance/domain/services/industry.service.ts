/*******************************************************************************************************
 * Nombre del archivo:  industry.service.ts
 * Descripción:          Servicio de dominio para manejar las operaciones CRUD relacionadas con los Rubros
 *                       (Industries), desacoplado mediante el patrón de factoría.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Inclusión de factoría y documentación estándar de proyecto.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IndustryInterface } from '../../application/repositories/industry.interface';
import { IndustryFactory } from '../../infrastructure/industry.factory';
import { IndustryEntity } from '../entities/industry.entity';
import { ResponseEntity } from '@models/response.entity';
@Injectable({
    providedIn: 'root',
})
export class IndustryService {
    private _industryInterface: IndustryInterface;
    /**
     * Inyección del repositorio de rubros mediante factoría.
     * @param _industryFactory Factoría que provee la implementación de repositorio.
     */
    constructor(private _industryFactory : IndustryFactory){ 
        this._industryInterface = this._industryFactory.injectRepository();
    }
    /**
     * Obtiene la lista completa de rubros registrados.
     * @returns Observable con la respuesta de tipo ResponseEntity que contiene todos los rubros.
     */
    getAll(): Observable<ResponseEntity<IndustryEntity>> {
        return this._industryInterface.getAll();
    }
    /**
     * Lista los rubros con paginación, filtro por nombre y estado.
     * @param param Texto para filtrar por nombre.
     * @param pageIndex Índice de la página actual.
     * @param pageSize Cantidad de elementos por página.
     * @param filterState Estado lógico (true, false o null para ambos).
     * @returns Observable con los rubros filtrados y paginados.
     */
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<IndustryEntity>> {
        return this._industryInterface.getByPagination(param, pageIndex, pageSize, filterState);
    }
    /**
     * Crea un nuevo rubro en el sistema.
     * @param object Objeto de tipo IndustryEntity con los datos del nuevo rubro.
     * @returns Observable con el ID generado del rubro.
     */
    create(object: IndustryEntity): Observable<ResponseEntity<number>> {
        return this._industryInterface.create(object);
    }
    /**
     * Actualiza un rubro existente.
     * @param object Objeto de tipo IndustryEntity con los datos a actualizar.
     * @returns Observable con booleano indicando el éxito de la operación.
     */
    update(object: IndustryEntity): Observable<ResponseEntity<boolean>> {
        return this._industryInterface.update(object);
    }
    /**
     * Elimina lógicamente un rubro.
     * @param object Objeto de tipo IndustryEntity que contiene el ID a eliminar.
     * @returns Observable con booleano indicando el resultado del borrado.
     */
    delete(object: IndustryEntity): Observable<ResponseEntity<boolean>> {
        return this._industryInterface.delete(object);
    }
}
