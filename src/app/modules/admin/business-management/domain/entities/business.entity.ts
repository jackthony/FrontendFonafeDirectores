export class BusinessEntity {
    nIdEmpresa: number;
    sNombreEmpresa: string;
    sRuc: string;
    sRazonSocial: string;
    nIdProponente: number;
    nIdRubroNegocio: number;
    sIdDepartamento: string;
    sIdProvincia: string;
    sIdDistrito: string;
    nIDSector: number;
    sDireccion: string;
    sComentario: string;
    mIngresosUltimoAnio: number;
    mUtilidadUltimoAnio: number;
    mConformacionCapitalSocial: number;
    nNumeroMiembros: number;
    bRegistradoMercadoValores: boolean;
    bActivo: boolean;
    dtFechaRegistro: string;
    nUsuarioRegistro: number;
    dtFechaModificacion: string;
    nUsuarioModificacion: number;
    sDescripcionRubro?: string;
    sNombreMinisterio?: string;
    sProvinciaDescripcion?: string;
}
