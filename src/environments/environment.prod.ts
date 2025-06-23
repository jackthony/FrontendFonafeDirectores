/*************************************************************************************
 * Nombre del archivo:  environment.ts
 * Descripción:         Archivo de configuración del entorno de desarrollo. Define
 *                      parámetros globales como el estado de producción, URL base
 *                      de la API y claves de servicios externos como Google reCAPTCHA.
 * Autor:               Jesús Martín Velásquez Zavaleta
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Jesús Martín Velásquez Zavaleta
 * Cambios recientes:   Actualización de la propiedad apiUrlBase a entorno público temporal.
 *************************************************************************************/
import { Environment } from "./environment.interface";
export const environment: Environment = {
    production: false,
    //apiUrlBase: 'https://172.191.184.95:8088',
    apiUrlBase: 'https://jackgptgod-001-site1.ktempurl.com/api',
    siteKeyCaptcha: '6Le_914rAAAAAEIpvmvQu_r8561iDthHJuTuwp6K'
};