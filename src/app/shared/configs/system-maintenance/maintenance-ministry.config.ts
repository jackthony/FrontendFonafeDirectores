/*******************************************************************************************************
 * Nombre del archivo: ministry-management.config.ts
 * Descripción:         Configuración de columnas y diálogos de confirmación para mantenimiento de ministerios.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 *******************************************************************************************************/
import { DialogConfirmation } from "app/modules/admin/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
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
};
export const CONFIG_INACTIVE_DIALOG_MINISTRY: DialogConfirmation = {
    title: "¿Estás seguro de desactivar el ministerio?",
    message: "Recuerda que una vez desactivado el ministerio?, no podrá ser visualizada como activa, pero podrás consultar su información.",
    actions: {
        confirm: {
            label: 'Desactivar'
        },
        iconClose: false
    }
};
export const CONFIG_ACTIVE_DIALOG_MINISTRY: DialogConfirmation = {
    title: "¿Estás seguro de activar el ministerio?",
    message: "Recuerda que una vez activado el ministerio, será visualizada como activa.",
    actions: {
        confirm: {
            label: 'Activar'
        },
        iconClose: false
    }
};
