/*******************************************************************************************************
 * Nombre de interfaz:    TypeDirectorInterface
 * Descripción:           Define los métodos de acceso y manipulación para la entidad Tipo Director.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { ResponseEntity } from "../../../../core/models/response.entity";
import { TypeDirectorEntity } from "../../domain/entities/type-director.entity";

export interface TypeDirectorInterface {
    getAll(): Observable<ResponseEntity<TypeDirectorEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<TypeDirectorEntity>>;
    create(object: TypeDirectorEntity): Observable<ResponseEntity<number>>;
    update(object: TypeDirectorEntity): Observable<ResponseEntity<boolean>>;
    delete(object: TypeDirectorEntity): Observable<ResponseEntity<boolean>>;
}
