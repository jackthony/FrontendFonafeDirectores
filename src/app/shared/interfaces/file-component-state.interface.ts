/*******************************************************************************************************
 * Nombre del archivo:  file-component-state.interface.ts
 * Descripción:          Define el estado de un componente de carga o gestión de archivos.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 *******************************************************************************************************/
/**
 * Interfaz que describe el estado actual de un componente relacionado con la gestión de archivos.
 * Puede ser utilizada para representar tanto el estado visual como el funcional (habilitado/deshabilitado),
 * así como mensajes de estado y rutas base de almacenamiento.
 */
export interface FileComponentState {
    title: string;
    isDisabled: boolean;
    message?: string;
    root?: string;
}