/*******************************************************************************************************
 * Nombre del archivo:  list-of-processes.interface.ts
 * Descripción:          Interfaces que representan la configuración de procesos y sus opciones dentro del sistema.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    - Definición de estructura para listas de procesos y subopciones
 *******************************************************************************************************/
export interface ListOfProcesses {
    label: string;
    icon: string;
    value: number;
    url: string;
    module: string;
    options: ListOptionsProcesses[]
}
export interface ListOptionsProcesses {
    label: string;
    url: string;
}