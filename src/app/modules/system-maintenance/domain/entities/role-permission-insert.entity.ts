/*******************************************************************************************************
 * Nombre de clase:       RolePermissionsInsert
 * Descripción:           Entidad de dominio que representa el registro de permisos del rol en el sistema.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
export interface RolePermissionsInsert {
    nRolId: number;
    lstModulos: ModulePermissionsInsert[];
    nUsuarioModificacionId: number;
}

export interface ActionPermissionsInsert {
    nAccionId: number;
    bPermitir: boolean;
}

export interface ModulePermissionsInsert {
    nModuloId: number;
    lstAcciones: ActionPermissionsInsert[];
}
