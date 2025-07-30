/*******************************************************************************************************
 * Nombre del archivo: business.interface.ts
 * Descripción:         Contrato que define las operaciones necesarias para gestionar entidades Empresa.
 * Autor:               Daniel Alva
 * Fecha de creación:   23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { ResponseEntity } from "@models/response.entity";
import { BusinessEntity } from "app/modules/business/domain/entities/business/business.entity";
export interface BusinessInterface {
    getByPagination(nameEnterprise: string, pageIndex: number, pageSize: number, filterState: boolean | null, dtFechaInicio: string | null, dtFechaFin: string | null): Observable<ResponseEntity<BusinessEntity>>;
    getById(nIdEmpresa: number): Observable<ResponseEntity<BusinessEntity>>;
    create(object: BusinessEntity): Observable<ResponseEntity<number>>;
    update(object: BusinessEntity): Observable<ResponseEntity<boolean>>;
    update(object: BusinessEntity): Observable<ResponseEntity<boolean>>;
    delete(object: BusinessEntity): Observable<ResponseEntity<boolean>>;
    exportExcelEnterprise(): Observable<ArrayBuffer>;
    exportPdfEnterprise(): Observable<ArrayBuffer>;
}
