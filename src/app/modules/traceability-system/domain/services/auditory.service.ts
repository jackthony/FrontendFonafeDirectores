/*******************************************************************************************************
 * Nombre del archivo:  role.service.ts
 * Descripción:          Servicio encargado de gestionar operaciones relacionadas a los Roles del sistema.
 *                       Utiliza un patrón de factoría para inyectar dinámicamente el repositorio correspondiente.
 * 
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Corrección del nombre de la propiedad inyectada y documentación formal.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseEntity } from '@models/response.entity';
import { AuditoryInterface } from '../../application/auditory.interface';
import { AuditoryFactory } from '../../infrastructure/factory/auditory.factory';
import { AuditoryStatusInterface } from '../entities/auditory-status.interface';
import { AuditoryRoleInterface } from '../entities/auditory-role.interface';
import { LogSystemInterface } from '../entities/log-system.interface';
import { LogTraceabilityInterface } from '../entities/log-traceability.interface';
@Injectable({
    providedIn: 'root',
})
export class AuditoryService {
    private _auditoryInterface: AuditoryInterface;
    /**
     * Constructor que inyecta dinámicamente el repositorio mediante la factoría AuditoryFactory.
     * @param _auditoryFactory Instancia de la factoría que provee la implementación de AuditoryInterface.
     */
    constructor(private _auditoryFactory : AuditoryFactory){ 
        this._auditoryInterface = this._auditoryFactory.injectRepository(); //Inyección del Factory
    }
    /**
     * Obtiene todos los modulos y acciones disponibles en el sistema.
     * @param object objecto para filtrar.
     * @returns Observable con la respuesta que contiene todos los modulos.
     */

    exportAuditoryStatus(object: AuditoryStatusInterface): Observable<ArrayBuffer> {
        return this._auditoryInterface.exportAuditoryStatus(object);
    }

    exportAuditoryRole(object: AuditoryRoleInterface): Observable<ArrayBuffer> {
        return this._auditoryInterface.exportAuditoryRole(object);
    }

    exportLogSystem(object: LogSystemInterface): Observable<ArrayBuffer> {
        return this._auditoryInterface.exportLogSystem(object);
    }

    exportLogTraceability(object: LogTraceabilityInterface): Observable<ArrayBuffer> {
        return this._auditoryInterface.exportLogTraceability(object);
    }
}
