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
