/*******************************************************************************************************
 * Nombre del archivo:  activity-management.columns.ts
 * Descripción:         Definición de columnas para la visualización de actividades en el módulo correspondiente.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Revisión de nombres y tipos de columnas, ajustes semánticos.
 *******************************************************************************************************/
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";
/**
 * Columnas para la tabla de gestión de actividades.
 */
export const COLUMNS_ACTIVITIES: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "fullName",
        displayedName: "Nombre y Apellido",
        type: "string"
    },
    {
        id: 1,
        name: "status",
        displayedName: "Estado",
        type: "string"
    },
    {
        id: 2,
        name: "dDate",
        displayedName: "Fecha",
        type: "date"
    },
    {
        id: 3,
        name: "transcurrido",
        displayedName: "Transcurrido",
        type: "string"
    },
    {
        id: 4,
        name: "enterprise",
        displayedName: "Empresa",
        type: "string"
    },
    {
        id: 5,
        name: "proponent",
        displayedName: "Proponente",
        type: "string"
    },
    {
        id: 6,
        name: "solicit",
        displayedName: "Solicitante",
        type: "string"
    },
    {
        id: 7,
        name: "none",
        displayedName: "",
        type: "enter"
    }
];