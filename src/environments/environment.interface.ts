/*************************************************************************************
 * Nombre del archivo:  environment.interface.ts
 * Descripción:         Interfaz que define la estructura del objeto de configuración
 *                      de entorno de la aplicación. Utilizada para tipar archivos
 *                      como `environment.ts` y `environment.prod.ts`.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
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