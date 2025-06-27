/*******************************************************************************************************
 * Nombre del archivo:  table-columns-def.interface.ts
 * Descripción:          Define la estructura estándar para la configuración de columnas en tablas dinámicas.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    - Inclusión de campos de alineación (`alignTitle`, `alignContent`)
 *                       - Soporte para componentes y customIcon
 *******************************************************************************************************/
/**
 * Interfaz que define la estructura esperada para describir columnas
 * en tablas dinámicas (generalmente usadas con componentes de tipo table).
 * 
 * Esta definición permite configurar de forma flexible el contenido, tipo de dato,
 * formato, estilos visuales, y comportamiento de cada columna renderizada.
 */
export interface TableColumnsDefInterface {
    id: number;
    name?: string | "none";
    subName?: string;
    displayedName: string;
    estado?: string;
    nombreColumna?: string;
    translate?: string;
    type?:
        | "string"
        | "decimal"
        | "number"
        | "date"
        | "dateInput"
        | "datetime"
        | "boolean"
        | "time"
        | "acciones"
        | "estado"
        | "moneda"
        | "input"
        | "input-number"
        | "select"
        | "accionesListaDetalle"
        | "url"
        | "statusIndicator"
        | "photo"
        | "detail"
        | "enter"
        | "fonafe"
        | "password";
    format?: "fullDate" | "shortTime" | "shortTimeHour";
    customIcon?: string[][];
    minMaxDecimal?: [number, number];
    checked?: string;
    backgroundColorTitle?: string;
    components?: string[];
    alignTitle?: "left" | "center" | "right" | "fill" | "justify" | "centerContinuous" | "distributed";
    alignContent?: "left" | "center" | "right" | "fill" | "justify" | "centerContinuous" | "distributed";
}