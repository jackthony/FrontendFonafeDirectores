import { DialogConfirmation } from "@components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";

export const MAINTENANCE_MINISTRY_MANAGEMENT: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "indice",
        displayedName: "Nro",
        type: "string"
    },
    {
        id: 1,
        name: "sNombreMinisterio",
        displayedName: "Nombre",
        type: "string"
    },
    {
        id: 2,
        name: "bActivo",
        displayedName: "Estado",
        type: "estado"
    },
    {
        id: 3,
        name: "none",
        displayedName: "",
        type: "acciones"
    }
];

export const CONFIG_DELETE_DIALOG_MINISTRY: DialogConfirmation = {
    title: "¿Estás seguro de eliminar el ministerio?",
    message: "Esta acción es irreversible y los datos no podrán ser recuperados."
}