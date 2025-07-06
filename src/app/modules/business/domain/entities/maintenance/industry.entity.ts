/*******************************************************************************************************
 * Nombre de clase:       IndustryEntity
 * Descripción:           Entidad que representa un Rubro o Industria dentro del sistema.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
export class IndustryEntity {
    nIdRubro: number;
    sNombreRubro: string;
    bActivo: boolean;
    dtFechaRegistro: Date;
    nUsuarioRegistro: number;
    dtFechaModificacion: Date;
    nUsuarioModificacion: number;
}