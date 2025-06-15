export interface SegUser {
	nIdUsuario: number;
    sApellidoPaterno: string;
    sApellidoMaterno: string;
    sNombres: string;
    nIdCargo: number;
    nIdRol: number;
    nEstado: number;
    sCorreoElectronico: string;
    sContrasena: string;
    dtFechaRegistro: string;
    nUsuarioRegistro: number;
    dtFechaModificacion: string;
    nUsuarioModificacion: number;
    nTipoDocumento?: number;
    sNumeroDocumento?: string;
    sApellidosNombres?: string;
}