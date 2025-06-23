/*******************************************************************************************************
 * Nombre del archivo:  list-of-processes.interface.ts
 * Descripción:          Interfaces que representan la configuración de procesos y sus opciones dentro del sistema.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    - Definición de estructura para listas de procesos y subopciones
 *******************************************************************************************************/
/**
 * Representa un proceso principal dentro del sistema (por ejemplo, un módulo o flujo funcional).
 * Incluye metadatos para presentación (etiqueta, ícono), identificación (valor, módulo),
 * navegación (URL) y subopciones (acciones o páginas relacionadas).
 */
export interface ListOfProcesses {
    label: string;
    icon: string;
    value: number;
    url: string;
    module: string;
    options: ListOptionsProcesses[]
}
/**
 * Representa una opción o acción específica dentro de un proceso.
 * Se utiliza para renderizar submenús, botones o acciones contextuales.
 */
export interface ListOptionsProcesses {
    label: string;
    url: string;
}