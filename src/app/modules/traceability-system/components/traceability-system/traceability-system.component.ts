/*******************************************************************************************************
 * Nombre del archivo:  traceability-system.component.ts
 * Descripción:          Componente principal del sistema de trazabilidad que permite gestionar la búsqueda 
 *                       y descarga de los logs de trazabilidad en formato Excel. El formulario permite seleccionar 
 *                       un rango de fechas para filtrar los logs y obtener un archivo descargable. 
 *                       También incluye una función para redirigir al usuario a la página principal del sistema.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación del formulario reactivo para filtrar logs de trazabilidad.
 *******************************************************************************************************/
import { Component,inject,signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuditoryService } from '../../domain/services/auditory.service';
import { ArchivingProcessService } from 'app/modules/business/domain/services/business/archiving-process.service';
import { DateTime } from 'luxon';
@Component({
  selector: 'app-traceability-system',
  standalone: false,
  templateUrl: './traceability-system.component.html',
  styleUrl: './traceability-system.component.scss'
})
export class TraceabilitySystemComponent {
  	private readonly _router = inject(Router);
    private readonly _fb = inject(FormBuilder);
	private _auditoryService = inject(AuditoryService);
	private _archivingProcessService = inject(ArchivingProcessService);
	textBtnSearch = signal<string>('Descargar');
	iconBtnSearch = signal<string>('download');
    form: FormGroup;
    ngOnInit(): void {
        this.form = this._fb.group({
			fechaInicio: [null, Validators.required],
            fechaFin: [null, Validators.required],
		})
    }
	downloadExcel(): void {
		if(this.form.invalid){
			this.form.markAllAsTouched();
			return;
		}
        const dateStart = this.form.get('fechaInicio').value;
        const dateEnd = this.form.get('fechaFin').value;
        const value = {
            fechaInicio: dateStart.setZone('UTC', { keepLocalTime: true }).toISO(),
            fechaFin: dateEnd.setZone('UTC', { keepLocalTime: true }).toISO()
        }
		const uniqueId = DateTime.now().toMillis();  // Devuelve el número de milisegundos desde la época Unix
 		const id = uniqueId.toString();
		const file$ = this._auditoryService.exportLogTraceability(value);
        this._archivingProcessService.downloadFile(file$, `reporte_log_trazabilidad_${id}.xlsx`, 'application/vnd.ms-excel');
	}
    /**
     * Método encargado de redirigir al usuario a la pantalla principal del sistema.
     * Se invoca usualmente desde el componente `FoReturnComponent`.
     */
    returnInit(): void {
        this._router.navigate(['home']);
    }
}