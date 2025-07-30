    /*******************************************************************************************************
 * Nombre del archivo:  activity-monitor.config.ts
 * Descripción:          Configuración para el monitoreo de actividad del usuario en la aplicación.
 *                       Establece los valores de tiempo de inactividad, umbrales de advertencia y 
 *                       frecuencias de comprobación, necesarios para gestionar la sesión y alertar 
 *                       al usuario antes de cerrar la sesión automáticamente.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Se establecieron los valores para los intervalos de comprobación de inactividad
 *                        y los umbrales de advertencia.
 *******************************************************************************************************/
export const ACTIVITY_MONITOR_CONFIG = {
        IDLE_TIMEOUT: 20 * 60 * 1000,
        WARNING_THRESHOLD: 3 * 60 * 1000,  
        HIGH_FREQ_INTERVAL: 1000,        
        LOW_FREQ_INTERVAL: 60 * 1000         
    };
