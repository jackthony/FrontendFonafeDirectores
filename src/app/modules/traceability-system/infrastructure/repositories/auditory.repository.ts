/*******************************************************************************************************
 * Nombre del archivo:  role.repository.ts
 * Descripción:          Implementación del repositorio para la entidad Rol. Gestiona la comunicación 
 *                       con la API REST para realizar operaciones de listado, paginación, registro, 
 *                       actualización y eliminación lógica de roles.
 *                       Cumple con el contrato definido por la interfaz RoleInterface.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación inicial del repositorio de roles.
 *******************************************************************************************************/
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseEntity } from '@models/response.entity';
import { ModuleInterface } from 'app/modules/user/application/repositories/profile/module.interface';
import { AuditoryInterface } from '../../application/auditory.interface';
import { AuditoryRoleInterface } from '../../domain/entities/auditory-role.interface';
import { AuditoryStatusInterface } from '../../domain/entities/auditory-status.interface';
import { LogSystemInterface } from '../../domain/entities/log-system.interface';
import { LogTraceabilityInterface } from '../../domain/entities/log-traceability.interface';
@Injectable({
    providedIn: 'root',
})
export class AuditoryRepository implements AuditoryInterface {
    private url = `${environment.apiUrlBase}/AuditoriaUsuarios`; //  URL base del endpoint de usuarios
    private _http = inject(HttpClient); // Inyección directa de HttpClient para llamadas HTTP

    exportAuditoryStatus(object: AuditoryStatusInterface): Observable<ArrayBuffer> {
        return this._http.post(`${this.url}/exportar-auditoria-estado`, object, {
            responseType: 'arraybuffer'
        });
    }
    exportAuditoryRole(object: AuditoryRoleInterface): Observable<ArrayBuffer> {
        return this._http.post(`${this.url}/exportar-por-rol`, object, {
            responseType: 'arraybuffer'
        });
    }
    exportLogSystem(object: LogSystemInterface): Observable<ArrayBuffer> {
        return this._http.post(`${this.url}/exportar-log-sistema`, object, {
            responseType: 'arraybuffer'
        });
    }
    exportLogTraceability(object: LogTraceabilityInterface): Observable<ArrayBuffer> {
        return this._http.post(`${this.url}/exportar-log-trazabilidad`, object, {
            responseType: 'arraybuffer'
        });
    }
}