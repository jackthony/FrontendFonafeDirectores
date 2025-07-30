/*******************************************************************************************************
 * Nombre del archivo: specialty-maintenance.config.ts
 * Descripción:         Configuración de tabla y diálogos de confirmación para el mantenimiento
 *                      de especialidades.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Revisión de redacción y mensajes de confirmación para mayor claridad.
 *******************************************************************************************************/
import { DialogConfirmation } from "app/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../../../shared/interfaces/table-columns-def.interface";
/**
 * Definición de columnas de la tabla de especialidades.
 */
export const MAINTENANCE_SPECIALTY_HEADER_TABLE: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "indice",
        displayedName: "Nro",
        type: "string"
    },
    {
        id: 1,
        name: "sNombreEspecialidad",
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
 * Diálogo de confirmación para eliminación de especialidad.
 */
export const CONFIG_DELETE_DIALOG_TYPE_SPECIALTY: DialogConfirmation = {
    title: "¿Estás seguro de eliminar la especialidad?",
    message: "Esta acción es irreversible y los datos no podrán ser recuperados."
};
/**
 * Diálogo de confirmación para desactivación de especialidad.
 */
export const CONFIG_INACTIVE_DIALOG_SPECIALTY: DialogConfirmation = {
    title: "¿Estás seguro de eliminar la especialidad?",
    message: "Recuerda que una vez eliminado la especialidad, no podrá ser visualizada como activa, pero podrás consultar su información.",
    actions: {
        confirm: {
            label: 'Eliminar'
        },
        iconClose: false
    }
};
/**
 * Diálogo de confirmación para activación de especialidad.
 */
export const CONFIG_ACTIVE_DIALOG_SPECIALTY: DialogConfirmation = {
    title: "¿Estás seguro de activar la especialidad?",
    message: "Recuerda que una vez activado la especialidad, será visualizada como activa.",
    actions: {
        confirm: {
            label: 'Activar'
        },
        iconClose: false
    }
};