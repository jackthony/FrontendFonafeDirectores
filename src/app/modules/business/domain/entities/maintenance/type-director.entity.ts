/*******************************************************************************************************
 * Nombre de clase:       TypeDirectorEntity
 * Descripción:           Entidad de dominio que representa un tipo de director en el sistema.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
export class TypeDirectorEntity {
    nIdTipoDirector: number;
    sNombreTipoDirector: string;
    bActivo: boolean;
    dtFechaRegistro: Date;
    nUsuarioRegistro: number;
    dtFechaModificacion: Date;
    nUsuarioModificacion: number;
}