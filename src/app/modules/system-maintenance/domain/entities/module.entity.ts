import { ModuleActionEntity } from "./module-action.entity";

/*******************************************************************************************************
 * Nombre de clase:       RoleEntity
 * Descripción:           Entidad de dominio que representa un rol de usuario dentro del sistema.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
export interface ModuleEntity {
    nModuloId: number;
    bModuloPermitido: boolean;
    sNombre: string;
    sRuta: string;
    sIcono: string;
    acciones: ModuleActionEntity[];
}