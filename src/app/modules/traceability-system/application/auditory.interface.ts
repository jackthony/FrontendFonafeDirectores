/*******************************************************************************************************
 * Nombre del archivo:  auditory.interface.ts
 * Descripción:          Interfaz que define las operaciones para la exportación de registros de auditoría y trazabilidad.
 *                       Esta interfaz establece las firmas de los métodos que deben implementar los servicios 
 *                       encargados de exportar los datos de auditoría y logs del sistema en diferentes categorías:
 *                       - Estado de usuario
 *                       - Rol de usuario
 *                       - Logs del sistema
 *                       - Logs de trazabilidad
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial de la interfaz para gestionar la exportación de logs y auditorías.
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { AuditoryStatusInterface } from "../domain/entities/auditory-status.interface";
import { AuditoryRoleInterface } from "../domain/entities/auditory-role.interface";
import { LogSystemInterface } from "../domain/entities/log-system.interface";
import { LogTraceabilityInterface } from "../domain/entities/log-traceability.interface";
export interface AuditoryInterface {
    exportAuditoryStatus(object: AuditoryStatusInterface): Observable<ArrayBuffer>;
    exportAuditoryRole(object: AuditoryRoleInterface): Observable<ArrayBuffer>;
    exportLogSystem(object: LogSystemInterface): Observable<ArrayBuffer>;
    exportLogTraceability(object: LogTraceabilityInterface): Observable<ArrayBuffer>;
}
