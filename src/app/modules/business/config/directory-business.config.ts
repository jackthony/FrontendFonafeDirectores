/*******************************************************************************************************
 * Nombre del archivo:  directory-business-table.config.ts
 * Descripción:         Configuración de constantes y columnas para la gestión del directorio empresarial.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Configuración inicial de columnas y diálogo de confirmación para eliminación.
 *******************************************************************************************************/
import { DialogConfirmation } from "app/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../../shared/interfaces/table-columns-def.interface";
/**
 * Constantes para filtros de catálogo utilizados en el mantenimiento del directorio empresarial.
 */
export const CONST_GENDER = 1;
export const CONST_TYPE_DOCUMENT = 2;
export const CONST_CARGO_DIRECTOR = 12;
/**
 * Columnas para la tabla de gestión del directorio empresarial.
 */
export const COLUMNS_DIRECTORY_BUSINESS: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "sNombreCompleto",
        displayedName: "Apellidos y nombres",
        type: "vacant"
    },
    {
        id: 1,
        name: "sTipoDocumentoDescripcion",
        displayedName: "Tipo de doc.",
        type: "string"
    },
    {
        id: 2,
        name: "sNumeroDocumento",
        displayedName: "Documento",
        type: "string"
    },
    {
        id: 3,
        name: "sCargoDescripcion",
        displayedName: "Cargo",
        type: "string"
    },
    {
        id: 4,
        name: "sTipoDirectorDescripcion",
        displayedName: "Tipo de director",
        type: "string"
    },
    {
        id: 6,
        name: "none",
        displayedName: "",
        type: "acciones"
    }
];
/**
 * Diálogo de confirmación para la eliminación de un director.
 */
export const CONFIG_DELETE_DIALOG_DIRECTORY_BUSINESS: DialogConfirmation = {
    title: "¿Estás seguro de eliminar al director?", 
    message: ""
};