import { DialogConfirmation } from "@components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";

export const CONST_TYPE_DOCUMENT = 1;
export const CONST_TYPE_DIRECTOR = 3;
export const CONST_TYPE_SPECIALTY_DIRECTOR = 6;
export const CONST_GENDER = 4;
export const CONST_CARGO_MANAGER = 5;

export const COLUMNS_DIRECTORY_BUSINESS: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "sNombreCompleto",
        displayedName: "Nombres y apellidos",
        type: "string"
    },
    {
        id: 1,
        name: "sTipoDocumentoDescripcion",
        displayedName: "Tipo de doc.",
        type: "string"
    },
    {
        id: 2,
        name: "sNumeroDocumento",
        displayedName: "Documento",
        type: "string"
    },
    {
        id: 3,
        name: "sCargoDescripcion",
        displayedName: "Cargo",
        type: "string"
    },
    {
        id: 4,
        name: "sTipoDirectorDescripcion",
        displayedName: "Tipo de director",
        type: "string"
    },
    {
        id: 6,
        name: "none",
        displayedName: "",
        type: "acciones"
    }
];

export const CONFIG_DELETE_DIALOG_DIRECTORY_BUSINESS: DialogConfirmation = {
    title: "¿Estás seguro de eliminar al director?",
    message: ""
}
