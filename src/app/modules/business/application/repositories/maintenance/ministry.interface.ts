/*******************************************************************************************************
 * Nombre de interfaz:    MinistryInterface
 * Descripción:           Define las operaciones del repositorio para la gestión de Ministerios en el sistema.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { ResponseEntity } from "@models/response.entity";
import { MinistryEntity } from "app/modules/business/domain/entities/maintenance/ministry.entity";
export interface MinistryInterface {
    getAll(): Observable<ResponseEntity<MinistryEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<MinistryEntity>>;
    create(object: MinistryEntity): Observable<ResponseEntity<number>>;
    update(object: MinistryEntity): Observable<ResponseEntity<boolean>>;
    delete(object: MinistryEntity): Observable<ResponseEntity<boolean>>;
}