/*******************************************************************************************************
 * Nombre del archivo:  permission.interface.ts
 * Descripción:          Interfaces que definen la estructura de los permisos asociados a un módulo dentro
 *                       de la aplicación. Cada módulo tiene un conjunto de permisos que indican las 
 *                       acciones permitidas para el usuario en ese módulo.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial de las interfaces para manejar los permisos de los módulos.
 *******************************************************************************************************/
export interface Permission {
    nombreModulo: string;
    permisos: Actions[];
}

export interface Actions {
    nombrePermiso: string;
}