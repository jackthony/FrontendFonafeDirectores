/*******************************************************************************************************
 * Nombre de clase:       PositionEntity
 * Descripción:           Entidad que representa un Cargo o Puesto dentro de la organización.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
export class PositionEntity {
    nIdCargo: number;
    sNombreCargo: string;
    bActivo: boolean;
    dtFechaRegistro: Date;
    nUsuarioRegistro: number;
    dtFechaModificacion: Date;
    nUsuarioModificacion: number;
}