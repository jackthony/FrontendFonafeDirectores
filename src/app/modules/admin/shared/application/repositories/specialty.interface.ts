/*******************************************************************************************************
 * Nombre de interfaz:    SpecialtyInterface
 * Descripción:           Define los métodos para el manejo de la entidad Especialidad dentro del sistema.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { ResponseEntity } from "../../domain/entities/response.entity";
import { SpecialtyEntity } from "../../domain/entities/specialty.entity";
export interface SpecialtyInterface {
    getAll(): Observable<ResponseEntity<SpecialtyEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<SpecialtyEntity>>;
    create(object: SpecialtyEntity): Observable<ResponseEntity<number>>;
    update(object: SpecialtyEntity): Observable<ResponseEntity<boolean>>;
    delete(object: SpecialtyEntity): Observable<ResponseEntity<boolean>>;
}