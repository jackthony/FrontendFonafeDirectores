/*******************************************************************************************************
 * Nombre de interfaz:    PositionInterface
 * Descripción:           Define las operaciones del repositorio para la gestión de cargos o puestos.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { ResponseEntity } from "../../domain/entities/response.entity";
import { PositionEntity } from "../../domain/entities/position.entity";
export interface PositionInterface {
    getAll(): Observable<ResponseEntity<PositionEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<PositionEntity>>;
    create(object: PositionEntity): Observable<ResponseEntity<number>>;
    update(object: PositionEntity): Observable<ResponseEntity<boolean>>;
    delete(object: PositionEntity): Observable<ResponseEntity<boolean>>;
}
