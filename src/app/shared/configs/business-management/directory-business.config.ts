import { DialogConfirmation } from "@components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";

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
