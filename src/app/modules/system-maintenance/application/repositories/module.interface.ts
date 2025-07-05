/*******************************************************************************************************
 * Nombre de interfaz:    RoleInterface
 * Descripción:           Define las operaciones del repositorio para la gestión de roles de usuario.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { ResponseEntity } from "../../../../core/models/response.entity";
import { ModuleEntity } from "../../domain/entities/module.entity";
export interface ModuleInterface {
    getAllActionsModules(rolId: number): Observable<ResponseEntity<ModuleEntity>>;
}