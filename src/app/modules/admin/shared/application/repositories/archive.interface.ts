/*******************************************************************************************************
 * Nombre de interfaz:    IndustryInterface
 * Descripción:           Define las operaciones del repositorio para la gestión de Rubros (Industrias).
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { ResponseEntity } from "../../domain/entities/response.entity";
export interface ArchiveInterface {
    getReportExcelBussines(): Observable<ArrayBuffer>;
    getReportPdfBussines(): Observable<ArrayBuffer>;
    importExcelBussines(excel: FormData): Observable<ResponseEntity<boolean>>;
}