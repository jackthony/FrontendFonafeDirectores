/*******************************************************************************************************
 * Nombre de interfaz:    MinistryInterface
 * Descripción:           Define las operaciones del repositorio para la gestión de Ministerios en el sistema.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { MinistryEntity } from "../../../business-management/domain/entities/ministry.entity";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";
export interface MinistryInterface {
    getAll(): Observable<ResponseEntity<MinistryEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<MinistryEntity>>;
    create(object: MinistryEntity): Observable<ResponseEntity<number>>;
    update(object: MinistryEntity): Observable<ResponseEntity<boolean>>;
    delete(object: MinistryEntity): Observable<ResponseEntity<boolean>>;
}