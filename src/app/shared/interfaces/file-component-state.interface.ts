/*******************************************************************************************************
 * Nombre del archivo:  file-component-state.interface.ts
 * Descripción:          Define el estado de un componente de carga o gestión de archivos.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 *******************************************************************************************************/
export interface FileComponentState {
    title: string;
    isDisabled: boolean;
    message?: string;
    root?: string;
}