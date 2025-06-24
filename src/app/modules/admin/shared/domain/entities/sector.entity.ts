/*******************************************************************************************************
 * Nombre de clase:       SectorEntity
 * Descripción:           Entidad de dominio que representa un sector económico o institucional.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
export class SectorEntity {
    nIdSector: number;
    sNombreSector: string;
    bActivo: boolean;
    dtFechaRegistro: Date;
    nUsuarioRegistro: number;
    dtFechaModificacion: Date;
    nUsuarioModificacion: number;
}