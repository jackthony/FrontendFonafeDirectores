/*******************************************************************************************************
 * Nombre de interfaz:    IndustryInterface
 * Descripción:           Define las operaciones del repositorio para la gestión de Rubros (Industrias).
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { ResponseEntity } from "../../domain/entities/response.entity";
import { MatTreeOptionsNode } from "../../components/bu-mat-tree-flat/models/mat-tree-options-node";
import { FileData } from "../../domain/entities/archive-tree.entity";
export interface ArchiveInterface {
    getReportExcelBussines(): Observable<ArrayBuffer>;
    getReportPdfBussines(): Observable<ArrayBuffer>;
    importExcelBussines(excel: FormData): Observable<ResponseEntity<boolean>>;
    importFileBussines(data: FormData): Observable<ResponseEntity<boolean>>;
    listTreeBussiness(nIdEmpresa: number): Observable<ResponseEntity<MatTreeOptionsNode<FileData>>>;
    downloadFileBussiness(url: string): Observable<ArrayBuffer>;
}