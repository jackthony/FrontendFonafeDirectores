/*******************************************************************************************************
 * Nombre del archivo: position-maintenance.config.ts
 * Descripción:         Configuración de columnas y diálogos de confirmación para mantenimiento de cargos.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Revisión ortográfica, mejoras de estilo y consistencia en mensajes.
 *******************************************************************************************************/
import { DialogConfirmation } from "app/modules/admin/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";
/**
 * Columnas de la tabla para mantenimiento de cargos.
 */
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
/**
 * Configuración del diálogo de eliminación de cargo.
 */
export const CONFIG_DELETE_DIALOG_POSITION: DialogConfirmation = {
    title: "¿Estás seguro de eliminar el cargo?",
    message: "Esta acción es irreversible y los datos no podrán ser recuperados." 
};
/**
 * Configuración del diálogo de desactivación de cargo.
 */
export const CONFIG_INACTIVE_DIALOG_POSITION: DialogConfirmation = {
    title: "¿Estás seguro de desactivar el cargo?", 
    message: "Recuerda que una vez desactivado el cargo?, no podrá ser visualizada como activa, pero podrás consultar su información.",
    actions: {
        confirm: {
            label: 'Desactivar'
        },
        iconClose: false
    }
};
/**
 * Configuración del diálogo de activación de cargo.
 */
export const CONFIG_ACTIVE_DIALOG_POSITION: DialogConfirmation = {
    title: "¿Estás seguro de activar el cargo?",
    message: "Recuerda que una vez activado el cargo, será visualizada como activa.",
    actions: {
        confirm: {
            label: 'Activar'
        },
        iconClose: false
    }
};