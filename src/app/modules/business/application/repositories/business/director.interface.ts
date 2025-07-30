/*******************************************************************************************************
 * Nombre del archivo: director.interface.ts
 * Descripción:         Contrato de acceso a datos para la entidad Director.
 * Autor:               Daniel Alva
 * Fecha de creación:   23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { DirectorEntity } from "../../../domain/entities/business/director.entity";
import { ResponseEntity } from "@models/response.entity";
export interface DirectorInterface {
    getByPagination(param: string, nIdEmpresa: number, pageIndex: number, pageSize: number, dtFechaInicio: string, dtFechaFin: string): Observable<ResponseEntity<DirectorEntity>>;
    create(object: DirectorEntity): Observable<ResponseEntity<number>>;
    update(object: DirectorEntity): Observable<ResponseEntity<boolean>>;
}
