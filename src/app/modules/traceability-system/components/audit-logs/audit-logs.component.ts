import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ArchivingProcessService } from 'app/modules/business/domain/services/business/archiving-process.service';
import { DateTime } from 'luxon';
import { AuditoryService } from '../../domain/services/auditory.service';
import { ConstantService } from 'app/modules/business/domain/services/business/constant.service';
import { CONST_STATUS_USER } from 'app/modules/user/config/profile-management.config';
import { ConstantEntity } from 'app/modules/business/domain/entities/business/constant.entity';
import { ResponseEntity } from '@models/response.entity';
import { RoleService } from 'app/modules/user/domain/services/maintenance/role.service';
import { RoleEntity } from 'app/modules/user/domain/entities/maintenance/role.entity';

@Component({
    selector: 'app-audit-logs',
    standalone: false,
    templateUrl: './audit-logs.component.html',
    styleUrl: './audit-logs.component.scss',
})
export class AuditLogsComponent implements OnInit {
    private readonly _router = inject(Router);
    private readonly _fb = inject(FormBuilder);

    private _auditoryService = inject(AuditoryService);
    private _archivingProcessService = inject(ArchivingProcessService);
    private _constantService = inject(ConstantService);
    private _roleService = inject(RoleService); // Servicio encargado de gestionar los roles de usuario

    textBtnSearch = signal<string>('Descargar');
    iconBtnSearch = signal<string>('download');

    lstStatusUser = signal<ConstantEntity[]>([]);
    lstRoleUser = signal<RoleEntity[]>([]);

    formStatus: FormGroup;
    formRole: FormGroup;

    ngOnInit(): void {
		this.loadStatus();
		this.loadRole();
        this.formStatus = this._fb.group({
            fechaInicio: [null, Validators.required],
            fechaFin: [null, Validators.required],
			estado: [null, Validators.required]
        });
		this.formRole = this._fb.group({
            fechaInicio: [null, Validators.required],
            fechaFin: [null, Validators.required],
			tipoUsuario: [null, Validators.required]
        });
    }

	loadStatus(): void {
		this._constantService.getAll(CONST_STATUS_USER).subscribe({
			next: ((response: ResponseEntity<ConstantEntity>) => {
				if(response.isSuccess){
					this.lstStatusUser.set(response.lstItem);
				} else this.lstStatusUser.set([]);
			}),
			error:(() => {
				this.lstStatusUser.set([]);
			})
		})
	}

	loadRole(): void {
		this._roleService.getAll().subscribe({
			next: ((response: ResponseEntity<RoleEntity>) => {
				if(response.isSuccess){
					this.lstRoleUser.set(response.lstItem);
				} else this.lstRoleUser.set([]);
			}),
			error:(() => {
				this.lstRoleUser.set([]);
			})
		})
	}

    downloadStatusExcel(): void {
        if (this.formStatus.invalid) {
            this.formStatus.markAllAsTouched();
            return;
        }
        const dateStart = this.formStatus.get('fechaInicio').value;
        const dateEnd = this.formStatus.get('fechaFin').value;
        const status = this.formStatus.get('estado').value;
        const value = {
            fechaInicio: dateStart.setZone('UTC', { keepLocalTime: true }).toISO(),
            fechaFin: dateEnd.setZone('UTC', { keepLocalTime: true }).toISO(),
			estado: status
        }
        const uniqueId = DateTime.now().toMillis(); // Devuelve el número de milisegundos desde la época Unix
        const id = uniqueId.toString();
        const file$ = this._auditoryService.exportAuditoryStatus(value);
        this._archivingProcessService.downloadFile(
            file$,
            `reporte_usuario_estados_${id}.xlsx`,
            'application/vnd.ms-excel'
        );
    }

	downloadRoleExcel(): void {
        if (this.formRole.invalid) {
            this.formRole.markAllAsTouched();
            return;
        }
        const dateStart = this.formRole.get('fechaInicio').value;
        const dateEnd = this.formRole.get('fechaFin').value;
        const typeUser = this.formRole.get('tipoUsuario').value;
        const value = {
            fechaInicio: dateStart.setZone('UTC', { keepLocalTime: true }).toISO(),
            fechaFin: dateEnd.setZone('UTC', { keepLocalTime: true }).toISO(),
			tipoUsuario: typeUser
        }
        const uniqueId = DateTime.now().toMillis(); // Devuelve el número de milisegundos.
        const id = uniqueId.toString();
        const file$ = this._auditoryService.exportAuditoryRole(value);
        this._archivingProcessService.downloadFile(
            file$,
            `reporte_usuario_roles_${id}.xlsx`,
            'application/vnd.ms-excel'
        );
    }

    /**
     * Método encargado de redirigir al usuario a la pantalla principal del sistema.
     * Se invoca usualmente desde el componente `FoReturnComponent`.
     */
    returnInit(): void {
        this._router.navigate(['home']);
    }
}
