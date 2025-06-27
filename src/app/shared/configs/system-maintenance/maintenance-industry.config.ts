/*******************************************************************************************************
 * Nombre del archivo: industry-management.config.ts
 * Descripción:         Configuración de columnas y diálogos de confirmación para mantenimiento de rubros.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Corrección de redacción y alineamiento semántico con otros mantenedores.
 *******************************************************************************************************/
import { DialogConfirmation } from "app/modules/admin/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";
/**
 * Columnas de la tabla para mantenimiento de rubros.
 */
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
/**
 * Configuración del diálogo de confirmación para eliminar rubro.
 */
export const CONFIG_DELETE_DIALOG_INDUSTRY: DialogConfirmation = {
    title: "¿Estás seguro de eliminar el rubro?",
    message: "Esta acción es irreversible y los datos no podrán ser recuperados."
};
/**
 * Configuración del diálogo de confirmación para desactivar rubro.
 */
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
/**
 * Configuración del diálogo de confirmación para activar rubro.
 */
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