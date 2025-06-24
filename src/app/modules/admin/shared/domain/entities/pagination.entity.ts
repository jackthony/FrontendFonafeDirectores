/*******************************************************************************************************
 * Nombre de interfaz:    Pagination
 * Descripción:           Representa la estructura de paginación utilizada en las respuestas del backend.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
export interface Pagination {
    pageIndex: number;
    pageSize: number;
    totalRows: number
}