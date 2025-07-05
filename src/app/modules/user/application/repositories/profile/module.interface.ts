/*******************************************************************************************************
 * Nombre de interfaz:    RoleInterface
 * Descripción:           Define las operaciones del repositorio para la gestión de roles de usuario.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { ResponseEntity } from "@models/response.entity";
import { ModuleEntity } from "app/modules/user/domain/entities/maintenance/module.entity";
import { Observable } from "rxjs";
export interface ModuleInterface {
    getAllActionsModules(rolId: number): Observable<ResponseEntity<ModuleEntity>>;
}