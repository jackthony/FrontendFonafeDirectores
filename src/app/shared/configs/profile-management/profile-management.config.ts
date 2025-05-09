import { DialogConfirmation } from "@components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";

export const CONST_STATUS_USER = 10;
export const CONST_POSITION_USER = 11;
export const CONST_PROFILE_USER = 12;

export const COLUMNS_PROFILE_MANAGEMENT: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "fullName",
        displayedName: "Nombres y Apellidos",
        type: "string"
    },
    {
        id: 1,
        name: "status",
        displayedName: "Cargo",
        type: "string"
    },
    {
        id: 2,
        name: "dDate",
        displayedName: "Perfil",
        type: "date"
    },
    {
        id: 3,
        name: "transcurrido",
        displayedName: "Estado",
        type: "string"
    },
    {
        id: 4,
        name: "enterprise",
        displayedName: "Fecha de creación",
        type: "string"
    },
    {
        id: 5,
        name: "proponent",
        displayedName: "Ult. modificación",
        type: "string"
    },
    {
        id: 6,
        name: "solicit",
        displayedName: "Correo",
        type: "string"
    },
    {
        id: 7,
        name: "clave",
        displayedName: "Clave",
        type: "string"
    },
    {
        id: 8,
        name: "none",
        displayedName: "",
        type: "acciones"
    }
];

export const CONFIG_DELETE_DIALOG_PROFILE: DialogConfirmation = {
    title: "¿Estás seguro de eliminar al usuario?",
    message: "Recuerda que una vez se haya eliminado al usuario no podrá ingresar al portal, ni realizar ninguna acción en el."
}