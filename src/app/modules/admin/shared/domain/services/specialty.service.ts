/*******************************************************************************************************
 * Nombre del archivo:  specialty.service.ts
 * Descripción:          Servicio para la gestión de Especialidades dentro del sistema. 
 *                       Provee métodos para operaciones CRUD, paginación y consumo desacoplado
 *                       del repositorio mediante el patrón de factoría.
 * 
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Primera versión completa del servicio con integración a la infraestructura.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { SpecialtyInterface } from '../../application/repositories/specialty.interface';
import { SpecialtyFactory } from '../../infrastructure/specialty.factory';
import { SpecialtyEntity } from '../entities/specialty.entity';
@Injectable({
    providedIn: 'root',
})
export class SpecialtyService {
    private _specialtyInterface: SpecialtyInterface;
    /**
     * Constructor que inyecta la factoría y resuelve la implementación concreta de la interfaz.
     * @param _specialtyFactory Factoría para obtener el repositorio de especialidades.
     */
    constructor(private _specialtyFactory : SpecialtyFactory){ 
        this._specialtyInterface = this._specialtyFactory.injectRepository(); 
    }
    /**
     * Obtiene todas las especialidades registradas.
     * @returns Observable con la respuesta que contiene todas las especialidades.
     */
    getAll(): Observable<ResponseEntity<SpecialtyEntity>> {
        return this._specialtyInterface.getAll();
    }
    /**
     * Obtiene especialidades de forma paginada con filtro opcional por nombre y estado.
     * @param param Texto de búsqueda.
     * @param pageIndex Índice de la página actual.
     * @param pageSize Número de elementos por página.
     * @param filterState Estado del filtro (activo/inactivo/null).
     * @returns Observable con la lista paginada.
     */
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<SpecialtyEntity>> {
        return this._specialtyInterface.getByPagination(param, pageIndex, pageSize, filterState);
    }
    /**
     * Crea una nueva especialidad.
     * @param object Objeto que representa la especialidad a registrar.
     * @returns Observable con el resultado del registro.
     */
    create(object: SpecialtyEntity): Observable<ResponseEntity<number>> {
        return this._specialtyInterface.create(object);
    }
    /**
     * Actualiza una especialidad existente.
     * @param object Objeto con la información modificada.
     * @returns Observable con el resultado de la operación.
     */
    update(object: SpecialtyEntity): Observable<ResponseEntity<boolean>> {
        return this._specialtyInterface.update(object);
    }
    /**
     * Elimina una especialidad (puede ser lógica o física).
     * @param object Objeto a eliminar.
     * @returns Observable con el resultado de la operación.
     */
    delete(object: SpecialtyEntity): Observable<ResponseEntity<boolean>> {
        return this._specialtyInterface.delete(object);
    }
}
