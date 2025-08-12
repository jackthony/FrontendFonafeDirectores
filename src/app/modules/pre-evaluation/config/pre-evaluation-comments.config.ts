/*******************************************************************************************************
 * Nombre del archivo:  profile-management.config.ts
 * Descripción:         Configuración de constantes, columnas y diálogos de confirmación para la gestión de perfiles de usuario.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Creación inicial del archivo.
 *******************************************************************************************************/
import { DialogConfirmation } from "app/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "app/shared/interfaces/table-columns-def.interface";

/**
 * Columnas de la tabla comentarios de Pre-evaluación .
 */
export const COLUMNS_PRE_EVALUATION_COMMENTS: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "sApellidosYNombres",
        displayedName: "Comentario",
        type: "string"
    },
    {
        id: 1,
        name: "sCorreoElectronico",
        displayedName: "Fecha",
        type: "string"
    },
    {
        id: 2,
        name: "sCargoDescripcion",
        displayedName: "Usuario",
        type: "string"
    }
];