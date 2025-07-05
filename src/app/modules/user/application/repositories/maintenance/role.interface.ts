/*******************************************************************************************************
 * Nombre de interfaz:    RoleInterface
 * Descripción:           Define las operaciones del repositorio para la gestión de roles de usuario.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { ResponseEntity } from "../../../../../core/models/response.entity";
import { RoleEntity } from "../../../domain/entities/maintenance/role.entity";
import { RolePermissionsInsert } from "../../../domain/entities/maintenance/role-permission-insert.entity";
export interface RoleInterface {
    getAll(): Observable<ResponseEntity<RoleEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<RoleEntity>>;
    create(object: RoleEntity): Observable<ResponseEntity<number>>;
    update(object: RoleEntity): Observable<ResponseEntity<boolean>>;
    delete(object: RoleEntity): Observable<ResponseEntity<boolean>>;
    insertPermissionRole(object: RolePermissionsInsert): Observable<ResponseEntity<boolean>>;
}