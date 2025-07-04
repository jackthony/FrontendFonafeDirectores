/*******************************************************************************************************
 * Nombre del archivo:  constant.service.ts
 * Descripción:          Servicio de dominio para el consumo de constantes del sistema según código.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Integración con patrón factoría y documentación estandarizada.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArchiveInterface } from '../../application/repositories/archive.interface';
import { ArchiveFactory } from '../../infrastructure/archive.factory';
import { ResponseEntity } from '../entities/response.entity';
import { MatTreeOptionsNode } from '../../components/bu-mat-tree-flat/models/mat-tree-options-node';
import { FileData } from '../entities/archive-tree.entity';
@Injectable({
    providedIn: 'root',
})
export class ArchiveService {
    private _archiveInterface: ArchiveInterface;
    /**
     * Inyección de dependencia del repositorio de constantes mediante factoría.
     * @param _archiveFactory Factoría que resuelve la implementación del repositorio de constantes.
     */
    constructor(private _archiveFactory : ArchiveFactory){ 
        this._archiveInterface = this._archiveFactory.injectRepository();
    }
    /**
     * Obtiene el reporte de empresas en formato Excel
     */
    getReportExcelBussines(): Observable<ArrayBuffer> {
        return this._archiveInterface.getReportExcelBussines();
    }
    /**
     * Obtiene el reporte de empresas en format PDF
     */
    getReportPdfBussines(): Observable<ArrayBuffer> {
        return this._archiveInterface.getReportPdfBussines();
    }

    importExcelBussines(excel: FormData): Observable<ResponseEntity<boolean>> {
        return this._archiveInterface.importExcelBussines(excel);
    }

    importFileBussines(data: FormData): Observable<ResponseEntity<boolean>> {
        return this._archiveInterface.importFileBussines(data);
    }

    listTreeBussiness(nIdEmpresa: number): Observable<ResponseEntity<MatTreeOptionsNode<FileData>>> {
        return this._archiveInterface.listTreeBussiness(nIdEmpresa);
    }

    downloadFileBussiness(url: string): Observable<ArrayBuffer> {
        return this._archiveInterface.downloadFileBussiness(url);
    }
}