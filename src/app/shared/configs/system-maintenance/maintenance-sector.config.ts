/*******************************************************************************************************
 * Nombre del archivo: sector-maintenance.config.ts
 * Descripción:         Configuración de columnas y diálogos de confirmación para mantenimiento de sectores.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Revisión de redacción y corrección de signos en mensajes de diálogo.
 *******************************************************************************************************/
import { DialogConfirmation } from "app/modules/admin/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";
/**
 * Columnas para la tabla de mantenimiento de sectores.
 */
export const MAINTENANCE_SECTOR_HEADER_TABLE: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "indice",
        displayedName: "Nro",
        type: "string"
    },
    {
        id: 1,
        name: "sNombreSector",
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
 * Configuración del diálogo de eliminación de sector.
 */
export const CONFIG_DELETE_DIALOG_SECTOR: DialogConfirmation = {
    title: "¿Estás seguro de eliminar el sector?",
    message: "Esta acción es irreversible y los datos no podrán ser recuperados."
};
/**
 * Configuración del diálogo de desactivación de sector.
 */
export const CONFIG_INACTIVE_DIALOG_SECTOR: DialogConfirmation = {
    title: "¿Estás seguro de eliminar el sector?",
    message: "Recuerda que una vez eliminado el sector, no podrá ser visualizada como activa, pero podrás consultar su información.",
    actions: {
        confirm: {
            label: 'Eliminar'
        },
        iconClose: false
    }
};
/**
 * Configuración del diálogo de activación de sector.
 */
export const CONFIG_ACTIVE_DIALOG_SECTOR: DialogConfirmation = {
    title: "¿Estás seguro de activar el sector?",
    message: "Recuerda que una vez activado el sector, será visualizada como activa.",
    actions: {
        confirm: {
            label: 'Activar'
        },
        iconClose: false
    }
};