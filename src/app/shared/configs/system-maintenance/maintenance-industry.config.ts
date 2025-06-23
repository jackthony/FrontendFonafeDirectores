/*******************************************************************************************************
 * Nombre del archivo: industry-management.config.ts
 * Descripción:         Configuración de columnas y diálogos de confirmación para mantenimiento de rubros.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 *******************************************************************************************************/
import { DialogConfirmation } from "app/modules/admin/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";
export const MAINTENANCE_INDUSTRY_HEADER_TABLE: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "indice",
        displayedName: "Nro",
        type: "string"
    },
    {
        id: 1,
        name: "sNombreRubro",
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
export const CONFIG_DELETE_DIALOG_INDUSTRY: DialogConfirmation = {
    title: "¿Estás seguro de eliminar el rubro?",
    message: "Esta acción es irreversible y los datos no podrán ser recuperados."
};
export const CONFIG_INACTIVE_DIALOG_INDUSTRY: DialogConfirmation = {
    title: "¿Estás seguro de desactivar el rubro?",
    message: "Recuerda que una vez desactivado el rubro?, no podrá ser visualizada como activa, pero podrás consultar su información.",
    actions: {
        confirm: {
            label: 'Desactivar'
        },
        iconClose: false
    }
};
export const CONFIG_ACTIVE_DIALOG_INDUSTRY: DialogConfirmation = {
    title: "¿Estás seguro de activar el rubro?",
    message: "Recuerda que una vez activado el rubro, será visualizada como activa.",
    actions: {
        confirm: {
            label: 'Activar'
        },
        iconClose: false
    }
};