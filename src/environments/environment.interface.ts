/*************************************************************************************
 * Nombre del archivo:  environment.interface.ts
 * Descripción:         Interfaz que define la estructura del objeto de configuración
 *                      de entorno de la aplicación. Utilizada para tipar archivos
 *                      como `environment.ts` y `environment.prod.ts`.
 * Autor:               Jesús Martín Velásquez Zavaleta
 * Fecha de creación:   23/06/2025
 * Última modificación: 23/06/2025 por Jesús Martín Velásquez Zavaleta
 * Cambios recientes:   Definición inicial de la interfaz de entorno.
 *************************************************************************************/

/**
 * Estructura base de configuración para entornos Angular.
 */
export interface Environment {
    production: boolean;
    apiUrlBase: string;
    siteKeyCaptcha: string;
  }