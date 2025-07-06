/*******************************************************************************************************
 * Nombre de interfaz:    SpecialtyInterface
 * Descripción:           Define los métodos para el manejo de la entidad Especialidad dentro del sistema.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { ResponseEntity } from "@models/response.entity";
import { SpecialtyEntity } from "app/modules/business/domain/entities/maintenance/specialty.entity";
import { Observable } from "rxjs";
export interface SpecialtyInterface {
    getAll(): Observable<ResponseEntity<SpecialtyEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<SpecialtyEntity>>;
    create(object: SpecialtyEntity): Observable<ResponseEntity<number>>;
    update(object: SpecialtyEntity): Observable<ResponseEntity<boolean>>;
    delete(object: SpecialtyEntity): Observable<ResponseEntity<boolean>>;
}