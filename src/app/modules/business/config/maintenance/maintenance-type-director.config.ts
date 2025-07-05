/*******************************************************************************************************
 * Nombre del archivo:  type-director.constants.ts
 * Descripción:          Definición de columnas para tabla y configuración de diálogos para acciones
 *                       (eliminar, activar, desactivar) del módulo de Tipos de Director.
 * Autor:                Daniel Alva
 * Última modificación:  23/06/2025
 *******************************************************************************************************/
import { DialogConfirmation } from "app/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../../../shared/interfaces/table-columns-def.interface";
/**
 * Columnas definidas para la tabla de tipos de director en el mantenimiento.
 */
export const MAINTENANCE_TYPE_DIRECTOR_HEADER_TABLE: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "indice",
        displayedName: "Nro",
        type: "string"
    },
    {
        id: 1,
        name: "sNombreTipoDirector",
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
 * Configuración del diálogo de confirmación para eliminar tipo de director.
 */
export const CONFIG_DELETE_DIALOG_TYPE_DIRECTOR: DialogConfirmation = {
    title: "¿Estás seguro de eliminar el tipo de director?",
    message: "Esta acción es irreversible y los datos no podrán ser recuperados."
};
/**
 * Configuración del diálogo de confirmación para desactivar tipo de director.
 */
export const CONFIG_INACTIVE_DIALOG_TYPE_DIRECTOR: DialogConfirmation = {
    title: "¿Estás seguro de eliminar tipo de director?",
    message: "Recuerda que una vez eliminado tipo de director, no podrá ser visualizada como activa, pero podrás consultar su información.",
    actions: {
        confirm: {
            label: 'Eliminar'
        },
        iconClose: false
    }
};
/**
 * Configuración del diálogo de confirmación para activar tipo de director.
 */
export const CONFIG_ACTIVE_DIALOG_TYPE_DIRECTOR: DialogConfirmation = {
    title: "¿Estás seguro de activar tipo de director?",
    message: "Recuerda que una vez activado tipo de director, será visualizada como activa.",
    actions: {
        confirm: {
            label: 'Activar'
        },
        iconClose: false
    }
};