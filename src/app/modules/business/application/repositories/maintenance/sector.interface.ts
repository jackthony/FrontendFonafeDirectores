/*******************************************************************************************************
 * Nombre de interfaz:    SectorInterface
 * Descripción:           Define los métodos para la gestión de sectores económicos dentro del sistema.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { ResponseEntity } from "@models/response.entity";
import { SectorEntity } from "app/modules/business/domain/entities/maintenance/sector.entity";
import { Observable } from "rxjs";
export interface SectorInterface {
    getAll(): Observable<ResponseEntity<SectorEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<SectorEntity>>;
    create(object: SectorEntity): Observable<ResponseEntity<number>>;
    update(object: SectorEntity): Observable<ResponseEntity<boolean>>;
    delete(object: SectorEntity): Observable<ResponseEntity<boolean>>;
}