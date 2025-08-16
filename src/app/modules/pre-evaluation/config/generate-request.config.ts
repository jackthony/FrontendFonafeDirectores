/*******************************************************************************************************
 * Nombre del archivo:  business-management-table.config.ts
 * Descripción:         Configuración de columnas y diálogo de confirmación para la gestión de empresas.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Corrección de redacción en el mensaje de diálogo y alineación estructural del archivo.
 *******************************************************************************************************/
import { DialogConfirmation } from "app/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";

/**
 * Diálogo de confirmación para traer su última solicitud.
 */
export const CONFIG_GENERATE_REQUEST_DIALOG: DialogConfirmation = {
    title: "¿Desea usar los datos de su última solicitud?", 
    message: "Estos se registrarán automáticamente en la nueva solicitud.",
    actions: {
        confirm: {
            show: true,
            label: 'Sí'
        },
        cancel: {
            show: true,
            label: 'No'
        },
        iconClose: true
    }
};