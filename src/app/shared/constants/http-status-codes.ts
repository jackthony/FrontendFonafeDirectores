/*******************************************************************************************************
 * Nombre del archivo:  http-status-codes.const.ts
 * Descripción:          Mapeo de los códigos de estado HTTP utilizados en las respuestas del backend.
 *                       Proporciona una referencia centralizada para mejorar la legibilidad y
 *                       evitar el uso de "números mágicos".
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025
 *******************************************************************************************************/
/**
 * Enumeración de códigos de estado HTTP comúnmente utilizados en el sistema.
 * Útil para el manejo de errores y respuestas exitosas en servicios HTTP.
 */
export const HttpStatusCodes = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};