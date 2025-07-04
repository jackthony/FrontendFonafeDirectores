export interface DirectorEntity {
    nIdRegistro: number;
    nIdEmpresa: number;
    nTipoDocumento: number;
    sNumeroDocumento: string;
    sNombres: string;
    sApellidos: string;
    dFechaNacimiento: string;
    nGenero: number;
    sDistrito: string;
    sProvincia: string;
    sDepartamento: string;
    sDireccion: string;
    sTelefono: string;
    sTelefonoSecundario: string;
    sTelefonoTerciario: string;
    sCorreo: string;
    sCorreoSecundario: string;
    sCorreoTerciario: string;
    nCargo: number;
    nTipoDirector: number;
    nIdSector: number;
    sProfesion: string;
    mDieta: number;
    nEspecialidad: number;
    dFechaNombramiento: string;
    dFechaDesignacion: string;
    dFechaRenuncia: string;
    sComentario: string;
    dtFechaRegistro: string;
    sUsuarioRegistro: string;
    dtFechaModificacion: string;
    sUsuarioModificacion: string;
    sNombreCompleto?: string;
    sTipoDocumentoDescripcion?: string;
    sCargoDescripcion?: string;
    sTipoDirectorDescripcion?: string;
  }