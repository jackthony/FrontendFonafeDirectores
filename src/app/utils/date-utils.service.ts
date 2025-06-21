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