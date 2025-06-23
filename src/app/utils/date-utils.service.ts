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
@Injectable({
    providedIn: 'root',
})
export class DateUtilsService {
    formatDateToString(date: string): string | null {
		if (!date) return null;
		const dt = DateTime.fromISO(date);
		if (!dt.isValid) return null;
		return dt.toFormat('yyyy-MM-dd');
	}
}