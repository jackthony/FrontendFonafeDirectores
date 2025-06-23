/*************************************************************************************
 * Nombre del archivo:  environment.ts
 * Descripción:         Archivo de configuración de entorno para el modo desarrollo.
 *                      Define variables globales como el estado de producción, la
 *                      URL base de la API y claves públicas para servicios externos.
 * Autor:               Jesús Martín Velásquez Zavaleta
 * Fecha de creación:   23/06/2025
 * Última modificación: 23/06/2025 por Jesús Martín Velásquez Zavaleta
 * Cambios recientes:   Configuración inicial del entorno de desarrollo.
 *************************************************************************************/
import { Environment } from "./environment.interface";
export const environment: Environment = {
    production: false,
    apiUrlBase: 'https://localhost:7063/api',
    siteKeyCaptcha: '6Le_914rAAAAAEIpvmvQu_r8561iDthHJuTuwp6K'
};