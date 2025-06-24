/*******************************************************************************************************
 * Nombre del archivo: role-maintenance.config.ts
 * Descripción:         Configuración de columnas y diálogos de confirmación para mantenimiento de roles.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Revisión ortográfica y uniformidad en los mensajes de diálogo.
 *******************************************************************************************************/
import { DialogConfirmation } from "app/modules/admin/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";
/**
 * Columnas de la tabla para mantenimiento de roles.
 */
export const MAINTENANCE_ROL_HEADER_TABLE: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "indice",
        displayedName: "Nro",
        type: "string"
    },
    {
        id: 1,
        name: "sNombreRol",
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
 * Configuración del diálogo de eliminación de rol.
 */
export const CONFIG_DELETE_DIALOG_ROLE: DialogConfirmation = {
    title: "¿Estás seguro de eliminar el rol?",
    message: "Esta acción es irreversible y los datos no podrán ser recuperados." 
};
/**
 * Configuración del diálogo de desactivación de rol.
 */
export const CONFIG_INACTIVE_DIALOG_ROLE: DialogConfirmation = {
    title: "¿Estás seguro de desactivar el rol?",
    message: "Recuerda que una vez desactivado el rol?, no podrá ser visualizada como activa, pero podrás consultar su información.",
    actions: {
        confirm: {
            label: 'Desactivar'
        },
        iconClose: false
    }
};
/**
 * Configuración del diálogo de activación de rol.
 */
export const CONFIG_ACTIVE_DIALOG_ROLE: DialogConfirmation = {
    title: "¿Estás seguro de activar el rol?",
    message: "Recuerda que una vez activado el rol, será visualizada como activa.",
    actions: {
        confirm: {
            label: 'Activar'
        },
        iconClose: false
    }
};