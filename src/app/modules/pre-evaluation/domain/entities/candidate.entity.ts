export interface CandidateEntity {
    nCandidatoId: number;
    nUsuarioId: number;
    sNombres: string;
    sApellidos: string;
    nTipoDocumento: number;
    sNumeroDocumento: string;
    dtFechaNacimiento: string;
    nGenero: number;
    sCorreoElectronico: string;
    sTelefono: string;
    sDepartamentoId: string;
    sProvinciaId: string;
    sDistritoId: string;
    sDireccion: string;
    nEstado: number;
    bActivo: boolean;
    nUsuarioRegistroId: number;
    NUsuarioActualizacionId: number;
    bBlock?: boolean;
    bHistorial?: boolean;
    bCopiarSolicitud: boolean;
}
