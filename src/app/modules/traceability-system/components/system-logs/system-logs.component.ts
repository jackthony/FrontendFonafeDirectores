/*******************************************************************************************************
 * Nombre del archivo:  system-logs.component.ts
 * Descripción:          Componente encargado de gestionar la visualización de los logs del sistema en el módulo 
 *                       de trazabilidad. Permite seleccionar un rango de fechas para filtrar los logs y 
 *                       descargar el resultado en formato Excel. Incluye un formulario reactivo para gestionar
 *                       las fechas y un botón para realizar la descarga.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del componente para visualizar y descargar los logs del sistema.
 *******************************************************************************************************/
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuditoryService } from '../../domain/services/auditory.service';
import { ArchivingProcessService } from 'app/modules/business/domain/services/business/archiving-process.service';
import { DateTime } from 'luxon';
@Component({
    selector: 'app-system-logs',
    standalone: false,
    templateUrl: './system-logs.component.html',
    styleUrl: './system-logs.component.scss',
})
export class SystemLogsComponent implements OnInit {
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
		const uniqueId = DateTime.now().toMillis();
 		const id = uniqueId.toString();
		const file$ = this._auditoryService.exportLogSystem(value);
        this._archivingProcessService.downloadFile(file$, `reporte_log_sistema_${id}.xlsx`, 'application/vnd.ms-excel');
	}
    /**
     * Método encargado de redirigir al usuario a la pantalla principal del sistema.
     * Se invoca usualmente desde el componente `FoReturnComponent`.
     */
    returnInit(): void {
        this._router.navigate(['home']);
    }
}