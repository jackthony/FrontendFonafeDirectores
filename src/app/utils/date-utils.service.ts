/*************************************************************************************
 * Nombre del archivo:  date-utils.service.ts
 * Descripción:         Servicio utilitario para el manejo y formateo de fechas usando Luxon.
 *                      Incluye funciones para convertir fechas en string a formatos estándar ISO.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 22/06/2025 por Daniel Alva
 * Cambios recientes:   Creación del método `formatDateToString` para formato 'yyyy-MM-dd'.
 *************************************************************************************/
import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
/**
 * Servicio singleton inyectable que proporciona utilidades relacionadas
 * al formateo y manipulación de fechas, utilizando la librería `luxon`
 * como reemplazo moderno de `Date` nativo.
 */
@Injectable({
    providedIn: 'root',
})
export class DateUtilsService {
	    /**
     * Método para convertir una fecha en formato ISO (cadena) al formato 'yyyy-MM-dd'.
     * Si la fecha no es válida o está vacía, retorna `null`.
     * 
     * @param date Fecha en string con formato ISO (por ejemplo: '2025-06-22T14:30:00Z')
     * @returns String con formato 'yyyy-MM-dd' (por ejemplo: '2025-06-22') o `null` si no es válido
     */
    formatDateToString(date: string): string | null {
		if (!date) return null;
		const dt = DateTime.fromISO(date);
		if (!dt.isValid) return null;
		return dt.toFormat('yyyy-MM-dd');
	}
}