/*******************************************************************************************************
 * Nombre del archivo:  http-error-messages.const.ts
 * Descripción:          Mensajes de error personalizados basados en códigos de estado HTTP.
 *                       Se utiliza para mostrar mensajes claros y estandarizados al usuario final.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 *******************************************************************************************************/
export const showError400 = (): string => `Solicitud Incorrecta`;
export const showError401 = (): string => `No tiene autorización para ejecutar la solicitud`;
export const showError403 = (): string => `Se ha denegado el acceso a la acción que se solicita`;
export const showError404 = (): string => `Los datos no se guardaron correctamente`;
export const showError404Sunat = (): string => `RUC consultado no encontrado`;
export const showError500 = (): string => `No hay conexión con el servidor`;