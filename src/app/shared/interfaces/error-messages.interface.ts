/*******************************************************************************************************
 * Nombre del archivo:  error-messages-password.interface.ts
 * Descripción:          Interfaz que define la estructura de los mensajes de error relacionados 
 *                       con la validación de contraseñas, incluyendo el mensaje, la validez 
 *                       del mismo y una clave única para cada tipo de error.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Definición inicial de la interfaz para manejar mensajes de error de contraseñas.
 *******************************************************************************************************/
export interface ErrorMessagesPassword {
    message: string; 
    valid: boolean; 
    key: string
}