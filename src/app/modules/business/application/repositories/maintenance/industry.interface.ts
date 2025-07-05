/*******************************************************************************************************
 * Nombre de interfaz:    IndustryInterface
 * Descripción:           Define las operaciones del repositorio para la gestión de Rubros (Industrias).
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { ResponseEntity } from "../../../../../core/models/response.entity";
import { IndustryEntity } from "app/modules/business/domain/entities/maintenance/industry.entity";
export interface IndustryInterface {
    getAll(): Observable<ResponseEntity<IndustryEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<IndustryEntity>>;
    create(object: IndustryEntity): Observable<ResponseEntity<number>>;
    update(object: IndustryEntity): Observable<ResponseEntity<boolean>>;
    delete(object: IndustryEntity): Observable<ResponseEntity<boolean>>;
}