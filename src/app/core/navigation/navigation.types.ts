/*******************************************************************************************************
 * Nombre del archivo:  navigation.interface.ts
 * Descripción:          Interfaz que define la estructura de navegación para diferentes tipos de diseño de la interfaz de usuario.
 *                       Se utiliza para organizar los elementos de navegación en distintos estilos de visualización,
 *                       tales como compactos, predeterminados, futuristas y horizontales.
 *                       Cada tipo de navegación contiene una lista de elementos de navegación (`FuseNavigationItem`).
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial de la interfaz de navegación.
 *******************************************************************************************************/
import { FuseNavigationItem } from '@fuse/components/navigation';

export interface Navigation {
    compact: FuseNavigationItem[];
    default: FuseNavigationItem[];
    futuristic: FuseNavigationItem[];
    horizontal: FuseNavigationItem[];
}
