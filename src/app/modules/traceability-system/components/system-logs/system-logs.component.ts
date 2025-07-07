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
		const uniqueId = DateTime.now().toMillis();  // Devuelve el número de milisegundos desde la época Unix
 		const id = uniqueId.toString();
		const file$ = this._auditoryService.exportLogSystem(this.form.value);
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
