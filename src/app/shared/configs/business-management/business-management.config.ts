import { DialogConfirmation } from "@components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";

export const CONST_COMPANY_SECTION = 1024;

export const COLUMNS_BUSINESS_MANAGEMENT: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "sRazonSocial",
        displayedName: "Razón social",
        type: "string"
    },
    {
        id: 1,
        name: "sRuc",
        displayedName: "RUC",
        type: "string"
    },
    {
        id: 2,
        name: "sNombreMinisterio",
        displayedName: "Proponente",
        type: "string"
    },
    {
        id: 3,
        name: "sDescripcionRubro",
        displayedName: "Rubro",
        type: "string"
    },
    {
        id: 4,
        name: "sProvinciaDescripcion",
        displayedName: "Ubicación",
        type: "string"
    },
    {
        id: 5,
        name: "none",
        displayedName: "",
        type: "acciones"
    }
];

export const CONFIG_DELETE_DIALOG_BUSINESS: DialogConfirmation = {
    title: "¿Estás seguro de eliminar a la empresa?",
    message: "Recuerda que una vez se haya eliminado al a la empresa no podrás visualizar su información, ni de la sus directores."
}
