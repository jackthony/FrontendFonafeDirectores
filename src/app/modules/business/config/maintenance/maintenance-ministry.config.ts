/*******************************************************************************************************
 * Nombre del archivo: ministry-management.config.ts
 * Descripción:         Configuración de columnas y diálogos de confirmación para mantenimiento de ministerios.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Corrección ortográfica y estandarización de mensajes de confirmación.
 *******************************************************************************************************/
import { DialogConfirmation } from "app/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../../../shared/interfaces/table-columns-def.interface";
/**
 * Columnas de la tabla para mantenimiento de ministerios.
 */
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
/**
 * Configuración del diálogo de confirmación para eliminar ministerio.
 */
export const CONFIG_DELETE_DIALOG_MINISTRY: DialogConfirmation = {
    title: "¿Estás seguro de eliminar el ministerio?",
    message: "Esta acción es irreversible y los datos no podrán ser recuperados."
};
/**
 * Configuración del diálogo de confirmación para desactivar ministerio.
 */
export const CONFIG_INACTIVE_DIALOG_MINISTRY: DialogConfirmation = {
    title: "¿Estás seguro de eliminar el ministerio?",
    message: "Recuerda que una vez eliminado el ministerio, no podrá ser visualizada como activa, pero podrás consultar su información.",
    actions: {
        confirm: {
            label: 'Eliminar'
        },
        iconClose: false
    }
};
/**
 * Configuración del diálogo de confirmación para activar ministerio.
 */
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
