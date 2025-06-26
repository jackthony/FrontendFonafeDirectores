/*******************************************************************************************************
 * Nombre de clase:       RoleEntity
 * Descripción:           Entidad de dominio que representa un rol de usuario dentro del sistema.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
export class RoleEntity {
    nRolId: number;
    sNombreRol: string;
    bActivo: boolean;
    dtFechaRegistro: string;
    nUsuarioRegistroId: number;
    dtFechaModificacion: string;
    nUsuarioModificacionId: number;
}