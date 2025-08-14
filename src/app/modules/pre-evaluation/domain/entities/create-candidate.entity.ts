export interface CreateCandidateRequest {
    SNombres: string;
    SApellidos: string;
    NTipoDocumento: number;
    SNumeroDocumento: string;
    DtFechaNacimiento: string;
    NGenero: number;
    SCorreoElectronico: string;
    STelefono: string;
    NDepartamentoId: number;
    NProvinciaId: number;
    NDistritoId: number;
    SDireccion: string;
    NEstado: number;
    BActivo: boolean;
    NUsuarioRegistroId: number;
}
