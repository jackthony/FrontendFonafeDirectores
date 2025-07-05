/*******************************************************************************************************
 * Nombre de clase:       SpecialtyEntity
 * Descripción:           Entidad de dominio que representa una especialidad dentro del sistema.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
export class SpecialtyEntity {
    nIdEspecialidad: number;
    sNombreEspecialidad: string;
    bActivo: boolean;
    dtFechaRegistro: Date;
    nUsuarioRegistro: number;
    dtFechaModificacion: Date;
    nUsuarioModificacion: number;
}