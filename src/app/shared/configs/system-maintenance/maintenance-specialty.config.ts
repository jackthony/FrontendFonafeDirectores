/*******************************************************************************************************
 * Nombre del archivo: specialty-maintenance.config.ts
 * Descripción:         Configuración de tabla y diálogos de confirmación para el mantenimiento
 *                      de especialidades.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 *******************************************************************************************************/
import { DialogConfirmation } from "app/modules/admin/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";
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
export const CONFIG_DELETE_DIALOG_TYPE_SPECIALTY: DialogConfirmation = {
    title: "¿Estás seguro de eliminar la especialidad?",
    message: "Esta acción es irreversible y los datos no podrán ser recuperados."
};
export const CONFIG_INACTIVE_DIALOG_SPECIALTY: DialogConfirmation = {
    title: "¿Estás seguro de desactivar la especialidad?",
    message: "Recuerda que una vez desactivado la especialidad?, no podrá ser visualizada como activa, pero podrás consultar su información.",
    actions: {
        confirm: {
            label: 'Desactivar'
        },
        iconClose: false
    }
};
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