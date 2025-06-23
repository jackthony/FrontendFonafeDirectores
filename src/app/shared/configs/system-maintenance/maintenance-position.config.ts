/*******************************************************************************************************
 * Nombre del archivo: position-maintenance.config.ts
 * Descripción:         Configuración de columnas y diálogos de confirmación para mantenimiento de cargos.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 *******************************************************************************************************/
import { DialogConfirmation } from "app/modules/admin/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";
export const MAINTENANCE_POSITION_HEADER_TABLE: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "indice",
        displayedName: "Nro",
        type: "string"
    },
    {
        id: 1,
        name: "sNombreCargo",
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

// Configuración para el diálogo de confirmación al eliminar un ministerio
export const CONFIG_DELETE_DIALOG_POSITION: DialogConfirmation = {
    title: "¿Estás seguro de eliminar el cargo?", // Título del diálogo de confirmación
    message: "Esta acción es irreversible y los datos no podrán ser recuperados." // Mensaje que se muestra al usuario, alertando de la irreversibilidad de la acción
};

export const CONFIG_INACTIVE_DIALOG_POSITION: DialogConfirmation = {
    title: "¿Estás seguro de desactivar el cargo?", // Título del diálogo de confirmación
    message: "Recuerda que una vez desactivado el cargo?, no podrá ser visualizada como activa, pero podrás consultar su información.",
    actions: {
        confirm: {
            label: 'Desactivar'
        },
        iconClose: false
    }
};

export const CONFIG_ACTIVE_DIALOG_POSITION: DialogConfirmation = {
    title: "¿Estás seguro de activar el cargo?", // Título del diálogo de confirmación
    message: "Recuerda que una vez activado el cargo, será visualizada como activa.",
    actions: {
        confirm: {
            label: 'Activar'
        },
        iconClose: false
    }
};
