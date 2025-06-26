
/*******************************************************************************************************
 * Nombre de archivo:   seg-user.entity.ts
 * Descripción:          Entidad que representa a un usuario del sistema, incluyendo su información
 *                       personal, rol, cargo, estado y datos de auditoría.
 * Autor:                Daniel Alva
 * Fecha de creación:    23/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    - Inclusión de campos opcionales para visualización (tipo documento, nombre completo).
 *******************************************************************************************************/
export interface SegUserEntity {
	nIdUsuario: number;
    sApellidoPaterno: string;
    sApellidoMaterno: string;
    sNombres: string;
    nIdCargo: number;
    nIdRol: number;
    nEstado: number;
    sCorreoElectronico: string;
    sContrasena: string;
    nTipoPersonal: number;
    dtFechaRegistro: string;
    nUsuarioRegistro: number;
    dtFechaModificacion: string;
    nUsuarioModificacion: number;
    nTipoDocumento?: number;
    sNumeroDocumento?: string;
    sApellidosNombres?: string;
}